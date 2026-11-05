export type EstadoFecha = 'confirmada' | 'prevista' | 'cancelada'

export interface FechaLaJuntada {
  /** Fecha legible, la que ve la familia. */
  fecha: string
  /** La misma fecha en ISO, para saber si ya pasó sin tener que editar nada a mano. */
  iso: string
  tema: string
  /** Efeméride argentina que cae en esa fecha o muy cerca. Null si no hay ninguna. */
  fechaArgentina: string | null
  estado: EstadoFecha
  stripeUrl: string | null
  /**
   * Solo en una fecha cancelada: el `iso` de la fecha a la que pasan sus
   * reservas. Una reserva de Stripe no se puede mover a otro payment link, así
   * que el traspaso se hace acá: toda reserva de esta fecha que no se haya
   * devuelto cuenta como reserva de aquella, en el panel y en el contador.
   * Quien prefirió la devolución se reembolsa en Stripe y deja de contar sola.
   */
  traspasadaA?: string
  /**
   * Quien da la actividad, si no la doy yo. El nombre y la descripción van
   * tal como lo pidieron: el crédito en la promoción es parte del acuerdo.
   */
  aCargoDe?: { nombre: string; descripcion: string; url: string }
  /**
   * El flyer de esa fecha, en public/static/images/lajuntada, en el formato
   * 4:5. Cuando la fecha cambia de estado (cancelada, pasada) se reemplaza por
   * el flyer que lo dice, con otro nombre de archivo para no servir el viejo
   * desde la caché. El alt dice lo mismo que el flyer.
   */
  flyer?: { src: string; alt: string }
}

export const fechasLaJuntada: FechaLaJuntada[] = [
  {
    fecha: 'Domingo 18 de octubre 2026',
    iso: '2026-10-18',
    tema: 'Canciones de la infancia',
    fechaArgentina: 'Día de la Madre',
    // Cancelada por alerta de lluvia. Las familias anotadas pasaron al 15 de noviembre.
    estado: 'cancelada',
    stripeUrl: 'https://buy.stripe.com/bJe00keki7vs6Hn7hs5gc01',
    traspasadaA: '2026-11-15',
    flyer: {
      src: '/static/images/lajuntada/flyer-2026-10-18.png',
      alt: 'Flyer de La Juntada del domingo 18 de octubre, cancelada por alerta de lluvia',
    },
  },
  {
    fecha: 'Domingo 15 de noviembre 2026',
    iso: '2026-11-15',
    tema: 'Chacarera para chicos y grandes',
    fechaArgentina: 'Cerca del Día de la Tradición (10 de noviembre)',
    estado: 'confirmada',
    aCargoDe: {
      nombre: 'ARGENFOLK',
      descripcion: 'la escuela Argentina de Tango y Folklore',
      url: 'https://www.instagram.com/argenfolk/',
    },
    flyer: {
      src: '/static/images/lajuntada/flyer-2026-11-15.png',
      alt: 'Flyer de La Juntada del domingo 15 de noviembre, de 15h a 17h en La Salle Gràcia: chacarera para chicos y grandes, clase a cargo de ARGENFOLK, la escuela Argentina de Tango y Folklore. Una familia, 30 euros; 35 si vienen los dos progenitores.',
    },
    // Limitado a 13 pagos: las 2 familias traspasadas del 18 de octubre completan los 15.
    stripeUrl: 'https://buy.stripe.com/dRmaEY5NM5nkghX7hs5gc02',
  },
  {
    fecha: 'Domingo 13 de diciembre 2026',
    iso: '2026-12-13',
    tema: 'Navidad a la argentina',
    fechaArgentina: null,
    estado: 'confirmada',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 17 de enero 2027',
    iso: '2027-01-17',
    tema: 'Fútbol en el patio',
    fechaArgentina: null,
    estado: 'prevista',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 14 de febrero 2027',
    iso: '2027-02-14',
    tema: 'Empanadas en familia',
    fechaArgentina: null,
    estado: 'prevista',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 14 de marzo 2027',
    iso: '2027-03-14',
    tema: 'Por confirmar',
    fechaArgentina: null,
    estado: 'prevista',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 18 de abril 2027',
    iso: '2027-04-18',
    tema: 'Juegos de patio argentinos',
    fechaArgentina: null,
    estado: 'prevista',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 23 de mayo 2027',
    iso: '2027-05-23',
    tema: 'Locro y pastelitos',
    fechaArgentina: 'Cerca del 25 de Mayo',
    estado: 'prevista',
    stripeUrl: null,
  },
  {
    fecha: 'Domingo 20 de junio 2027',
    iso: '2027-06-20',
    tema: 'Izamiento de la bandera, con abanderado por familia',
    fechaArgentina: 'Día de la Bandera y Día del Padre',
    estado: 'prevista',
    stripeUrl: null,
  },
]

/**
 * Los payment links cuyas reservas cuentan para una fecha: el suyo, más el de
 * cada fecha cancelada que se traspasó a ella. Una fecha traspasada no tiene
 * reservas propias: ya son de la otra.
 */
export function linksDe(
  fecha: FechaLaJuntada
): { stripeUrl: string; traspasadaDe: FechaLaJuntada | null }[] {
  if (fecha.traspasadaA) return []
  const links: { stripeUrl: string; traspasadaDe: FechaLaJuntada | null }[] = []
  for (const f of fechasLaJuntada) {
    if (f.traspasadaA === fecha.iso && f.stripeUrl)
      links.push({ stripeUrl: f.stripeUrl, traspasadaDe: f })
  }
  if (fecha.stripeUrl) links.push({ stripeUrl: fecha.stripeUrl, traspasadaDe: null })
  return links
}
