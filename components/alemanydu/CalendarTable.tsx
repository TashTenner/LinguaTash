import { clases } from '@/data/alemanydu-audios'
import { diaDelMes, formatMesAno } from './format'

type DiaDelCurso = {
  /** ISO date of the Monday. */
  fecha: string
  /** What happens that Monday. */
  etiqueta: string
  /** Mondays without class are shown quieter. */
  hayClase: boolean
}

/**
 * The Mondays with no class. Every other Monday of the course has one, so this
 * list plus the class dates covers the whole year with nothing left over.
 */
const sinClase: { fecha: string; motivo: string }[] = [
  { fecha: '2026-10-12', motivo: 'Fiesta Nacional' },
  { fecha: '2026-12-07', motivo: 'Día de libre disposición' },
  { fecha: '2026-12-28', motivo: 'Vacaciones de Navidad' },
  { fecha: '2027-01-04', motivo: 'Vacaciones de Navidad' },
  { fecha: '2027-02-08', motivo: 'Día de libre disposición' },
  { fecha: '2027-03-22', motivo: 'Semana Santa' },
  { fecha: '2027-03-29', motivo: 'Semana Santa' },
  { fecha: '2027-05-17', motivo: 'Festivo local de Barcelona' },
]

/** The last day of school. Whether there is a class that day is still open. */
const ultimoDia: DiaDelCurso = {
  fecha: '2027-06-21',
  etiqueta: 'Último día de colegio. Sin confirmar',
  hayClase: false,
}

function construirCalendario(): DiaDelCurso[] {
  const dias: DiaDelCurso[] = [
    ...clases.map((c) => ({
      fecha: c.fecha,
      etiqueta: `Clase ${c.clase}`,
      hayClase: true,
    })),
    ...sinClase.map((d) => ({
      fecha: d.fecha,
      etiqueta: `Sin clase. ${d.motivo}`,
      hayClase: false,
    })),
    ultimoDia,
  ]

  return dias.sort((a, b) => a.fecha.localeCompare(b.fecha))
}

function agruparPorMes(dias: DiaDelCurso[]) {
  const meses: { mes: string; dias: DiaDelCurso[] }[] = []

  for (const dia of dias) {
    const mes = formatMesAno(dia.fecha)
    const ultimo = meses[meses.length - 1]
    if (ultimo && ultimo.mes === mes) {
      ultimo.dias.push(dia)
    } else {
      meses.push({ mes, dias: [dia] })
    }
  }

  return meses
}

/**
 * The whole course, Monday by Monday. Grouped by month rather than laid out as
 * a wide table so that it reads on a phone without scrolling sideways, which is
 * where most parents will open it.
 */
export default function CalendarTable() {
  const meses = agruparPorMes(construirCalendario())

  return (
    <div className="space-y-8">
      {meses.map((mes) => (
        <div key={mes.mes}>
          <h3 className="text-sm font-semibold tracking-wide text-[#B3475A] uppercase">
            {mes.mes}
          </h3>

          <dl className="mt-3 divide-y divide-[#9A8F85]/30 border-t border-[#9A8F85]/30">
            {mes.dias.map((dia) => (
              <div key={dia.fecha} className="flex gap-4 py-2.5">
                <dt
                  className={`w-8 shrink-0 text-right tabular-nums ${
                    dia.hayClase ? 'font-semibold' : 'text-[#9A8F85] dark:text-[#F4EFE8]/60'
                  }`}
                >
                  {diaDelMes(dia.fecha)}
                </dt>
                <dd
                  className={dia.hayClase ? 'opacity-90' : 'text-[#9A8F85] dark:text-[#F4EFE8]/60'}
                >
                  {dia.etiqueta}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
