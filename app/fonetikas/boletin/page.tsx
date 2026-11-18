// /fonetikas/boletin: the signup on its own, to link from social media or a flyer.

import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import BoletinForm from '@/components/BoletinForm'
import BoletinTexto from '@/components/fonetikas/BoletinTexto'

export const metadata = genPageMetadata({
  title: 'Boletín de Fonetikas',
  description:
    'El boletín de Fonetikas, alemán desde la base oral para adultos hispanohablantes: cursos y talleres que se abren e ideas para entrenar el oído.',
})

export default function BoletinFonetikasPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <BoletinTexto />
        <div className="mt-10">
          <BoletinForm lista="fonetikas" />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/fonetikas" className="text-[#B3475A] underline-offset-4 hover:underline">
          Más sobre Fonetikas
        </Link>
      </p>
    </main>
  )
}
