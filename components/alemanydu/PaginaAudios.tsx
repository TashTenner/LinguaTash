import type { ReactNode } from 'react'
import Image from 'next/image'
import BoletinForm from '@/components/BoletinForm'
import { audioUrl, clases, frasePrueba, sueltos, type AudioSuelto } from '@/data/alemanydu-audios'
import { clasesDadas, type Grupo } from '@/data/alemanydu-grupos'
import AudioPlayer from './AudioPlayer'
import AudioStats from './AudioStats'
import AudioTrackCard from './AudioTrackCard'
import BoletinTexto from './BoletinTexto'
import CalendarTable from './CalendarTable'
import { faseActual, fases, periodoDeFase } from './fases'
import ReproducirTodo from './ReproducirTodo'

/** Cuántas clases quedan abiertas arriba. El resto va en «Clases anteriores». */
const CLASES_ABIERTAS = 2

const textoApagado = 'text-[#9A8F85] dark:text-[#F4EFE8]/60'

/**
 * Una sección que ocupa una línea hasta que alguien la abre.
 *
 * `<details>` y no un acordeón propio: funciona sin JavaScript, el navegador
 * lo hace accesible solo y la página sigue siendo entera de servidor.
 */
function Plegable({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-[#9A8F85]/25 px-5 py-4 sm:px-8">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
        <span>{titulo}</span>
        <span
          aria-hidden="true"
          className="text-[#B3475A] transition-transform duration-200 group-open:rotate-90"
        >
          ›
        </span>
      </summary>
      <div className="mt-4 mb-2 space-y-5 leading-relaxed">{children}</div>
    </details>
  )
}

/**
 * La página de un grupo: los audios, y debajo todo lo que antes vivía en la
 * página de familias.
 *
 * Los audios van arriba porque es a lo que viene una familia. Lo de familias
 * va plegado debajo: está, pero no empuja el audio de esta semana fuera de la
 * pantalla del móvil.
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

  const recientes = yaDadas.slice(0, CLASES_ABIERTAS)
  const anteriores = yaDadas.slice(CLASES_ABIERTAS)

  const conAudio = yaDadas.filter((x) => x.audio?.disponible && x.audio.archivo)

  // Los audios sueltos, colgados de la clase en la que este grupo los cantó.
  // No entran en `cola`: «Reproducir todo» recorre el curso en orden y el
  // repertorio de una fiesta no es un punto de ese recorrido.
  const sueltosPorClase = new Map<number, AudioSuelto[]>()
  for (const asignado of grupo.sueltos ?? []) {
    const suelto = sueltos.find((x) => x.id === asignado.id)
    if (!suelto?.disponible || !suelto.archivo) continue
    sueltosPorClase.set(asignado.clase, [...(sueltosPorClase.get(asignado.clase) ?? []), suelto])
  }
  const sueltosDelGrupo = yaDadas.flatMap((x) => sueltosPorClase.get(x.n) ?? [])

  const frase = frasePrueba.disponible && frasePrueba.archivo ? frasePrueba.archivo : null

  // Estrechado a propósito: esto cruza a un componente de cliente.
  const titulos = Object.fromEntries([
    ...conAudio.map((x) => [x.audio!.archivo, `pre-A1 · ${x.audio!.titulo}`]),
    // Sin nivel: estas canciones no son de pre-A1, son de la fiesta.
    ...sueltosDelGrupo.map((x) => [x.archivo, x.titulo]),
    ...(frase ? [[frase, 'La frase']] : []),
  ])

  const cola = [...conAudio]
    .reverse()
    .map((x) => ({ clase: x.n, titulo: x.audio!.titulo, src: audioUrl(x.audio!.archivo) }))

  const tarjeta = (x: (typeof yaDadas)[number]) => (
    <AudioTrackCard
      key={x.n}
      clase={x.n}
      fecha={x.fecha}
      titulo={x.audio?.titulo ?? `Clase ${x.n}`}
      resumen={x.audio?.resumen ?? ''}
      archivo={x.audio?.archivo ?? ''}
      duracion={x.audio?.duracion ?? 0}
      disponible={Boolean(x.audio?.disponible)}
      sueltos={sueltosPorClase.get(x.n) ?? []}
    />
  )

  const ahora = faseActual(dadas)

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
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

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Cada clase tiene su audio, con lo que hicimos ese {grupo.diaSemana}. Se puede escuchar
            aquí o descargar para el coche. Si esa semana aprendimos una canción, va dentro del
            mismo audio.
          </p>
          <p>No hace falta prestar atención. Con que suene de fondo alcanza.</p>
          <p>
            Es solo mi voz, en alemán, sin traducción y a propósito. Si tu hijo o hija no entiende
            todo, está haciendo justo lo que tiene que hacer.
          </p>
          <p>
            En casa ayuda cantar las canciones aunque no se entienda la letra. Mejor no pedirle que
            traduzca ni corregirle la pronunciación: con acento español se deshace sin querer el
            trabajo de la clase.
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

        {recientes.length > 0 ? (
          <div className="mt-6 space-y-6">{recientes.map(tarjeta)}</div>
        ) : (
          <p className={`mt-6 ${textoApagado}`}>
            El primer audio aparece aquí cuando termine la primera clase.
          </p>
        )}

        {/*
          Las clases viejas van plegadas. En junio son treinta, y la que una
          familia viene a buscar es casi siempre la de esta semana. «Reproducir
          todo» las sigue recorriendo todas.
        */}
        {anteriores.length > 0 ? (
          <details className="mt-8 rounded-2xl border border-[#9A8F85]/25 px-5 py-4 sm:px-8">
            <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-[#B3475A]">
              Clases anteriores ({anteriores.length})
            </summary>
            <div className="mt-6 mb-2 space-y-6">{anteriores.map(tarjeta)}</div>
          </details>
        ) : null}
      </section>

      {/* PARA LAS FAMILIAS */}
      <section>
        <h2 className="text-2xl font-semibold">Para las familias</h2>

        <div className="mt-6 space-y-4">
          <Plegable titulo="Por qué hablo solo en alemán">
            <p className="opacity-90">
              En clase hablo solamente en alemán desde el primer día. Tenemos una hora por semana, y
              cada minuto que yo hablo en castellano es un minuto menos de alemán.
            </p>
            <p className="opacity-90">
              Los niños aprenden los sonidos imitando, no escuchando una explicación. Para la
              pronunciación, oír vale más que entender.
            </p>
            <p className="opacity-90">
              El grupo es de edades mixtas. Si yo explicara gramática, los mayores seguirían y los
              pequeños se quedarían fuera. Escuchando, todos parten del mismo lugar.
            </p>
            <p className="opacity-90">
              Fuera de eso, el castellano o el catalán quedan como válvula en dos casos: si hay un
              problema de seguridad física, o si un niño se está bloqueando. Breve, y nunca para
              explicar contenido lingüístico.
            </p>
            <p className="opacity-90">
              Yo me encargo de que siempre sepan qué hay que hacer. Uso gestos, objetos, canciones y
              una rutina que se repite igual todas las semanas.
            </p>
          </Plegable>

          <Plegable titulo="Qué es normal">
            <p className="opacity-90">
              Es normal que las primeras semanas tu hijo o hija diga que no entendió nada. No hace
              falta entender todo. Lo que está haciendo es escuchar, y eso es exactamente el trabajo
              de estos meses.
            </p>
            <p className="opacity-90">
              También es normal que durante un tiempo no diga nada en alemán, pero puede ser que
              esté con tanto entusiasmo que sí repita algo. Primero entra por el oído y bastante
              después sale por la boca.
            </p>
          </Plegable>

          <Plegable titulo="El recorrido del año y el nivel">
            <div className="space-y-6">
              {fases.map((fase) => (
                <div key={fase.titulo}>
                  <h3 className="text-lg font-semibold">
                    {fase.titulo}
                    {fase.titulo === ahora.titulo ? (
                      <span className="ml-2 text-sm font-semibold text-[#B3475A]">ahora</span>
                    ) : null}
                  </h3>
                  <p className={`mt-1 text-sm ${textoApagado}`}>{periodoDeFase(grupo, fase)}</p>
                  <p className="mt-2 opacity-90">{fase.descripcion}</p>
                </div>
              ))}
            </div>

            <h3 className="pt-4 text-lg font-semibold">Qué van a saber en junio</h3>
            <p className="opacity-90">
              Van a reconocer y producir los sonidos del alemán que no existen ni en castellano ni
              en catalán. Van a entender y responder a muchas frases cotidianas sin pensar en la
              traducción. Van a saber unas cuantas canciones enteras.
            </p>
            <p className="opacity-90">
              No van a leer ni escribir en alemán este año, y es a propósito. Primero el oído.
            </p>

            <h3 className="pt-4 text-lg font-semibold">Este curso es pre-A1</h3>
            <p className="opacity-90">
              pre-A1 describe el punto de partida, no la edad ni el curso escolar. Las etiquetas A1,
              A2 o B1 vienen del marco europeo de las lenguas y están pensadas para adultos que ya
              leen y escriben, así que ninguna describe bien lo que hacemos este año. En pre-A1 se
              escucha y se habla. No se lee y no se escribe.
            </p>
            <p className="opacity-90">
              El paso siguiente es A1.1. Ahí tampoco se empieza por la escritura. Dentro de A1.1 se
              trabaja primero el reconocimiento de palabras alemanas escritas, y leer y escribir
              llegan más adelante.
            </p>
            <p className="opacity-90">
              Lo hago así por una razón concreta. Quiero que tu hijo o hija sepa con seguridad cómo
              suena una palabra alemana antes de ver cómo se escribe. Lo que entra por los ojos
              cambia lo que sale por la boca, y esa interferencia solo deja de pasar cuando la
              pronunciación ya está asentada.
            </p>
          </Plegable>

          <Plegable titulo="Una cosa para probar">
            <p className="opacity-90">
              Ponle este audio a tu hijo o hija una sola vez, sin traducir nada, y mira qué hace.
            </p>
            {frase ? (
              <AudioPlayer
                archivo={frase}
                etiqueta="La frase"
                duracion={frasePrueba.duracion}
                ariaLabel="La frase para probar en casa, en alemán"
              />
            ) : (
              <p className={`text-sm ${textoApagado}`}>Todavía no disponible</p>
            )}
            <p className="opacity-90">Si se toca la cabeza, ya está funcionando.</p>
            <p className={`text-sm ${textoApagado}`}>
              La frase va grabada y no escrita a propósito. Así la escucha en mi voz, igual que en
              clase.
            </p>
          </Plegable>

          <Plegable titulo="Calendario">
            <p className="text-sm font-semibold text-[#B3475A]">
              {grupo.nombre} · {grupo.curso}
            </p>
            <p className="opacity-90">
              Las clases son {grupo.horario}. Este es el curso entero, semana a semana, con los días
              que caen fuera.
            </p>
            <CalendarTable grupo={grupo} />
            <p className="opacity-90">{grupo.cierreCalendario}</p>
          </Plegable>
        </div>
      </section>

      {/* BOLETÍN */}
      <section
        id="boletin"
        className="scroll-mt-20 rounded-2xl border border-l-4 border-[#9A8F85]/40 border-l-[#B3475A] bg-[#F4EFE8] px-5 py-10 sm:px-8 dark:bg-[#081C3C]"
      >
        <BoletinTexto />
        <div className="mt-8">
          <BoletinForm lista="alemanydu" />
        </div>
      </section>

      {/* CONTACTO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-10 sm:px-8 dark:bg-[#081C3C]">
        <p className="leading-relaxed opacity-90">
          Cualquier cosa, escríbeme. Si necesitas algo por escrito, también.
        </p>

        <div className="mt-6 flex flex-col items-start gap-4">
          <a
            href="https://wa.me/34644886723"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Escribir por WhatsApp
          </a>

          <a
            href="mailto:alemanydu@linguatash.com"
            className="inline-flex min-h-11 max-w-full items-center truncate rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium whitespace-nowrap text-[#F4EFE8] transition-transform duration-300 hover:scale-105"
          >
            alemanydu@linguatash.com
          </a>
        </div>
      </section>
    </main>
  )
}
