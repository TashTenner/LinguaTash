import Image from 'next/image'

export default function OnePersonTwoLanguagesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        {/* 1P2L Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/1p2l-icon.png"
            alt="1P2L Logo"
            width={600}
            height={400}
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <Image
            src="/static/images/1p2l-icon-dark.png"
            alt="1P2L Dark Logo"
            width={600}
            height={400}
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="font-[400]" style={{ letterSpacing: '-0.05em' }}>
            1P
          </span>
          <span className="font-[200] opacity-95">2L</span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          Una Persona Dos Lenguas
        </p>

        <p className="mt-4 text-lg text-[#081C3C]/80 md:text-xl dark:text-[#F4EFE8]/80">
          Cuando una persona sostiene dos lenguas y las transmite como herencia a sus hijos.
        </p>

        <div className="mx-auto my-10 h-px w-20 bg-[#9A8F85]" />

        <p className="text-xl font-semibold text-[#B3475A] md:text-2xl">One Person Two Languages</p>

        <p className="mt-4 text-lg text-[#081C3C]/80 md:text-xl dark:text-[#F4EFE8]/80">
          When one person holds two languages and passes them on to their children as heritage.
        </p>
      </section>

      {/* STORY */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-8 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-16 text-justify leading-relaxed opacity-90 md:grid-cols-2">
          {/* ESPAÑOL */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">
              Transmitir dos lenguas cuando se creció con dos lenguas
            </h2>

            <p>Nací bilingüe en la antigua República Democrática Alemana, RDA.</p>
            <p>Madre bilingüe en ruso y armenio, con ruso dominante, de Yerevan, Armenia.</p>
            <p>Padre germanoparlante.</p>
            <p>Escuela y entorno en alemán.</p>

            <p>El idioma con mi madre fue el ruso.</p>
            <p>Por eso, emocionalmente, el ruso ocupa un lugar central.</p>
            <p>
              Pero el alemán también forma parte de mi vínculo afectivo. Lo hablo con mi hermano y
              otros parientes en Alemania.
            </p>

            <p>
              Crecí con dos lenguas que nunca compitieron entre sí, pero que tampoco ocuparon el
              mismo espacio.
            </p>

            <p>
              Cuando nació mi primer hijo en Barcelona, en un entorno de español y catalán, apareció
              una presión interna inesperada:
            </p>

            <p>
              <strong>¿Había que elegir una de las dos lenguas?</strong>
            </p>

            <p>El alemán habría sido la opción lógica.</p>
            <p>Es mi lengua académica.</p>
            <p>Es mi lengua dominante.</p>

            <p>Pero dejar una de mis lenguas no se sentía correcto.</p>
            <p>No resonaba con mi identidad.</p>
          </div>

          {/* ENGLISH */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">
              Passing on Two Languages After Growing Up with Two
            </h2>

            <p>I was born bilingual in the former German Democratic Republic, GDR.</p>
            <p>
              My mother is bilingual in Russian and Armenian, with Russian as her dominant language,
              from Yerevan, Armenia.
            </p>
            <p>My father was a German speaker.</p>
            <p>School and social environment were in German.</p>

            <p>The language I spoke with my mother was Russian.</p>
            <p>For that reason, Russian holds a central emotional place.</p>
            <p>
              But German is also part of my emotional bond. I speak it with my brother and other
              relatives in Germany.
            </p>

            <p>
              I grew up with two languages that never competed with each other, yet never occupied
              the same space.
            </p>

            <p>
              When my first child was born in Barcelona, in a Spanish and Catalan environment, an
              unexpected internal pressure appeared:
            </p>

            <p>
              <strong>Was it necessary to choose one of the two languages?</strong>
            </p>

            <p>German would have been the logical option.</p>
            <p>It is my academic language.</p>
            <p>It is my dominant language.</p>

            <p>But letting go of one of my languages did not feel right.</p>
            <p>It did not resonate with my identity.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/1p2l-icon.png"
            alt="1P2L Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/1p2l-icon-dark.png"
            alt="1P2L Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* APPROACH */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-8 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-16 text-justify leading-relaxed opacity-90 md:grid-cols-2">
          {/* ESPAÑOL */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">El enfoque 1P2L</h2>

            <p>
              1P2L, One Person Two Languages, documenta cómo transmito mis dos lenguas de herencia a
              mis hijos, aun siendo la única persona que se las habla.
            </p>

            <p>No es OPOL, One Person One Language o One Parent One Language.</p>
            <p>No es una separación entre progenitores.</p>

            <p>Es una organización consciente basada en Time and Place.</p>

            <h3 className="mt-8 text-xl font-semibold">Time</h3>

            <p>Trabajo por bloques:</p>
            <p>Dos semanas en alemán.</p>
            <p>Dos semanas en ruso.</p>

            <p>Durante ese período, esa lengua es la principal en casa conmigo.</p>

            <p>Esto permite:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Profundidad en el input.</li>
              <li>Consistencia temporal.</li>
              <li>Asociación emocional clara.</li>
              <li>Ritmo natural sin alternancia constante.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold">Place</h3>

            <p>El contexto también guía la lengua.</p>
            <p>
              Si estamos en semanas de ruso pero nos reunimos con germanoparlantes, hablo alemán.
            </p>
            <p>
              Si estamos en semanas de alemán y nos encontramos con la comunidad rusoparlante,
              cambio al ruso.
            </p>

            <p>Mis hijos ven que ambas lenguas están vivas.</p>
            <p>No son idiomas de práctica. Son parte real de mi historia y de mi identidad.</p>
          </div>

          {/* ENGLISH */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">The 1P2L Approach</h2>

            <p>
              1P2L, One Person Two Languages, documents how I pass on my two heritage languages to
              my children, even though I am the only person speaking them to them.
            </p>

            <p>It is not OPOL, One Person One Language or One Parent One Language.</p>
            <p>It is not a separation between parents.</p>

            <p>It is a conscious organisation based on Time and Place.</p>

            <h3 className="mt-8 text-xl font-semibold">Time</h3>

            <p>I work in blocks:</p>
            <p>Two weeks in German.</p>
            <p>Two weeks in Russian.</p>

            <p>During that period, that language becomes the primary language at home with me.</p>

            <p>This allows for:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Depth of input.</li>
              <li>Temporal consistency.</li>
              <li>Clear emotional association.</li>
              <li>A natural rhythm without constant switching.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold">Place</h3>

            <p>Context also guides language use.</p>
            <p>If we are in Russian weeks but meet German speakers, I speak German.</p>
            <p>
              If we are in German weeks but meet Russian speaking community members, I switch to
              Russian.
            </p>

            <p>My children see that both languages are alive.</p>
            <p>
              They are not practice languages. They are a real part of my history and my identity.
            </p>
          </div>
        </div>
      </section>

      {/* REAL CHALLENGE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-8 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-16 text-justify leading-relaxed opacity-90 md:grid-cols-2">
          {/* ESPAÑOL */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">El verdadero reto</h2>

            <p>El reto no es que mis hijos aprendan idiomas.</p>
            <p>El entorno ya les ofrece español y catalán.</p>

            <p>El reto es no simplificar la propia identidad por comodidad.</p>

            <p>
              Muchas personas que crecieron bilingües sienten presión al convertirse en madres o
              padres, especialmente cuando la pareja no domina ninguna de las lenguas de herencia.
            </p>

            <p>
              <strong>1P2L nace de esa tensión:</strong>
            </p>

            <p>
              <strong>
                ¿Cómo transmitir dos lenguas cuando el entorno no las sostiene y la pareja tampoco?
              </strong>
            </p>
          </div>

          {/* ENGLISH */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">The Real Challenge</h2>

            <p>The challenge is not whether my children will learn languages.</p>
            <p>The environment already provides Spanish and Catalan.</p>

            <p>The challenge is not simplifying one’s own identity for the sake of convenience.</p>

            <p>
              Many adults who grew up bilingual feel pressure when they become parents, especially
              when their partner does not speak either heritage language.
            </p>

            <p>
              <strong>1P2L emerges from that tension:</strong>
            </p>

            <p>
              <strong>
                How can two languages be transmitted when the environment does not sustain them and
                the partner does not speak them either?
              </strong>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/1p2l-icon.png"
            alt="1P2L Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/1p2l-icon-dark.png"
            alt="1P2L Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-8 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-16 leading-relaxed opacity-90 md:grid-cols-2">
          {/* ESPAÑOL */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">Comunidad 1P2L – Encuentro mensual</h2>

            <p>
              Además del contenido, 1P2L ofrece un encuentro mensual por Zoom para personas que
              viven situaciones similares:
            </p>

            <p>Crecieron con lengua A y lengua B.</p>
            <p>Viven en un entorno de lengua C.</p>
            <p>Su pareja no domina A ni B, o incluso habla una lengua D diferente.</p>

            <p className="mt-6 font-semibold">Un espacio para:</p>

            <ul className="ml-6 list-disc space-y-2">
              <li>Compartir preocupaciones reales.</li>
              <li>Reflexionar sobre identidad y presión interna.</li>
              <li>Intercambiar estrategias prácticas.</li>
              <li>Aprender de las experiencias de otras personas.</li>
              <li>Construir comunidad entre adultos bilingües.</li>
            </ul>

            <p className="mt-6">
              El idioma base de la videollamada será el inglés, ya que probablemente habrá
              combinaciones muy diversas de lenguas y contextos. El inglés funcionará como puente
              común.
            </p>

            <p>No es asesoría individual.</p>
            <p>Es comunidad horizontal.</p>
            <p>También es un espacio para aprender de otras experiencias.</p>
          </div>

          {/* ENGLISH */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-semibold">1P2L Community – Monthly Meeting</h2>

            <p>
              In addition to the content, 1P2L offers a monthly Zoom meeting for people who live in
              similar situations:
            </p>

            <p>They grew up with language A and language B.</p>
            <p>They live in an environment of language C.</p>
            <p>Their partner does not speak A or B, or even speaks a different language D.</p>

            <p className="mt-6 font-semibold">A space to:</p>

            <ul className="ml-6 list-disc space-y-2">
              <li>Share real concerns.</li>
              <li>Reflect on identity and internal pressure.</li>
              <li>Exchange practical strategies.</li>
              <li>Learn from the experiences of others.</li>
              <li>Build community among bilingual adults.</li>
            </ul>

            <p className="mt-6">
              The base language of the meeting will be English, as there will likely be very diverse
              combinations of languages and contexts. English will function as a common bridge.
            </p>

            <p>This is not individual coaching.</p>
            <p>It is a horizontal community space.</p>
            <p>It is also a place to learn from others.</p>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-8 py-20 text-[#F4EFE8]">
        <div className="grid gap-12 text-center md:grid-cols-2 md:text-left">
          {/* SPANISH */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Comunidad 1P2L</h2>

            <p className="opacity-80">
              Si esta experiencia resulta familiar y existe interés en participar en el encuentro
              mensual, se puede escribir directamente para recibir más información.
            </p>
          </div>

          {/* ENGLISH */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1P2L Community</h2>

            <p className="opacity-80">
              If this resonates and there is interest in joining the monthly meeting, feel free to
              reach out for further information.
            </p>
          </div>
        </div>

        {/* SINGLE BUTTON */}
        <div className="mt-12 flex justify-center">
          <a
            href="mailto:1p2l@linguatash.com"
            className="inline-block rounded-xl bg-[#B3475A] px-8 py-3 text-base font-medium transition-transform duration-300 hover:scale-105"
          >
            1p2l@linguatash.com
          </a>
        </div>
      </section>
    </main>
  )
}
