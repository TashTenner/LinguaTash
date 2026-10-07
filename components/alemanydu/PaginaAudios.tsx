import Image from 'next/image'
import { audioUrl, clases } from '@/data/alemanydu-audios'
import { clasesDadas, type Grupo } from '@/data/alemanydu-grupos'
import AudioStats from './AudioStats'
import AudioTrackCard from './AudioTrackCard'
import { formatFecha } from './format'
import ReproducirTodo from './ReproducirTodo'

/**
 * La página de audios de un grupo.
 *
 * Un grupo solo ve las clases que ya dio. Dos grupos comparten las grabaciones
 * pero van por distinto punto del curso, así que una familia del miércoles no
 * se encuentra con la pista de una clase que todavía no tuvo.
 *
 * Qué se ve depende de la fecha, no de un interruptor por grupo, y la fecha se
 * mira al servir la página. La ruta que use esto tiene que ser dinámica: si se
 * generase en el build, una clase del miércoles no aparecería hasta el
 * siguiente despliegue, que es el lunes.
 */
export default function PaginaAudios({ grupo }: { grupo: Grupo }) {
  const dadas = clasesDadas(grupo)
  const porNumero = new Map(clases.map((c) => [c.clase, c]))

  // Recorremos los números de clase del grupo, no la lista de audios: un grupo
  // puede tener más clases que grabaciones, y entonces la tarjeta queda en
  // «todavía no disponible» en vez de desaparecer.
  const yaDadas = Array.from({ length: dadas }, (_, i) => i + 1)
    .map((n) => ({ n, fecha: grupo.fechas[n - 1], audio: porNumero.get(n) }))
    .reverse()

  const porVenir = grupo.fechas.map((fecha, i) => ({ n: i + 1, fecha })).filter((x) => x.n > dadas)

  const conAudio = yaDadas.filter((x) => x.audio?.disponible && x.audio.archivo)

  // Estrechado a propósito: esto cruza a un componente de cliente.
  const titulos = Object.fromEntries(
    conAudio.map((x) => [x.audio!.archivo, `pre-A1 · ${x.audio!.titulo}`])
  )

  const cola = [...conAudio]
    .reverse()
    .map((x) => ({ clase: x.n, titulo: x.audio!.titulo, src: audioUrl(x.audio!.archivo) }))

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      <AudioStats titulos={titulos} />

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
        <p className="mt-3 text-center text-sm font-semibold text-[#B3475A]">{grupo.nombre}</p>

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Aquí están los audios de las clases que ya tuvimos. Se pueden escuchar directamente o
            descargar para el coche.
          </p>
          <p>
            Cada clase tiene su audio con lo que hicimos ese {grupo.diaSemana}. Dura unos minutos.
          </p>
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
          {yaDadas.map((x) => (
            <AudioTrackCard
              key={x.n}
              clase={x.n}
              fecha={x.fecha}
              titulo={x.audio?.titulo ?? `Clase ${x.n}`}
              resumen={x.audio?.resumen ?? ''}
              archivo={x.audio?.archivo ?? ''}
              duracion={x.audio?.duracion ?? 0}
              disponible={Boolean(x.audio?.disponible)}
            />
          ))}
        </div>

        {/*
          Las clases que faltan van plegadas. Al principio del curso son muchas
          más que las dadas, y treinta tarjetas grises tapan la que la familia
          vino a buscar.
        */}
        {porVenir.length > 0 ? (
          <details className="mt-8 rounded-2xl border border-[#9A8F85]/25 px-5 py-4 sm:px-8">
            <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-[#B3475A]">
              Próximas clases ({porVenir.length})
            </summary>
            <ul className="mt-4 space-y-2 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
              {porVenir.map((x) => (
                <li key={x.n} className="flex flex-wrap gap-x-2">
                  <span className="font-semibold">Clase {x.n}</span>
                  <span>{formatFecha(x.fecha)}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>
    </main>
  )
}
