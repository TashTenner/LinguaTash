import Link from 'next/link'
import { formatDate } from '../../../lib/formatDate'

const updates = [
  {
    date: '2026-02-01',
    content:
      'Primera versión pública de la página Now. Enfoque en LinguaTash, fonética, lenguaje y reorganización de prioridades profesionales y personales.',
  },
]

export default function NowArchivePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
      <article className="prose max-w-none py-16">
        <header className="mb-12">
          <h1>Archivo Now</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Versiones anteriores de mi página Now.
          </p>
          <p className="text-sm">
            <Link
              href="/now"
              className="underline underline-offset-4 hover:text-gray-800 dark:hover:text-gray-300"
            >
              ← Volver a la página Now actual
            </Link>
          </p>
        </header>

        <section className="space-y-8">
          {updates.map((update) => (
            <div key={update.date} className="border-l-4 border-gray-300 pl-4 dark:border-gray-600">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(update.date)}
              </h2>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{update.content}</p>
            </div>
          ))}
        </section>
      </article>
    </main>
  )
}
