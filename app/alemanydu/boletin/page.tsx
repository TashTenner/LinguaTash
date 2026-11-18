// /alemanydu/boletin: the signup on its own, to send by WhatsApp or put on a
// flyer.

import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import BoletinForm from '@/components/BoletinForm'
import BoletinTexto from '@/components/alemanydu/BoletinTexto'

export const metadata = genPageMetadata({
  title: 'Boletín de Alemán·y·Du',
  description:
    'El boletín de Alemán·y·Du, alemán extraescolar en Barcelona: inscripciones del próximo curso y novedades de las clases.',
})

export default function BoletinAlemanYDuPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <BoletinTexto />
        <div className="mt-10">
          <BoletinForm lista="alemanydu" />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/alemanydu" className="text-[#B3475A] underline-offset-4 hover:underline">
          Más sobre Alemán·y·Du
        </Link>
      </p>
    </main>
  )
}
