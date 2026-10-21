import { formatDuracion } from '@/components/alemanydu/format'
import { audioUrl, downloadUrl } from '@/data/nordkreis-audios'
import { formatDatum } from './format'
import GehoertMarke from './GehoertMarke'

/** Narrowed props, never a whole Aufnahme. */
type SamstagKarteProps = {
  nummer: number
  datum: string
  titel: string
  wortDerWoche: string
  formeln: string[]
  zwischenDenSamstagen: string
  /** Title only, as a quiet line. The full credit is at the foot of the page. */
  buch: string
  datei: string
  dauer: number
  verfuegbar: boolean
}

export default function SamstagKarte({
  nummer,
  datum,
  titel,
  wortDerWoche,
  formeln,
  zwischenDenSamstagen,
  buch,
  datei,
  dauer,
  verfuegbar,
}: SamstagKarteProps) {
  const zeit = formatDuracion(dauer)

  return (
    // Same look with or without audio: a card with no player yet is the
    // normal state for days after each Saturday, not an error.
    <article className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-6 sm:px-8 sm:py-8 dark:bg-[#081C3C]">
      <p className="text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
        Samstag {nummer} · {formatDatum(datum)}
      </p>

      {titel ? <h3 className="mt-1 text-xl font-semibold">{titel}</h3> : null}

      {/* The one thing parents act on, so it stands out even before the audio exists. */}
      {wortDerWoche ? (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wider text-[#9A8F85] uppercase dark:text-[#F4EFE8]/60">
            Wort der Woche
          </p>
          <p className="mt-1 font-[Caveat] text-4xl leading-tight text-[#B3475A]">{wortDerWoche}</p>
        </div>
      ) : null}

      {/* No heading: right under the word, these read as its examples on their own. */}
      {formeln.length > 0 ? (
        <ul className="mt-3 space-y-1 leading-relaxed opacity-90">
          {formeln.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}

      {zwischenDenSamstagen ? (
        <div className="mt-5">
          <p className="text-sm font-semibold">Zwischen den Samstagen</p>
          <p className="mt-2 leading-relaxed opacity-90">{zwischenDenSamstagen}</p>
        </div>
      ) : null}

      {buch ? (
        <p className="mt-5 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
          Wir lesen: <span className="italic">{buch}</span>
        </p>
      ) : null}

      {verfuegbar ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold">Das Audio</span>
            {zeit ? (
              <span className="text-sm text-[#9A8F85] tabular-nums dark:text-[#F4EFE8]/60">
                {zeit}
              </span>
            ) : null}
          </div>

          {/*
            Native controls on purpose: they give lock screen playback, CarPlay
            and Android Auto for free. No caption track, because there is no
            transcript; what parents need in writing is on this card.
          */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            preload="none"
            src={audioUrl(datei)}
            aria-label={`Audio von Samstag ${nummer}`}
            className="mt-2 w-full"
          />

          <a
            href={downloadUrl(datei)}
            aria-label={`Audio von Samstag ${nummer} herunterladen`}
            data-umami-event="nk-audio-download"
            data-umami-event-datei={datei}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#B3475A] px-5 py-2.5 text-sm font-medium text-[#B3475A] transition-colors hover:bg-[#B3475A] hover:text-[#F4EFE8]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
            </svg>
            Herunterladen
          </a>

          <GehoertMarke datei={datei} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">Noch nicht verfügbar</p>
      )}
    </article>
  )
}
