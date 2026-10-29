/**
 * Las reservas de La Juntada, leídas de Stripe.
 *
 * No hay copia local ni hoja de cálculo a propósito. El dato nace en el
 * checkout de Stripe, que ya guarda nombre, email, teléfono y los campos que
 * pide el formulario, así que cualquier copia nuestra sería una segunda
 * verdad que puede desincronizarse.
 *
 * Una fecha y su payment link ya están emparejados en content/lajuntada/fechas.ts.
 * De ahí sale todo: buscamos el link por su URL y contamos lo que cobró. Una
 * fecha cancelada y traspasada suma su link al de la fecha que la reemplaza
 * (ver `linksDe`).
 */

import Stripe from 'stripe'
import { linksDe, type FechaLaJuntada } from '@/content/lajuntada/fechas'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/** Lo que cuesta una familia con un adulto, en céntimos. Ver `adultosDe`. */
const BASE_CENTIMOS = 3000

export interface ReservaLaJuntada {
  sessionId: string
  creada: string
  nombre: string | null
  email: string | null
  telefono: string | null
  /** 1, o 2 si sumó al otro progenitor. */
  adultos: number
  chicos: string | null
  edades: string | null
  origen: string | null
  /** En euros, lo que pagó de verdad. */
  importe: number
  /** Una devuelta ya no ocupa lugar, pero sigue siendo parte del historial. */
  estado: 'pagada' | 'devuelta'
  /** La fecha cancelada en la que se pagó, si vino traspasada. Null si es de esta fecha. */
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

/** Las sesiones efectivamente cobradas: una abandonada no es una reserva. */
async function sesionesPagadas(paymentLinkId: string): Promise<Stripe.Checkout.Session[]> {
  const pagadas: Stripe.Checkout.Session[] = []
  for await (const session of stripe.checkout.sessions.list({
    payment_link: paymentLinkId,
    limit: 100,
    expand: ['data.payment_intent.latest_charge'],
  })) {
    if (session.payment_status === 'paid') pagadas.push(session)
  }
  return pagadas
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
 * Cuántos adultos vienen, deducido del importe.
 *
 * El checkout no marca esto en ningún campo: la base es una familia con un
 * adulto y el add-on suma al otro, así que el total lo dice. Queda atado al
 * precio: si la base deja de ser 30, hay que cambiar BASE_CENTIMOS.
 */
function adultosDe(session: Stripe.Checkout.Session): number {
  return (session.amount_total ?? 0) > BASE_CENTIMOS ? 2 : 1
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
    let familias = 0
    for (const { stripeUrl } of linksDe(fecha)) {
      const id = await idDelLink(stripeUrl)
      if (!id) return null
      const sesiones = await sesionesPagadas(id)
      familias += sesiones.filter((s) => !estaDevuelta(s)).length
    }
    return familias
  } catch (err) {
    console.error('[La Juntada] No se pudo contar las reservas:', err)
    return null
  }
}

/** Las reservas de una fecha, traspasadas incluidas, con sus datos, para el panel. */
export async function listarReservas(fecha: FechaLaJuntada): Promise<ReservaLaJuntada[]> {
  const reservas: ReservaLaJuntada[] = []
  for (const { stripeUrl, traspasadaDe } of linksDe(fecha)) {
    const id = await idDelLink(stripeUrl)
    if (!id) continue
    const sesiones = await sesionesPagadas(id)
    reservas.push(...sesiones.map((s) => aReserva(s, traspasadaDe?.fecha ?? null)))
  }
  return reservas.sort((a, b) => a.creada.localeCompare(b.creada))
}

function aReserva(s: Stripe.Checkout.Session, traspasadaDe: string | null): ReservaLaJuntada {
  return {
    sessionId: s.id,
    creada: new Date(s.created * 1000).toISOString(),
    nombre: s.customer_details?.name ?? null,
    email: s.customer_details?.email ?? null,
    telefono: s.customer_details?.phone ?? null,
    adultos: adultosDe(s),
    chicos: campo(s, 'chicos'),
    edades: campo(s, 'edades'),
    origen: campo(s, 'parte'),
    importe: (s.amount_total ?? 0) / 100,
    estado: estaDevuelta(s) ? ('devuelta' as const) : ('pagada' as const),
    traspasadaDe,
  }
}
