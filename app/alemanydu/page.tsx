import Image from 'next/image'
import Link from '../../components/Link'

export default function AlemanYDuPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        {/* Aleman y Du Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/alemanydu-icon.png"
            alt="Aleman y Du Logo"
            width={112}
            height={112}
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <Image
            src="/static/images/alemanydu-icon-dark.png"
            alt="Aleman y Du Dark Logo"
            width={112}
            height={112}
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
          <Image
            src="/static/images/alemanydu-icon.png"
            alt="Alemán y Du Logo"
            width={32}
            height={32}
            className="block h-8 w-auto dark:hidden"
          />
          <Image
            src="/static/images/alemanydu-icon-dark.png"
            alt="Alemán y Du Dark Logo"
            width={32}
            height={32}
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
              <li>
                Día y horario: <strong>por confirmar</strong>
              </li>
            </ul>

            <p className="mt-6 leading-relaxed opacity-90">
              Todavía no tenemos confirmado el horario. Si te interesa, escríbeme por WhatsApp
              indicando qué días y horarios te vendrían mejor y en qué curso está tu hijo o hija. No
              puedo garantizar que coincida con tu disponibilidad, pero nos ayuda mucho a coordinar
              el horario con el colegio.
            </p>

            <a
              href="https://wa.me/34602656578"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Escribir por WhatsApp
            </a>
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
          <Image
            src="/static/images/alemanydu-icon.png"
            alt="Alemán y Du Logo"
            width={32}
            height={32}
            className="block h-8 w-auto dark:hidden"
          />
          <Image
            src="/static/images/alemanydu-icon-dark.png"
            alt="Alemán y Du Dark Logo"
            width={32}
            height={32}
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
        <a
          href="https://maps.google.com/?q=La+Salle+Gràcia,+Plaça+del+Nord+14,+08024+Barcelona"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-[#B3475A] underline underline-offset-4 transition-colors hover:text-[#9f3f50]"
        >
          Ver en Google Maps →
        </a>
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
