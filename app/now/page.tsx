import Link from 'next/link'
import { formatDate } from '../../lib/formatDate'

export default function NowPage() {
  const lastUpdated = '2026-04-30'

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
          <li>
            Aprender cómo funciona Instagram y subir las primeras publicaciones para LinguaTash
          </li>
          <li>Volver a grabar las lecciones de Fonetikas con mejor calidad</li>
        </ul>
      </section>

      {/* ENFOQUE PERSONAL */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Enfoque personal</h2>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>
            Cuánto pan es razonable para adultos y niños — es un alimento cómodo y rápido, pero no
            el más nutritivo
          </li>
          <li>
            Cómo reducir el plástico de forma profunda y realista, sin pretender eliminarlo por
            completo
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
