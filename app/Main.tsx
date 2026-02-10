import Link from '@/components/Link'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
      {/* First Quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold md:text-3xl">
          "Una lengua se construye primero en el oído y en la voz. Leer y escribir solo tiene
          sentido cuando el idioma ya se siente natural."
        </blockquote>
      </section>

      {/* Intro / LinguaTash projects */}
      <section className="space-y-6">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          LinguaTash es el espacio donde convergen mi trabajo y mi experiencia en adquisición del
          lenguaje. A través de distintos proyectos, exploro cómo se adquieren las lenguas de forma
          natural — en la infancia, en la edad adulta y a través del juego.
        </p>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          De esta base nacen tres proyectos complementarios:
        </p>

        <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Fonetikas</strong> – adquisición del alemán para adultos hispanohablantes a
            partir de la fonética y la oralidad
          </li>
          <li>
            <strong>Sprachwege</strong> – escuela de alemán de los sábados para familias
            germanohablantes en Barcelona
          </li>
          <li>
            <strong>¡Salten!</strong> – un juego de mesa para adquirir vocabulario en distintas
            lenguas mediante la fonética, sin lectura
          </li>
        </ul>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Todos parten del mismo principio: la lengua se adquiere primero en el oído y en la voz; la
          lectura y la escritura vienen después.
        </p>
      </section>

      {/* Second Quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold md:text-3xl">
          "La capacidad de adquirir lenguas no se pierde con la edad. Lo que a menudo falta es un
          enfoque adecuado, basado en la lengua materna del aprendiz."
        </blockquote>
      </section>

      {/* Mis Propuestas / Offers */}
      <section className="space-y-12">
        <h2 className="text-center text-3xl font-bold">Mis propuestas</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Fonetikas */}
          <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-gray-200 bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
            <div>
              <h3 className="text-xl font-semibold">Fonetikas</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Adultos hispanohablantes: aprendizaje de alemán desde cero o reconstrucción de la
                base oral, basado en fonética y contrastes con el español.
              </p>
            </div>
            <Link
              href="/fonetikas"
              className="bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 mt-4 inline-block rounded-lg px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Descubrir Fonetikas
            </Link>
          </div>

          {/* Sprachwege */}
          <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-gray-200 bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
            <div>
              <h3 className="text-xl font-semibold">Sprachwege</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Niños de familias germanohablantes en Barcelona: escuela de alemán los sábados,
                centrada en el desarrollo natural del idioma.
              </p>
            </div>
            <Link
              href="/sprachwege"
              className="bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 mt-4 inline-block rounded-lg px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Conocer Sprachwege
            </Link>
          </div>

          {/* ¡Salten! */}
          <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-gray-200 bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
            <div>
              <h3 className="text-xl font-semibold">¡Salten!</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Familias, adultos y niños: juego de mesa para adquirir vocabulario en varias lenguas
                a través de la fonética, sin lectura de palabras.
              </p>
            </div>
            <Link
              href="/salten"
              className="bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-500 mt-4 inline-block rounded-lg px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Ver ¡Salten!
            </Link>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold md:text-3xl">
          "El idioma se adquiere primero en el oído y en la voz; la lectura y la escritura llegan
          después."
        </blockquote>
      </section>
    </main>
  )
}
