import Link from 'next/link'
import { formatDate } from '../../../lib/formatDate'

const updates = [
  {
    date: '2026-01-08',
    content: 'Primera versión de la página web LinguaTash.',
  },
]

export default function NowArchivePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 dark:bg-[#081C3C]">
        <header className="space-y-6">
          <h1 className="text-4xl font-semibold">Archivo Now</h1>

          <p className="text-lg opacity-80">Versiones anteriores de mi página Now.</p>

          <p className="text-sm">
            <Link
              href="/now"
              className="underline underline-offset-4 transition-colors hover:text-[#B3475A]"
            >
              ← Volver a la página Now actual
            </Link>
          </p>
        </header>
      </section>

      {/* UPDATES */}
      <section className="space-y-10 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        {updates.map((update) => (
          <div key={update.date} className="border-l-4 border-[#9A8F85] pl-6">
            <h2 className="text-xl font-semibold">{formatDate(update.date)}</h2>

            <p className="mt-2 opacity-90">{update.content}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
