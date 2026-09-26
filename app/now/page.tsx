import Link from 'next/link'
import { formatDate } from '../../lib/formatDate'

export default function NowPage() {
  const lastUpdated = '2026-09-26'

  return (
    <main className="mx-auto max-w-5xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 dark:bg-[#081C3C]">
        <header className="space-y-6">
          <h1 className="text-4xl font-semibold">Now</h1>

          <p className="text-lg opacity-80">En qué estoy enfocada ahora mismo.</p>

          <p className="text-sm text-[#9A8F85] dark:text-[#9A8F85]">
            Esta es mi página personal “now”, inspirada en{' '}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-[#B3475A]"
            >
              Derek Sivers
            </a>
            .
          </p>
        </header>
      </section>

      {/* ENFOQUE PROFESIONAL */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Enfoque profesional</h2>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>Empezar Alemán·y·Du: alemán extraescolar en La Salle Gràcia</li>
          <li>Abrir Nordkreis, la escuela de alemán de los sábados</li>
          <li>
            Preparar La Juntada, que empieza en octubre: un domingo al mes para familias
            rioplatenses en Barcelona
          </li>
        </ul>
      </section>

      {/* ENFOQUE PERSONAL */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Enfoque personal</h2>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>
            Aprender en Empower, un curso Erasmus+ sobre aprendizaje socioemocional y autodirigido,
            y llevar lo que aprendo a mis clases
          </li>
          <li>
            Volver con energía después de cinco semanas en Jena y unas vacaciones con amigos y
            familia
          </li>
        </ul>
      </section>

      {/* FOOTER */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-10 text-[#F4EFE8]">
        <footer className="space-y-4 text-sm">
          <p className="opacity-80">Última actualización: {formatDate(lastUpdated)}</p>

          <p>
            <Link
              href="/now/archive"
              className="underline underline-offset-4 transition-colors hover:text-[#B3475A]"
            >
              Ver archivo de actualizaciones anteriores →
            </Link>
          </p>
        </footer>
      </section>
    </main>
  )
}
