import Link from '../../components/Link'

export default function AlemanYDuPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        {/* Aleman y Du Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/static/images/alemanydu-icon.png"
            alt="Aleman y Du Logo"
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <img
            src="/static/images/alemanydu-icon-dark.png"
            alt="Aleman y Du Dark Logo"
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="font-[400]" style={{ letterSpacing: '-0.05em' }}>
            Alemán
          </span>
          <span className="font-[200] opacity-95">·y·</span>
          <span className="font-[400]" style={{ letterSpacing: '-0.05em' }}>
            Du
          </span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          Extraescolar de alemán · Curso 2026/2027
        </p>

        <p className="mt-4 text-lg text-[#081C3C]/80 md:text-xl dark:text-[#F4EFE8]/80">
          Alemán desde la oralidad y la fonética.
          <br className="hidden md:block" />
          Aprender a comunicarse desde el primer día.
        </p>
      </section>

      {/* ABOUT */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-8 py-16 dark:bg-[#081C3C]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">¿Qué es Alemán·y·Du?</h2>
          </div>

          <p className="leading-relaxed opacity-90">
            Alemán·y·Du es una actividad extraescolar de alemán diseñada para que los alumnos
            empiecen a comunicarse desde el primer día.
          </p>

          <p className="leading-relaxed opacity-90">
            Las clases siguen el enfoque de Deutsch als Fremdsprache (alemán como lengua
            extranjera), con especial atención a la pronunciación, la comprensión auditiva y la
            seguridad al hablar.
          </p>

          <p className="leading-relaxed opacity-90">
            El objetivo es construir una base sólida que permita al alumno avanzar con confianza en
            los próximos años.
          </p>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/alemanydu-icon.png"
            alt="Alemán y Du Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/alemanydu-icon-dark.png"
            alt="Alemán y Du Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* METODOLOGÍA Y EDADES */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-8 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-semibold">Metodología</h2>

            <ul className="ml-6 list-disc space-y-3 leading-relaxed opacity-90">
              <li>Fuerte enfoque en oralidad y fonética</li>
              <li>Trabajo específico de sonidos inexistentes en español o catalán</li>
              <li>Dinámicas activas y participación constante</li>
              <li>Repetición significativa (no mecánica)</li>
              <li>Introducción progresiva de lectura y escritura</li>
            </ul>

            <p className="leading-relaxed opacity-90">
              Los grupos serán reducidos (mínimo 5, máximo 10 alumnos) para asegurar participación
              real y acompañamiento individual.
            </p>
          </div>

          {/* COLUMNA DERECHA */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Edades y niveles</h2>

            <p className="opacity-90">Curso 2026/2027:</p>

            <ul className="mt-4 ml-6 list-disc space-y-2 opacity-90">
              <li>I3, I4, I5: forman un grupo</li>
              <li>Primaria</li>
              <li>ESO (hasta 4º)</li>
            </ul>

            <p className="mt-6 text-justify opacity-90">
              El primer año se ofrecerán únicamente grupos para principiantes.
            </p>

            <p className="mt-6 text-justify opacity-90">
              El objetivo es sentar las bases para que el alumno gane seguridad real al comunicarse
              en alemán y construya una pronunciación clara desde el inicio.{' '}
            </p>
          </div>
        </div>
      </section>

      {/* INFORMACION PRACTICA Y PRECIOS */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Información práctica</h2>

            <ul className="ml-6 list-disc space-y-3 opacity-90">
              <li>1 sesión semanal de 60 minutos</li>
              <li>Grupos de 5 a 10 alumnos</li>
              <li>Inicio: septiembre 2026</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-semibold">Cuotas mensuales</h2>

            <ul className="ml-6 list-disc space-y-3 opacity-90">
              <li>45 € — Alumnos de La Salle Gràcia</li>
              <li>50 € — Alumnos externos</li>
            </ul>

            <p className="mt-4 text-justify opacity-90">
              La actividad comenzará al alcanzarse el número mínimo de alumnos.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/alemanydu-icon.png"
            alt="Alemán y Du Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/alemanydu-icon-dark.png"
            alt="Alemán y Du Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* DaF vs DaH */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <div className="flex flex-col gap-10">
          <h2 className="text-2xl font-semibold">Dos enfoques lingüísticos diferentes</h2>

          <p className="leading-relaxed opacity-90">
            No todos los niños aprenden alemán desde el mismo punto de partida. Por eso existen dos
            enfoques pedagógicos distintos: Deutsch als Fremdsprache (DaF) y Deutsch als
            Herkunftssprache (DaH).
          </p>

          <div className="grid gap-12 md:grid-cols-2">
            {/* ALEMÁN·Y·DU */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Alemán·y·Du — Enfoque DaF</h3>

              <p className="leading-relaxed opacity-90">
                DaF significa “Deutsch als Fremdsprache” (alemán como lengua extranjera). Está
                pensado para niños que no tienen el alemán en casa y comienzan desde cero.
              </p>

              <p className="mt-4 leading-relaxed opacity-90">
                El aprendizaje se desarrolla en un contexto académico estructurado, donde se
                construyen progresivamente:
              </p>

              <ul className="mt-4 ml-6 list-disc space-y-2 opacity-90">
                <li>Inicio desde nivel principiante</li>
                <li>Trabajo sistemático de fonética y comprensión</li>
                <li>Construcción progresiva de base gramatical</li>
                <li>Desarrollo comunicativo paso a paso</li>
              </ul>
            </div>

            {/* NORDKREIS */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                <Link href="/nordkreis" className="hover:underline">
                  Nordkreis
                </Link>{' '}
                — Enfoque DaH
              </h3>

              <p className="leading-relaxed opacity-90">
                DaH significa “Deutsch als Herkunftssprache” (alemán como lengua de herencia). Está
                dirigido a niños que ya crecen con alemán en casa o han vivido sus primeros años en
                Alemania.
              </p>

              <p className="mt-4 leading-relaxed opacity-90">
                En este caso, el alemán no se aprende desde cero, sino que se fortalece y se
                desarrolla a nivel académico:
              </p>

              <ul className="mt-4 ml-6 list-disc space-y-2 opacity-90">
                <li>Consolidación de lengua familiar</li>
                <li>Desarrollo avanzado de lectura y escritura</li>
                <li>Ampliación de vocabulario académico</li>
                <li>Trabajo consciente sobre interferencias del español y/o catalán</li>
              </ul>
            </div>
          </div>

          <div className="leading-relaxed opacity-90">
            <p>
              Ambos proyectos responden a realidades lingüísticas diferentes. La recomendación
              depende del perfil del alumno.
            </p>

            <p className="mt-4">
              Si un alumno con alemán en casa, por cuestiones de horario o disponibilidad, prefiere
              asistir a Alemán·y·Du, podrá hacerlo. Sin embargo, el proyecto Nordkreis está
              concebido exclusivamente para niños que ya tienen el alemán como lengua familiar.
            </p>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 text-center dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Ubicación</h2>

        <p className="opacity-90">
          Escuela La Salle Gràcia
          <br />
          Plaça del Nord 14
          <br />
          08024 Barcelona
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-20 text-center text-[#F4EFE8]">
        <h2 className="mb-6 text-2xl font-semibold">Contacto</h2>

        <a
          href="mailto:alemanydu@linguatash.com"
          className="mt-6 w-fit max-w-full truncate overflow-hidden rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium whitespace-nowrap transition-transform duration-300 hover:scale-105 sm:text-sm"
        >
          alemanydu@linguatash.com
        </a>
      </section>
    </main>
  )
}
