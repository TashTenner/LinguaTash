// /boletin: the homepage box on its own page: any of the seven boletines.

import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata = genPageMetadata({
  title: 'Boletines de LinguaTash',
  description:
    'Los boletines de LinguaTash: el general, con las novedades de todos los proyectos, y el de cada proyecto.',
})

export default function BoletinPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl font-semibold">Los boletines de LinguaTash</h1>
          <p className="leading-relaxed opacity-90">
            El general reúne las novedades de todos los proyectos, tres o cuatro veces al año. Cada
            proyecto tiene además el suyo. Elige los que quieras, uno o varios.
          </p>
        </div>
        <div className="mt-10">
          <WaitlistForm />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-[#B3475A] underline-offset-4 hover:underline">
          Volver a LinguaTash
        </Link>
      </p>
    </main>
  )
}
