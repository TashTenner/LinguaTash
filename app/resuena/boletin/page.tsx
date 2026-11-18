// /resuena/boletin: the signup on its own, to link from social media or a game.

import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import BoletinForm from '@/components/BoletinForm'
import BoletinTexto from '@/components/resuena/BoletinTexto'

export const metadata = genPageMetadata({
  title: 'Boletín de Resuena',
  description:
    'El boletín de Resuena: juegos fonéticos y audiolibros nuevos, y cómo van los que están en desarrollo.',
})

export default function BoletinResuenaPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <BoletinTexto />
        <div className="mt-10">
          <BoletinForm lista="resuena" />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/resuena" className="text-[#B3475A] underline-offset-4 hover:underline">
          Más sobre Resuena
        </Link>
      </p>
    </main>
  )
}
