import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ── Stripe ──────────────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

// ── R2 client (S3-compatible) ────────────────────────────────────────────────
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

// ── Language metadata ────────────────────────────────────────────────────────
const LANGUAGE_META: Record<string, { name: string; file: string }> = {
  es: { name: 'Español', file: 'salten-es.zip' },
  ca: { name: 'Catalán', file: 'salten-ca.zip' },
  en: { name: 'Inglés', file: 'salten-en.zip' },
  de: { name: 'Alemán', file: 'salten-de.zip' },
  it: { name: 'Italiano', file: 'salten-it.zip' },
  ru: { name: 'Ruso', file: 'salten-ru.zip' },
}

// ── Generate a signed R2 URL (expires in 24h) ────────────────────────────────
async function getDownloadUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: fileKey,
  })
  return getSignedUrl(r2, command, { expiresIn: 60 * 60 * 24 }) // 24 hours
}

// ── Send email via MailerSend REST API ───────────────────────────────────────
async function sendDownloadEmail({
  toEmail,
  toName,
  languages,
  downloadLinks,
}: {
  toEmail: string
  toName: string
  languages: string[]
  downloadLinks: { name: string; url: string }[]
}) {
  const linksHtml = downloadLinks
    .map(
      ({ name, url }) =>
        `<tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e3ded7;">
            <strong>${name}</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e3ded7; text-align: right;">
            <a href="${url}"
               style="background: #b3475a; color: white; padding: 8px 18px; border-radius: 8px;
                      text-decoration: none; font-size: 14px; font-weight: 500;">
              Descargar
            </a>
          </td>
        </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background:#f4efe8; font-family:'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#081c3c;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background: white; border-radius: 16px; overflow: hidden;
                      border: 1px solid #e3ded7; max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: #081c3c; padding: 32px 40px; text-align: center;">
              <p style="margin:0; color: #b3475a; font-size: 12px; letter-spacing: 3px;
                        text-transform: uppercase; font-weight: 600;">Resuena · LinguaTash</p>
              <h1 style="margin: 12px 0 0; color: #f4efe8; font-size: 28px; font-weight: 600;">
                ¡Gracias por tu compra!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 8px; font-size: 16px;">Hola <strong>${toName}</strong>,</p>
              <p style="margin: 0 0 32px; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
                Tu compra de <strong>Salten</strong> ha sido completada.
                Aquí tienes tus enlaces de descarga. Cada enlace es válido durante <strong>24 horas</strong>.
              </p>

              <!-- Download links -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border: 1px solid #e3ded7; border-radius: 12px; overflow: hidden;
                            margin-bottom: 32px;">
                <tr style="background: #f4efe8;">
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 600;
                              text-transform: uppercase; letter-spacing: 1px; color: #9a8f85;">
                    Idioma
                  </td>
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 600;
                              text-transform: uppercase; letter-spacing: 1px; color: #9a8f85;
                              text-align: right;">
                    Descarga
                  </td>
                </tr>
                ${linksHtml}
              </table>

              <p style="margin: 0 0 8px; font-size: 14px; color: #9a8f85; line-height: 1.6;">
                Si los enlaces expiran antes de que puedas descargar los archivos, escríbenos a
                <a href="mailto:resuena@linguatash.com"
                   style="color: #b3475a;">resuena@linguatash.com</a>
                y te los reenviamos.
              </p>
              <p style="margin: 24px 0 0; font-size: 14px; color: #9a8f85; line-height: 1.6;">
                La factura electrónica se emitirá en los próximos días conforme a la normativa Verifactu.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f4efe8; padding: 24px 40px; text-align: center;
                        border-top: 1px solid #e3ded7;">
              <p style="margin: 0; font-size: 12px; color: #9a8f85;">
                LinguaTash · Barcelona, Catalunya ·
                <a href="https://linguatash.com" style="color: #b3475a;">linguatash.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAILERSEND_FROM_EMAIL,
        name: process.env.MAILERSEND_FROM_NAME,
      },
      to: [{ email: toEmail, name: toName }],
      subject: 'Salten — Tus archivos de descarga',
      html,
      text: `Hola ${toName},\n\nGracias por tu compra de Salten\n\nTus enlaces de descarga (válidos 24h):\n\n${downloadLinks.map((l) => `${l.name}: ${l.url}`).join('\n')}\n\nSi tienes cualquier problema escríbenos a resuena@linguatash.com\n\nLinguaTash`,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`MailerSend error: ${error}`)
  }
}

// ── Webhook handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log('[Webhook] Request received')

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  console.log('[Webhook] Has signature:', !!signature)

  if (!signature) {
    console.error('[Webhook] ERROR: Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // 1. Verify Stripe signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    console.log('[Webhook] ✓ Signature verified')
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Signature verification failed'
    console.error('[Webhook] Signature verification failed:', errorMessage)
    return NextResponse.json({ error: `Webhook error: ${errorMessage}` }, { status: 400 })
  }

  // 2. Only handle checkout.session.completed
  console.log('[Webhook] Event type:', event.type)
  if (event.type !== 'checkout.session.completed') {
    console.log('[Webhook] Ignoring event type (not checkout.session.completed)')
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // 3. Extract metadata saved during checkout
  const { nombre, languages: languagesRaw, nif } = session.metadata || {}
  const customerEmail = session.customer_email || session.customer_details?.email

  console.log('[Webhook] Metadata:', { nombre, languagesRaw, nif, customerEmail })

  if (!customerEmail || !languagesRaw || !nombre) {
    console.error('[Webhook] Missing required metadata', session.metadata)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const languages = languagesRaw.split(',').filter(Boolean)

  try {
    console.log('[Webhook] Processing languages:', languages)

    // 4. Generate signed R2 download URLs for each purchased language
    const downloadLinks = await Promise.all(
      languages.map(async (code) => {
        const meta = LANGUAGE_META[code]
        if (!meta) throw new Error(`Unknown language code: ${code}`)
        console.log(`[Webhook] Generating R2 URL for: ${meta.file}`)
        const url = await getDownloadUrl(meta.file)
        return { name: meta.name, url }
      })
    )

    console.log('[Webhook] ✓ Download links generated')

    // 5. Send download email via MailerSend
    await sendDownloadEmail({
      toEmail: customerEmail,
      toName: nombre,
      languages,
      downloadLinks,
    })

    console.log(`[Webhook] ✓ Email sent to ${customerEmail} for languages: ${languagesRaw}`)

    // 6. TODO: Verifactu invoice generation
    // When you're ready to implement Verifactu, add it here.
    // You have: nombre, nif, customerEmail, languages, session.amount_total

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Webhook] Error processing order:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
