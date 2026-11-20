/**
 * Publishes one of the three Piep und Brumm audios (/piepundbrumm).
 *
 *   node scripts/publicar-piepundbrumm.mjs --audio 1 --wav "D:/…/pub_01_wer_macht_das.wav" \
 *        --copia "G:/My Drive/LinguaTash/Nordkreis/Audios"
 *
 * Built on publicar-nordkreis.mjs, same loudness system and the same checks.
 * Differences, all from the brief for this page:
 *
 *   - Silence is trimmed at the start and the end only, leaving at most 0.5 s.
 *     The pauses INSIDE the take are deliberate: the children answer in them.
 *     Nothing else is cut.
 *   - 128 kbps instead of 96.
 *   - Uploaded to the Nordkreis bucket under `piepundbrumm/piepundbrumm-0N.mp3`,
 *     served publicly by app/api/piepundbrumm/audio/[datei]/route.ts.
 *
 * Never overwrites, locally or in the bucket: the files are cached for a year.
 * What it cannot check: whether the take is any good. Listen first.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const COVER = path.join(RAIZ, 'public/static/images/nordkreis-icon.png')
const DATEN = path.join(RAIZ, 'data/piepundbrumm.ts')
const ORDNER = 'piepundbrumm'

// One system with the checks below, unchanged from publicar-nordkreis.mjs.
// Read the Alemán·y·Du section of CLAUDE.md before touching any of them.
const LUFS_ZIEL = -16
const TP_ZIEL = -5
const LRA_ZIEL = 11
const TOLERANZ_LUFS = 1.5
const TP_MAX = -1.0

// Leading and trailing silence: below this level counts as silence, and this
// much of it is kept so the audio does not start on a clipped breath.
const STILLE_DB = -50
const STILLE_BEHALTEN = 0.5

// ── helpers ──────────────────────────────────────────────────────────────────

const rot = (t) => `\x1b[31m${t}\x1b[0m`
const gruen = (t) => `\x1b[32m${t}\x1b[0m`
const grau = (t) => `\x1b[90m${t}\x1b[0m`

function abbruch(meldung) {
  console.error(`\n${rot('ABGEBROCHEN')}  ${meldung}\n`)
  process.exit(1)
}

function laufen(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.error) abbruch(`${cmd} ließ sich nicht starten: ${r.error.message}`)
  return { code: r.status, out: r.stdout ?? '', err: r.stderr ?? '' }
}

function letztesJson(text) {
  const auf = text.lastIndexOf('{')
  const zu = text.lastIndexOf('}')
  if (auf === -1 || zu === -1 || zu < auf) return null
  try {
    return JSON.parse(text.slice(auf, zu + 1))
  } catch {
    return null
  }
}

function messen(datei, mitHochpass) {
  const kette = `${mitHochpass ? 'highpass=f=80,' : ''}loudnorm=I=${LUFS_ZIEL}:TP=${TP_ZIEL}:LRA=${LRA_ZIEL}:print_format=json`
  const r = laufen('ffmpeg', ['-hide_banner', '-i', datei, '-af', kette, '-f', 'null', '-'])
  const daten = letztesJson(r.err)
  if (!daten) abbruch(`${path.basename(datei)} ließ sich nicht messen:\n${r.err.slice(-800)}`)
  return daten
}

function sondieren(datei) {
  const r = laufen('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration:stream=codec_type,codec_name,channels,sample_rate,bit_rate',
    '-of',
    'json',
    datei,
  ])
  try {
    return JSON.parse(r.out)
  } catch {
    return abbruch(`ffprobe konnte ${datei} nicht lesen`)
  }
}

// ── arguments ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const option = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}

const nummer = Number(option('audio'))
const wav = option('wav')
const kopie = option('copia')
const trocken = args.includes('--dry-run')

if (!Number.isInteger(nummer) || nummer < 1 || nummer > 3) {
  abbruch('--audio fehlt oder liegt nicht zwischen 1 und 3')
}
if (!wav || !fs.existsSync(wav)) abbruch(`WAV nicht gefunden: ${wav ?? '(--wav fehlt)'}`)
if (!kopie) abbruch('--copia fehlt, der Sicherungsordner außerhalb von Cloudflare')
if (!fs.existsSync(kopie)) abbruch(`Sicherungsordner existiert nicht: ${kopie}`)
if (!fs.existsSync(COVER)) abbruch(`Cover fehlt: ${COVER}`)

const name = `piepundbrumm-${String(nummer).padStart(2, '0')}.mp3`
const key = `${ORDNER}/${name}`

// Title from the data file, so the ID3 title matches the page.
function titelAusDaten() {
  const text = fs.readFileSync(DATEN, 'utf8')
  const start = text.indexOf(`nummer: ${nummer},`)
  if (start === -1) return ''
  return text.slice(start).match(/titel:\s*'([^']+)'/)?.[1] ?? ''
}

const titel = titelAusDaten()
if (!titel) abbruch(`kein Titel für Audio ${nummer} in data/piepundbrumm.ts`)

// ── never overwrite ──────────────────────────────────────────────────────────

for (const zeile of fs.existsSync(path.join(RAIZ, '.env.local'))
  ? fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split(/\r?\n/)
  : []) {
  const m = zeile.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const bucket = process.env.CLOUDFLARE_R2_NORDKREIS_AUDIO_BUCKET
if (!bucket) abbruch('CLOUDFLARE_R2_NORDKREIS_AUDIO_BUCKET fehlt in .env.local')

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

const zielKopie = path.join(kopie, name)
if (fs.existsSync(zielKopie)) abbruch(`${zielKopie} existiert schon. Nichts wird überschrieben.`)

try {
  await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
  abbruch(`${key} liegt schon im Bucket. Eine veröffentlichte Datei wird nie ersetzt.`)
} catch (e) {
  const code = e?.$metadata?.httpStatusCode
  if (code !== 404 && e?.name !== 'NotFound') {
    abbruch(`konnte nicht prüfen, ob ${key} schon im Bucket liegt: ${e?.name ?? e}`)
  }
}

console.log(`\nAudio ${nummer} · ${titel}  ->  ${bucket}/${key}`)
console.log(grau(`  Quelle     ${wav}`))
console.log(grau(`  Sicherung  ${kopie}`))
if (trocken) console.log(grau('  (dry-run: nichts wird gesichert oder hochgeladen)'))

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pub-'))

// ── 1. trim silence at the start and end only ────────────────────────────────

console.log('\n1/5  entferne Stille am Anfang und am Ende')
const getrimmt = path.join(tmp, 'getrimmt.wav')
const rand = `silenceremove=start_periods=1:start_threshold=${STILLE_DB}dB:start_silence=${STILLE_BEHALTEN}`
let r = laufen('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  wav,
  '-af',
  `${rand},areverse,${rand},areverse`,
  '-c:a',
  'pcm_f32le',
  getrimmt,
])
if (r.code !== 0) abbruch(`Trimmen fehlgeschlagen:\n${r.err.slice(-1200)}`)

const dauerRoh = Number(sondieren(wav).format?.duration ?? 0)
const dauerGetrimmt = Number(sondieren(getrimmt).format?.duration ?? 0)
if (!(dauerGetrimmt > 0)) abbruch('nach dem Trimmen ist nichts übrig')
console.log(
  grau(
    `     ${dauerRoh.toFixed(1)}s -> ${dauerGetrimmt.toFixed(1)}s (${(dauerRoh - dauerGetrimmt).toFixed(1)}s Stille entfernt)`
  )
)

// ── 2. measure, encode, cover ────────────────────────────────────────────────

console.log('2/5  messe')
const gemessen = messen(getrimmt, true)
console.log(
  grau(`     I=${gemessen.input_i} LUFS  TP=${gemessen.input_tp} dBTP  LRA=${gemessen.input_lra}`)
)

const ohneCover = path.join(tmp, `ohne_cover_${name}`)
const fertig = path.join(tmp, name)

console.log('3/5  kodiere mit den gemessenen Werten')
const filter =
  'highpass=f=80,' +
  [
    `loudnorm=I=${LUFS_ZIEL}`,
    `TP=${TP_ZIEL}`,
    `LRA=${LRA_ZIEL}`,
    `measured_I=${gemessen.input_i}`,
    `measured_TP=${gemessen.input_tp}`,
    `measured_LRA=${gemessen.input_lra}`,
    `measured_thresh=${gemessen.input_thresh}`,
    `offset=${gemessen.target_offset}`,
    'linear=true',
  ].join(':')

r = laufen('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  getrimmt,
  '-af',
  filter,
  '-ac',
  '1',
  '-ar',
  '44100',
  '-codec:a',
  'libmp3lame',
  '-b:a',
  '128k',
  '-map_metadata',
  '-1',
  '-metadata',
  `title=${titel}`,
  '-metadata',
  'artist=Tash Tenner',
  '-metadata',
  'album=Piep und Brumm zum Nachhören',
  '-metadata',
  `track=${nummer}/3`,
  ohneCover,
])
if (r.code !== 0) abbruch(`Kodierung fehlgeschlagen:\n${r.err.slice(-1200)}`)

r = laufen('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  ohneCover,
  '-i',
  COVER,
  '-map',
  '0:a',
  '-map',
  '1:v',
  '-c:a',
  'copy',
  '-c:v',
  'copy',
  '-id3v2_version',
  '3',
  '-metadata:s:v',
  'title=Album cover',
  '-metadata:s:v',
  'comment=Cover (front)',
  '-disposition:v',
  'attached_pic',
  fertig,
])
if (r.code !== 0) abbruch(`Cover ließ sich nicht einbetten:\n${r.err.slice(-1200)}`)

// ── 3. check the result ──────────────────────────────────────────────────────

console.log('4/5  prüfe das fertige MP3')
const geprueft = messen(fertig, false)
const lufs = Number(geprueft.input_i)
const tp = Number(geprueft.input_tp)

const info = sondieren(fertig)
const audio = (info.streams ?? []).find((s) => s.codec_type === 'audio') ?? {}
const mitCover = (info.streams ?? []).some((s) => s.codec_type === 'video')
const dauer = Number(info.format?.duration ?? 0)

const fehler = []
if (!Number.isFinite(lufs) || Math.abs(lufs - LUFS_ZIEL) > TOLERANZ_LUFS) {
  fehler.push(`Lautheit ${lufs} LUFS, außerhalb von ${LUFS_ZIEL} ±${TOLERANZ_LUFS}`)
}
if (!Number.isFinite(tp) || tp > TP_MAX) fehler.push(`True Peak ${tp} dBTP, über ${TP_MAX}`)
if (audio.codec_name !== 'mp3') fehler.push(`Codec ${audio.codec_name}, erwartet mp3`)
if (Number(audio.channels) !== 1) fehler.push(`${audio.channels} Kanäle, erwartet 1`)
if (Number(audio.sample_rate) !== 44100) fehler.push(`${audio.sample_rate} Hz, erwartet 44100`)
if (!mitCover) fehler.push('kein Cover eingebettet')
// Against the TRIMMED source: everything between first and last sound stays.
if (Math.abs(dauer - dauerGetrimmt) > 1) {
  fehler.push(`dauert ${dauer.toFixed(1)}s, das getrimmte WAV ${dauerGetrimmt.toFixed(1)}s`)
}

console.log(`     Lautheit ${lufs} LUFS   True Peak ${tp} dBTP`)
console.log(
  grau(
    `     mp3 ${audio.channels} Kanal ${audio.sample_rate} Hz ${Math.round(Number(audio.bit_rate) / 1000)} kbit/s  ${dauer.toFixed(1)}s  Cover: ${mitCover ? 'ja' : 'nein'}`
  )
)

if (fehler.length > 0) {
  console.error(`\n${rot('DAS AUDIO BESTEHT DIE PRÜFUNG NICHT')}`)
  for (const f of fehler) console.error(`  · ${f}`)
  console.error(`\nNichts kopiert, nichts hochgeladen. Die Testdatei liegt hier:\n  ${fertig}\n`)
  process.exit(1)
}
console.log(gruen('     besteht'))

// ── 4. backup, then upload ───────────────────────────────────────────────────

console.log('5/5  sichere und lade hoch')

if (trocken) {
  const vorschau = path.join(os.tmpdir(), `vorschau_${name}`)
  fs.copyFileSync(fertig, vorschau)
  console.log(grau('     (dry-run: nichts gesichert, nichts hochgeladen)'))
  console.log(grau(`     zum Anhören: ${vorschau}`))
} else {
  fs.copyFileSync(fertig, zielKopie)
  // Named after the MP3, like the nk_*.wav masters beside it, not "Recording (59).wav".
  const wavKopie = path.join(kopie, `${path.parse(name).name}.wav`)
  if (!fs.existsSync(wavKopie)) fs.copyFileSync(wav, wavKopie)
  console.log(grau(`     ${zielKopie}`))
  console.log(grau(`     ${wavKopie}`))

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fs.readFileSync(fertig),
      ContentType: 'audio/mpeg',
    })
  )
  console.log(grau(`     hochgeladen nach ${bucket}/${key}`))
}

fs.rmSync(tmp, { recursive: true, force: true })

console.log(`\n${gruen('Fertig.')} In data/piepundbrumm.ts bei Audio ${nummer} eintragen:\n`)
console.log(`    dauer: ${Math.round(dauer)},\n`)
console.log(`Öffentlich: https://www.linguatash.com/api/piepundbrumm/audio/${name}\n`)
