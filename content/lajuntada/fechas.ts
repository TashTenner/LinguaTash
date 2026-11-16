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
  /** Solo en una fecha cancelada: por qué, para el panel. "alerta de lluvia". */
  motivoCancelacion?: string
  /**
   * Quien da la actividad, si no la doy yo. Se muestra en el hero y en la fila
   * del calendario, y se quita si el acuerdo deja de estar en pie, aunque la
   * fecha ya haya pasado.
   */
  aCargoDe?: { nombre: string; descripcion: string; url: string }
  /**
   * El flyer de esa fecha, en public/static/images/lajuntada, en el formato
   * 4:5. Cuando la fecha cambia de estado (cancelada, pasada) se reemplaza por
   * el flyer que lo dice, con otro nombre de archivo para no servir el viejo
   * desde la caché. El alt dice lo mismo que el flyer.
   *
   * Cuando la fecha pasa, la página lo muestra desvaído y con una banda
   * "Pasada" encima, sola, sin que haga falta otro flyer. `final` es para el
   * flyer que ya dice cómo terminó la fecha (uno cancelado, o un pasado hecho
   * a mano porque había que tapar algo), que no lleva la banda otra vez.
   */
  flyer?: { src: string; alt: string; final?: boolean }
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
    motivoCancelacion: 'alerta de lluvia',
    flyer: {
      src: '/static/images/lajuntada/flyer-2026-10-18.png',
      final: true,
      alt: 'Flyer de La Juntada del domingo 18 de octubre, cancelada por alerta de lluvia',
    },
  },
  {
    fecha: 'Domingo 15 de noviembre 2026',
    iso: '2026-11-15',
    tema: 'Chacarera para chicos y grandes',
    fechaArgentina: 'Cerca del Día de la Tradición (10 de noviembre)',
    estado: 'confirmada',
    // Limitado a 13 pagos: las 2 familias traspasadas del 18 de octubre completan los 15.
    stripeUrl: 'https://buy.stripe.com/dRmaEY5NM5nkghX7hs5gc02',
    flyer: {
      src: '/static/images/lajuntada/flyer-2026-11-15-pasada.png',
      final: true,
      alt: 'Flyer de La Juntada del domingo 15 de noviembre, chacarera para chicos y grandes: pasada. Gracias a las familias que vinieron.',
    },
  },
  {
    fecha: 'Domingo 13 de diciembre 2026',
    iso: '2026-12-13',
    tema: 'Navidad a la argentina',
    fechaArgentina: null,
    estado: 'confirmada',
    // Limitado a 14 pagos: Ana, movida desde octubre, ocupa el lugar 15.
    stripeUrl: 'https://buy.stripe.com/dRm00k6RQ7vs7LratE5gc03',
    flyer: {
      src: '/static/images/lajuntada/flyer-2026-12-13-v3.png',
      alt: 'Flyer de La Juntada del domingo 13 de diciembre, de 15h a 17h en La Salle Gràcia: Navidad a la argentina. Para familias argentinas con hijos en Barcelona, chicos de 3 a 8 años y sus hermanos. Una familia, 30 euros, vengan uno o los dos progenitores. Reservá tu lugar en linguatash.com/lajuntada, con un código QR que lleva ahí. Seguime en Instagram, @lajuntada.bcn.',
    },
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
 * Una reserva que se pasa a otra fecha sola, sin el resto de su fecha. La
 * familia pagó en el link de `desde` y se presenta el día `a`. Como con
 * `traspasadaA`, el pago no se toca: lo que cambia es para qué fecha cuenta.
 */
export interface ReservaMovida {
  /** El id de la Checkout Session en Stripe (cs_live_…). */
  sessionId: string
  /** El `iso` de la fecha en cuyo link pagó. */
  desde: string
  /** El `iso` de la fecha para la que cuenta ahora. */
  a: string
}

export const reservasMovidas: ReservaMovida[] = [
  // Pagó para el 18 de octubre, pasó con el resto al 15 de noviembre y pidió
  // posponer otra vez, al 13 de diciembre.
  {
    sessionId: 'cs_live_a11Y7eppf7IwPLWBh6ieFFcjl0YtdULNLR6CyfaQS1OZDyi8B5aEXf4P3O',
    desde: '2026-10-18',
    a: '2026-12-13',
  },
]

/**
 * La fecha para la que cuenta una reserva pagada en el link de `fechaDelLink`.
 *
 * Lo devuelto de una fecha cancelada se queda en ella: es quien prefirió la
 * plata a otra fecha, y su fila es el rastro de la cancelación en el panel.
 */
export function destinoDe(
  sessionId: string,
  fechaDelLink: FechaLaJuntada,
  devuelta: boolean
): string {
  if (devuelta && fechaDelLink.estado === 'cancelada') return fechaDelLink.iso
  const movida = reservasMovidas.find((m) => m.sessionId === sessionId)
  return movida?.a ?? fechaDelLink.traspasadaA ?? fechaDelLink.iso
}

/**
 * Las fechas cuyos payment links pueden tener reservas para `fecha`: la suya,
 * cada fecha cancelada que se traspasó a ella y cada fecha de la que se movió
 * una reserva suelta hacia ella. Quien lea esos links filtra con `destinoDe`,
 * porque no todo lo cobrado en ellos es de esta fecha.
 */
export function fuentesDe(fecha: FechaLaJuntada): FechaLaJuntada[] {
  // Una cancelada solo lee su propio link, y de él solo le queda lo devuelto.
  if (fecha.traspasadaA) return fecha.stripeUrl ? [fecha] : []
  return fechasLaJuntada.filter(
    (f) =>
      !!f.stripeUrl &&
      (f.iso === fecha.iso ||
        f.traspasadaA === fecha.iso ||
        reservasMovidas.some((m) => m.desde === f.iso && m.a === fecha.iso))
  )
}

/** "domingo 13 de diciembre", de "Domingo 13 de diciembre 2026". */
export function diaDe(f: FechaLaJuntada): string {
  return f.fecha.replace(/^Domingo/, 'domingo').replace(/ [0-9]{4}$/, '')
}
