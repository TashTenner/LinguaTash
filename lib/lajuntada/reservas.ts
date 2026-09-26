/**
 * Las reservas de La Juntada, leídas de Stripe.
 *
 * No hay copia local ni hoja de cálculo a propósito. El dato nace en el
 * checkout de Stripe, que ya guarda nombre, email, teléfono y los campos que
 * pide el formulario, así que cualquier copia nuestra sería una segunda
 * verdad que puede desincronizarse.
 *
 * Una fecha y su payment link ya están emparejados en content/lajuntada/fechas.ts.
 * De ahí sale todo: buscamos el link por su URL y contamos lo que cobró.
 */

import Stripe from 'stripe'

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

/** Solo las sesiones efectivamente pagadas: una abandonada no es una reserva. */
async function sesionesPagadas(paymentLinkId: string): Promise<Stripe.Checkout.Session[]> {
  const pagadas: Stripe.Checkout.Session[] = []
  for await (const session of stripe.checkout.sessions.list({
    payment_link: paymentLinkId,
    limit: 100,
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
 * Cuántas familias reservaron una fecha. Devuelve null si la fecha no tiene
 * link todavía, o si Stripe no contesta: la página distingue "ninguna reserva"
 * de "no lo pudimos averiguar", y no debe inventar un cero.
 */
export async function contarFamilias(stripeUrl: string | null): Promise<number | null> {
  if (!stripeUrl) return null
  try {
    const id = await idDelLink(stripeUrl)
    if (!id) return null
    return (await sesionesPagadas(id)).length
  } catch (err) {
    console.error('[La Juntada] No se pudo contar las reservas:', err)
    return null
  }
}

/** Las reservas de una fecha, con sus datos, para el panel. */
export async function listarReservas(stripeUrl: string): Promise<ReservaLaJuntada[]> {
  const id = await idDelLink(stripeUrl)
  if (!id) return []

  const sesiones = await sesionesPagadas(id)

  return sesiones
    .map((s) => ({
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
    }))
    .sort((a, b) => a.creada.localeCompare(b.creada))
}
