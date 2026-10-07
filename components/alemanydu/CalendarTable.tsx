import type { Grupo } from '@/data/alemanydu-grupos'
import { diaDelMes, formatMesAno } from './format'

type DiaDelCurso = {
  fecha: string
  etiqueta: string
  /** Los días sin clase se muestran más apagados. */
  hayClase: boolean
}

function construirCalendario(grupo: Grupo): DiaDelCurso[] {
  const dias: DiaDelCurso[] = [
    ...grupo.fechas.map((fecha, i) => ({
      fecha,
      etiqueta: `Clase ${i + 1}`,
      hayClase: true,
    })),
    ...grupo.sinClase.map((d) => ({
      fecha: d.fecha,
      etiqueta: `Sin clase. ${d.motivo}`,
      hayClase: false,
    })),
    ...(grupo.ultimoDia
      ? [{ fecha: grupo.ultimoDia.fecha, etiqueta: grupo.ultimoDia.etiqueta, hayClase: false }]
      : []),
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
 * El curso entero del grupo, semana a semana.
 *
 * Agrupado por mes en vez de puesto como tabla ancha, para que se lea en un
 * móvil sin desplazarse de lado, que es donde lo va a abrir la mayoría.
 */
export default function CalendarTable({ grupo }: { grupo: Grupo }) {
  const meses = agruparPorMes(construirCalendario(grupo))

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
