import Image from 'next/image'
import { Metadata } from 'next'
import AudioStats from '@/components/alemanydu/AudioStats'
import AudioTrackCard from '@/components/alemanydu/AudioTrackCard'
import ReproducirTodo from '@/components/alemanydu/ReproducirTodo'
import { audioUrl, clases } from '@/data/alemanydu-audios'

export const metadata: Metadata = {
  title: 'Audios · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

const porClase = (a: { clase: number }, b: { clase: number }) => a.clase - b.clase
const porClaseDesc = (a: { clase: number }, b: { clase: number }) => b.clase - a.clase

export default function AlemanYDuAudiosPage() {
  // Newest class on top, because that is the one a parent came for. The pending
  // ones then ascend, so the block below reads as what is still coming.
  const disponibles = clases.filter((c) => c.disponible).sort(porClaseDesc)
  const pendientes = clases.filter((c) => !c.disponible).sort(porClase)

  // Narrowed on purpose: this crosses into a client component.
  const cola = clases
    .filter((c) => c.disponible && c.archivo)
    .sort(porClase)
    .map((c) => ({ clase: c.clase, titulo: c.titulo, src: audioUrl(c.archivo) }))

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      <AudioStats />

      {/* CABECERA */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-14 sm:px-8 dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/alemanydu-icon.png"
            alt="Aleman y Du Logo"
            width={112}
            height={112}
            className="block h-20 w-auto md:h-24 dark:hidden"
          />
          <Image
            src="/static/images/alemanydu-icon-dark.png"
            alt="Aleman y Du Dark Logo"
            width={112}
            height={112}
            className="hidden h-20 w-auto md:h-24 dark:block"
          />
        </div>

        <h1 className="text-center text-4xl font-[400] md:text-5xl">Audios</h1>

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Aquí están todos los audios del curso. Se pueden escuchar directamente o descargar para
            el coche.
          </p>
          <p>Cada clase tiene su audio con lo que hicimos ese lunes. Dura unos minutos.</p>
          <p>
            Si esa semana aprendimos una canción, la canción va dentro del mismo audio. No hay pista
            de canciones aparte.
          </p>
          <p>No hace falta prestar atención. Con que suene de fondo alcanza.</p>
          <p>
            Son solo mi voz, en alemán. No hay traducción ni texto, y es a propósito. Si tu hijo o
            hija escucha y no entiende todo, está haciendo justo lo que tiene que hacer. Si
            necesitas algo por escrito, escríbeme.
          </p>
        </div>
      </section>

      {/* REPRODUCIR TODO */}
      {cola.length > 0 ? (
        <section>
          <ReproducirTodo pistas={cola} />
        </section>
      ) : null}

      {/* LAS CLASES */}
      <section>
        <h2 className="text-2xl font-semibold">Las clases</h2>

        <div className="mt-6 space-y-6">
          {[...disponibles, ...pendientes].map((c) => (
            <AudioTrackCard
              key={c.clase}
              clase={c.clase}
              fecha={c.fecha}
              titulo={c.titulo}
              resumen={c.resumen}
              archivo={c.archivo}
              duracion={c.duracion}
              disponible={c.disponible}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
