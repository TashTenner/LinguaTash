import { Metadata } from 'next'
import Link from '@/components/Link'
import AudioPlayer from '@/components/alemanydu/AudioPlayer'
import AudioStats from '@/components/alemanydu/AudioStats'
import CalendarTable from '@/components/alemanydu/CalendarTable'
import PhaseBlock from '@/components/alemanydu/PhaseBlock'
import { frasePrueba } from '@/data/alemanydu-audios'

export const metadata: Metadata = {
  title: 'Para las familias · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

const fases = [
  {
    titulo: 'Abrir el oído',
    tituloAleman: 'Ohren auf',
    periodo: 'Septiembre y octubre',
    descripcion:
      'Escuchar. Saludos, el cuerpo, los colores y las órdenes de movimiento. Se habla desde el primer día y todo lo que salga vale.',
  },
  {
    titulo: 'Primeras palabras',
    tituloAleman: 'Erste Wörter',
    periodo: 'Noviembre y diciembre',
    descripcion: 'Primeras palabras sueltas. Números, la familia, el aula. Sankt Martin y Navidad.',
  },
  {
    titulo: 'Yo y tú',
    tituloAleman: 'Ich und du',
    periodo: 'Enero a marzo',
    descripcion:
      'Hablar de uno mismo y del otro. Animales, comida, ropa. Primeras preguntas y respuestas.',
  },
  {
    titulo: 'Señalar y hablar',
    tituloAleman: 'Zeigen und sprechen',
    periodo: 'Abril a junio',
    descripcion:
      'Describir el mundo. El tiempo, la casa, la naturaleza. Conversaciones un poco más largas.',
  },
]

export default function AlemanYDuFamiliasPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      <AudioStats titulos={frasePrueba.archivo ? { [frasePrueba.archivo]: 'La frase' } : {}} />

      {/* HERO */}
      <section className="pt-10">
        <h1 className="text-4xl font-[400] md:text-5xl">Para las familias</h1>

        <p className="mt-4 text-lg font-semibold text-[#B3475A]">Alemán·y·Du</p>

        <p className="mt-8 text-xl leading-relaxed md:text-2xl">
          En clase hablo solamente en alemán desde el primer día.
        </p>
      </section>

      {/* POR QUÉ */}
      <section>
        <h2 className="text-2xl font-semibold">Por qué</h2>

        <div className="mt-6 space-y-5 leading-relaxed opacity-90">
          <p>
            Tenemos una hora por semana. Cada minuto que yo hablo en castellano es un minuto menos
            de alemán.
          </p>
          <p>
            Los niños aprenden los sonidos imitando, no escuchando una explicación. Para la
            pronunciación, oír vale más que entender.
          </p>
          <p>
            En el grupo hay niños mayores y niños pequeños. Si yo explicara gramática, los mayores
            seguirían y los pequeños se quedarían fuera. Escuchando, todos parten del mismo lugar.
          </p>
          <p>
            Fuera de eso, el castellano o el catalán quedan como válvula en dos casos: si hay un
            problema de seguridad física, o si un niño se está bloqueando. Breve, y nunca para
            explicar contenido lingüístico.
          </p>
          <p>
            Yo me encargo de que siempre sepan qué hay que hacer. Uso gestos, objetos, canciones y
            una rutina que se repite igual todas las semanas.
          </p>
        </div>
      </section>

      {/* QUÉ ES NORMAL */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-10 sm:px-8 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Qué es normal</h2>

        <div className="mt-6 space-y-5 leading-relaxed opacity-90">
          <p>
            Es normal que las primeras semanas tu hijo o hija diga que no entendió nada. No hace
            falta entender todo. Lo que está haciendo es escuchar, y eso es exactamente el trabajo
            de estos meses.
          </p>
          <p>
            También es normal que durante un tiempo no diga nada en alemán, pero puede ser que esté
            con tanto entusiasmo que sí repita algo. Primero entra por el oído y bastante después
            sale por la boca.
          </p>
        </div>
      </section>

      {/* QUÉ AYUDA EN CASA */}
      <section>
        <h2 className="text-2xl font-semibold">Qué ayuda en casa</h2>

        <h3 className="mt-6 text-xl font-semibold">Esto sí</h3>
        <ul className="mt-3 ml-6 list-disc space-y-2 leading-relaxed opacity-90">
          <li>
            Poner el audio de la semana mientras hacen otra cosa. En el coche funciona muy bien.
          </li>
          <li>Cantar las canciones aunque no se entienda la letra.</li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">Esto mejor no</h3>
        <ul className="mt-3 ml-6 list-disc space-y-2 leading-relaxed opacity-90">
          <li>Pedirle que traduzca lo que dijo.</li>
          <li>Corregirle la pronunciación.</li>
        </ul>

        <p className="mt-8 leading-relaxed opacity-90">
          Lo de la pronunciación importa más de lo que parece. Si se corrige con acento español, se
          deshace el trabajo de la clase sin querer.
        </p>
      </section>

      {/* LOS AUDIOS */}
      <section>
        <h2 className="text-2xl font-semibold">Los audios</h2>

        <p className="mt-6 leading-relaxed opacity-90">
          Cada semana subo un audio corto con lo que hicimos el lunes. Está para escuchar y para
          descargar.
        </p>

        <Link
          href="/alemanydu/audios"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium text-[#F4EFE8] transition-transform duration-200 hover:scale-105"
        >
          Ir a los audios
        </Link>
      </section>

      {/* UNA COSA PARA PROBAR */}
      <section>
        <h2 className="text-2xl font-semibold">Una cosa para probar</h2>

        <div className="mt-6 rounded-2xl border-2 border-[#B3475A] bg-[#B3475A]/10 px-5 py-10 sm:px-8">
          <p className="leading-relaxed opacity-90">
            Ponle este audio a tu hijo o hija una sola vez, sin traducir nada, y mira qué hace.
          </p>

          {frasePrueba.disponible && frasePrueba.archivo ? (
            <div className="my-8">
              <AudioPlayer
                archivo={frasePrueba.archivo}
                etiqueta="La frase"
                duracion={frasePrueba.duracion}
                ariaLabel="La frase para probar en casa, en alemán"
              />
            </div>
          ) : (
            <p className="my-8 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
              Todavía no disponible
            </p>
          )}

          <p className="leading-relaxed opacity-90">Si se toca la cabeza, ya está funcionando.</p>

          <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
            La frase va grabada y no escrita a propósito. Así la escucha en mi voz, igual que en
            clase.
          </p>
        </div>
      </section>

      {/* EL RECORRIDO DEL AÑO */}
      <section>
        <h2 className="text-2xl font-semibold">El recorrido del año</h2>

        <div className="mt-6 space-y-8">
          {fases.map((fase) => (
            <PhaseBlock
              key={fase.titulo}
              titulo={fase.titulo}
              tituloAleman={fase.tituloAleman}
              periodo={fase.periodo}
              descripcion={fase.descripcion}
            />
          ))}
        </div>
      </section>

      {/* QUÉ VAN A SABER EN JUNIO */}
      <section>
        <h2 className="text-2xl font-semibold">Qué van a saber en junio</h2>

        <div className="mt-6 space-y-5 leading-relaxed opacity-90">
          <p>
            Van a reconocer y producir los sonidos del alemán que no existen ni en castellano ni en
            catalán. Van a entender y responder a muchas frases cotidianas sin pensar en la
            traducción. Van a saber unas cuantas canciones enteras.
          </p>
          <p>No van a leer ni escribir en alemán este año, y es a propósito. Primero el oído.</p>
        </div>
      </section>

      {/* EL NIVEL */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-10 sm:px-8 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">El nivel</h2>

        <p className="mt-6 text-xl font-semibold text-[#B3475A]">Este curso es pre-A1.</p>

        <div className="mt-6 space-y-5 leading-relaxed opacity-90">
          <p>
            pre-A1 describe el punto de partida, no la edad ni el curso escolar. Las etiquetas A1,
            A2 o B1 vienen del marco europeo de las lenguas y están pensadas para adultos que ya
            leen y escriben, así que ninguna describe bien lo que hacemos este año. En pre-A1 se
            escucha y se habla. No se lee y no se escribe.
          </p>
          <p>
            El paso siguiente es A1.1. Ahí tampoco se empieza por la escritura. Dentro de A1.1 se
            trabaja primero el reconocimiento de palabras alemanas escritas, y leer y escribir
            llegan más adelante.
          </p>
          <p>
            Lo hago así por una razón concreta. Quiero que tu hijo o hija sepa con seguridad cómo
            suena una palabra alemana antes de ver cómo se escribe. Lo que entra por los ojos cambia
            lo que sale por la boca, y esa interferencia solo deja de pasar cuando la pronunciación
            ya está asentada.
          </p>
        </div>
      </section>

      {/* CALENDARIO */}
      <section>
        <h2 className="text-2xl font-semibold">Calendario</h2>

        <p className="mt-2 text-sm font-semibold text-[#B3475A]">Curso 2026/2027</p>

        <p className="mt-6 leading-relaxed opacity-90">
          Las clases son los lunes de 14:00 a 15:00. Este es el curso entero, lunes a lunes, con los
          días que caen fuera.
        </p>

        <div className="mt-6">
          <CalendarTable />
        </div>

        <p className="mt-6 leading-relaxed opacity-90">
          La última clase prevista es el lunes 14 de junio de 2027. El curso escolar termina el 21
          de junio, que también cae en lunes. Todavía no sé si ese día habrá clase: otros años el
          colegio cerró a las 13:00 el último día, así que lo más probable es que no. En cuanto lo
          confirmen, mandaré un aviso.
        </p>
      </section>

      {/* CONTACTO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-10 sm:px-8 dark:bg-[#081C3C]">
        <p className="leading-relaxed opacity-90">Cualquier cosa, escríbeme.</p>

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
