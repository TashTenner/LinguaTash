import AudioPlayer from './AudioPlayer'
import DownloadButton from './DownloadButton'
import { formatDia } from './format'

/** Narrowed props, same reason as in AudioTrackCard. */
type LiederCardProps = {
  archivo: string
  duracion: number
  actualizado: string
  resumen: string
  canciones: string[]
  disponible: boolean
}

export default function LiederCard({
  archivo,
  duracion,
  actualizado,
  resumen,
  canciones,
  disponible,
}: LiederCardProps) {
  return (
    <article className="rounded-2xl border-2 border-[#B3475A]/50 bg-[#E3DED7] px-5 py-6 sm:px-8 sm:py-8 dark:bg-[#081C3C]">
      <h2 className="text-2xl font-semibold text-[#B3475A]">Canciones</h2>

      <p className="mt-2 leading-relaxed opacity-90">{resumen}</p>

      {disponible && archivo ? (
        <>
          <div className="mt-6">
            <AudioPlayer
              archivo={archivo}
              etiqueta="Canciones"
              duracion={duracion}
              ariaLabel="Canciones, todas las canciones del curso"
            />
            <DownloadButton archivo={archivo} ariaLabel="Descargar la pista de canciones" />
          </div>

          {canciones.length > 0 ? (
            <ul className="mt-6 ml-6 list-disc space-y-2 opacity-90">
              {canciones.map((cancion) => (
                <li key={cancion}>{cancion}</li>
              ))}
            </ul>
          ) : null}

          {actualizado ? (
            <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
              Actualizado el {formatDia(actualizado)}
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">Todavía no disponible</p>
      )}
    </article>
  )
}
