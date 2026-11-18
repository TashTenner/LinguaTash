// /lajuntada/boletin: the signup on its own, to link from WhatsApp, Instagram
// and flyers.

import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import BoletinForm from '@/components/BoletinForm'
import BoletinTexto from '@/components/lajuntada/BoletinTexto'

export const metadata = genPageMetadata({
  title: 'Boletín de La Juntada',
  description:
    'El boletín de La Juntada, el encuentro mensual en Barcelona para familias argentinas con hijos: la próxima fecha y cuándo se abren las reservas.',
  image: '/static/images/lajuntada-og.png',
})

export default function BoletinLaJuntadaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-l-4 border-[#9A8F85]/40 border-l-[#B3475A] bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <BoletinTexto />
        <div className="mt-10">
          <BoletinForm lista="lajuntada" />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/lajuntada" className="text-[#B3475A] underline-offset-4 hover:underline">
          Más sobre La Juntada
        </Link>
      </p>
    </main>
  )
}
