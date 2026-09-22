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

**Never run `yarn build` while the dev server is running.** Both write to
`.next`. The build wins the race, the dev server is left with a corrupted
`.next`, and from then on _every_ route returns 500, including pages that were
never touched. The first symptom is
`EPERM: operation not permitted, open '.next	race'` during the build; by the
time it appears the damage is done.

To recover: kill the whole `yarn dev` / `next dev` process tree,
`Remove-Item -Recurse -Force .next`, then start the dev server again.

When debugging site-wide 500s, check a route you did not touch (`/` or
`/la-juntada`) before suspecting the code you just wrote. That single request
separates "my page is broken" from "the dev server is broken".

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

| What                        | Where to find it                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `META_APP_ID`               | Meta App Dashboard → App Settings → Basic → App ID                                     |
| `META_APP_SECRET`           | Meta App Dashboard → App Settings → Basic → App Secret (reset after Jun 2026 exposure) |
| `META_PAGE_ACCESS_TOKEN`    | Vercel env — permanent Page token (obtained Jun 15 2026)                               |
| `META_VERIFY_TOKEN`         | Vercel env — any string, used only for webhook verification                            |
| `META_INSTAGRAM_ACCOUNT_ID` | `17841404322043409` (LinguaTash IG Business Account ID)                                |
| Facebook Page ID            | `1189096167613513`                                                                     |
| MongoDB URI                 | Vercel env — Atlas M0 cluster, EU region                                               |
| `CRON_SECRET`               | Vercel env — protects sync-followers endpoint                                          |

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
> y luego pulsa el botón ⬇️" [✅ Ya te sigo]
>
> [User follows, taps button]
>
> LinguaTash → User: "¡Hola! Aquí tienes tu regalo de LinguaTash —
> Die Beziehung ist die Methode: https://linguatash.com/resuena/hafen
> ¡Espero que te sea útil! 🌊"

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

---

## Alemán·y·Du — familias and audios pages

**Status as of 2026-09-22: live. Classes 1 and 2 published.**

Two unlisted pages for the families of the Primaria group. Both are `noindex`,
absent from the header nav and `sitemap.ts`, and not linked from `/alemanydu`.
Parents reach them by a QR card handed out in class and by WhatsApp.

- `/alemanydu/familias` — the method, what is normal, what helps at home, the
  four phases of the year, the pre-A1 level, the Monday by Monday calendar
- `/alemanydu/audios` — one audio per class, play and download, plus a
  **Reproducir todo** button that plays every published class in order

**One audio per class, and that is the whole model.** There is no cumulative
track and no separate songs track. When a class teaches a song, the song is
inside that class's own audio, and the song title goes in the `cancion` field
so the card can name it.

### How the audio is served, and what must not be "simplified"

Audio lives in a **private** R2 bucket, `linguatash-alemanydu-audio`, and is
streamed through our own route handlers. There is deliberately **no public
bucket and no custom domain**.

The reason is that every audio URL is then same origin, so `media-src 'self'`
covers it and there is no CSP entry that can drift out of sync. Audio that
plays in local development and fails silently on the deployed site is a failure
this project has already hit once; this design removes the possibility rather
than documenting it.

Three changes that look like cleanups and will break playback:

1. **Do not add `export const runtime = 'edge'`** to
   `app/api/alemanydu/audio/route.ts`. The AWS SDK streaming and the Range
   passthrough need the Node runtime. iOS breaks first and loudest.
2. **Do not remove the Range forwarding.** Safari and iOS refuse to play media
   unless a range request is answered with `206`. Without it, a parent on an
   iPhone gets a player that does nothing when pressed, and no error appears
   anywhere.
3. **Do not widen the allowlist regex** in `lib/alemanydu/audioStorage.ts`. It
   is the only thing stopping these handlers from becoming a generic fetch
   proxy or an open redirect.

`jsx-a11y/media-has-caption` is disabled on the `<audio>` elements in
`components/alemanydu/AudioPlayer.tsx` and `ReproducirTodo.tsx` on purpose.
There is no public transcript, and German text beside the audio is exactly the
interference the course exists to prevent. The audios page says so in its
footer note and offers a written version on request.

`ReproducirTodo.tsx` is the only client component here. It receives a narrowed
`{clase, titulo, src}` list built in the page, never whole track objects,
because anything a client component receives is serialised into the page
payload. Keep it that way if internal fields are ever added back.

### Caching

Set per file in `cacheControlPara`, not globally:

| File                   | Cache             | Why                                                                            |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------ |
| `ayd_cNN.mp3`          | 1 year, immutable | written once, never replaced; a parent replaying it all week downloads it once |
| `ayd_frase_prueba.mp3` | 1 day             | the only file that gets re-recorded under the same name                        |

If class audios ever do get replaced in place, this is wrong and the name needs
a version suffix instead.

### Environment

| Variable                               | Value                        |
| -------------------------------------- | ---------------------------- |
| `CLOUDFLARE_R2_ALEMANYDU_AUDIO_BUCKET` | `linguatash-alemanydu-audio` |

Reuses the existing `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`
and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`. The R2 API token must list the bucket in
its scope, otherwise every request returns `AccessDenied`.

### Publishing a week

**House format: mono, 44.1 kHz, 96 kbps MP3.**

```bash
ffmpeg -i clase03.wav \
  -ac 1 -ar 44100 \
  -af "highpass=f=80,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -codec:a libmp3lame -b:a 96k \
  -metadata title="Clase 3" \
  -metadata artist="LinguaTash" \
  -metadata album="Alemán y Du · Primaria" \
  ayd_c03.mp3
```

- **Do not downsample to 22 kHz** to save space. It caps the audio near 11 kHz
  and dulls the sibilants, the ich-Laut and the ach-Laut, which are precisely
  what the course teaches. This is the one setting where the whole point of the
  course is at stake.
- `loudnorm` matters: without it one week is quiet and the next is loud, and a
  parent driving has to reach for the volume every time.
- ID3 tags show on CarPlay, Android Auto and the lock screen. Without them the
  dashboard shows `ayd_c03`.
- Record and archive masters in WAV, publish MP3. The route rejects anything
  that is not `.mp3`.

Object names, at the **bucket root, never in a folder** (the allowlist contains
no slashes):

```
ayd_cNN.mp3            the audio for class NN, two digits
ayd_frase_prueba.mp3   the phrase on the familias page
```

**Note for a future course.** The names carry no year, so `ayd_c01.mp3` for
2027/28 would collide with this year's. Before next September, either add a
year segment back or give the new course its own bucket.

Then, every week:

1. Upload `ayd_cNN.mp3`.
2. In `data/alemanydu-audios.ts` find that class. `archivo` is already filled
   for all 32 classes, because the name follows from the class number. Set
   `duracion` in seconds
   (`ffprobe -v error -show_entries format=duration -of csv=p=0 FILE`), write
   `titulo` and `resumen`, add `cancion` if the class taught a song, and flip
   `disponible` to `true`.
3. Commit and push. **No other code changes, ever.**

### Copy rules for these two pages

- Register is **tú** for the singular, throughout. No vos, no vosotros, no
  ustedes. Every reader is one parent on a phone, and `tu hijo o hija` is the
  warmest thing on the page.
- **No hyphens, en dashes or em dashes** anywhere in copy. The single exception
  is the level name `pre-A1`. Ranges use "a" or "hasta".
- **No emoji** in body text.
- The familias page never asks a parent to say German aloud. The phrase box
  plays the recording instead, so the child hears it in Tash's voice rather
  than read with Spanish vowels.

### R2 buckets, and a preview trap

`CLOUDFLARE_R2_BUCKET_NAME` (the salten downloads) is **`linguatash-resuena` in
Production** and **`test-downloads` in Preview**. That split is intentional, so
that preview does not serve a gigabyte of real game files.

The preview fixtures are small stand-ins, and `salten/salten-es-ES.zip` there is
a **228 byte stub**. Testing a Spanish purchase in Preview will therefore appear
to succeed and hand over a near empty zip. It is not a bug in the checkout.
