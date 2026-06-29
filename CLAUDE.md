# LinguaTash — Claude Code notes

## Before every commit

Always run Prettier before staging and committing:

```bash
npx prettier --write <changed files>
```

Or to check without writing:

```bash
npx prettier --check .
```

The CI build (`yarn build`) enforces Prettier via ESLint and will fail if formatting is off.

---

## Starting the dev server locally

Always run this first in PowerShell, then start the dev server:

```powershell
$env:PWD = $(Get-Location).Path
yarn dev
```

---

## Instagram Keyword Automation (ManyChat alternative)

**Status as of 2026-06-15: PAUSED — waiting for autónoma registration in Spain**

This is a self-hosted ManyChat-style automation. When someone comments a keyword
(e.g. HAFEN) on a LinguaTash Instagram post, they automatically receive a DM with
a follow-gate and a freebie link.

### What is fully built and working

- Webhook endpoint: `app/api/webhooks/meta/route.ts`
  - Receives Instagram comment and DM events from Meta
  - HMAC signature verification (X-Hub-Signature-256)
  - Deduplication via MongoDB (never triggers twice per user/keyword)
  - ManyChat-style flow: no public comment reply, DM only
- MongoDB Atlas M0 (free tier, EU region): `lib/mongodb.ts`
  - `MetaInteraction` collection — logs every trigger, status (awaiting_follow / fulfilled)
  - `Follower` collection — follower cache for the follow-gate check
- Keyword config: `lib/metatrigger/keywords.ts`
  - HAFEN → freebie at `/resuena/hafen`
  - AUDIO → placeholder (update freebieUrl when Bloque 1 is live)
- Instagram API functions: `lib/metatrigger/instagram.ts`
  - `sendDmWithFollowButton` — sends follow-gate DM with "✅ Ya te sigo" button
  - `sendDmFreebie` — sends the freebie link
  - `sendDmFollowFirst` — repeats the follow prompt (loop until really following)
  - `streamFollowers` — paginates follower list (for sync endpoint)
- Follower sync endpoint: `app/api/metatrigger/sync-followers/route.ts`
  - POST, protected by `Authorization: Bearer ${CRON_SECRET}`
- Privacy policy updated: `app/politica-de-privacidad/page.tsx` Section 8

### The exact flow that is coded

1. User comments keyword (e.g. HAFEN) on any LinguaTash post
2. Webhook fires → no public reply → check Follower cache in MongoDB
   - Already following → send freebie DM immediately, mark fulfilled
   - Not in cache → send: "¡Hola! Para recibir tu regalo, sígueme primero en Instagram y luego pulsa el botón ⬇️" + button [✅ Ya te sigo]
3. User follows LinguaTash on Instagram, comes back, taps the button
4. Postback fires → check Follower cache again
   - In cache → send freebie DM, mark fulfilled
   - Not in cache → send: "¡Aún no te veo como seguidor/a! Sígueme primero en Instagram y luego pulsa el botón 🙏" + button (loop repeats)

Freebie DM for HAFEN:
> ¡Hola! Aquí tienes tu regalo de LinguaTash — Die Beziehung ist die Methode:
> https://linguatash.com/resuena/hafen
> ¡Espero que te sea útil! 🌊

### What is NOT working yet (and why)

**`instagram_manage_messages` permission is blocked.**

The DM sending fails with:
```
(#200) App does not have Advanced Access to instagram_manage_messages permission
and recipient user does not have role on app.
```

This means: until the App Review is approved, DMs can only be sent to accounts
that are added as Testers on the Meta app. Real users cannot receive DMs yet.

**The Follower cache is empty.**

`streamFollowers()` requires `instagram_manage_followers` permission which also
needs App Review. The cache has never been seeded, so everyone goes through the
follow-gate even if they already follow. This is acceptable — the gate still works,
it just always asks first.

### Key IDs and values (look these up in Vercel env / Meta dashboard)

| What | Where to find it |
|------|-----------------|
| `META_APP_ID` | Meta App Dashboard → App Settings → Basic → App ID |
| `META_APP_SECRET` | Meta App Dashboard → App Settings → Basic → App Secret (reset after Jun 2026 exposure) |
| `META_PAGE_ACCESS_TOKEN` | Vercel env — permanent Page token (obtained Jun 15 2026) |
| `META_VERIFY_TOKEN` | Vercel env — any string, used only for webhook verification |
| `META_INSTAGRAM_ACCOUNT_ID` | `17841404322043409` (LinguaTash IG Business Account ID) |
| Facebook Page ID | `1189096167613513` |
| MongoDB URI | Vercel env — Atlas M0 cluster, EU region |
| `CRON_SECRET` | Vercel env — protects sync-followers endpoint |

### Page Access Token — how to renew when it expires

The current Page token was obtained on 2026-06-15. Tokens from a long-lived User
Token are permanent, but if it ever stops working, re-generate with these steps:

**Step 1** — Graph API Explorer → Get User Access Token with these permissions:
`pages_show_list`, `pages_manage_metadata`, `pages_messaging`,
`instagram_manage_comments`, `instagram_manage_messages`

**Step 2** — Exchange for long-lived User Token (PowerShell):
```powershell
$APP_ID = "YOUR_APP_ID"
$APP_SECRET = "YOUR_APP_SECRET"
$SHORT = "SHORT_LIVED_USER_TOKEN"

$r = Invoke-WebRequest -UseBasicParsing -Method GET `
  "https://graph.facebook.com/v25.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT"
$r.Content
# Copy the access_token from the response
```

**Step 3** — Get permanent Page Token by querying the Page ID directly:
```powershell
$LONG = "LONG_LIVED_USER_TOKEN"
$r = Invoke-WebRequest -UseBasicParsing -Method GET `
  "https://graph.facebook.com/v25.0/1189096167613513?fields=name,access_token&access_token=$LONG"
$r.Content
# Copy the access_token from the response → this is the permanent Page Token
```
Note: `/me/accounts` returns empty because the Page is under a Business Portfolio.
Always use the direct Page ID query (Step 3) instead.

**Step 4** — Update `META_PAGE_ACCESS_TOKEN` in Vercel → redeploy.

### Webhook subscriptions (already active)

The Facebook Page (`1189096167613513`) is subscribed to:
`feed`, `messages`, `messaging_postbacks`

If subscriptions are ever lost, re-run (PowerShell):
```powershell
$PAGE_TOKEN = "YOUR_PAGE_ACCESS_TOKEN"
$r = Invoke-WebRequest -UseBasicParsing -Method POST `
  "https://graph.facebook.com/v25.0/1189096167613513/subscribed_apps?subscribed_fields=feed,messages,messaging_postbacks&access_token=$PAGE_TOKEN"
$r.Content
# Should return {"success":true}
```

### Next steps when returning (in order)

**Step 1 — Register as autónoma in Spain**
Get the "Certificado de Alta en el RETA" from Social Security. This is the legal
document Meta requires for Business Verification.

**Step 2 — Complete Meta Business Verification**
Meta App Dashboard → App Review → Business Verification → upload RETA certificate.
Business name: LinguaTash. Address: Carrer de la Providència, 47, Entlo. 2, 08024 Barcelona.

**Step 3 — Submit App Review for `instagram_manage_messages`**
Meta App Dashboard → App Review → Permissions and Features → `instagram_manage_messages`
→ Edit App Review request.

Fill in:
- Access level: Standard Access (no business verification needed for this level,
  but try it — if Meta rejects and requires Advanced Access, then Step 2 is needed first)
- Platform: Instagram
- Use case: "Automated DM flow triggered by Instagram comments. When a user comments
  a keyword on a post, the app sends them a private DM with a follow-gate and delivers
  a freebie link once they follow the account. No unsolicited messages — all
  conversations are user-initiated via the comment."
- Screen recording: show a LinguaTash post → comment HAFEN → Vercel logs showing
  webhook fires → show the mock DM conversation (Scenario B: follow-gate flow)

Mock DM conversation for the screen recording:
> LinguaTash → User: "¡Hola! Para recibir tu regalo, sígueme primero en Instagram
>   y luego pulsa el botón ⬇️" [✅ Ya te sigo]
> [User follows, taps button]
> LinguaTash → User: "¡Hola! Aquí tienes tu regalo de LinguaTash —
>   Die Beziehung ist die Methode: https://linguatash.com/resuena/hafen
>   ¡Espero que te sea útil! 🌊"

**Step 4 — Seed the Follower cache (after `instagram_manage_followers` is approved)**
Call the sync endpoint once:
```powershell
$CRON = "YOUR_CRON_SECRET"
Invoke-WebRequest -UseBasicParsing -Method POST `
  -Headers @{ Authorization = "Bearer $CRON" } `
  "https://linguatash.com/api/metatrigger/sync-followers"
```
Then add to `vercel.json` as a cron job (hourly) to keep it current.

**Step 5 — Test end-to-end with a real (non-tester) account**
After App Review approves: delete any old MetaInteraction test records from MongoDB
Atlas → comment HAFEN from a fresh account → confirm DM arrives.

### Phases still to build

- **Phase 3**: WhatsApp Cloud API and Facebook Messenger modules
- **Phase 4**: Kit (ConvertKit) integration — tag users after freebie delivered
- **Phase 5**: Admin dashboard (mirror Nordkreis pattern) — view all MetaInteractions,
  filter by keyword/status, see follower sync status
