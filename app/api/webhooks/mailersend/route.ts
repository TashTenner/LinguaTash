// app/api/webhooks/mailersend/route.ts
//
// Receives delivery event notifications from MailerSend and forwards
// a structured message to Slack #linguatash-orders.
//
// Events handled: delivered, soft_bounced, hard_bounced, spam_complaint, opened, clicked
//
// ENV VARS REQUIRED:
//   MAILERSEND_WEBHOOK_SECRET  — from MailerSend webhook settings
//   SLACK_WEBHOOK_URL          — Slack incoming webhook URL

import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// ── Verify MailerSend webhook signature ───────────────────────────────────────
function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  return signature === expected
}

// ── Event metadata ────────────────────────────────────────────────────────────
const EVENT_META: Record<string, { emoji: string; label: string; urgent: boolean }> = {
  'activity.delivered': { emoji: '📬', label: 'Email entregado / Delivered', urgent: false },
  'activity.soft_bounced': { emoji: '⚠️', label: 'Rebote temporal / Soft bounce', urgent: true },
  'activity.hard_bounced': { emoji: '🚫', label: 'Rebote permanente / Hard bounce', urgent: true },
  'activity.spam_complaint': {
    emoji: '🚨',
    label: 'Marcado como spam / Spam complaint',
    urgent: true,
  },
  'activity.opened': { emoji: '👁️', label: 'Email abierto / Opened', urgent: false },
  'activity.clicked': { emoji: '🔗', label: 'Enlace clicado / Link clicked', urgent: false },
}

// ── Send to Slack ─────────────────────────────────────────────────────────────
async function notifySlack(blocks: object[]): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) return
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
  } catch (err) {
    console.error('[MailerSend webhook] Slack notify failed:', err)
  }
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log('[MailerSend webhook] Request received')

  const body = await req.text()
  const signature = req.headers.get('x-mailersend-signature') ?? ''
  const secret = process.env.MAILERSEND_WEBHOOK_SECRET ?? ''

  // Verify signature if secret is configured
  if (secret && !verifySignature(body, signature, secret)) {
    console.error('[MailerSend webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body) as Record<string, unknown>
  } catch {
    console.error('[MailerSend webhook] Invalid JSON')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // MailerSend v2 payload structure:
  // { type: "activity.delivered", created_at: "...", data: { type: "delivered", subject: "...", recipient: "email@...", ... } }
  const eventType = (payload.type as string) ?? 'unknown'
  const data = (payload.data ?? {}) as Record<string, unknown>
  const createdAt = (payload.created_at as string) ?? new Date().toISOString()

  const recipient = (data.recipient as string) ?? 'unknown'
  const subject = (data.subject as string) ?? '—'
  const messageId = (data.email_id as string) ?? (data.message_id as string) ?? '—'
  const timestamp = createdAt

  const meta = EVENT_META[eventType] ?? { emoji: 'ℹ️', label: eventType, urgent: false }

  console.log(`[MailerSend webhook] Event: ${eventType} → ${recipient}`)

  // Build Slack blocks
  const blocks: object[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${meta.emoji} *${meta.label}*${meta.urgent ? ' — *acción requerida*' : ''}`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Recipient:*\n${recipient}` },
        { type: 'mrkdwn', text: `*Subject:*\n${subject}` },
        { type: 'mrkdwn', text: `*Event:*\n${eventType}` },
        { type: 'mrkdwn', text: `*Time:*\n${timestamp}` },
        { type: 'mrkdwn', text: `*Message ID:*\n${messageId}` },
      ],
    },
  ]

  // Add urgent action note for bounces and spam
  if (meta.urgent) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          eventType === 'hard_bounced'
            ? '🔴 *Hard bounce* — esta dirección no existe o rechaza emails. Contacta al cliente por otro medio.'
            : eventType === 'activity.soft_bounced'
              ? '🟡 *Soft bounce* — entrega temporal fallida. MailerSend reintentará automáticamente.'
              : eventType === 'activity.spam_complaint'
                ? '🔴 *Spam* — el destinatario marcó el email como spam. Revisa el contenido y considera contactar al cliente.'
                : '',
      },
    })
  }

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `MailerSend · ${new Date().toISOString()} · LinguaTash` }],
  })

  await notifySlack(blocks)

  return NextResponse.json({ received: true })
}
