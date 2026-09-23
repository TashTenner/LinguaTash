/**
 * Publica el audio de una clase de Alemán·y·Du.
 *
 *   node scripts/publicar-clase.mjs --clase 3 --wav "D:/grabaciones/clase03.wav" \
 *        --copia "D:/Mi unidad/AlemanYDu"
 *
 * Qué hace, en orden:
 *
 *   1. Se niega a seguir si `ayd_cNN.mp3` ya existe, en local o en el bucket.
 *   2. Mide el WAV con loudnorm (primera pasada).
 *   3. Codifica aplicando los valores medidos (segunda pasada).
 *   4. Incrusta la carátula copiando el audio, sin recodificar.
 *   5. **Mide el MP3 final y falla si se sale del rango.**
 *   6. Copia el WAV y el MP3 a la carpeta de respaldo.
 *   7. Sube el MP3 a R2 e imprime lo que hay que pegar en el archivo de datos.
 *
 * El paso 5 es el importante. Si un lunes se escapa un flag y la pista sale
 * quince decibelios más baja, sin esa comprobación nadie se entera hasta que
 * un padre deja de escuchar. Con ella, el error es ruidoso y no se sube nada.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CARATULA = path.join(RAIZ, 'public/static/images/alemanydu-cover.jpg')

// Objetivo de sonoridad. TP a -3 y no a -1.5 porque el MP3 se pasa por encima:
// la codificación con pérdida puede superar el pico real del PCM, así que hay
// que dejarle margen o el archivo final acaba recortando.
const LUFS_OBJETIVO = -16
const TP_OBJETIVO = -3
const LRA_OBJETIVO = 11

// Márgenes de la comprobación final, sobre el MP3 ya codificado.
const TOLERANCIA_LUFS = 1.0
const TP_MAXIMO = -1.0

// ── utilidades ───────────────────────────────────────────────────────────────

const rojo = (t) => `\x1b[31m${t}\x1b[0m`
const verde = (t) => `\x1b[32m${t}\x1b[0m`
const gris = (t) => `\x1b[90m${t}\x1b[0m`

function morir(mensaje) {
  console.error(`\n${rojo('ABORTADO')}  ${mensaje}\n`)
  process.exit(1)
}

function correr(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.error) morir(`no se pudo ejecutar ${cmd}: ${r.error.message}`)
  return { code: r.status, out: r.stdout ?? '', err: r.stderr ?? '' }
}

/** loudnorm escribe su JSON al final de stderr. */
function ultimoJson(texto) {
  const abre = texto.lastIndexOf('{')
  const cierra = texto.lastIndexOf('}')
  if (abre === -1 || cierra === -1 || cierra < abre) return null
  try {
    return JSON.parse(texto.slice(abre, cierra + 1))
  } catch {
    return null
  }
}

function medirLoudnorm(archivo, conFiltroGraves) {
  const cadena = conFiltroGraves
    ? `highpass=f=80,loudnorm=I=${LUFS_OBJETIVO}:TP=${TP_OBJETIVO}:LRA=${LRA_OBJETIVO}:print_format=json`
    : `loudnorm=I=${LUFS_OBJETIVO}:TP=${TP_OBJETIVO}:LRA=${LRA_OBJETIVO}:print_format=json`
  const r = correr('ffmpeg', ['-hide_banner', '-i', archivo, '-af', cadena, '-f', 'null', '-'])
  const datos = ultimoJson(r.err)
  if (!datos)
    morir(`no se pudo medir ${path.basename(archivo)}. ffmpeg dijo:\n${r.err.slice(-800)}`)
  return datos
}

function sondear(archivo) {
  const r = correr('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration:stream=codec_type,codec_name,channels,sample_rate',
    '-of',
    'json',
    archivo,
  ])
  try {
    return JSON.parse(r.out)
  } catch {
    return morir(`ffprobe no pudo leer ${archivo}`)
  }
}

// ── argumentos ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const opcion = (nombre) => {
  const i = args.indexOf(`--${nombre}`)
  return i === -1 ? undefined : args[i + 1]
}
const bandera = (nombre) => args.includes(`--${nombre}`)

const clase = Number(opcion('clase'))
const wav = opcion('wav')
const copia = opcion('copia')
const enSeco = bandera('dry-run')

if (!Number.isInteger(clase) || clase < 1 || clase > 32) {
  morir('falta --clase, o no está entre 1 y 32')
}
if (!wav || !fs.existsSync(wav)) morir(`no encuentro el WAV: ${wav ?? '(falta --wav)'}`)
if (!copia) morir('falta --copia, la carpeta de respaldo sincronizada con Drive')
if (!fs.existsSync(copia)) morir(`la carpeta de respaldo no existe: ${copia}`)
if (!fs.existsSync(CARATULA)) morir(`falta la carátula: ${CARATULA}`)

const nn = String(clase).padStart(2, '0')
const nombre = `ayd_c${nn}.mp3`

// ── 1. no pisar nada ─────────────────────────────────────────────────────────

for (const linea of fs.existsSync(path.join(RAIZ, '.env.local'))
  ? fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split('\n')
  : []) {
  const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const bucket = process.env.CLOUDFLARE_R2_ALEMANYDU_AUDIO_BUCKET
if (!bucket) morir('falta CLOUDFLARE_R2_ALEMANYDU_AUDIO_BUCKET en .env.local')

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

const destinoCopia = path.join(copia, nombre)
if (fs.existsSync(destinoCopia)) {
  morir(`ya existe ${destinoCopia}. Si de verdad querés rehacer la clase ${clase}, borralo a mano.`)
}

try {
  await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: nombre }))
  morir(
    `${nombre} ya está en el bucket. No lo piso: perder un master por repetir el comando es justo\n` +
      `           lo que esto evita. Si de verdad hay que reemplazarlo, borralo primero en Cloudflare.`
  )
} catch (e) {
  const codigo = e?.$metadata?.httpStatusCode
  if (codigo !== 404 && e?.name !== 'NotFound') {
    morir(`no pude comprobar si ${nombre} ya existe en el bucket: ${e?.name ?? e}`)
  }
}

console.log(`\nClase ${clase}  ->  ${nombre}`)
console.log(gris(`  origen   ${wav}`))
console.log(gris(`  respaldo ${copia}`))
if (enSeco) console.log(gris('  (dry-run: no se sube nada)'))

// ── 2. primera pasada: medir ─────────────────────────────────────────────────

console.log('\n1/5  midiendo el WAV')
const medido = medirLoudnorm(wav, true)
console.log(
  gris(
    `     I=${medido.input_i} LUFS  TP=${medido.input_tp} dBTP  LRA=${medido.input_lra}  umbral=${medido.input_thresh}`
  )
)

// ── 3. segunda pasada: codificar con lo medido ───────────────────────────────

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ayd-'))
const sinArte = path.join(tmp, `sin_arte_${nombre}`)
const finalMp3 = path.join(tmp, nombre)

console.log('2/5  codificando con los valores medidos')
const filtro =
  'highpass=f=80,' +
  [
    `loudnorm=I=${LUFS_OBJETIVO}`,
    `TP=${TP_OBJETIVO}`,
    `LRA=${LRA_OBJETIVO}`,
    `measured_I=${medido.input_i}`,
    `measured_TP=${medido.input_tp}`,
    `measured_LRA=${medido.input_lra}`,
    `measured_thresh=${medido.input_thresh}`,
    `offset=${medido.target_offset}`,
    'linear=true',
  ].join(':')

let r = correr('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  wav,
  '-af',
  filtro,
  '-ac',
  '1',
  '-ar',
  '44100',
  '-codec:a',
  'libmp3lame',
  '-b:a',
  '96k',
  '-metadata',
  `title=Clase ${clase}`,
  '-metadata',
  'artist=LinguaTash',
  '-metadata',
  'album=Alemán y Du · Primaria',
  '-metadata',
  `track=${clase}`,
  sinArte,
])
if (r.code !== 0) morir(`la codificación falló:\n${r.err.slice(-1200)}`)

// ── 4. carátula, copiando el audio ───────────────────────────────────────────

console.log('3/5  incrustando la carátula')
r = correr('ffmpeg', [
  '-hide_banner',
  '-y',
  '-i',
  sinArte,
  '-i',
  CARATULA,
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
  finalMp3,
])
if (r.code !== 0) morir(`no se pudo incrustar la carátula:\n${r.err.slice(-1200)}`)

// ── 5. comprobar el resultado. Esto es lo que convierte un fallo silencioso
//       en uno ruidoso ──────────────────────────────────────────────────────

console.log('4/5  comprobando el MP3 final')
const comprobado = medirLoudnorm(finalMp3, false)
const lufs = Number(comprobado.input_i)
const tp = Number(comprobado.input_tp)

const info = sondear(finalMp3)
const audio = (info.streams ?? []).find((s) => s.codec_type === 'audio') ?? {}
const tienePortada = (info.streams ?? []).some((s) => s.codec_type === 'video')
const duracion = Number(info.format?.duration ?? 0)
const duracionOrigen = Number(sondear(wav).format?.duration ?? 0)

const fallos = []
if (!Number.isFinite(lufs) || Math.abs(lufs - LUFS_OBJETIVO) > TOLERANCIA_LUFS) {
  fallos.push(`sonoridad ${lufs} LUFS, fuera de ${LUFS_OBJETIVO} ±${TOLERANCIA_LUFS}`)
}
if (!Number.isFinite(tp) || tp > TP_MAXIMO) {
  fallos.push(`pico real ${tp} dBTP, por encima de ${TP_MAXIMO}`)
}
if (audio.codec_name !== 'mp3') fallos.push(`códec ${audio.codec_name}, se esperaba mp3`)
if (Number(audio.channels) !== 1) fallos.push(`${audio.channels} canales, se esperaba 1`)
if (Number(audio.sample_rate) !== 44100) fallos.push(`${audio.sample_rate} Hz, se esperaban 44100`)
if (!tienePortada) fallos.push('sin carátula incrustada')
if (duracionOrigen > 0 && Math.abs(duracion - duracionOrigen) > 1) {
  fallos.push(`dura ${duracion.toFixed(1)}s y el WAV ${duracionOrigen.toFixed(1)}s`)
}

console.log(`     sonoridad ${lufs} LUFS   pico real ${tp} dBTP`)
console.log(
  gris(
    `     mp3 ${audio.channels} canal ${audio.sample_rate} Hz  ${duracion.toFixed(1)}s  carátula: ${tienePortada ? 'sí' : 'no'}`
  )
)

if (fallos.length > 0) {
  console.error(`\n${rojo('LA PISTA NO PASA LA COMPROBACIÓN')}`)
  for (const f of fallos) console.error(`  · ${f}`)
  console.error(`\nNo se ha subido nada y no se ha copiado nada. El archivo de prueba quedó en:`)
  console.error(`  ${finalMp3}\n`)
  process.exit(1)
}
console.log(verde('     pasa'))

// ── 6. respaldo, antes de subir ──────────────────────────────────────────────

console.log('5/5  copiando al respaldo y subiendo')
fs.copyFileSync(finalMp3, destinoCopia)
const wavCopia = path.join(copia, `${path.parse(nombre).name}.wav`)
if (!fs.existsSync(wavCopia)) fs.copyFileSync(wav, wavCopia)
console.log(gris(`     ${destinoCopia}`))
console.log(gris(`     ${wavCopia}`))

// ── 7. subir ─────────────────────────────────────────────────────────────────

if (enSeco) {
  console.log(gris('     (dry-run: no se sube a R2)'))
} else {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: nombre,
      Body: fs.readFileSync(finalMp3),
      ContentType: 'audio/mpeg',
    })
  )
  console.log(gris(`     subido a ${bucket}/${nombre}`))
}

fs.rmSync(tmp, { recursive: true, force: true })

// ── 8. qué pegar ─────────────────────────────────────────────────────────────

console.log(`\n${verde('Listo.')} Pegá esto en data/alemanydu-audios.ts, en la clase ${clase}:\n`)
console.log(`    titulo: 'Clase ${clase}',`)
console.log(`    resumen: '',`)
console.log(`    archivo: '${nombre}',`)
console.log(`    duracion: ${Math.round(duracion)},`)
console.log(`    disponible: true,`)
console.log(`\n${gris('Falta escribir el resumen, en castellano y sin alemán.')}\n`)
