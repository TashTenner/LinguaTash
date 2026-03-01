export default function AvisoLegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 font-['Noto_Sans'] text-gray-900 dark:text-gray-100">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Aviso Legal / Impressum</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Última actualización: 28.02.2026
        </p>
      </header>

      <article className="space-y-8 text-base leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            1. Información del titular
          </h2>
          <p>Conforme a la legislación española y europea, se facilita la siguiente información:</p>
          <p>
            Titular: Tash Tenner
            <br />
            Dirección: Barcelona, España
            <br />
            Correo electrónico: info@linguatash.com
            <br />
            NIF/CIF:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            2. Propiedad intelectual
          </h2>
          <p>
            Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos y diseño, es
            propiedad de LinguaTash y está protegido por la legislación española e internacional
            sobre propiedad intelectual.
          </p>
          <p>
            Se permite el uso personal y no comercial, citando la fuente. Cualquier otro uso
            requiere autorización expresa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            3. Responsabilidad
          </h2>
          <p>
            LinguaTash se esfuerza por mantener la información actualizada y correcta, pero no se
            hace responsable de errores, interrupciones, o contenidos externos enlazados desde el
            sitio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            4. Protección de datos
          </h2>
          <p>
            Todos los datos personales se gestionan conforme a la Política de Privacidad publicada
            en este sitio web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            5. Legislación aplicable
          </h2>
          <p>
            La relación entre LinguaTash y los usuarios se rige por la legislación española.
            Cualquier disputa será sometida a los tribunales competentes de España.
          </p>
        </section>
      </article>
    </main>
  )
}
