import Link from 'next/link'
import { fechasLaJuntada, fuentesDe, type FechaLaJuntada } from '@/content/lajuntada/fechas'
import { listarReservas, type ReservaLaJuntada } from '@/lib/lajuntada/reservas'
import AdminAcciones from '@/components/lajuntada/AdminAcciones'
import CopiarEmails from '@/components/lajuntada/CopiarEmails'

// El panel muestra quién reservó, así que nunca debe servirse de una caché.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Panel de La Juntada',
  robots: { index: false, follow: false },
}

const CUPO = 15

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
const corta = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const cuando = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** Los emails de unas reservas, sin repetir y sin las devueltas. */
function emailsDe(reservas: ReservaLaJuntada[]): string[] {
  const vistos = new Map<string, string>()
  for (const r of reservas) {
    if (r.estado === 'pagada' && r.email) vistos.set(r.email.trim().toLowerCase(), r.email.trim())
  }
  return [...vistos.values()]
}

export default async function LaJuntadaAdminPage(props: {
  searchParams: Promise<{ fecha?: string }>
}) {
  const { fecha: elegida } = await props.searchParams
  const hoy = new Date().toISOString().slice(0, 10)

  // Toda fecha con link propio o con reservas que le llegaron de otra. Una
  // cancelada tiene pestaña, pero solo con lo devuelto: lo demás se fue a la
  // fecha que la reemplaza y se ve allá.
  const conReservas = fechasLaJuntada.filter((f) => fuentesDe(f).length > 0)

  // Todas a la vez, aunque se vea una: los dos botones de emails las necesitan.
  const porFecha = await Promise.all(
    conReservas.map(async (f) => ({ fecha: f, reservas: await listarReservas(f) }))
  )

  const proxima = porFecha.find(({ fecha }) => fecha.iso >= hoy && fecha.estado !== 'cancelada')
  const actual = porFecha.find(({ fecha }) => fecha.iso === elegida) ?? proxima ?? porFecha.at(-1)

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel de La Juntada</h1>
          <p className="mt-2 text-sm opacity-70">
            Las reservas se leen de Stripe en cada carga. No hay copia local: lo que se ve acá es lo
            que hay cobrado.
          </p>
        </div>
        <AdminAcciones />
      </div>

      <div className="flex flex-wrap gap-3">
        <CopiarEmails
          etiqueta={
            proxima
              ? `Copiar emails del ${corta.format(new Date(proxima.fecha.iso))}`
              : 'Copiar emails de la próxima'
          }
          emails={proxima ? emailsDe(proxima.reservas) : []}
        />
        <CopiarEmails
          etiqueta="Copiar emails de todas las juntadas"
          emails={emailsDe(porFecha.flatMap(({ reservas }) => reservas))}
        />
      </div>

      {!actual ? (
        <p className="opacity-70">Todavía no hay ninguna fecha con reservas abiertas.</p>
      ) : (
        <>
          <nav className="flex flex-wrap gap-2 border-b border-[#9a8f85]/30 pb-3">
            {porFecha.map(({ fecha, reservas }) => {
              const activa = fecha.iso === actual.fecha.iso
              const familias = reservas.filter((r) => r.estado === 'pagada').length
              return (
                <Link
                  key={fecha.iso}
                  href={`/lajuntada/admin?fecha=${fecha.iso}`}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    activa
                      ? 'bg-[#b3475a] text-[#f4efe8]'
                      : 'border border-[#9a8f85]/40 hover:bg-[#e3ded7]'
                  } ${fecha.iso < hoy && !activa ? 'opacity-60' : ''}`}
                >
                  {corta.format(new Date(fecha.iso))}
                  <span className="ml-2 opacity-80">
                    · {fecha.estado === 'cancelada' ? 'cancelada' : familias}
                  </span>
                  {fecha.iso === proxima?.fecha.iso && (
                    <span className="ml-2 text-xs uppercase">Próxima</span>
                  )}
                </Link>
              )
            })}
          </nav>

          <Detalle
            fecha={actual.fecha}
            reservas={actual.reservas}
            pasada={actual.fecha.iso < hoy}
          />
        </>
      )}
    </main>
  )
}

function Detalle({
  fecha,
  reservas,
  pasada,
}: {
  fecha: FechaLaJuntada
  reservas: ReservaLaJuntada[]
  pasada: boolean
}) {
  const activas = reservas.filter((r) => r.estado === 'pagada')
  const devueltas = reservas.filter((r) => r.estado === 'devuelta')
  const chicos = activas.reduce((n, r) => n + (Number(r.chicos) || 0), 0)
  const recaudado = activas.reduce((n, r) => n + r.importe, 0)
  const lleno = activas.length >= CUPO

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[#b3475a]/30 pb-2">
        <h2 className="text-xl font-semibold text-[#b3475a]">
          {fecha.fecha}
          {pasada && fecha.estado !== 'cancelada' && (
            <span className="ml-3 text-sm font-normal opacity-70">pasada</span>
          )}
          {!fecha.stripeUrl && (
            <span className="ml-3 text-sm font-normal opacity-70">sin link de Stripe todavía</span>
          )}
        </h2>
        {fecha.estado !== 'cancelada' && (
          <p className="text-sm">
            <span className={lleno ? 'font-semibold text-[#b3475a]' : 'font-semibold'}>
              {activas.length} de {CUPO} familias
            </span>
            <span className="opacity-70">
              {' · '}
              {chicos} chicos · {euros.format(recaudado)}
            </span>
            {devueltas.length > 0 && (
              <span className="opacity-70">
                {' · '}
                {devueltas.length} devuelta{devueltas.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        )}
      </div>

      {fecha.estado === 'cancelada' && (
        <p className="rounded-xl border border-[#b3475a]/40 bg-[#b3475a]/10 px-4 py-3 text-sm">
          Cancelada{fecha.motivoCancelacion ? ` por ${fecha.motivoCancelacion}` : ''}.
          {fecha.traspasadaA &&
            ` Las familias que no pidieron la devolución pasaron al ${
              fechasLaJuntada
                .find((f) => f.iso === fecha.traspasadaA)
                ?.fecha.replace(/^Domingo/, 'domingo') ?? fecha.traspasadaA
            } y figuran en esa pestaña.`}
        </p>
      )}

      {reservas.length === 0 ? (
        <p className="text-sm opacity-70">
          {fecha.estado === 'cancelada' ? 'No quedó ninguna reserva acá.' : 'Sin reservas todavía.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#9a8f85]/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#e3ded7]">
              <tr>
                <th className="px-3 py-3 font-medium">Reservó</th>
                <th className="px-3 py-3 font-medium">Familia</th>
                <th className="px-3 py-3 font-medium">Contacto</th>
                <th className="px-3 py-3 font-medium">Chicos</th>
                <th className="px-3 py-3 font-medium">Edades</th>
                <th className="px-3 py-3 font-medium">De dónde</th>
                <th className="px-3 py-3 font-medium">Boletín</th>
                <th className="px-3 py-3 font-medium">Pagó</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9a8f85]/20">
              {reservas.map((r) => {
                const devuelta = r.estado === 'devuelta'
                return (
                  <tr key={r.sessionId} className={devuelta ? 'bg-[#9a8f85]/10' : undefined}>
                    <td className="px-3 py-3 whitespace-nowrap opacity-70">
                      {cuando.format(new Date(r.creada))}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      <div className="flex flex-col gap-1">
                        <span className={devuelta ? 'line-through opacity-60' : undefined}>
                          {r.nombre ?? '—'}
                        </span>
                        {devuelta && (
                          <span className="inline-block w-fit rounded-full bg-[#b3475a] px-2 py-0.5 text-xs font-medium text-[#f4efe8]">
                            Devuelta
                          </span>
                        )}
                        {r.traspasadaDe && (
                          <span className="inline-block w-fit rounded-full bg-[#9a8f85]/20 px-2 py-0.5 text-xs font-medium">
                            Traspasada del {r.traspasadaDe}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-3 py-3 ${devuelta ? 'opacity-60' : ''}`}>
                      <div className="flex flex-col gap-1">
                        {r.email && (
                          <a href={`mailto:${r.email}`} className="hover:text-[#b3475a]">
                            {r.email}
                          </a>
                        )}
                        {r.telefono && (
                          <a
                            href={`https://wa.me/${r.telefono.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-70 hover:text-[#b3475a]"
                          >
                            {r.telefono}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className={`px-3 py-3 ${devuelta ? 'opacity-60' : ''}`}>
                      {r.chicos ?? '—'}
                    </td>
                    <td className={`px-3 py-3 ${devuelta ? 'opacity-60' : ''}`}>
                      {r.edades ?? '—'}
                    </td>
                    <td className={`px-3 py-3 ${devuelta ? 'opacity-60' : ''}`}>
                      {r.origen ?? '—'}
                    </td>
                    <td className={`px-3 py-3 ${devuelta ? 'opacity-60' : ''}`}>
                      {r.boletin === 'si' ? 'Sí' : r.boletin === 'no' ? 'No' : '—'}
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap ${devuelta ? 'line-through opacity-60' : ''}`}
                    >
                      {euros.format(r.importe)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
