import AudioPlayer from './AudioPlayer'
import DownloadButton from './DownloadButton'
import { formatFecha } from './format'

/**
 * Props are listed one by one on purpose. The track objects carry an internal
 * `skript` field that must never reach the browser, so cards take narrowed
 * values instead of the whole object. See section 8 of the build spec.
 */
type AudioTrackCardProps = {
  clase: number
  fecha: string
  titulo: string
  resumen: string
  neu: string
  neuDuracion: number
  alles: string
  allesDuracion: number
  disponible: boolean
}

export default function AudioTrackCard({
  clase,
  fecha,
  titulo,
  resumen,
  neu,
  neuDuracion,
  alles,
  allesDuracion,
  disponible,
}: AudioTrackCardProps) {
  return (
    <article
      className={`rounded-2xl border px-5 py-6 sm:px-8 sm:py-8 ${
        disponible
          ? 'border-[#9A8F85]/40 bg-[#F4EFE8] dark:bg-[#081C3C]'
          : 'border-[#9A8F85]/25 bg-[#F4EFE8]/50 dark:bg-[#081C3C]/50'
      }`}
    >
      <p className="text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
        Clase {clase} · {formatFecha(fecha)}
      </p>

      <h3 className={`mt-1 text-xl font-semibold ${disponible ? '' : 'opacity-70'}`}>{titulo}</h3>

      {resumen ? (
        <p className={`mt-2 leading-relaxed ${disponible ? 'opacity-90' : 'opacity-60'}`}>
          {resumen}
        </p>
      ) : null}

      {disponible ? (
        <div className="mt-6 flex flex-col gap-8">
          {neu ? (
            <div>
              <AudioPlayer
                archivo={neu}
                etiqueta="La pista de la semana"
                duracion={neuDuracion}
                ariaLabel={`La pista de la semana de la clase ${clase}`}
              />
              <DownloadButton
                archivo={neu}
                ariaLabel={`Descargar la pista de la semana de la clase ${clase}`}
              />
            </div>
          ) : null}

          {alles ? (
            <div>
              <AudioPlayer
                archivo={alles}
                etiqueta="Todo hasta ahora"
                duracion={allesDuracion}
                ariaLabel={`Todo hasta ahora, hasta la clase ${clase}`}
              />
              <DownloadButton
                archivo={alles}
                ariaLabel={`Descargar Todo hasta ahora, hasta la clase ${clase}`}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">Todavía no disponible</p>
      )}
    </article>
  )
}
