import Link from '@/components/Link'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-24 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* First Quote */}
      <section className="py-20 text-center">
        <p className="font-[Caveat] text-3xl leading-relaxed md:text-4xl">
          "Una lengua se construye primero en el oído y en la voz. Leer y escribir solo tiene
          sentido cuando el idioma ya se siente natural."
        </p>
      </section>

      {/* Intro */}
      <section className="space-y-6 text-center md:text-left">
        <p className="text-lg opacity-80">
          LinguaTash es el espacio donde convergen mi trabajo y mi experiencia en adquisición del
          lenguaje. A través de distintos proyectos, exploro cómo se adquieren las lenguas de forma
          natural — en la infancia, en la edad adulta y a través del juego.
        </p>

        <p className="text-lg opacity-80">
          De esta base nacen cuatro proyectos complementarios: <strong>Fonetikas</strong> –{' '}
          <strong>Nordkreis</strong> – <strong>Alemán·y·Du</strong> – <strong>Resuena</strong>
        </p>

        <p className="text-lg opacity-80">
          Todos parten del mismo principio: la lengua se adquiere primero en el oído y en la voz; la
          lectura y la escritura vienen después.
        </p>
      </section>

      {/* Second Quote */}
      <section className="py-20 text-center">
        <p className="font-[Caveat] text-3xl leading-relaxed md:text-4xl">
          "La capacidad de adquirir lenguas no se pierde con la edad. Lo que a menudo falta es un
          enfoque adecuado, basado en la lengua materna del aprendiz."
        </p>
      </section>

      {/* Mis Propuestas */}
      <section className="space-y-16">
        <h2 className="text-center text-3xl font-semibold">Mis propuestas</h2>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Fonetikas */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]">
            <div>
              <h3 className="text-xl font-semibold">Fonetikas</h3>
              <p className="mt-4 opacity-90">
                Adultos hispanohablantes: aprendizaje de alemán desde cero o reconstrucción de la
                base oral, basado en fonética y contrastes con el español.
              </p>
            </div>
            <Link
              href="/fonetikas"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition-transform duration-300 hover:scale-105"
            >
              Descubrir Fonetikas
            </Link>
          </div>

          {/* Nordkreis */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-8 dark:bg-[#081C3C]">
            <div>
              <h3 className="text-xl font-semibold">Nordkreis</h3>
              <p className="mt-4 opacity-90">
                Niños de familias germanohablantes en Barcelona: escuela de alemán los sábados,
                centrada en el desarrollo natural del idioma.
              </p>
            </div>
            <Link
              href="/nordkreis"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition-transform duration-300 hover:scale-105"
            >
              Conocer Nordkreis
            </Link>
          </div>

          {/* Alemán y Du */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]">
            <div>
              <h3 className="text-xl font-semibold">Alemán·y·Du</h3>
              <p className="mt-4 opacity-90">
                Programa de alemán extraescolar centrado en la fonética y la expresión oral (I3–4º
                ESO).
              </p>
            </div>
            <Link
              href="/alemanydu"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition-transform duration-300 hover:scale-105"
            >
              Descubrir Alemán·y·Du
            </Link>
          </div>

          {/* Resuena */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] p-8 dark:bg-[#081C3C]">
            <div>
              <h3 className="text-xl font-semibold">Resuena</h3>
              <p className="mt-4 opacity-90">
                Familias, adultos y niños: juego de mesa para adquirir vocabulario en varias lenguas
                a través de la fonética, sin lectura de palabras.
              </p>
            </div>
            <Link
              href="/resuena"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition-transform duration-300 hover:scale-105"
            >
              Ver Resuena
            </Link>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-20 text-center">
        <p className="font-[Caveat] text-3xl leading-relaxed md:text-4xl">
          "El idioma se adquiere primero en el oído y en la voz; la lectura y la escritura llegan
          después."
        </p>
      </section>
    </main>
  )
}
