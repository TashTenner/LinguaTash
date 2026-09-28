import { fechasLaJuntada } from '@/content/lajuntada/fechas'
import { listarReservas } from '@/lib/lajuntada/reservas'
import AdminAcciones from '@/components/lajuntada/AdminAcciones'

// El panel muestra quién reservó, así que nunca debe servirse de una caché.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Panel de La Juntada',
  robots: { index: false, follow: false },
}

const CUPO = 15

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
const cuando = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export default async function LaJuntadaAdminPage() {
  const abiertas = fechasLaJuntada.filter((f) => f.stripeUrl)

  const porFecha = await Promise.all(
    abiertas.map(async (f) => ({
      fecha: f,
      reservas: await listarReservas(f.stripeUrl!),
    }))
  )

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
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

      {porFecha.length === 0 && (
        <p className="opacity-70">Todavía no hay ninguna fecha con reservas abiertas.</p>
      )}

      {porFecha.map(({ fecha, reservas }) => {
        const activas = reservas.filter((r) => r.estado === 'pagada')
        const devueltas = reservas.filter((r) => r.estado === 'devuelta')
        const adultos = activas.reduce((n, r) => n + r.adultos, 0)
        const chicos = activas.reduce((n, r) => n + (Number(r.chicos) || 0), 0)
        const recaudado = activas.reduce((n, r) => n + r.importe, 0)
        const lleno = activas.length >= CUPO

        return (
          <section key={fecha.iso} className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[#b3475a]/30 pb-2">
              <h2 className="text-xl font-semibold text-[#b3475a]">{fecha.fecha}</h2>
              <p className="text-sm">
                <span className={lleno ? 'font-semibold text-[#b3475a]' : 'font-semibold'}>
                  {activas.length} de {CUPO} familias
                </span>
                <span className="opacity-70">
                  {' · '}
                  {adultos} adultos · {chicos} chicos · {euros.format(recaudado)}
                </span>
                {devueltas.length > 0 && (
                  <span className="opacity-70">
                    {' · '}
                    {devueltas.length} devuelta{devueltas.length > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>

            {reservas.length === 0 ? (
              <p className="text-sm opacity-70">Sin reservas todavía.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#9a8f85]/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#e3ded7]">
                    <tr>
                      <th className="px-3 py-3 font-medium">Reservó</th>
                      <th className="px-3 py-3 font-medium">Familia</th>
                      <th className="px-3 py-3 font-medium">Contacto</th>
                      <th className="px-3 py-3 font-medium">Adultos</th>
                      <th className="px-3 py-3 font-medium">Chicos</th>
                      <th className="px-3 py-3 font-medium">Edades</th>
                      <th className="px-3 py-3 font-medium">De dónde</th>
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
                            {r.adultos}
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
      })}
    </main>
  )
}
