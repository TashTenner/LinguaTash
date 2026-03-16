'use client'

import Link from 'next/link'

export default function GraciasPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 px-4 py-20 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* Success Section */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-8 py-16 text-center dark:bg-[#081C3C]">
        <div className="mb-6 text-5xl">✓</div>

        <h1 className="text-4xl font-semibold">¡Gracias por tu compra!</h1>

        <p className="mt-6 text-lg opacity-80">Tu pago ha sido completado exitosamente.</p>

        <p className="mt-4 leading-relaxed opacity-80">
          Hemos enviado un email con tus enlaces de descarga a tu bandeja de entrada.
          <br />
          <span className="text-sm">
            Recibirás el email en unos minutos. Si no aparece en 10 minutos, revisa tu carpeta de
            spam.
          </span>
          <br />
          <span className="text-sm">
            Los enlaces son válidos durante <strong>24 horas</strong>.
          </span>
        </p>
      </section>

      {/* What to do next */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Próximos pasos</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-4 rounded-xl border border-[#9A8F85]/30 p-4">
            <span className="text-2xl font-semibold text-[#B3475A]">1</span>
            <div>
              <p className="font-medium">Revisa tu email</p>
              <p className="text-sm opacity-70">
                Busca el email de Resuena con el asunto "Salten — Tus archivos de descarga"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-[#9A8F85]/30 p-4">
            <span className="text-2xl font-semibold text-[#B3475A]">2</span>
            <div>
              <p className="font-medium">Descarga los archivos</p>
              <p className="text-sm opacity-70">
                Haz clic en el botón "Descargar" para cada idioma
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-[#9A8F85]/30 p-4">
            <span className="text-2xl font-semibold text-[#B3475A]">3</span>
            <div>
              <p className="font-medium">¡Comienza a jugar!</p>
              <p className="text-sm opacity-70">
                Descomprime los archivos, imprime y recorta las cartas, y disfruta aprendiendo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-8 py-8 text-center text-[#F4EFE8]">
        <h2 className="text-xl font-semibold">¿Tienes problemas?</h2>
        <p className="mt-4 opacity-80">
          Si no recibes el email o los enlaces expiran, contáctanos:
        </p>
        <a
          href="mailto:resuena@linguatash.com"
          className="mt-6 inline-block rounded-xl bg-[#B3475A] px-6 py-3 font-medium transition hover:scale-105"
        >
          resuena@linguatash.com
        </a>
      </section>

      {/* Back button */}
      <div className="text-center">
        <Link href="/resuena/salten" className="text-[#B3475A] hover:underline">
          ← Volver a Salten
        </Link>
      </div>
    </main>
  )
}
