/**
 * Las reservas de La Juntada, leídas de Stripe.
 *
 * No hay copia local ni hoja de cálculo a propósito. El dato nace en el
 * checkout de Stripe, que ya guarda nombre, email, teléfono y los campos que
 * pide el formulario, así que cualquier copia nuestra sería una segunda
 * verdad que puede desincronizarse.
 *
 * Una fecha y su payment link ya están emparejados en content/lajuntada/fechas.ts.
 * De ahí sale todo: buscamos el link por su URL y contamos lo que cobró. Un
 * pago cuenta para la fecha que diga `destinoDe`, que casi siempre es la de
 * su link: una fecha cancelada pasa sus reservas a otra, y una reserva suelta
 * se puede mover sola.
 */

import { cache } from 'react'
import Stripe from 'stripe'
import { destinoDe, fuentesDe, type FechaLaJuntada } from '@/content/lajuntada/fechas'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export interface ReservaLaJuntada {
  sessionId: string
  creada: string
  nombre: string | null
  email: string | null
  telefono: string | null
  chicos: string | null
  edades: string | null
  origen: string | null
  /** En euros, lo que pagó de verdad. */
  importe: number
  /** Una devuelta ya no ocupa lugar, pero sigue siendo parte del historial. */
  estado: 'pagada' | 'devuelta'
  /** La fecha en cuyo link se pagó, si vino de otra. Null si es de esta fecha. */
  traspasadaDe: string | null
}

/**
 * El id del payment link cuya URL pública es la que guarda `fechas.ts`.
 *
 * Se resuelve por URL y no por id para que no haya un identificador más que
 * copiar a mano: la fecha ya conoce su link, y si el link se rehace, cambiar
 * la URL en `fechas.ts` es suficiente.
 */
async function idDelLink(stripeUrl: string): Promise<string | null> {
  for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
    if (link.url === stripeUrl) return link.id
  }
  return null
}

/**
 * Una reserva reembolsada por completo ya no ocupa lugar.
 *
 * Stripe deja una sesión devuelta en `payment_status: 'paid'` para siempre, así
 * que sin esto una cancelación seguiría contando y el cupo diría quince con
 * catorce familias. Un reembolso parcial (devolver solo el otro progenitor)
 * sigue siendo una reserva.
 *
 * El contador la descuenta; el panel la sigue mostrando, marcada, porque una
 * fila que desaparece parece un error y no deja rastro de que alguien canceló.
 */
function estaDevuelta(session: Stripe.Checkout.Session): boolean {
  const pi = session.payment_intent
  if (!pi || typeof pi === 'string') return false
  const charge = pi.latest_charge
  if (!charge || typeof charge === 'string') return false
  return charge.refunded
}

/**
 * Las sesiones efectivamente cobradas de un link: una abandonada no es una
 * reserva. Memorizado por petición, porque un link puede alimentar a varias
 * fechas y el panel las pide todas a la vez.
 */
const sesionesPagadas = cache(async (stripeUrl: string): Promise<Stripe.Checkout.Session[]> => {
  const paymentLinkId = await idDelLink(stripeUrl)
  if (!paymentLinkId) return []
  const pagadas: Stripe.Checkout.Session[] = []
  for await (const session of stripe.checkout.sessions.list({
    payment_link: paymentLinkId,
    limit: 100,
    expand: ['data.payment_intent.latest_charge'],
  })) {
    if (session.payment_status === 'paid') pagadas.push(session)
  }
  return pagadas
})

/** Las sesiones pagadas que cuentan para `fecha`, cada una con la fecha de su link. */
async function sesionesDe(
  fecha: FechaLaJuntada
): Promise<{ session: Stripe.Checkout.Session; delLink: FechaLaJuntada }[]> {
  const todas = await Promise.all(
    fuentesDe(fecha).map(async (delLink) =>
      (await sesionesPagadas(delLink.stripeUrl!)).map((session) => ({ session, delLink }))
    )
  )
  return todas
    .flat()
    .filter(
      ({ session, delLink }) => destinoDe(session.id, delLink, estaDevuelta(session)) === fecha.iso
    )
}

/** Quita acentos y deja solo letras, para comparar etiquetas sin depender de cómo estén escritas. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

/**
 * Busca un campo del formulario por una palabra de su etiqueta.
 *
 * Stripe genera la clave a partir de la etiqueta y no la publica en ningún
 * sitio del que podamos leerla, así que buscar por clave exacta obliga a
 * adivinarla. Buscamos por etiqueta, y por clave como respaldo, para que
 * reescribir la pregunta no deje el panel en blanco.
 */
function campo(session: Stripe.Checkout.Session, palabra: string): string | null {
  const objetivo = normalizar(palabra)
  const field = session.custom_fields?.find((f) => {
    const etiqueta = normalizar(f.label?.custom ?? '')
    return etiqueta.includes(objetivo) || normalizar(f.key).includes(objetivo)
  })
  if (!field) return null
  return field.text?.value ?? field.numeric?.value ?? null
}

/**
 * Cuántas familias reservaron una fecha, contando las traspasadas. Devuelve
 * null si la fecha no tiene link todavía, o si Stripe no contesta: la página
 * distingue "ninguna reserva" de "no lo pudimos averiguar", y no debe inventar
 * un cero.
 */
export async function contarFamilias(fecha: FechaLaJuntada): Promise<number | null> {
  if (!fecha.stripeUrl) return null
  try {
    const sesiones = await sesionesDe(fecha)
    return sesiones.filter(({ session }) => !estaDevuelta(session)).length
  } catch (err) {
    console.error('[La Juntada] No se pudo contar las reservas:', err)
    return null
  }
}

/** Las reservas de una fecha, las que vinieron de otra incluidas, con sus datos, para el panel. */
export async function listarReservas(fecha: FechaLaJuntada): Promise<ReservaLaJuntada[]> {
  const sesiones = await sesionesDe(fecha)
  return sesiones
    .map(({ session, delLink }) =>
      aReserva(session, delLink.iso === fecha.iso ? null : delLink.fecha)
    )
    .sort((a, b) => a.creada.localeCompare(b.creada))
}

function aReserva(s: Stripe.Checkout.Session, traspasadaDe: string | null): ReservaLaJuntada {
  return {
    sessionId: s.id,
    creada: new Date(s.created * 1000).toISOString(),
    nombre: s.customer_details?.name ?? null,
    email: s.customer_details?.email ?? null,
    telefono: s.customer_details?.phone ?? null,
    chicos: campo(s, 'chicos'),
    edades: campo(s, 'edades'),
    origen: campo(s, 'parte'),
    importe: (s.amount_total ?? 0) / 100,
    estado: estaDevuelta(s) ? ('devuelta' as const) : ('pagada' as const),
    traspasadaDe,
  }
}
