import type { Grupo } from '@/data/alemanydu-grupos'
import { nombreMes } from './format'

/**
 * Las fases del año, definidas por número de clase y no por mes.
 *
 * El mes se calcula para cada grupo a partir de sus propias fechas. Escrito a
 * mano salía del calendario del lunes, y un grupo que empieza en octubre leía
 * «Septiembre y octubre» en una fase que para ellos no tiene septiembre.
 *
 * `hasta: null` significa hasta el final del curso, que es lo que hace que un
 * grupo con 33 clases meta la de más en el último bloque sin tocar nada.
 *
 * Sin nombre alemán: viven en la página de audios, que no lleva texto en
 * alemán. La única excepción es Sankt Martin, por decisión de Tash: la fiesta
 * tiene ese nombre.
 */
export const fases = [
  {
    titulo: 'Abrir el oído',
    desde: 1,
    hasta: 6,
    descripcion:
      'Escuchar. Saludos, el cuerpo, los colores y las órdenes de movimiento. Se habla desde el primer día y todo lo que salga vale.',
  },
  {
    titulo: 'Primeras palabras',
    desde: 7,
    hasta: 13,
    descripcion: 'Primeras palabras sueltas. Números, la familia, el aula. Sankt Martin y Navidad.',
  },
  {
    titulo: 'Yo y tú',
    desde: 14,
    hasta: 22,
    descripcion:
      'Hablar de uno mismo y del otro. Animales, comida, ropa. Primeras preguntas y respuestas.',
  },
  {
    titulo: 'Señalar y hablar',
    desde: 23,
    hasta: null,
    descripcion:
      'Describir el mundo. El tiempo, la casa, la naturaleza. Conversaciones un poco más largas.',
  },
] as const

export type Fase = (typeof fases)[number]

/** «Octubre y noviembre», «Enero a marzo», según los meses que toque la fase. */
export function periodoDeFase(grupo: Grupo, fase: Fase): string {
  const tramo = grupo.fechas.slice(fase.desde - 1, fase.hasta ?? undefined)
  if (tramo.length === 0) return ''
  const meses = [...new Set(tramo.map(nombreMes))]
  const mayus = (m: string) => m.charAt(0).toUpperCase() + m.slice(1)
  if (meses.length === 1) return mayus(meses[0])
  if (meses.length === 2) return `${mayus(meses[0])} y ${meses[1]}`
  return `${mayus(meses[0])} a ${meses[meses.length - 1]}`
}

/**
 * La fase de la última clase que el grupo ya tuvo. Antes de la primera clase,
 * la primera fase: es la que empieza.
 */
export function faseActual(dadas: number): Fase {
  const n = Math.max(dadas, 1)
  return fases.find((f) => n >= f.desde && (f.hasta === null || n <= f.hasta)) ?? fases[0]
}
