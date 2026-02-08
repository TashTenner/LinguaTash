import Link from 'next/link'
import { formatDate } from '../../lib/formatDate'

export default function NowPage() {
  const lastUpdated = '2026-02-01'

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Now</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          En qué estoy enfocada ahora mismo.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Esta es mi página personal “now”, inspirada en{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-gray-800 dark:hover:text-gray-300"
          >
            Derek Sivers
          </a>
          .
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Enfoque profesional
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>Mejorar y refinar la web de LinguaTash</li>
          <li>
            Investigar la etimología de algunas palabras en español y ruso (por ejemplo:{' '}
            <em>duro</em> en español y <em>derevo</em> en ruso)
          </li>
          <li>
            Profundizar en el debate entre Noam Chomsky y Daniel Everett sobre si el lenguaje humano
            es innato y universal o principalmente moldeado por la cultura
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Enfoque personal
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>
            Reflexionar sobre las dificultades de la crianza y cómo aliviarlas sin perder conexión
          </li>
          <li>Aprender más sobre temas de salud que afectan a madres y familias</li>
          <li>Encontrar formas realistas de volver al deporte después del embarazo y el parto</li>
        </ul>
      </section>

      <footer className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Última actualización: {formatDate(lastUpdated)}
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/now/archive"
            className="underline underline-offset-4 hover:text-gray-800 dark:hover:text-gray-300"
          >
            Ver archivo de actualizaciones anteriores →
          </Link>
        </p>
      </footer>
    </article>
  )
}
