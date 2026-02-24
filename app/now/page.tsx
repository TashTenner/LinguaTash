import Link from 'next/link'
import { formatDate } from '../../lib/formatDate'

export default function NowPage() {
  const lastUpdated = '2026-02-01'

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
          <li>Mejorar y refinar la web de LinguaTash</li>
          <li>
            Investigar la etimología de algunas palabras en español y ruso (por ejemplo:{' '}
            <em>duro</em> en español y <em>дерево</em> (derevo) en ruso, que quiere decir árbol)
          </li>
          <li>
            Comparar palabras similares en inglés, español y ruso: <em>wind</em> (inglés),{' '}
            <em>viento</em> (español), <em>ветер</em> (veter)
          </li>
          <li>
            Profundizar en el debate entre Noam Chomsky y Daniel Everett sobre si el lenguaje humano
            es innato y universal o principalmente moldeado por la cultura
          </li>
        </ul>
      </section>

      {/* ENFOQUE PERSONAL */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Enfoque personal</h2>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>
            Reflexionar sobre las dificultades de la crianza desde el enfoque de la crianza
            autoritativa (límites firmes con alta conexión emocional)
          </li>
          <li>
            Interés en el estudio del microbioma y su conexión con el cerebro, la regulación
            emocional y la salud general
          </li>
          <li>Encontrar formas realistas de volver al deporte después del embarazo y el parto</li>
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
