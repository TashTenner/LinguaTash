// app/api/webhooks/meta/route.ts
//
// Public Meta webhook endpoint — receives Instagram comment and DM events.
//
// Register in Meta App Dashboard → Webhooks:
//   URL:          https://linguatash.com/api/webhooks/meta
//   Verify token: whatever you set as META_VERIFY_TOKEN in .env
//   Subscriptions (Instagram object):
//     - comments   (keyword triggers from post comments)
//     - messages   (DM postbacks — "I'm following" button taps)
//
// Add to .env.local (and Vercel env vars):
//   META_APP_SECRET=      (App Dashboard → App Settings → Basic → App Secret)
//   META_VERIFY_TOKEN=    (any string you choose — used only for the one-time GET challenge)

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { MetaInteraction } from '@/lib/models/MetaInteraction'
import { Follower } from '@/lib/models/Follower'
import { getKeywordAction, getCommentReply, resolveDmText } from '@/lib/metatrigger/keywords'
import {
  replyToComment,
  sendDmWithFollowButton,
  sendDmFreebie,
  sendDmFollowFirst,
} from '@/lib/metatrigger/instagram'

// ─── GET — Meta one-time webhook verification challenge ───────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge ?? '', { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ─── POST — Incoming webhook events ──────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text()

  // Verify X-Hub-Signature-256 — reject anything without a valid signature.
  const sig = req.headers.get('x-hub-signature-256') ?? ''
  const expected = `sha256=${crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(body)
    .digest('hex')}`

  // timingSafeEqual requires equal-length buffers — check length first.
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Return 200 to Meta before processing — prevents retry storms if our DB
  // is slow. We still process synchronously because Vercel serverless functions
  // don't guarantee continuation after response in all runtimes.
  const payload = JSON.parse(body) as MetaWebhookPayload

  try {
    await connectToDatabase()
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field === 'comments') {
          await handleComment(change.value as CommentValue)
        }
      }
      for (const msg of entry.messaging ?? []) {
        if (msg.postback) {
          await handlePostback(msg.sender.id, msg.postback.payload)
        } else if (msg.message?.text) {
          await handleDmText(msg.sender.id, msg.message.text)
        }
      }
    }
  } catch (err) {
    // Log but don't surface — Meta will retry on non-200, which we don't want.
    console.error('[meta-webhook] processing error', err)
  }

  return NextResponse.json({ status: 'ok' })
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleComment(value: CommentValue) {
  const action = getKeywordAction(value.text)
  if (!action) return

  const { id: userId } = value.from
  const commentId = value.id

  // Dedupe: only trigger once per user/keyword combination.
  const existing = await MetaInteraction.findOne({
    platform: 'instagram',
    userId,
    keyword: action.keyword,
  })
  if (existing) return

  try {
    await MetaInteraction.create({
      platform: 'instagram',
      userId,
      keyword: action.keyword,
      status: 'awaiting_follow',
      lastTriggeredAt: new Date(),
    })
  } catch (err: unknown) {
    // Duplicate key = another request beat us to it (race condition). Safe to ignore.
    if ((err as { code?: number })?.code === 11000) return
    throw err
  }

  // Post a public comment reply.
  const commentText = getCommentReply(action)
  if (commentText) await replyToComment(commentId, commentText)

  if (action.followGate) {
    // Send DM with "I'm following" button — freebie delivered after button tap + follow check.
    await sendDmWithFollowButton(
      userId,
      action.keyword,
      '¡Hola! Para recibir tu regalo, sígueme primero en Instagram y luego pulsa el botón ⬇️'
    )
  } else {
    // No gate — send freebie link immediately in DM.
    const dmText = resolveDmText(action)
    if (dmText) {
      await sendDmFreebie(userId, dmText)
      await MetaInteraction.updateOne(
        { platform: 'instagram', userId, keyword: action.keyword },
        { status: 'fulfilled', fulfilledAt: new Date() }
      )
    }
  }
}

async function handlePostback(userId: string, payload: string) {
  if (!payload.startsWith('CONFIRM_FOLLOW_')) return

  const keyword = payload.replace('CONFIRM_FOLLOW_', '')
  const action = getKeywordAction(keyword)
  if (!action) return

  // Already fulfilled — resend as a courtesy.
  const interaction = await MetaInteraction.findOne({
    platform: 'instagram',
    userId,
    keyword: action.keyword,
  })
  if (interaction?.status === 'fulfilled') {
    const dmText = resolveDmText(action)
    if (dmText) await sendDmFreebie(userId, `¡Ya te lo envié! Aquí va de nuevo:\n\n${dmText}`)
    return
  }

  // Check follower cache.
  const isFollower = await Follower.exists({ platform: 'instagram', userId })
  if (!isFollower) {
    await sendDmFollowFirst(userId, action.keyword)
    return
  }

  // Follower confirmed — deliver freebie.
  const dmText = resolveDmText(action)
  if (dmText) {
    await sendDmFreebie(userId, dmText)
    await MetaInteraction.findOneAndUpdate(
      { platform: 'instagram', userId, keyword: action.keyword },
      { status: 'fulfilled', fulfilledAt: new Date() },
      { upsert: true }
    )
  }
}

async function handleDmText(userId: string, text: string) {
  // Handles users who DM the keyword directly instead of via the comment flow.
  const action = getKeywordAction(text)
  if (!action) return

  const existing = await MetaInteraction.findOne({
    platform: 'instagram',
    userId,
    keyword: action.keyword,
  })
  if (existing?.status === 'fulfilled') return

  if (action.followGate) {
    const isFollower = await Follower.exists({ platform: 'instagram', userId })
    if (!isFollower) {
      await sendDmWithFollowButton(
        userId,
        action.keyword,
        '¡Hola! Para recibir tu regalo, sígueme primero en Instagram y luego pulsa el botón ⬇️'
      )
      return
    }
  }

  const dmText = resolveDmText(action)
  if (dmText) {
    await sendDmFreebie(userId, dmText)
    await MetaInteraction.findOneAndUpdate(
      { platform: 'instagram', userId, keyword: action.keyword },
      { status: 'fulfilled', fulfilledAt: new Date(), lastTriggeredAt: new Date() },
      { upsert: true }
    )
  }
}

// ─── Payload types ────────────────────────────────────────────────────────────

interface CommentValue {
  from: { id: string; username?: string }
  id: string    // comment ID — used to post a reply
  text: string
  media?: { id: string }
}

interface MessagingEntry {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  postback?: { payload: string; title?: string }
  message?: { text: string; mid?: string }
}

interface WebhookEntry {
  id: string
  time: number
  changes?: { field: string; value: unknown }[]
  messaging?: MessagingEntry[]
}

interface MetaWebhookPayload {
  object: string
  entry: WebhookEntry[]
}
