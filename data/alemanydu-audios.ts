/**
 * Audios de Alemán·y·Du, Primaria, curso 2026/2027.
 *
 * One audio per class, and that is the whole model. There is no cumulative
 * track and no separate songs track: when a class has a song, the song is
 * inside that class's own audio.
 *
 * Import this module from server components only. Anything handed to a client
 * component (the play all button) must be a narrowed object built here, never
 * a whole track, so that future internal fields cannot leak into the page
 * payload by accident.
 */

export type AudioTrack = {
  /** Class number, 1 to 32 */
  clase: number
  /** Monday the class took place, ISO date */
  fecha: string
  /** Short public title, shown to families. Spanish. */
  titulo: string
  /** One line of what this class covers. Spanish. */
  resumen: string
  /** Basename of the audio. Derived from the class number, so it is prefilled. */
  archivo: string
  /** Duration in seconds. 0 when not recorded. */
  duracion: number
  /** Controls playable vs pending state. */
  disponible: boolean
}

export type FraseTrack = {
  archivo: string
  /** Duration in seconds. 0 when not recorded. */
  duracion: number
  disponible: boolean
}

/**
 * Link the native player points at.
 *
 * The bucket is private and there is no public domain. Everything is served
 * from our own origin, which is why `media-src 'self'` is enough and there is
 * no CSP entry that can drift out of sync and kill playback in production.
 */
export const audioUrl = (basename: string) =>
  `/api/alemanydu/audio?file=${encodeURIComponent(basename)}`

/** Link the download button points at. Same bytes, saved instead of streamed. */
export const downloadUrl = (basename: string) =>
  `/api/alemanydu/download?file=${encodeURIComponent(basename)}`

/**
 * The 32 classes of the course, in order.
 *
 * `archivo` is already filled for every class, because the name follows from
 * the class number and the level. Publishing a week is therefore: upload `ayd_pre_a1_cNN.mp3`, then
 * fill `duracion`, write `titulo` and `resumen`, and flip `disponible` to true.
 */
export const clases: AudioTrack[] = [
  {
    clase: 1,
    fecha: '2026-09-14',
    titulo: 'Clase 1',
    resumen:
      'Saludos, el sonido de la hache, el tiempo que hace, las partes del cuerpo y las órdenes de movimiento.',
    archivo: 'ayd_pre_a1_c01.mp3',
    duracion: 279,
    disponible: true,
  },
  {
    clase: 2,
    fecha: '2026-09-21',
    titulo: 'Clase 2',
    resumen: 'Un sonido nuevo, la mano, y las órdenes en grupo.',
    archivo: 'ayd_pre_a1_c02.mp3',
    duracion: 191,
    disponible: true,
  },
  {
    clase: 3,
    fecha: '2026-09-28',
    titulo: 'Clase 3',
    resumen: '',
    archivo: 'ayd_pre_a1_c03.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 4,
    fecha: '2026-10-05',
    titulo: 'Clase 4',
    resumen: '',
    archivo: 'ayd_pre_a1_c04.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 5,
    fecha: '2026-10-19',
    titulo: 'Clase 5',
    resumen: '',
    archivo: 'ayd_pre_a1_c05.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 6,
    fecha: '2026-10-26',
    titulo: 'Clase 6',
    resumen: '',
    archivo: 'ayd_pre_a1_c06.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 7,
    fecha: '2026-11-02',
    titulo: 'Clase 7',
    resumen: '',
    archivo: 'ayd_pre_a1_c07.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 8,
    fecha: '2026-11-09',
    titulo: 'Clase 8',
    resumen: '',
    archivo: 'ayd_pre_a1_c08.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 9,
    fecha: '2026-11-16',
    titulo: 'Clase 9',
    resumen: '',
    archivo: 'ayd_pre_a1_c09.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 10,
    fecha: '2026-11-23',
    titulo: 'Clase 10',
    resumen: '',
    archivo: 'ayd_pre_a1_c10.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 11,
    fecha: '2026-11-30',
    titulo: 'Clase 11',
    resumen: '',
    archivo: 'ayd_pre_a1_c11.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 12,
    fecha: '2026-12-14',
    titulo: 'Clase 12',
    resumen: '',
    archivo: 'ayd_pre_a1_c12.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 13,
    fecha: '2026-12-21',
    titulo: 'Clase 13',
    resumen: '',
    archivo: 'ayd_pre_a1_c13.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 14,
    fecha: '2027-01-11',
    titulo: 'Clase 14',
    resumen: '',
    archivo: 'ayd_pre_a1_c14.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 15,
    fecha: '2027-01-18',
    titulo: 'Clase 15',
    resumen: '',
    archivo: 'ayd_pre_a1_c15.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 16,
    fecha: '2027-01-25',
    titulo: 'Clase 16',
    resumen: '',
    archivo: 'ayd_pre_a1_c16.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 17,
    fecha: '2027-02-01',
    titulo: 'Clase 17',
    resumen: '',
    archivo: 'ayd_pre_a1_c17.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 18,
    fecha: '2027-02-15',
    titulo: 'Clase 18',
    resumen: '',
    archivo: 'ayd_pre_a1_c18.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 19,
    fecha: '2027-02-22',
    titulo: 'Clase 19',
    resumen: '',
    archivo: 'ayd_pre_a1_c19.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 20,
    fecha: '2027-03-01',
    titulo: 'Clase 20',
    resumen: '',
    archivo: 'ayd_pre_a1_c20.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 21,
    fecha: '2027-03-08',
    titulo: 'Clase 21',
    resumen: '',
    archivo: 'ayd_pre_a1_c21.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 22,
    fecha: '2027-03-15',
    titulo: 'Clase 22',
    resumen: '',
    archivo: 'ayd_pre_a1_c22.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 23,
    fecha: '2027-04-05',
    titulo: 'Clase 23',
    resumen: '',
    archivo: 'ayd_pre_a1_c23.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 24,
    fecha: '2027-04-12',
    titulo: 'Clase 24',
    resumen: '',
    archivo: 'ayd_pre_a1_c24.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 25,
    fecha: '2027-04-19',
    titulo: 'Clase 25',
    resumen: '',
    archivo: 'ayd_pre_a1_c25.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 26,
    fecha: '2027-04-26',
    titulo: 'Clase 26',
    resumen: '',
    archivo: 'ayd_pre_a1_c26.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 27,
    fecha: '2027-05-03',
    titulo: 'Clase 27',
    resumen: '',
    archivo: 'ayd_pre_a1_c27.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 28,
    fecha: '2027-05-10',
    titulo: 'Clase 28',
    resumen: '',
    archivo: 'ayd_pre_a1_c28.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 29,
    fecha: '2027-05-24',
    titulo: 'Clase 29',
    resumen: '',
    archivo: 'ayd_pre_a1_c29.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 30,
    fecha: '2027-05-31',
    titulo: 'Clase 30',
    resumen: '',
    archivo: 'ayd_pre_a1_c30.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 31,
    fecha: '2027-06-07',
    titulo: 'Clase 31',
    resumen: '',
    archivo: 'ayd_pre_a1_c31.mp3',
    duracion: 0,
    disponible: false,
  },
  {
    clase: 32,
    fecha: '2027-06-14',
    titulo: 'Clase 32',
    resumen: '',
    archivo: 'ayd_pre_a1_c32.mp3',
    duracion: 0,
    disponible: false,
  },
]

/**
 * The phrase parents play on the familias page.
 *
 * It is audio and not text on purpose: a Spanish reading parent looking at
 * `Wo ist der Kopf?` will say it with Spanish vowels, which is the exact thing
 * the course is trying to avoid. The child hears it in Tash's voice instead.
 */
export const frasePrueba: FraseTrack = {
  archivo: 'ayd_frase_prueba.mp3',
  duracion: 12,
  disponible: true,
}
