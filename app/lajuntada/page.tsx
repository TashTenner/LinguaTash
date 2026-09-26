import Image from 'next/image'
import { genPageMetadata } from 'app/seo'
import { fechasLaJuntada } from '@/content/lajuntada/fechas'
import FaqAccordion from '@/components/lajuntada/FaqAccordion'

export const metadata = genPageMetadata({
  title: 'La Juntada',
  description:
    'Encuentro mensual en Barcelona para familias argentinas y uruguayas con hijos. Un domingo al mes, cultura argentina compartida entre padres e hijos.',
})

// Las fechas pasadas se marcan solas. Sin esto la pagina se generaria una sola vez
// y "Pasada" se quedaria congelada en la fecha del build.
export const revalidate = 86400

// El mismo número que ya usan el header, el footer y las páginas de Alemán·y·Du.
const WHATSAPP_LA_JUNTADA =
  'https://wa.me/34644886723?text=' +
  encodeURIComponent('Hola Tash, me interesa La Juntada. ¿Me contás cómo reservar?')

const PRECIOS_PUBLICADOS = true
const PRECIO_UN_PROGENITOR = 30
const PRECIO_DOS_PROGENITORES = 35
const PRECIO_ADULTO_ADICIONAL = 10

const UBICACION_PUBLICADA = true

export default function LaJuntadaPage() {
  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/laJuntada-icon.png"
            alt="La Juntada Logo"
            width={112}
            height={112}
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <Image
            src="/static/images/laJuntada-icon-dark.png"
            alt="La Juntada Dark Logo"
            width={112}
            height={112}
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="font-[Caveat] text-6xl text-[#081C3C] md:text-7xl dark:text-[#F4EFE8]">
          La Juntada
        </h1>

        <p className="mt-6 text-xl text-[#9A8F85] md:text-2xl">
          Tarde familiar argentina, un domingo al mes
        </p>

        <p className="mt-6 font-[Caveat] text-3xl text-[#B3475A]">
          Para que tus hijos te escuchen en argentino
        </p>

        <p className="mx-auto mt-8 max-w-2xl leading-relaxed opacity-80">
          Estamos armando la primera juntada para el domingo 18 de octubre, en La Salle Gràcia.
          Somos entre 10 y 15 familias. Escribinos y te avisamos en cuanto abran las reservas.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP_LA_JUNTADA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-[#B3475A] px-8 py-3 text-base font-medium text-white transition-transform duration-300 hover:scale-105"
          >
            Escribinos por WhatsApp
          </a>
          <a
            href="#fechas"
            className="inline-block rounded-xl border border-[#9A8F85]/60 px-8 py-3 text-base font-medium transition-transform duration-300 hover:scale-105"
          >
            Ver las fechas
          </a>
        </div>
      </section>

      {/* QUÉ ES LA JUNTADA */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Qué es La Juntada</h2>

        <div className="space-y-4 text-justify leading-relaxed opacity-90">
          <p>En Barcelona tus hijos van a hablar español. Eso no está en riesgo.</p>

          <p>
            Lo que se pierde es otra cosa. El voseo, la tonada, las palabras, las canciones que vos
            escuchabas de chico. Llega un día en que le hablás en tu voz y te contesta en otra. No
            es que no te entienda. Es que ya no suena tuyo.
          </p>

          <p>
            La Juntada es un encuentro mensual para familias argentinas y uruguayas que viven en
            Barcelona. Un domingo al mes nos juntamos dos horas: los chicos con sus padres, con
            otros chicos y con otros adultos que hablan como ellos.
          </p>

          <p>
            No es una clase. No es una guardería. Es una tarde argentina, con la gente que la habla.
          </p>
        </div>
      </section>

      {/* PARA QUIÉN ES */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Para quién es</h2>

        <div className="space-y-4 text-justify leading-relaxed opacity-90">
          <p>
            La Juntada es para familias donde al menos uno de los progenitores habla el castellano
            de Argentina o Uruguay como lengua propia y se la habla a sus hijos.
          </p>

          <p>
            De Buenos Aires, de Salta, de Córdoba, de la Patagonia o de Montevideo. Todas las
            tonadas entran. El criterio es la lengua y no el pasaporte.
          </p>

          <p>
            El progenitor que habla la lengua viene siempre. El otro progenitor puede venir si
            quiere.
          </p>

          <p>Pensada para chicos de 3 a 8 años. Los hermanos de cualquier edad son bienvenidos.</p>

          <p>
            La lengua de la tarde es el castellano de Argentina y Uruguay, con todas sus tonadas.
          </p>
        </div>
      </section>

      {/* QUIÉN ESTÁ DETRÁS */}
      <section className="rounded-2xl border border-l-4 border-[#9A8F85]/40 border-l-[#B3475A] bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Quién está detrás</h2>

        <div className="space-y-4 text-justify leading-relaxed opacity-90">
          <p>
            No soy argentina. Mi pareja sí, y nuestros hijos son mitad argentinos y mitad alemanes.
          </p>

          <p>
            Soy alemana y crío a mis hijos lejos de donde crecí. Sé lo que es querer que hereden
            algo que no está en la calle donde viven: una lengua, unas canciones, una forma de decir
            las cosas. En casa nos pasa en dos idiomas a la vez.
          </p>

          <p>
            Por eso La Juntada no es una actividad que se me ocurrió organizar. Es la tarde que
            queríamos tener.
          </p>

          <p>Del tango, además, soy entusiasta desde mucho antes de todo esto.</p>
        </div>
      </section>

      {/* CÓMO ES UNA TARDE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="mb-8 text-2xl font-semibold">Cómo es una tarde</h2>

        <div className="space-y-6">
          {[
            [
              '15h',
              'Llegada, merienda y mate. Cada adulto trae su mate y su bombilla, nosotros ponemos los termos y la yerba.',
            ],
            ['15h30', 'La actividad del día, una hora, con un invitado o coordinada por nosotros.'],
            ['16h30', 'Ronda de cierre, todos juntos.'],
            ['17h', 'Nos despedimos.'],
          ].map(([hora, texto]) => (
            <div key={hora} className="flex gap-4">
              <div className="w-16 shrink-0 font-semibold text-[#B3475A]">{hora}</div>
              <div className="opacity-90">{texto}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LAS FECHAS */}
      <section id="fechas" className="scroll-mt-20 space-y-8">
        <h2 className="text-2xl font-semibold">Las fechas</h2>

        <div className="overflow-x-auto rounded-xl border border-[#9A8F85]/30">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#9A8F85]/30 opacity-70">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Tema</th>
                <th className="px-4 py-3 font-medium">Fecha argentina</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9A8F85]/15">
              {fechasLaJuntada.map((f) => {
                const pasada = f.iso < hoy
                return (
                  <tr key={f.iso} className={pasada ? 'opacity-50' : undefined}>
                    <td className="px-4 py-4 font-medium whitespace-nowrap">{f.fecha}</td>
                    <td className="px-4 py-4 opacity-90">{f.tema}</td>
                    <td className="px-4 py-4 opacity-90">
                      {f.fechaArgentina ?? <span className="opacity-40">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className="inline-block rounded-full bg-[#9A8F85]/15 px-3 py-1 text-xs font-medium text-[#9A8F85]">
                          {pasada
                            ? 'Pasada'
                            : f.estado === 'confirmada'
                              ? 'Confirmada'
                              : 'Prevista'}
                        </span>
                        {!pasada && f.stripeUrl && (
                          <a
                            href={f.stripeUrl}
                            className="text-xs font-medium text-[#B3475A] underline underline-offset-4 hover:text-[#9f3f50]"
                          >
                            Reservar →
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="text-sm opacity-70">
          Todas las juntadas son de 15h a 17h. Las fechas previstas se confirman con antelación. Los
          temas son una intención y pueden cambiar: la chacarera, el locro o los juegos de patio
          dependen de quién nos acompañe ese día.
        </p>
      </section>

      {/* PRECIO */}
      {PRECIOS_PUBLICADOS && (
        <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
          <h2 className="mb-6 text-2xl font-semibold">Precio</h2>

          <ul className="ml-6 list-disc space-y-2 opacity-90">
            <li>Un progenitor con sus hijos: {PRECIO_UN_PROGENITOR} euros por familia</li>
            <li>Los dos progenitores con sus hijos: {PRECIO_DOS_PROGENITORES} euros por familia</li>
            <li>
              Cada adulto adicional de la familia, una abuela o un abuelo por ejemplo:{' '}
              {PRECIO_ADULTO_ADICIONAL} euros
            </li>
          </ul>

          <p className="mt-4 text-justify leading-relaxed opacity-90">
            Incluye la actividad, la merienda de los chicos y una bebida para cada adulto.
          </p>

          <p className="mt-4 text-justify leading-relaxed opacity-90">
            Cupo de 10 a 15 familias. Si no llegamos al mínimo, la juntada se pospone y se devuelve
            el importe.
          </p>

          <p className="mt-4 text-justify leading-relaxed opacity-90">
            Cancelaciones hasta cinco días antes: se devuelve el importe. Después de ese plazo no se
            hacen devoluciones.
          </p>
        </section>
      )}

      {/* DÓNDE */}
      {UBICACION_PUBLICADA && (
        <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 text-center dark:bg-[#081C3C]">
          <h2 className="mb-6 text-2xl font-semibold">Dónde</h2>

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
      )}

      {/* ME INTERESA */}
      <section className="rounded-2xl border border-l-4 border-[#9A8F85]/40 border-l-[#B3475A] bg-[#F4EFE8] px-6 py-12 text-center dark:bg-[#081C3C]">
        <h2 className="mb-4 text-2xl font-semibold">Me interesa</h2>

        <p className="mx-auto max-w-2xl leading-relaxed opacity-90">
          Las reservas todavía no están abiertas. Escribinos y te avisamos antes que a nadie, o
          contanos cualquier duda: cuántos son en tu familia, qué edades tienen los chicos, si viene
          alguien más.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={WHATSAPP_LA_JUNTADA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-[#B3475A] px-8 py-3 text-base font-medium text-white transition-transform duration-300 hover:scale-105"
          >
            Escribinos por WhatsApp
          </a>
        </div>

        <p className="mt-6 text-sm opacity-70">
          También podés escribirnos a lajuntada@linguatash.com
        </p>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
        <FaqAccordion />
      </section>
    </main>
  )
}
