import Image from 'next/image'
import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Fonetikas' })

export default function FonetikasPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            width={112}
            height={112}
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <Image
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            width={112}
            height={112}
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="font-[100] opacity-95" style={{ letterSpacing: '-0.1em' }}>
            Foneti
          </span>
          <span className="font-[400]">k</span>
          <span className="font-[100] opacity-95" style={{ letterSpacing: '-0.1em' }}>
            as
          </span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          El método de alemán para adultos hispanohablantes, basado en la oralidad.
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          Aprender alemán no comienza en el libro. Comienza en el oído.
          <br className="hidden md:block" />
          Cuando el oído cambia, cambia tu manera de hablar y tu relación con el idioma.
        </p>

        <div className="mx-auto mt-10 h-px w-20 bg-[#9A8F85]" />

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          No se trata de memorizar reglas. Se trata de activar lo que ya está en ti.
        </p>

        <p className="mt-10 font-[Caveat] text-3xl text-[#B3475A]">El oído primero.</p>
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
            Después de años enseñando alemán entendí algo fundamental: necesitas bloques elementales
            del idioma, pequeñas piezas que sean claras, combinables y fáciles de usar.
          </p>

          <p>
            Cuando esas piezas encajan, hablar deja de intimidar. Se vuelve natural. Y cuando hablar
            se vuelve natural, la gramática deja de ser un obstáculo.
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
                Cada ser humano nace con una estructura interna para el lenguaje, una base de reglas
                hecha de lógica.
              </p>

              <p>
                Al adquirir nuestra lengua materna activamos solo una parte de esas reglas. Las
                demás siguen ahí, disponibles.
              </p>

              <p>
                No perdimos la capacidad de adquirir lenguas. Lo que perdimos es el orden natural
                del proceso.
              </p>

              <p>
                Esa capacidad que todos tenemos no es una sola lógica. Es la capacidad de sostener
                varias. Cada lengua corre su propia lógica sobre la misma base.
              </p>

              <p>
                El problema no es comparar con el español. Comparar te ayuda a entender la
                gramática. El problema es dejar que el español decida cómo suena el alemán.
              </p>

              <p>
                Traducimos. Leemos antes de escuchar. Y así, sin darnos cuenta, el español elige el
                sonido por nosotras.
              </p>

              <p>
                Fonetikas propone otra cosa: recuperar el orden con el que adquirimos nuestra lengua
                materna, el oído primero, y aplicarlo al adulto, que ya tiene una lengua instalada y
                una mente que puede comparar, razonar y elegir.
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
                <p className="mt-2 font-semibold">Adquisición frente a Aprendizaje</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 leading-relaxed opacity-90">
          No se trata de memorizar reglas. Se trata de permitir que tu sistema interno se active.
        </p>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <Image
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            width={32}
            height={32}
            className="block h-8 w-auto dark:hidden"
          />
          <Image
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            width={32}
            height={32}
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* NO PARTES DE CERO */}
      <section className="rounded-2xl border-2 border-[#B3475A]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">
          No partes de cero. Partes de lo que ya sabes.
        </h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>
            Un bebé construye su primera lengua sin nada previo. Tú no. Ya tienes el español
            instalado, y eso es una ventaja que un bebé no tiene.
          </p>

          <p>
            Ya sabes que las palabras cumplen una función. Ya puedes comparar, razonar y notar un
            contraste. Ya entiendes un concepto cuando lo escuchas. Solo necesitas una forma nueva
            para algo que ya conoces.
          </p>

          <p>
            Fonetikas no te pide volver a ser bebé. Toma el orden del bebé, el oído primero, y lo
            combina con todo lo que tú, como adulta, sí puedes hacer y un bebé no.
          </p>
        </div>
      </section>

      {/* JUEGAS CON EL CONTRASTE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Juegas con el contraste en tu propio idioma</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>
            El orden de las palabras en alemán se siente extraño al principio. Por eso lo practicas
            con palabras que ya dominas, antes de cargar el oído con vocabulario nuevo.
          </p>

          <p>
            En español dices: No estoy aquí. Sabes que así es correcto.
            <br className="hidden md:block" />
            Ahora juega: Yo estoy no aquí. Así ordenaría la frase una persona alemana.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <div className="rounded-full border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-3 text-base dark:bg-[#081C3C]">
            No estoy aquí.
          </div>
          <span className="text-2xl opacity-60">→</span>
          <div className="rounded-full border border-[#B3475A]/50 bg-[#E3DED7] px-6 py-3 text-base font-medium text-[#B3475A] dark:bg-[#081C3C]">
            Yo estoy no aquí.
          </div>
        </div>

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Al repetir las dos versiones con tus propias palabras, sientes el contraste desde
            adentro. Y poco a poco ese orden alemán deja de sentirse como un error. Empiezas a notar
            que también tiene su lógica.
          </p>

          <p>
            Ahí pasa algo importante: descubres que la lógica de tu lengua materna no es la única.
            Cada idioma tiene la suya. No hay un orden correcto y otro incorrecto. Hay órdenes
            distintos.
          </p>

          <p>
            Mientras tu mente juega con la estructura en español, el oído queda libre para
            concentrarse en lo único que de verdad es nuevo: el sonido alemán. El sonido va siempre
            primero.
          </p>
        </div>
      </section>

      {/* ADQUISICIÓN FRENTE A APRENDIZAJE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Adquisición frente a aprendizaje</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>Una niña adquiere su idioma simplemente por estar expuesta a sonidos.</p>
          <p>A los seis años habla con fluidez, aunque todavía no sepa leer ni escribir.</p>
          <p>La lectura y la escritura llegan después. Hablar y comprender se adquieren primero.</p>
          <p>Aprender es consciente. Adquirir es profundo. En Fonetikas respetamos ese orden.</p>
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
          <li>
            Las primeras clases trabajan solo la parte oral. No se muestra la forma escrita de las
            palabras al inicio.
          </li>
          <li>
            Se introducen bloques básicos del idioma, con ejemplos en afirmativo, negativo y
            pregunta.
          </li>
          <li>
            Se entrena de forma activa la pronunciación real del alemán. Escuchar, comprender el
            sonido y producirlo van juntos, desde el primer día.
          </li>
          <li>
            La estructura alemana se practica primero con palabras en español, para sentir el
            contraste sin cargar el oído.
          </li>
          <li>Solo cuando la base oral está integrada aparece la escritura.</li>
          <li>La gramática se comprende desde lo que ya adquiriste.</li>
          <li>Las explicaciones se adaptan a tu lengua materna.</li>
        </ol>

        <div className="mt-10 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-6 dark:bg-[#081C3C]">
          <p className="mb-3 font-semibold">¿Por qué evitar la palabra escrita al principio?</p>
          <p className="leading-relaxed opacity-90">
            Cuando ves una palabra en alemán, esa imagen escrita se te graba. Y tu cerebro la lee
            con la lógica del español, en voz alta, como si fuera una palabra española. Deja de
            escuchar. Repite lo que ve, no lo que oye.
          </p>
          <p className="mt-4 leading-relaxed opacity-90">
            Por eso primero se memoriza el sonido. La forma escrita llega después, cuando el oído ya
            manda.
          </p>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-8 text-2xl font-semibold">¿Para quién es Fonetikas?</h2>

        <ul className="ml-6 list-disc space-y-3 leading-relaxed opacity-90">
          <li>Empiezas desde cero y quieres hacerlo bien desde el principio.</li>
          <li>Ya estudiaste alemán, pero sientes que tu pronunciación no te representa.</li>
          <li>Quieres dejar de traducir mentalmente.</li>
          <li>Deseas sentir el idioma, no solo entenderlo.</li>
        </ul>

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Y algo que parece una paradoja: no haber visto alemán escrito puede ser una ventaja. Tu
            oído está más disponible, más atento, más moldeable.
          </p>

          <p>
            Quien ya vio las palabras escritas en alemán las tiene grabadas con la imagen escrita
            encima, y el cerebro las lee a la española. Si empiezas sin esa imagen, el oído todavía
            manda. Y eso es justo lo que Fonetikas quiere proteger.
          </p>

          <p>
            Al mismo tiempo, como adulta ya tienes una lengua sobre la cual construir. Usamos las
            dos cosas: un oído libre y una mente que ya sabe comparar.
          </p>
        </div>
      </section>

      {/* DIFERENCIACIÓN */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">¿Por qué Fonetikas es diferente?</h2>

        <div className="space-y-5 leading-relaxed opacity-90">
          <p>No te enseña a aprobar alemán. Te enseña a hablarlo desde dentro.</p>
          <p>Aprender alemán en la adultez no es cuestión de memoria. Es cuestión de enfoque.</p>
          <p>
            La capacidad de adquirir lenguas no desaparece con la edad. Lo que cambia es el método.
          </p>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <Image
            src="/static/images/fonetikas-icon.png"
            alt="Fonetikas Logo"
            width={32}
            height={32}
            className="block h-8 w-auto dark:hidden"
          />
          <Image
            src="/static/images/fonetikas-icon-dark.png"
            alt="Fonetikas Dark Logo"
            width={32}
            height={32}
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-16 text-center text-[#F4EFE8]">
        <h2 className="mb-6 text-2xl font-semibold">Tu alemán empieza aquí.</h2>

        <p className="mx-auto mb-8 max-w-2xl opacity-80">No en el libro. En el sonido.</p>

        <p className="mb-10 font-[Caveat] text-3xl text-[#B3475A]">El oído primero.</p>

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
