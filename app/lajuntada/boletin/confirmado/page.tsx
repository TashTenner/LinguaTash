// /lajuntada/boletin/confirmado: where Kit sends people after they click the
// confirmation link (set in the "Boletín de La Juntada" form in Kit).

import Link from '../../../../components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Suscripción confirmada',
  robots: { index: false, follow: false },
})

export default function BoletinConfirmadoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 text-center dark:bg-[#081C3C]">
        <h1 className="text-4xl" style={{ letterSpacing: '-0.04em' }}>
          ¡Listo, ya estás!
        </h1>
        <p className="mt-6 leading-relaxed opacity-90">
          Tu suscripción al boletín de La Juntada está confirmada. El próximo te llega directo al
          correo, con la fecha y el tema de la próxima juntada.
        </p>
        <Link
          href="/lajuntada"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-[#B3475A] px-6 py-2.5 font-medium text-white transition-transform duration-200 hover:scale-105"
        >
          Ver las próximas fechas
        </Link>
      </div>
    </main>
  )
}
