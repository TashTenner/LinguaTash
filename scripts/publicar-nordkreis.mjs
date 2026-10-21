/**
 * Publishes one Nordkreis audio.
 *
 *   node scripts/publicar-nordkreis.mjs --audio 3 --wav "C:/…/Recording (32).wav" \
 *        --copia "G:/My Drive/LinguaTash/Nordkreis/Audios"
 *
 * `--audio` is the CONTENT number (01 to 20 within the cycle), never the
 * Saturday number. Group and cycle default to `ent` and `a`; pass `--gruppe`
 * and `--zyklus` for anything else.
 *
 * Same steps and the same loudness system as `publicar-clase.mjs`, whose
 * comments explain the numbers. In order:
 *
 *   1. Refuses to go on if `nk_<gruppe>_<zyklus><NN>.mp3` already exists,
 *      locally or in the bucket. A published file is never replaced under the
 *      same name: parents' phones cache it for a year.
 *   2. Reads the title from data/nordkreis-audios.ts, so the ID3 title cannot
 *      drift from what the page shows.
 *   3. Measures the WAV, encodes with the measured values, attaches the cover.
 *   4. **Measures the finished MP3 and refuses to publish if it is out of range.**
 *   5. Copies WAV and MP3 to the backup folder, then uploads the MP3.
 *
 * What it cannot check: whether the recording is any good. Listen first.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const COVER = path.join(RAIZ, 'public/static/images/nordkreis-icon.png')
const DATEN = path.join(RAIZ, 'data/nordkreis-audios.ts')

// One system with the checks below. Taken unchanged from publicar-clase.mjs,
// where they were measured on real speech; re-run its --calibrar mode on a
// real Nordkreis master before changing any of them.
const LUFS_ZIEL = -16
const TP_ZIEL = -5
const LRA_ZIEL = 11
const TOLERANZ_LUFS = 1.5
const TP_MAX = -1.0

const GRUPPEN = {
  spi: 'Spielkreis',
  ent: 'Entdeckerkreis',
  kom: 'Kompasskreis',
  nor: 'Nordlichter',
  pol: 'Polarkreis',
  den: 'Denkraum',
  wei: 'Weitblick',
  abs: 'Abschlusskreis',
}

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

/** loudnorm writes its JSON at the end of stderr. */
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
    'format=duration:stream=codec_type,codec_name,channels,sample_rate',
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

const inhalt = Number(option('audio'))
const gruppe = option('gruppe') ?? 'ent'
const zyklus = option('zyklus') ?? 'a'
const wav = option('wav')
const kopie = option('copia')
const trocken = args.includes('--dry-run')

if (!Number.isInteger(inhalt) || inhalt < 1 || inhalt > 20) {
  abbruch('--audio fehlt oder liegt nicht zwischen 1 und 20')
}
if (!(gruppe in GRUPPEN)) abbruch(`unbekannte Gruppe: ${gruppe}`)
if (!['a', 'b', 'c'].includes(zyklus)) abbruch(`unbekannter Zyklus: ${zyklus}`)
if (!wav || !fs.existsSync(wav)) abbruch(`WAV nicht gefunden: ${wav ?? '(--wav fehlt)'}`)
if (!kopie) abbruch('--copia fehlt, der Sicherungsordner außerhalb von Cloudflare')
if (!fs.existsSync(kopie)) abbruch(`Sicherungsordner existiert nicht: ${kopie}`)
if (!fs.existsSync(COVER)) abbruch(`Cover fehlt: ${COVER}`)

const nn = String(inhalt).padStart(2, '0')
const name = `nk_${gruppe}_${zyklus}${nn}.mp3`
const album = `Nordkreis ${GRUPPEN[gruppe]} · Zyklus ${zyklus.toUpperCase()}`

// ── 2. title from the data file ──────────────────────────────────────────────
//
// Only the ent/a recordings live there today. Each one is a `...leer(N)`
// object; its `titel` is the ID3 title. No title, no publish: a file without
// one shows up as a bare number in a parent's downloads.

function titelAusDaten() {
  const text = fs.readFileSync(DATEN, 'utf8')
  const start = text.indexOf(`...leer(${inhalt}),`)
  if (start === -1) return ''
  const ende = text.indexOf('...leer(', start + 1)
  const block = text.slice(start, ende === -1 ? undefined : ende)
  return block.match(/titel:\s*'([^']+)'/)?.[1] ?? ''
}

const titel = titelAusDaten()
if (!titel) abbruch(`kein Titel für Audio ${inhalt} in data/nordkreis-audios.ts`)

// ── 1. never overwrite ───────────────────────────────────────────────────────

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
  await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: name }))
  abbruch(
    `${name} liegt schon im Bucket. Eine veröffentlichte Datei wird nie unter demselben\n` +
      `           Namen ersetzt: die Handys der Eltern halten sie ein Jahr im Zwischenspeicher.`
  )
} catch (e) {
  const code = e?.$metadata?.httpStatusCode
  if (code !== 404 && e?.name !== 'NotFound') {
    abbruch(`konnte nicht prüfen, ob ${name} schon im Bucket liegt: ${e?.name ?? e}`)
  }
}

console.log(`\nAudio ${inhalt} · ${titel}  ->  ${name}`)
console.log(grau(`  Quelle     ${wav}`))
console.log(grau(`  Sicherung  ${kopie}`))
if (trocken) console.log(grau('  (dry-run: nichts wird hochgeladen)'))

// ── 3. measure, encode, cover ────────────────────────────────────────────────

console.log('\n1/4  messe das WAV')
const gemessen = messen(wav, true)
console.log(
  grau(`     I=${gemessen.input_i} LUFS  TP=${gemessen.input_tp} dBTP  LRA=${gemessen.input_lra}`)
)

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nk-'))
const ohneCover = path.join(tmp, `ohne_cover_${name}`)
const fertig = path.join(tmp, name)

console.log('2/4  kodiere mit den gemessenen Werten')
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

// No year, no Saturday number, no date: the same file plays in 2029.
let r = laufen('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  wav,
  '-af',
  filter,
  '-ac',
  '1',
  '-ar',
  '44100',
  '-codec:a',
  'libmp3lame',
  '-b:a',
  '96k',
  '-map_metadata',
  '-1',
  '-metadata',
  `title=${titel}`,
  '-metadata',
  'artist=Tash Tenner',
  '-metadata',
  `album=${album}`,
  '-metadata',
  `track=${inhalt}`,
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

// ── 4. check the result ──────────────────────────────────────────────────────

console.log('3/4  prüfe das fertige MP3')
const geprueft = messen(fertig, false)
const lufs = Number(geprueft.input_i)
const tp = Number(geprueft.input_tp)

const info = sondieren(fertig)
const audio = (info.streams ?? []).find((s) => s.codec_type === 'audio') ?? {}
const mitCover = (info.streams ?? []).some((s) => s.codec_type === 'video')
const dauer = Number(info.format?.duration ?? 0)
const dauerQuelle = Number(sondieren(wav).format?.duration ?? 0)

const fehler = []
if (!Number.isFinite(lufs) || Math.abs(lufs - LUFS_ZIEL) > TOLERANZ_LUFS) {
  fehler.push(`Lautheit ${lufs} LUFS, außerhalb von ${LUFS_ZIEL} ±${TOLERANZ_LUFS}`)
}
if (!Number.isFinite(tp) || tp > TP_MAX) fehler.push(`True Peak ${tp} dBTP, über ${TP_MAX}`)
if (audio.codec_name !== 'mp3') fehler.push(`Codec ${audio.codec_name}, erwartet mp3`)
if (Number(audio.channels) !== 1) fehler.push(`${audio.channels} Kanäle, erwartet 1`)
if (Number(audio.sample_rate) !== 44100) fehler.push(`${audio.sample_rate} Hz, erwartet 44100`)
if (!mitCover) fehler.push('kein Cover eingebettet')
if (dauerQuelle > 0 && Math.abs(dauer - dauerQuelle) > 1) {
  fehler.push(`dauert ${dauer.toFixed(1)}s, das WAV ${dauerQuelle.toFixed(1)}s`)
}

console.log(`     Lautheit ${lufs} LUFS   True Peak ${tp} dBTP`)
console.log(
  grau(
    `     mp3 ${audio.channels} Kanal ${audio.sample_rate} Hz  ${dauer.toFixed(1)}s  Cover: ${mitCover ? 'ja' : 'nein'}`
  )
)

if (fehler.length > 0) {
  console.error(`\n${rot('DAS AUDIO BESTEHT DIE PRÜFUNG NICHT')}`)
  for (const f of fehler) console.error(`  · ${f}`)
  console.error(`\nNichts kopiert, nichts hochgeladen. Die Testdatei liegt hier:\n  ${fertig}\n`)
  process.exit(1)
}
console.log(gruen('     besteht'))

// ── 5. backup, then upload ───────────────────────────────────────────────────

console.log('4/4  sichere und lade hoch')

// A dry run touches neither the backup nor the bucket. Copying here would make
// the real run refuse afterwards, because the backup MP3 "already exists".
if (trocken) {
  console.log(grau('     (dry-run: nichts gesichert, nichts hochgeladen)'))
} else {
  fs.copyFileSync(fertig, zielKopie)
  const wavKopie = path.join(kopie, `${path.parse(name).name}.wav`)
  if (!fs.existsSync(wavKopie)) fs.copyFileSync(wav, wavKopie)
  console.log(grau(`     ${zielKopie}`))
  console.log(grau(`     ${wavKopie}`))

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: name,
      Body: fs.readFileSync(fertig),
      ContentType: 'audio/mpeg',
    })
  )
  console.log(grau(`     hochgeladen nach ${bucket}/${name}`))
}

fs.rmSync(tmp, { recursive: true, force: true })

console.log(`\n${gruen('Fertig.')} In data/nordkreis-audios.ts bei Audio ${inhalt} eintragen:\n`)
console.log(`    dauer: ${Math.round(dauer)},`)
console.log(`    verfuegbar: true,\n`)
