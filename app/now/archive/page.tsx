import Link from 'next/link'
import { formatDate } from '../../../lib/formatDate'

const updates = [
  {
    date: '2026-02-01',
    profesional: [
      'Mejorar y refinar la web de LinguaTash',
      'Investigar la etimología de algunas palabras en español y ruso (por ejemplo: duro en español y дерево (derevo) en ruso, que quiere decir árbol)',
      'Comparar palabras similares en inglés, español y ruso: wind (inglés), viento (español), ветер (veter)',
      'Profundizar en el debate entre Noam Chomsky y Daniel Everett sobre si el lenguaje humano es innato y universal o principalmente moldeado por la cultura',
    ],
    personal: [
      'Reflexionar sobre las dificultades de la crianza desde el enfoque de la crianza autoritativa (límites firmes con alta conexión emocional)',
      'Interés en el estudio del microbioma y su conexión con el cerebro, la regulación emocional y la salud general',
      'Encontrar formas realistas de volver al deporte después del embarazo y el parto',
    ],
  },
  {
    date: '2026-01-08',
    profesional: ['Primera versión de la página web LinguaTash.'],
    personal: [],
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
      <section className="space-y-12 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        {updates.map((update) => (
          <div key={update.date} className="border-l-4 border-[#9A8F85] pl-6">
            <h2 className="mb-4 text-xl font-semibold">{formatDate(update.date)}</h2>

            {update.profesional.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 font-medium">Enfoque profesional</h3>
                <ul className="ml-5 list-disc space-y-1 opacity-90">
                  {update.profesional.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {update.personal.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium">Enfoque personal</h3>
                <ul className="ml-5 list-disc space-y-1 opacity-90">
                  {update.personal.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
