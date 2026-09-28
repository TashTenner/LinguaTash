/**
 * Revisa la grabación de una clase el mismo día, antes de que se enfríe la
 * memoria de lo que pasó.
 *
 *   node scripts/revisar-grabacion.mjs --archivo "…/Recording (13).m4a" --esperado 55
 *
 * Busca las dos formas en que una clase se pierde, que no son la misma:
 *
 *   1. **La grabación se cortó.** El portátil se durmió, la app se cerró, se
 *      acabó la batería. No hay silencio que detectar: el archivo simplemente
 *      dura menos de lo que duró la clase. Por eso hace falta `--esperado`.
 *   2. **La grabación siguió pero no entró sonido.** Micrófono tapado o
 *      desconectado. Ahí sí hay un tramo mudo en medio.
 *
 * El lunes 28 de septiembre de 2026 se perdieron veinte minutos por el primer
 * caso. Avisar el mismo día fue lo que permitió reconstruir de memoria lo que
 * el audio ya no tenía. Un aviso el martes no sirve igual.
 *
 * No toca el archivo ni sube nada. Solo mira y avisa.
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const rojo = (t) => `\x1b[31m${t}\x1b[0m`
const verde = (t) => `\x1b[32m${t}\x1b[0m`
const ambar = (t) => `\x1b[33m${t}\x1b[0m`
const gris = (t) => `\x1b[90m${t}\x1b[0m`

const args = process.argv.slice(2)
const opcion = (n) => {
  const i = args.indexOf(`--${n}`)
  return i === -1 ? undefined : args[i + 1]
}

const archivo = opcion('archivo')
const esperado = opcion('esperado') ? Number(opcion('esperado')) : undefined
const minSilencio = opcion('silencio') ? Number(opcion('silencio')) : 15
const umbralRuido = opcion('umbral') ?? '-50dB'

if (!archivo || !fs.existsSync(archivo)) {
  console.error(
    `\n${rojo('ABORTADO')}  no encuentro el archivo: ${archivo ?? '(falta --archivo)'}\n`
  )
  process.exit(1)
}

const correr = (cmd, a) => spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const reloj = (s) => {
  const m = Math.floor(s / 60)
  const r = Math.round(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}

// ── duración ─────────────────────────────────────────────────────────────────

const sonda = correr('ffprobe', [
  '-v',
  'error',
  '-show_entries',
  'format=duration',
  '-of',
  'csv=p=0',
  archivo,
])
const duracion = Number(sonda.stdout.trim())
if (!Number.isFinite(duracion) || duracion <= 0) {
  console.error(`\n${rojo('ABORTADO')}  ffprobe no pudo leer la duración\n`)
  process.exit(1)
}

console.log(`\n${path.basename(archivo)}`)
console.log(`  dura ${reloj(duracion)}`)

const avisos = []

if (esperado) {
  const faltan = esperado * 60 - duracion
  console.log(gris(`  esperado unos ${esperado} min`))
  if (faltan > 5 * 60) {
    avisos.push(
      `faltan ${reloj(faltan)} respecto de los ${esperado} min esperados. ` +
        `Esto es lo que pasa cuando la grabación se corta sola.`
    )
  }
}

// ── tramos mudos ─────────────────────────────────────────────────────────────

const det = correr('ffmpeg', [
  '-hide_banner',
  '-i',
  archivo,
  '-af',
  `silencedetect=noise=${umbralRuido}:d=${minSilencio}`,
  '-f',
  'null',
  '-',
])

const tramos = []
let inicio = null
for (const linea of (det.stderr ?? '').split('\n')) {
  const a = linea.match(/silence_start:\s*(-?[\d.]+)/)
  if (a) inicio = Number(a[1])
  const b = linea.match(/silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/)
  if (b && inicio !== null) {
    tramos.push({ desde: inicio, hasta: Number(b[1]), cuanto: Number(b[2]) })
    inicio = null
  }
}
// Un silencio que llega hasta el final no produce silence_end.
if (inicio !== null) {
  tramos.push({ desde: inicio, hasta: duracion, cuanto: duracion - inicio })
}

const mudo = tramos.reduce((t, x) => t + x.cuanto, 0)
console.log(
  gris(`  tramos mudos de más de ${minSilencio}s (bajo ${umbralRuido}): ${tramos.length}`)
)

if (tramos.length > 0) {
  for (const t of tramos) {
    console.log(`    ${reloj(t.desde)} a ${reloj(t.hasta)}   ${reloj(t.cuanto)} sin sonido`)
  }
  avisos.push(
    `${reloj(mudo)} de silencio en total, un ${Math.round((mudo / duracion) * 100)} % de la grabación.`
  )
}

// ── veredicto ────────────────────────────────────────────────────────────────

if (avisos.length === 0) {
  console.log(`\n${verde('Sin huecos.')} La grabación parece completa.\n`)
  process.exit(0)
}

console.log(`\n${ambar('REVISAR HOY MISMO')}`)
for (const a of avisos) console.log(`  · ${a}`)
console.log(
  `\n${gris('Si falta clase, anotá de memoria lo que el audio no tiene, hoy.')}\n` +
    `${gris('Mañana ya no te vas a acordar igual.')}\n`
)
process.exit(1)
