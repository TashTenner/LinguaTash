import AudioPlayer from './AudioPlayer'
import DownloadButton from './DownloadButton'
import MarcaEscuchado from './MarcaEscuchado'
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
  archivo: string
  duracion: number
  disponible: boolean
  /**
   * Audios que no son esta clase pero se escucharon en ella, como el
   * repertorio de una fiesta. Van dentro de esta tarjeta y no en una caja
   * aparte al final de la página, que es donde no los ve nadie.
   */
  sueltos?: {
    titulo: string
    etiqueta: string
    resumen: string
    archivo: string
    duracion: number
  }[]
}

export default function AudioTrackCard({
  clase,
  fecha,
  titulo,
  resumen,
  archivo,
  duracion,
  disponible,
  sueltos = [],
}: AudioTrackCardProps) {
  const listo = disponible && Boolean(archivo)

  return (
    <article
      className={`rounded-2xl border px-5 py-6 sm:px-8 sm:py-8 ${
        listo
          ? 'border-[#9A8F85]/40 bg-[#F4EFE8] dark:bg-[#081C3C]'
          : 'border-[#9A8F85]/25 bg-[#F4EFE8]/50 dark:bg-[#081C3C]/50'
      }`}
    >
      {/* Solo la fecha: el número de clase ya es el título, justo debajo. */}
      <p className="text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">{formatFecha(fecha)}</p>

      <h3 className={`mt-1 text-xl font-semibold ${listo ? '' : 'opacity-70'}`}>{titulo}</h3>

      {resumen ? (
        <p className={`mt-2 leading-relaxed ${listo ? 'opacity-90' : 'opacity-60'}`}>{resumen}</p>
      ) : null}

      {listo ? (
        <div className="mt-6">
          <AudioPlayer
            archivo={archivo}
            etiqueta="El audio de la clase"
            duracion={duracion}
            ariaLabel={`Audio de la clase ${clase}`}
          />
          <DownloadButton archivo={archivo} ariaLabel={`Descargar el audio de la clase ${clase}`} />
          <MarcaEscuchado archivo={archivo} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">Todavía no disponible</p>
      )}

      {sueltos.map((suelto) => (
        <div key={suelto.archivo} className="mt-8 border-t border-[#9A8F85]/30 pt-6">
          {suelto.resumen ? <p className="leading-relaxed opacity-90">{suelto.resumen}</p> : null}

          <div className="mt-6">
            <AudioPlayer
              archivo={suelto.archivo}
              etiqueta={suelto.etiqueta}
              duracion={suelto.duracion}
              ariaLabel={suelto.titulo}
            />
            <DownloadButton archivo={suelto.archivo} ariaLabel={`Descargar ${suelto.titulo}`} />
            <MarcaEscuchado archivo={suelto.archivo} />
          </div>
        </div>
      ))}
    </article>
  )
}
