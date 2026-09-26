export type EstadoFecha = 'confirmada' | 'prevista'

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
}

export const fechasLaJuntada: FechaLaJuntada[] = [
  {
    fecha: 'Domingo 18 de octubre 2026',
    iso: '2026-10-18',
    tema: 'Canciones de la infancia',
    fechaArgentina: 'Día de la Madre',
    estado: 'confirmada',
    stripeUrl: 'https://buy.stripe.com/7sY7sM6RQbLI5DjbxI5gc00',
  },
  {
    fecha: 'Domingo 15 de noviembre 2026',
    iso: '2026-11-15',
    tema: 'Chacarera para chicos y grandes',
    fechaArgentina: 'Cerca del Día de la Tradición (10 de noviembre)',
    estado: 'confirmada',
    stripeUrl: null,
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
