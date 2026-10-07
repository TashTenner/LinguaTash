/**
 * Los grupos de Alemán·y·Du.
 *
 * El audio pertenece al número de clase; la fecha pertenece al grupo. Dos
 * grupos distintos escuchan la misma grabación de la clase 1, pero la dieron
 * en días diferentes, así que `fecha` vive acá y no en `alemanydu-audios.ts`.
 *
 * De esto sale todo lo que distingue una página de otra: el calendario, el
 * horario, y sobre todo **qué clases ve cada grupo**. Un grupo solo ve las
 * clases cuya fecha ya pasó, así que una familia del miércoles no se encuentra
 * con una pista de cuatro semanas más adelante.
 */

export type Grupo = {
  /** Segmento de URL. Vacío para el grupo del lunes, que vive en /alemanydu. */
  slug: string
  /** Cómo se llama el grupo en la página. */
  nombre: string
  /** «los miércoles de 14:00 a 15:00». Entra en la frase del calendario. */
  horario: string
  /** «miércoles». Entra en «lo que hicimos ese miércoles». */
  diaSemana: string
  /** «Curso 2026/2027». */
  curso: string
  /** Una fecha por número de clase, en orden. La primera es la clase 1. */
  fechas: string[]
  /** Días del curso sin clase, para el calendario. */
  sinClase: { fecha: string; motivo: string }[]
  /** Fila extra al final del calendario, si hace falta aclarar algo. */
  ultimoDia?: { fecha: string; etiqueta: string }
  /** Párrafo de cierre del calendario. */
  cierreCalendario: string
}

export const grupoLunes: Grupo = {
  slug: '',
  nombre: 'Primaria, lunes',
  horario: 'los lunes de 14:00 a 15:00',
  diaSemana: 'lunes',
  curso: 'Curso 2026/2027',
  fechas: [
    '2026-09-14',
    '2026-09-21',
    '2026-09-28',
    '2026-10-05',
    '2026-10-19',
    '2026-10-26',
    '2026-11-02',
    '2026-11-09',
    '2026-11-16',
    '2026-11-23',
    '2026-11-30',
    '2026-12-14',
    '2026-12-21',
    '2027-01-11',
    '2027-01-18',
    '2027-01-25',
    '2027-02-01',
    '2027-02-15',
    '2027-02-22',
    '2027-03-01',
    '2027-03-08',
    '2027-03-15',
    '2027-04-05',
    '2027-04-12',
    '2027-04-19',
    '2027-04-26',
    '2027-05-03',
    '2027-05-10',
    '2027-05-24',
    '2027-05-31',
    '2027-06-07',
    '2027-06-14',
  ],
  sinClase: [
    { fecha: '2026-10-12', motivo: 'Fiesta Nacional' },
    { fecha: '2026-12-07', motivo: 'Día de libre disposición' },
    { fecha: '2026-12-28', motivo: 'Vacaciones de Navidad' },
    { fecha: '2027-01-04', motivo: 'Vacaciones de Navidad' },
    { fecha: '2027-02-08', motivo: 'Día de libre disposición' },
    { fecha: '2027-03-22', motivo: 'Semana Santa' },
    { fecha: '2027-03-29', motivo: 'Semana Santa' },
    { fecha: '2027-05-17', motivo: 'Festivo local de Barcelona' },
  ],
  ultimoDia: { fecha: '2027-06-21', etiqueta: 'Último día de colegio' },
  cierreCalendario:
    'La última clase prevista es el lunes 14 de junio de 2027. El curso escolar termina el 21 de junio, que también cae en lunes. Todavía no sé si ese día habrá clase: otros años el colegio cerró a las 13:00 el último día, así que lo más probable es que no. En cuanto lo confirmen, mandaré un aviso.',
}

export const grupoMiercoles: Grupo = {
  slug: 'miercoles',
  nombre: 'Primaria, miércoles',
  horario: 'los miércoles de 14:00 a 15:00',
  diaSemana: 'miércoles',
  curso: 'Curso 2026/2027',
  fechas: [
    '2026-10-07',
    '2026-10-14',
    '2026-10-21',
    '2026-10-28',
    '2026-11-04',
    '2026-11-11',
    '2026-11-18',
    '2026-11-25',
    '2026-12-02',
    '2026-12-09',
    '2026-12-16',
    '2027-01-13',
    '2027-01-20',
    '2027-01-27',
    '2027-02-03',
    '2027-02-10',
    '2027-02-17',
    '2027-02-24',
    '2027-03-03',
    '2027-03-10',
    '2027-03-17',
    '2027-03-31',
    '2027-04-07',
    '2027-04-14',
    '2027-04-21',
    '2027-04-28',
    '2027-05-05',
    '2027-05-12',
    '2027-05-19',
    '2027-05-26',
    '2027-06-02',
    '2027-06-09',
    '2027-06-16',
  ],
  sinClase: [
    { fecha: '2026-12-23', motivo: 'Vacaciones de Navidad' },
    { fecha: '2026-12-30', motivo: 'Vacaciones de Navidad' },
    { fecha: '2027-01-06', motivo: 'Reyes' },
    { fecha: '2027-03-24', motivo: 'Semana Santa' },
  ],
  cierreCalendario: 'La última clase del curso es el miércoles 16 de junio de 2027.',
}

/**
 * Hoy en Madrid, como `YYYY-MM-DD`.
 *
 * Importa la zona: una clase de las 14:00 tiene que aparecer ese mismo día, y
 * comparar contra UTC la adelantaría o la atrasaría según la hora.
 */
export const hoyEnMadrid = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })

/**
 * Cuántas clases ha tenido ya este grupo.
 *
 * Se deriva de las fechas, no de un contador que alguien tenga que subir cada
 * semana. Un contador se olvida, y se olvida justo en la dirección mala: de
 * más, mostrando una clase que el grupo todavía no dio.
 */
export const clasesDadas = (grupo: Grupo, hoy = hoyEnMadrid()) =>
  grupo.fechas.filter((f) => f <= hoy).length
