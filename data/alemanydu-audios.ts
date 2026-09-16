/**
 * Audios de Alemán·y·Du, Primaria, curso 2026/2027.
 *
 * INTERNAL FIELD WARNING
 * `skript` is for Tash only. It must never be rendered, never returned by an
 * API route, and never imported into a client component (Next would serialise
 * it into the page payload). See section 8 of the build spec.
 *
 * Practical rule: import this module from server components only, and pass
 * narrowed props down to the cards instead of the whole track object.
 */

export type AudioTrack = {
  /** Class number, 1 to 32 */
  clase: number
  /** Monday the class took place, ISO date */
  fecha: string
  /** Short public title, shown to families. Spanish. */
  titulo: string
  /** One line of what this track covers. Spanish. */
  resumen: string
  /** Basename of the weekly track. Empty when not recorded. */
  neu: string
  /** Duration of the weekly track in seconds. 0 when not recorded. */
  neuDuracion: number
  /** Basename of the cumulative snapshot. Empty when not recorded. */
  alles: string
  /** Duration of the cumulative snapshot in seconds. 0 when not recorded. */
  allesDuracion: number
  /** Controls playable vs pending state. */
  disponible: boolean
  /** INTERNAL ONLY. Never rendered. */
  skript?: string
}

export type LiederTrack = {
  /** Versioned basename, e.g. ayd_2627_lieder_v03.mp3 */
  archivo: string
  /** Duration in seconds. 0 when not recorded. */
  duracion: number
  /** ISO date of the last update, shown to parents. */
  actualizado: string
  /** One line of what this track is. Spanish. */
  resumen: string
  /** Public list of song titles currently on the track, in order. */
  canciones: string[]
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
 * Publishing workflow, once the ffmpeg script has produced the files:
 *   1. Upload ayd_2627_cNN_neu.mp3 and ayd_2627_cNN_alles.mp3 to the bucket.
 *   2. Fill both basenames and both durations in that entry, write `titulo`
 *      and `resumen`, and flip `disponible` to true.
 *   3. Commit and push. No other code changes, ever.
 */
export const clases: AudioTrack[] = [
  {
    clase: 1,
    fecha: '2026-09-14',
    titulo: 'Clase 1. Hallo',
    resumen: 'Saludos, el sonido de la hache, las partes del cuerpo y la canción.',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 2,
    fecha: '2026-09-21',
    titulo: 'Clase 2',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 3,
    fecha: '2026-09-28',
    titulo: 'Clase 3',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 4,
    fecha: '2026-10-05',
    titulo: 'Clase 4',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 5,
    fecha: '2026-10-19',
    titulo: 'Clase 5',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 6,
    fecha: '2026-10-26',
    titulo: 'Clase 6',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 7,
    fecha: '2026-11-02',
    titulo: 'Clase 7',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 8,
    fecha: '2026-11-09',
    titulo: 'Clase 8',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 9,
    fecha: '2026-11-16',
    titulo: 'Clase 9',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 10,
    fecha: '2026-11-23',
    titulo: 'Clase 10',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 11,
    fecha: '2026-11-30',
    titulo: 'Clase 11',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 12,
    fecha: '2026-12-14',
    titulo: 'Clase 12',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 13,
    fecha: '2026-12-21',
    titulo: 'Clase 13',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 14,
    fecha: '2027-01-11',
    titulo: 'Clase 14',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 15,
    fecha: '2027-01-18',
    titulo: 'Clase 15',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 16,
    fecha: '2027-01-25',
    titulo: 'Clase 16',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 17,
    fecha: '2027-02-01',
    titulo: 'Clase 17',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 18,
    fecha: '2027-02-15',
    titulo: 'Clase 18',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 19,
    fecha: '2027-02-22',
    titulo: 'Clase 19',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 20,
    fecha: '2027-03-01',
    titulo: 'Clase 20',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 21,
    fecha: '2027-03-08',
    titulo: 'Clase 21',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 22,
    fecha: '2027-03-15',
    titulo: 'Clase 22',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 23,
    fecha: '2027-04-05',
    titulo: 'Clase 23',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 24,
    fecha: '2027-04-12',
    titulo: 'Clase 24',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 25,
    fecha: '2027-04-19',
    titulo: 'Clase 25',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 26,
    fecha: '2027-04-26',
    titulo: 'Clase 26',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 27,
    fecha: '2027-05-03',
    titulo: 'Clase 27',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 28,
    fecha: '2027-05-10',
    titulo: 'Clase 28',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 29,
    fecha: '2027-05-24',
    titulo: 'Clase 29',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 30,
    fecha: '2027-05-31',
    titulo: 'Clase 30',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 31,
    fecha: '2027-06-07',
    titulo: 'Clase 31',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
  {
    clase: 32,
    fecha: '2027-06-14',
    titulo: 'Clase 32',
    resumen: '',
    neu: '',
    neuDuracion: 0,
    alles: '',
    allesDuracion: 0,
    disponible: false,
  },
]

/**
 * The songs track. Not tied to a class number: it changes when the repertoire
 * changes, roughly once a month.
 *
 * Songs never enter the cumulative `alles` track. They live in `neu` and here.
 *
 * Always bump the version in the filename when you replace it. Overwriting the
 * same key behind a CDN with a one year cache header serves the stale file to
 * some parents and the new one to others.
 */
export const lieder: LiederTrack = {
  archivo: '',
  duracion: 0,
  actualizado: '',
  resumen: 'Todas las canciones del curso, en orden. Crece a medida que aprendemos una nueva.',
  canciones: [],
  disponible: false,
}

export type FraseTrack = {
  /** Versioned basename, e.g. ayd_2627_frase_v01.mp3 */
  archivo: string
  /** Duration in seconds. 0 when not recorded. */
  duracion: number
  disponible: boolean
}

/**
 * The phrase parents are invited to try at home, on the familias page.
 *
 * It is audio and not text on purpose: a Spanish reading parent looking at
 * `Wo ist der Kopf?` will say it with Spanish vowels, which is the exact thing
 * the course is trying to avoid. They hear it first, then repeat it.
 *
 * Versioned like the songs track, because it gets replaced rather than added.
 */
export const frasePrueba: FraseTrack = {
  archivo: '',
  duracion: 0,
  disponible: false,
}
