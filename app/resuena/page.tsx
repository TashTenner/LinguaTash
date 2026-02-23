export default function ResuenaPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        {/* Resuena Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/static/images/resuena-icon.png"
            alt="Resuena Logo"
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <img
            src="/static/images/resuena-icon-dark.png"
            alt="Resuena Dark Logo"
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="font-[400]" style={{ letterSpacing: '-0.05em' }}>
            Re
          </span>
          <span className="font-[200] opacity-95">suena</span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          Aprender idiomas también puede ser un juego.
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          Juegos digitales y audiolibros diseñados para fortalecer el alemán y el español,
          especialmente en contextos bilingües.
        </p>

        <div className="mt-10 inline-block rounded-xl border border-[#B3475A] px-6 py-2 text-sm font-medium text-[#B3475A] opacity-80">
          Próximamente disponible
        </div>
      </section>

      {/* VISIÓN */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Qué es Resuena?</h2>

        <p className="leading-relaxed opacity-90">
          Resuena es un proyecto digital dentro de LinguaTash que nace de una idea sencilla: la
          lengua no se memoriza, se experimenta.
        </p>

        <p className="leading-relaxed opacity-90">
          Aquí estoy desarrollando juegos fonéticos y audiolibros que permiten practicar
          vocabulario, comprensión y sensibilidad lingüística de manera intuitiva.
        </p>

        <p className="leading-relaxed opacity-90">
          El enfoque está especialmente pensado para bilingües alemán-español, independientemente de
          cuál sea la lengua dominante y cuál la lengua de herencia.
        </p>
      </section>

      {/* PROYECTOS EN DESARROLLO */}
      <section className="space-y-10">
        <h2 className="text-2xl font-semibold">Proyectos en desarrollo</h2>

        <div className="space-y-8">
          {/* ¡Salten! */}
          <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold">¡Salten!</h3>
              <span className="rounded-full bg-[#B3475A]/10 px-3 py-1 text-sm text-[#B3475A]">
                En desarrollo
              </span>
            </div>

            <p className="mt-4 leading-relaxed opacity-90">
              Un juego de palabras innovador que te ayuda a aprender vocabulario en distintos
              idiomas únicamente a través de la fonética. Saltar de palabra en palabra será tu nueva
              manera de entrenar el oído y la memoria lingüística.
            </p>

            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Ideal para entrenar el oído, reforzar vocabulario y desarrollar conciencia fonológica
              en contextos bilingües.
            </p>
          </div>

          {/* Der Sommerweihnachtsmann */}
          <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3
                className="tag text-xl font-semibold break-words"
                style={{ fontSize: 'calc(1rem + 0.5vw)' }}
              >
                Der Sommerweihnachtsmann
              </h3>

              <span className="rounded-full bg-[#B3475A]/10 px-3 py-1 text-sm text-[#B3475A]">
                En desarrollo
              </span>
            </div>

            <p className="mt-4 leading-relaxed opacity-90">
              Un audiolibro en alemán diseñado para niños y jóvenes bilingües. Combina historia,
              ritmo narrativo y exposición lingüística natural.
            </p>

            <p className="mt-4 text-sm leading-relaxed opacity-80">
              El objetivo es fortalecer la comprensión auditiva y la conexión emocional con la
              lengua alemana.
            </p>
          </div>
        </div>
      </section>

      {/* ESTADO ACTUAL */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">En qué estamos trabajando ahora</h2>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>Desarrollo conceptual y pruebas de mecánicas para ¡Salten!</li>
          <li>Guion y estructura narrativa del audiolibro</li>
          <li>Diseño de identidad visual y logotipo de Resuena</li>
          <li>Definición del formato de descarga y experiencia de usuario</li>
        </ul>

        <p className="text-sm leading-relaxed opacity-80">
          Las descargas aún no están disponibles. Esta página irá evolucionando conforme los
          proyectos avancen.
        </p>
      </section>

      {/* CONTACTO */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-16 text-center text-[#F4EFE8]">
        <h2 className="mb-6 text-2xl font-semibold">Contacto</h2>

        <p className="mb-6 opacity-80">
          Si quieres recibir noticias cuando los proyectos estén listos, puedes escribirme
          directamente.
        </p>

        <a
          href="mailto:resuena@linguatash.com"
          className="mt-6 w-fit max-w-full truncate overflow-hidden rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium whitespace-nowrap transition-transform duration-300 hover:scale-105 sm:text-sm"
        >
          resuena@linguatash.com
        </a>
      </section>
    </main>
  )
}
