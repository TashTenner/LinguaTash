// lib/metatrigger/instagram.ts
//
// Instagram Graph API calls for the keyword-trigger automation.
//
// These functions are fully implemented but require the following env vars
// before they will fire real API calls:
//   META_PAGE_ACCESS_TOKEN   — long-lived Page access token
//   META_INSTAGRAM_ACCOUNT_ID — numeric Instagram Business Account ID
//
// Until those are set, every function logs a stub message and returns false/nothing.
// This lets the webhook route run end-to-end in dev without credentials.
//
// Meta App Review permissions required:
//   instagram_manage_comments   (replyToComment)
//   instagram_manage_messages   (sendDm*, requires being in a 24h window or comment-triggered)
//   instagram_manage_followers  (streamFollowers — for the sync endpoint)

const GRAPH_BASE = 'https://graph.facebook.com/v21.0'
const TOKEN = process.env.META_PAGE_ACCESS_TOKEN
const IG_ACCOUNT_ID = process.env.META_INSTAGRAM_ACCOUNT_ID

function isConfigured(): boolean {
  return !!(TOKEN && IG_ACCOUNT_ID)
}

function stub(fn: string, data: Record<string, unknown>): false {
  console.log(`[metatrigger:instagram] STUB ${fn}`, data)
  return false
}

// Reply to a comment publicly (appears as a reply thread under the original comment).
export async function replyToComment(commentId: string, text: string): Promise<boolean> {
  if (!isConfigured()) return stub('replyToComment', { commentId, text })

  const res = await fetch(`${GRAPH_BASE}/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, access_token: TOKEN }),
  })
  if (!res.ok) console.error('[metatrigger:instagram] replyToComment failed', await res.text())
  return res.ok
}

// Send a DM with a quick-reply "I'm following" button.
// payload format: CONFIRM_FOLLOW_{KEYWORD} — received back as a postback event.
export async function sendDmWithFollowButton(
  userId: string,
  keyword: string,
  promptText: string
): Promise<boolean> {
  if (!isConfigured()) return stub('sendDmWithFollowButton', { userId, keyword })

  const res = await fetch(`${GRAPH_BASE}/me/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: userId },
      message: {
        text: promptText,
        quick_replies: [
          {
            content_type: 'text',
            title: '✅ Ya te sigo',
            payload: `CONFIRM_FOLLOW_${keyword.toUpperCase()}`,
          },
        ],
      },
      access_token: TOKEN,
    }),
  })
  if (!res.ok) console.error('[metatrigger:instagram] sendDmWithFollowButton failed', await res.text())
  return res.ok
}

// Send the freebie link in a plain DM.
export async function sendDmFreebie(userId: string, dmText: string): Promise<boolean> {
  if (!isConfigured()) return stub('sendDmFreebie', { userId, dmText })

  const res = await fetch(`${GRAPH_BASE}/me/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: userId },
      message: { text: dmText },
      access_token: TOKEN,
    }),
  })
  if (!res.ok) console.error('[metatrigger:instagram] sendDmFreebie failed', await res.text())
  return res.ok
}

// Remind the user to follow first, showing the button again.
export async function sendDmFollowFirst(userId: string, keyword: string): Promise<boolean> {
  if (!isConfigured()) return stub('sendDmFollowFirst', { userId, keyword })

  const res = await fetch(`${GRAPH_BASE}/me/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: userId },
      message: {
        text: '¡Aún no te veo como seguidor/a! Sígueme primero en Instagram y luego pulsa el botón 🙏',
        quick_replies: [
          {
            content_type: 'text',
            title: '✅ Ya te sigo',
            payload: `CONFIRM_FOLLOW_${keyword.toUpperCase()}`,
          },
        ],
      },
      access_token: TOKEN,
    }),
  })
  if (!res.ok) console.error('[metatrigger:instagram] sendDmFollowFirst failed', await res.text())
  return res.ok
}

// Async generator that paginates through all Instagram followers.
// Yields { id, username } objects — consumed by the sync-followers endpoint.
export async function* streamFollowers(): AsyncGenerator<{ id: string; username: string }> {
  if (!isConfigured()) {
    stub('streamFollowers', {})
    return
  }

  let url: string | null =
    `${GRAPH_BASE}/${IG_ACCOUNT_ID}/followers?fields=id,username&limit=100&access_token=${TOKEN}`

  while (url) {
    const res = await fetch(url)
    if (!res.ok) {
      console.error('[metatrigger:instagram] streamFollowers API error', await res.text())
      break
    }
    const data: { data: { id: string; username: string }[]; paging?: { next?: string } } =
      await res.json()
    for (const follower of data.data ?? []) {
      yield follower
    }
    url = data.paging?.next ?? null
  }
}
