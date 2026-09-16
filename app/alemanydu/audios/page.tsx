import Image from 'next/image'
import { Metadata } from 'next'
import AudioTrackCard from '@/components/alemanydu/AudioTrackCard'
import LiederCard from '@/components/alemanydu/LiederCard'
import { clases, lieder } from '@/data/alemanydu-audios'

export const metadata: Metadata = {
  title: 'Audios · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

const masRecienteFirst = (a: { clase: number }, b: { clase: number }) => b.clase - a.clase

export default function AlemanYDuAudiosPage() {
  const disponibles = clases.filter((c) => c.disponible).sort(masRecienteFirst)
  const pendientes = clases.filter((c) => !c.disponible).sort(masRecienteFirst)

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
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
          <p>Hay tres tipos de audio.</p>
          <p>
            La pista de la semana dura poco más de un minuto y trae lo que hicimos ese lunes en
            clase.
          </p>
          <p>
            Todo hasta ahora junta el contenido de todas las clases desde el principio, en orden.
            Crece cada semana. En junio va a durar unos veinte minutos, que es justo un trayecto en
            coche.
          </p>
          <p>
            Canciones es una pista aparte con todas las canciones del curso. No están incluidas en
            Todo hasta ahora, para que esa pista no se haga eterna.
          </p>
          <p>No hace falta escuchar las tres. Con una alcanza.</p>
        </div>
      </section>

      {/* CANCIONES */}
      <section>
        <LiederCard
          archivo={lieder.archivo}
          duracion={lieder.duracion}
          actualizado={lieder.actualizado}
          resumen={lieder.resumen}
          canciones={lieder.canciones}
          disponible={lieder.disponible}
        />
      </section>

      {/* LAS CLASES */}
      <section>
        <h2 className="text-2xl font-semibold">Las clases</h2>

        {disponibles.length === 0 ? (
          <p className="mt-6 leading-relaxed opacity-90">El primer audio llega esta semana.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {disponibles.map((c) => (
              <AudioTrackCard
                key={c.clase}
                clase={c.clase}
                fecha={c.fecha}
                titulo={c.titulo}
                resumen={c.resumen}
                neu={c.neu}
                neuDuracion={c.neuDuracion}
                alles={c.alles}
                allesDuracion={c.allesDuracion}
                disponible={c.disponible}
              />
            ))}
          </div>
        )}

        {pendientes.length > 0 ? (
          <div className="mt-6 space-y-6">
            {pendientes.map((c) => (
              <AudioTrackCard
                key={c.clase}
                clase={c.clase}
                fecha={c.fecha}
                titulo={c.titulo}
                resumen={c.resumen}
                neu={c.neu}
                neuDuracion={c.neuDuracion}
                alles={c.alles}
                allesDuracion={c.allesDuracion}
                disponible={c.disponible}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* NOTA FINAL */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-10 sm:px-8 dark:bg-[#081C3C]">
        <div className="space-y-5 leading-relaxed opacity-90">
          <p>
            Los audios son solo mi voz, en alemán. No hay traducción y es a propósito. Si tu hijo o
            hija escucha y no entiende todo, está haciendo exactamente lo que tiene que hacer.
          </p>
          <p>
            Tampoco llevan transcripción ni subtítulos, por la misma razón: ver la palabra escrita
            cambia la forma de pronunciarla. Si necesitas una versión escrita por cualquier motivo,
            escríbeme y te la paso.
          </p>
        </div>
      </section>
    </main>
  )
}
