import { fechasLaJuntada } from '@/content/lajuntada/fechas'
import { listarReservas } from '@/lib/lajuntada/reservas'

// El panel muestra quién reservó, así que nunca debe servirse de una caché.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Panel de La Juntada',
  robots: { index: false, follow: false },
}

const CUPO = 15

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
      <div>
        <h1 className="text-2xl font-semibold">Panel de La Juntada</h1>
        <p className="mt-2 text-sm opacity-70">
          Las reservas se leen de Stripe en cada carga. No hay copia local: lo que se ve acá es lo
          que hay cobrado.
        </p>
      </div>

      {porFecha.length === 0 && (
        <p className="opacity-70">Todavía no hay ninguna fecha con reservas abiertas.</p>
      )}

      {porFecha.map(({ fecha, reservas }) => {
        const adultos = reservas.reduce((n, r) => n + r.adultos, 0)
        const recaudado = reservas.reduce((n, r) => n + r.importe, 0)

        return (
          <section key={fecha.iso} className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">{fecha.fecha}</h2>
              <p className="text-sm opacity-70">
                {reservas.length} de {CUPO} familias · {adultos} adultos · {recaudado.toFixed(2)}{' '}
                euros
              </p>
            </div>

            {reservas.length === 0 ? (
              <p className="text-sm opacity-70">Sin reservas todavía.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#9A8F85]/30">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#9A8F85]/30 opacity-70">
                      <th className="px-3 py-3 font-medium">Familia</th>
                      <th className="px-3 py-3 font-medium">Contacto</th>
                      <th className="px-3 py-3 font-medium">Adultos</th>
                      <th className="px-3 py-3 font-medium">Chicos</th>
                      <th className="px-3 py-3 font-medium">Edades</th>
                      <th className="px-3 py-3 font-medium">De dónde</th>
                      <th className="px-3 py-3 font-medium">Pagó</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9A8F85]/15">
                    {reservas.map((r) => (
                      <tr key={r.sessionId}>
                        <td className="px-3 py-3 font-medium">{r.nombre ?? '—'}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-1">
                            {r.email && (
                              <a href={`mailto:${r.email}`} className="hover:text-[#B3475A]">
                                {r.email}
                              </a>
                            )}
                            {r.telefono && (
                              <a
                                href={`https://wa.me/${r.telefono.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-70 hover:text-[#B3475A]"
                              >
                                {r.telefono}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3">{r.adultos}</td>
                        <td className="px-3 py-3">{r.chicos ?? '—'}</td>
                        <td className="px-3 py-3">{r.edades ?? '—'}</td>
                        <td className="px-3 py-3">{r.origen ?? '—'}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{r.importe.toFixed(2)} €</td>
                      </tr>
                    ))}
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
