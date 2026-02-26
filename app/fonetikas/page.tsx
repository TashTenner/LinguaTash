import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Fonetikas' })

export default function FonetikasPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <img
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <img
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="opcity-95 font-[100]" style={{ letterSpacing: '-0.1em' }}>
            Foneti
          </span>
          <span className="font-[400]">k</span>
          <span className="font-[100] opacity-95" style={{ letterSpacing: '-0.1em' }}>
            as
          </span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          El método de alemán para adultos hispanohablantes basado en la oralidad.
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          Aprender alemán no comienza en el libro. Comienza en el oído.
          <br className="hidden md:block" />Y cuando el oído cambia, cambia tu manera de hablar y tu
          relación con el idioma.
        </p>

        <div className="mx-auto mt-10 h-px w-20 bg-[#9A8F85]" />

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          No se trata de memorizar reglas. Se trata de activar lo que ya está en ti.
        </p>
      </section>

      {/* ¿QUÉ ES? */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">¿Qué es Fonetikas?</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>
            Fonetikas es el método con el que acompaño a adultos hispanohablantes a adquirir el
            alemán desde la base oral.
          </p>

          <p>
            Durante años enseñando alemán entendí algo fundamental: los estudiantes necesitan
            bloques elementales del idioma — pequeñas “piezas de lego” lingüísticas — claras,
            combinables y fáciles de usar.
          </p>

          <p>
            Cuando esas piezas encajan, hablar deja de ser intimidante. Se vuelve natural. Y cuando
            hablar se vuelve natural, la gramática deja de ser un obstáculo.
          </p>
        </div>
      </section>

      {/* QUOTE 1 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            “Aprender alemán no comienza en el libro. Comienza en el oído.”
          </p>
        </div>
      </section>

      {/* BASE TEÓRICA (2 columnas) */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">La base teórica</h2>
            <h3 className="mb-3 font-semibold">La capacidad lingüística es innata</h3>

            <div className="space-y-4 leading-relaxed opacity-90">
              <p>
                Cada ser humano nace con una estructura gramatical interna. Una “placa madre” de
                reglas basada en lógica.
              </p>

              <p>
                Al adquirir nuestro idioma nativo, activamos solo una parte de esas reglas. Las
                demás siguen allí, disponibles.
              </p>

              <p>
                No hemos perdido la capacidad de adquirir lenguas. Lo que hemos perdido es el orden
                natural del proceso.
              </p>

              <p>
                El problema no es que no podamos aprender un nuevo idioma. El problema es que casi
                siempre intentamos hacerlo desde la lógica de nuestra lengua materna.
              </p>

              <p>Traducimos. Comparamos. Leemos antes de escuchar.</p>

              <p>
                Fonetikas propone algo distinto: activar primero la adquisición oral, igual que
                cuando aprendimos nuestra lengua nativa.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-semibold">Referencias</h2>

            <div className="space-y-4 leading-relaxed opacity-90">
              <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-6 dark:bg-[#081C3C]">
                <p className="text-sm tracking-wide uppercase opacity-70">Noam Chomsky</p>
                <p className="mt-2 font-semibold">Gramática Universal</p>
              </div>

              <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-6 dark:bg-[#081C3C]">
                <p className="text-sm tracking-wide uppercase opacity-70">Stephen Krashen</p>
                <p className="mt-2 font-semibold">Acquisition vs Learning</p>
              </div>

              <p className="mt-2 opacity-90">
                No se trata de memorizar reglas. Se trata de permitir que el sistema interno se
                active.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* ADQUISICIÓN VS APRENDIZAJE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Adquisición vs Aprendizaje</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>Un niño adquiere su idioma simplemente por estar expuesto a sonidos.</p>
          <p>A los seis años habla con fluidez. Aunque no sepa leer ni escribir.</p>
          <p>
            La lectura y la escritura se aprenden después. Hablar y comprender se adquieren primero.
          </p>
          <p>
            Aprender es consciente. Adquirir es profundo. En Fonetikas respetamos ese orden natural.
          </p>
        </div>
      </section>

      {/* QUOTE 2 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            “Primero escuchar. Después repetir. Luego combinar. Más tarde escribir.”
          </p>
        </div>
      </section>

      {/* MÉTODO (pasos) */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-8 text-2xl font-semibold">¿Cómo funciona el método?</h2>

        <ol className="ml-6 list-decimal space-y-3 leading-relaxed opacity-90">
          <li>Las primeras clases trabajan únicamente la parte oral.</li>
          <li>No se muestra la forma escrita de las palabras al inicio.</li>
          <li>
            Se introducen bloques lingüísticos básicos y ejemplos en afirmativo, negativo y
            pregunta.
          </li>
          <li>Se entrena activamente la pronunciación real del alemán.</li>
          <li>Solo cuando la base oral está integrada, aparece la escritura.</li>
          <li>La gramática se comprende desde lo ya adquirido.</li>
          <li>Las explicaciones se adaptan según tu lengua materna.</li>
        </ol>

        <div className="mt-10 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-6 dark:bg-[#081C3C]">
          <p className="leading-relaxed opacity-90">
            ¿Por qué evitar la palabra escrita al principio? Porque cuando ves una palabra
            extranjera, la lees con la lógica del español. Y eso cambia automáticamente tu
            pronunciación. Primero se memoriza el sonido. Después se introduce la forma escrita.
          </p>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-8 text-2xl font-semibold">¿Para quién es Fonetikas?</h2>

        <ul className="ml-6 list-disc space-y-3 leading-relaxed opacity-90">
          <li>Empiezas desde cero y quieres hacerlo bien desde el principio.</li>
          <li>Ya estudiaste alemán pero sientes que tu pronunciación no te representa.</li>
          <li>Quieres dejar de traducir mentalmente.</li>
          <li>Deseas sentir el idioma, no solo entenderlo.</li>
        </ul>

        <p className="mt-8 leading-relaxed opacity-90">
          Paradójicamente, empezar sin conocimientos previos puede ser una ventaja: tu oído está más
          disponible, más atento, más moldeable.
        </p>
      </section>

      {/* DIFERENCIACIÓN */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">¿Por qué Fonetikas es diferente?</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>Porque no te enseña a “aprobar” alemán. Te enseña a hablarlo desde dentro.</p>
          <p>Aprender alemán en la adultez no es cuestión de memoria. Es cuestión de enfoque.</p>
          <p>
            La capacidad de adquirir lenguas no desaparece con la edad. Lo que cambia es el método.
          </p>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-16 text-center text-[#F4EFE8]">
        <h2 className="mb-6 text-2xl font-semibold">Tu alemán empieza aquí.</h2>

        <p className="mx-auto mb-8 max-w-2xl opacity-80">No en el libro. En el sonido.</p>

        <a
          href="mailto:fonetikas@linguatash.com"
          className="mt-6 w-fit max-w-full truncate overflow-hidden rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium whitespace-nowrap transition-transform duration-300 hover:scale-105 sm:text-sm"
        >
          fonetikas@linguatash.com
        </a>
      </section>
    </main>
  )
}
