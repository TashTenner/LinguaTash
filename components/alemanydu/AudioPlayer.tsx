import { audioUrl } from '@/data/alemanydu-audios'
import { formatDuracion } from './format'

type AudioPlayerProps = {
  /** Basename of the object on the bucket. */
  archivo: string
  /** Label shown above the controls, for example `La pista de la semana`. */
  etiqueta: string
  /** Duration in seconds. `0` hides the duration. */
  duracion: number
  /** Full spoken label for screen readers, naming the class and the track. */
  ariaLabel: string
}

/**
 * Thin wrapper on the native player. Do not replace this with a custom one:
 * native controls are what give parents lock screen playback, CarPlay and
 * Android Auto for free, which is the entire point of the page.
 */
export default function AudioPlayer({ archivo, etiqueta, duracion, ariaLabel }: AudioPlayerProps) {
  const tiempo = formatDuracion(duracion)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">{etiqueta}</span>
        {tiempo ? (
          <span className="text-sm text-[#9A8F85] tabular-nums dark:text-[#F4EFE8]/60">
            {tiempo}
          </span>
        ) : null}
      </div>

      {/*
        These tracks deliberately have no caption file. The transcript is
        internal and must never reach the browser (section 8 of the build spec),
        and putting German text next to the audio is the exact interference the
        course exists to prevent: read with Spanish eyes, the word changes the
        way it gets pronounced. The aria-label names the class and the track.
      */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        controls
        preload="none"
        src={audioUrl(archivo)}
        aria-label={ariaLabel}
        className="mt-2 w-full"
      />
    </div>
  )
}
