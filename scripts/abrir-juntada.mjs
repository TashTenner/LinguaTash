/**
 * Abre las reservas de una fecha de La Juntada.
 *
 *   node scripts/abrir-juntada.mjs --fecha 2027-01-17
 *   node scripts/abrir-juntada.mjs --fecha 2027-01-17 --aula I4 --dry-run
 *
 * La fecha tiene que estar ya en content/lajuntada/fechas.ts, con su tema. De
 * ahí sale todo lo que cambia de un mes a otro. En orden:
 *
 *   1. Se niega si la fecha ya pasó, está cancelada, ya tiene link en
 *      fechas.ts o ya hay en Stripe un link con su etiqueta `evento`. Repetir
 *      el comando no puede abrir dos links para el mismo domingo.
 *   2. Cuenta en Stripe los lugares que ya ocupan reservas venidas de otra
 *      fecha (traspasos y reservas movidas, ver fechas.ts) y pone el límite
 *      del link en 15 menos esas.
 *   3. Copia del último link de La Juntada lo que es igual todos los meses:
 *      los tres campos del formulario, nombre y teléfono obligatorios, solo
 *      tarjeta. Copiarlo, en vez de escribirlo acá, hace que un cambio hecho
 *      a mano en el Dashboard se mantenga el mes siguiente.
 *   4. Crea producto, precio de 30 € y link, con la etiqueta, el mensaje de
 *      confirmación (fecha, entrada, aula, devoluciones hasta cinco días
 *      antes) y el de lugares completos.
 *   5. Escribe la URL en fechas.ts. Queda commitear y pushear.
 *
 * Con --dry-run hace los pasos 1 a 3 e imprime todo lo que crearía, sin
 * crear nada en Stripe ni tocar fechas.ts.
 *
 * Es un comando y no un cron a propósito: abrir es el momento en que se
 * empieza a cobrar, y depende de que el aula esté confirmada. Cerrar sí es
 * automático (app/api/lajuntada/cerrar-links).
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Stripe from 'stripe'
import { diaDe, fechasLaJuntada, reservasMovidas } from '../content/lajuntada/fechas.ts'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FECHAS = path.join(RAIZ, 'content/lajuntada/fechas.ts')

const CUPO = 15
const PRECIO_CENTIMOS = 3000
const DIAS_PARA_DEVOLVER = 5
// Stripe corta el mensaje de confirmación en 500 caracteres.
const MAX_CONFIRMACION = 500

const rojo = (s) => `\x1b[31m${s}\x1b[0m`
const verde = (s) => `\x1b[32m${s}\x1b[0m`

function cortar(mensaje) {
  console.error(`\n${rojo('NO SE ABRIÓ')}  ${mensaje}\n`)
  process.exit(1)
}

// ── argumentos ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const valor = (nombre) => {
  const i = args.indexOf(nombre)
  return i === -1 ? undefined : args[i + 1]
}
const iso = valor('--fecha')
const aula = valor('--aula') ?? 'I4'
const dryRun = args.includes('--dry-run')

if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) cortar('falta --fecha AAAA-MM-DD')

for (const linea of fs.existsSync(path.join(RAIZ, '.env.local'))
  ? fs.readFileSync(path.join(RAIZ, '.env.local'), 'utf8').split(/\r?\n/)
  : []) {
  const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
if (!process.env.STRIPE_SECRET_KEY) cortar('falta STRIPE_SECRET_KEY en .env.local')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ── 1. ¿se puede abrir? ──────────────────────────────────────────────────────

const fecha = fechasLaJuntada.find((f) => f.iso === iso)
if (!fecha) cortar(`${iso} no está en content/lajuntada/fechas.ts. Agregala primero, con su tema.`)

const hoy = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' })
if (iso <= hoy) cortar(`${fecha.fecha} ya pasó o es hoy.`)
if (fecha.estado === 'cancelada') cortar(`${fecha.fecha} está cancelada.`)
if (fecha.stripeUrl) cortar(`${fecha.fecha} ya tiene link: ${fecha.stripeUrl}`)

const evento = `la-juntada-${iso}`
const links = []
for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
  if (link.metadata?.evento?.startsWith('la-juntada-')) links.push(link)
}
const yaExiste = links.find((l) => l.metadata.evento === evento && l.active)
if (yaExiste) {
  cortar(
    `ya hay un link activo con evento=${evento}: ${yaExiste.url}\n` +
      '             Si es el bueno, ponelo en fechas.ts a mano en vez de crear otro.'
  )
}

// ── 2. lugares ya ocupados ───────────────────────────────────────────────────
// La misma regla que lib/lajuntada/reservas.ts: una reserva cuenta para la
// fecha a la que se movió sola, si no para la que heredó su fecha cancelada.

function devuelta(session) {
  const charge = session.payment_intent?.latest_charge
  return !!charge && typeof charge !== 'string' && charge.refunded
}

const fuentes = fechasLaJuntada.filter(
  (f) =>
    f.stripeUrl &&
    f.iso !== iso &&
    (f.traspasadaA === iso || reservasMovidas.some((m) => m.desde === f.iso && m.a === iso))
)
const venidas = []
for (const f of fuentes) {
  const link = links.find((l) => l.url === f.stripeUrl)
  if (!link) cortar(`el link de ${f.fecha} no aparece en Stripe (${f.stripeUrl})`)
  for await (const s of stripe.checkout.sessions.list({
    payment_link: link.id,
    limit: 100,
    expand: ['data.payment_intent.latest_charge'],
  })) {
    if (s.payment_status !== 'paid' || devuelta(s)) continue
    const movida = reservasMovidas.find((m) => m.sessionId === s.id)
    if ((movida?.a ?? f.traspasadaA ?? f.iso) === iso) {
      venidas.push(`${s.customer_details?.name ?? s.id} (pagó para el ${diaDe(f)})`)
    }
  }
}
const limite = CUPO - venidas.length
if (limite < 1) cortar(`las ${venidas.length} reservas venidas de otras fechas ya llenan el cupo.`)

// ── 3. lo que se copia del último link ───────────────────────────────────────

const modelo = links.sort((a, b) => (a.metadata.evento < b.metadata.evento ? 1 : -1))[0]
if (!modelo) cortar('no hay ningún link anterior de La Juntada del que copiar el formulario.')
const camposModelo = modelo.custom_fields ?? []
for (const clave of ['chicos', 'edades', 'origen']) {
  // El panel busca los campos por estas palabras (ver `campo` en reservas.ts).
  if (!camposModelo.some((c) => c.key === clave)) {
    cortar(`el link modelo (${modelo.metadata.evento}) no tiene el campo "${clave}".`)
  }
}
const camposNuevos = camposModelo.map((c) => ({
  key: c.key,
  label: { type: 'custom', custom: c.label.custom },
  type: c.type,
  optional: c.optional,
}))

// ── 4. textos ────────────────────────────────────────────────────────────────

const dia = diaDe(fecha) // "domingo 17 de enero"
const diaSinDomingo = dia.replace(/^domingo /, '')
const plazo = new Date(`${iso}T12:00:00Z`)
plazo.setUTCDate(plazo.getUTCDate() - DIAS_PARA_DEVOLVER)
const hastaCuando = plazo.toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const nombreProducto = `La Juntada, ${diaSinDomingo} · Una familia y sus hijos`
const credito = fecha.aCargoDe
  ? `, clase a cargo de ${fecha.aCargoDe.nombre}, ${fecha.aCargoDe.descripcion}`
  : ''
const descripcion =
  `${fecha.tema}${credito}. Una familia y sus hijos, venga uno de los progenitores o vengan ` +
  'los dos. Incluye la actividad, la yerba, el agua caliente y un jugo para los chicos. ' +
  'Cada adulto trae su mate y su bombilla.'

const confirmacion =
  `¡Listo, ya tenés tu lugar en La Juntada! Te esperamos el ${dia}, de 15h a 17h, en La Salle ` +
  'Gràcia (Plaça del Nord). La entrada es por Carrer de Sant Salvador 36-50: el portón negro ' +
  `entre los muros azules, no la puerta principal. Estamos en el aula ${aula}. Traé mate y ` +
  'bombilla; la yerba, el agua caliente y el jugo los pongo yo. Si no podés venir, avisame ' +
  `hasta el ${hastaCuando} y te devuelvo el importe; después de esa fecha no hay devoluciones. ` +
  'WhatsApp: +34 644 88 67 23. Tash'
if (confirmacion.length > MAX_CONFIRMACION) {
  cortar(
    `el mensaje de confirmación tiene ${confirmacion.length} caracteres y Stripe acepta ` +
      `${MAX_CONFIRMACION}. Acortá el texto en el script.`
  )
}

const completo =
  `Ya se completaron los lugares de La Juntada del ${diaSinDomingo}. Escribime por WhatsApp ` +
  'al +34 644 88 67 23 y te anoto en la lista de espera.'

console.log(`
La Juntada del ${dia} · aula ${aula}${dryRun ? ' · DRY RUN, no se crea nada' : ''}

  Producto      ${nombreProducto}
  Descripción   ${descripcion}
  Precio        ${(PRECIO_CENTIMOS / 100).toFixed(2)} €, solo tarjeta
  Etiqueta      evento = ${evento}
  Límite        ${limite} pagos${venidas.length ? `, porque ya ocupan lugar:\n                ${venidas.join('\n                ')}` : ''}
  Formulario    copiado de ${modelo.metadata.evento}: ${camposNuevos.map((c) => c.key).join(', ')}
  Completo      ${completo}
  Confirmación  (${confirmacion.length} caracteres)
                ${confirmacion}
`)

if (dryRun) process.exit(0)

// ── 5. crear y anotar ────────────────────────────────────────────────────────

const producto = await stripe.products.create({
  name: nombreProducto,
  description: descripcion,
  type: 'service',
})
const precio = await stripe.prices.create({
  product: producto.id,
  currency: 'eur',
  unit_amount: PRECIO_CENTIMOS,
})
const link = await stripe.paymentLinks.create({
  line_items: [{ price: precio.id, quantity: 1 }],
  // Nunca SEPA: "Nueva reserva" llegaría a Slack antes que la plata.
  payment_method_types: ['card'],
  phone_number_collection: { enabled: true },
  ...(modelo.name_collection?.individual
    ? { name_collection: { individual: modelo.name_collection.individual } }
    : {}),
  custom_fields: camposNuevos,
  metadata: { evento },
  restrictions: { completed_sessions: { limit: limite } },
  inactive_message: completo,
  after_completion: {
    type: 'hosted_confirmation',
    hosted_confirmation: { custom_message: confirmacion },
  },
})

const texto = fs.readFileSync(FECHAS, 'utf8')
const inicio = texto.indexOf(`iso: '${iso}'`)
const siguiente = texto.indexOf("iso: '", inicio + 1)
const bloque = texto.slice(inicio, siguiente === -1 ? undefined : siguiente)
if (!bloque.includes('stripeUrl: null,')) {
  cortar(
    `el link se creó (${link.url}) pero no encontré "stripeUrl: null," en la entrada de ${iso}.\n` +
      '             Ponelo a mano en fechas.ts.'
  )
}
const comentario =
  limite < CUPO
    ? `// Limitado a ${limite} pagos: ${CUPO - limite} lugar${CUPO - limite > 1 ? 'es' : ''} ya ocupado${CUPO - limite > 1 ? 's' : ''} por reservas venidas de otra fecha.\n    `
    : ''
const nuevoBloque = bloque.replace('stripeUrl: null,', `${comentario}stripeUrl: '${link.url}',`)
fs.writeFileSync(FECHAS, texto.replace(bloque, nuevoBloque))
spawnSync('npx', ['prettier', '--write', FECHAS], { cwd: RAIZ, stdio: 'ignore', shell: true })

console.log(`${verde('ABIERTA')}  ${link.url}

  Escrita en content/lajuntada/fechas.ts. Falta commitear y pushear a
  private-prod y main. Después, abrí el link una vez para ver el formulario.
`)
