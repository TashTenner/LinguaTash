import AudioPlayer from './AudioPlayer'
import DownloadButton from './DownloadButton'
import MarcaEscuchado from './MarcaEscuchado'

/**
 * Un audio que no es una clase: el repertorio de una fiesta.
 *
 * Deliberadamente no reusa `AudioTrackCard`, que pide número de clase y fecha.
 * Pasarle valores inventados para que encaje sería atar al calendario del
 * curso justo lo que no pertenece a él, que es la razón de que este audio
 * exista aparte.
 */
type AudioSueltoCardProps = {
  titulo: string
  resumen: string
  archivo: string
  duracion: number
}

export default function AudioSueltoCard({
  titulo,
  resumen,
  archivo,
  duracion,
}: AudioSueltoCardProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{titulo}</h2>

      <article className="mt-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-6 sm:px-8 sm:py-8 dark:bg-[#081C3C]">
        {resumen ? <p className="leading-relaxed opacity-90">{resumen}</p> : null}

        <div className="mt-6">
          <AudioPlayer
            archivo={archivo}
            etiqueta="Las canciones"
            duracion={duracion}
            ariaLabel={titulo}
          />
          <DownloadButton archivo={archivo} ariaLabel={`Descargar ${titulo}`} />
          <MarcaEscuchado archivo={archivo} />
        </div>
      </article>
    </section>
  )
}
