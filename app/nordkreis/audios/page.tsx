import { Metadata } from 'next'
import Image from 'next/image'
import AllesAbspielen from '@/components/nordkreis/audios/AllesAbspielen'
import AudioStatistik from '@/components/nordkreis/audios/AudioStatistik'
import { formatDatum } from '@/components/nordkreis/audios/format'
import SamstagKarte from '@/components/nordkreis/audios/SamstagKarte'
import {
  aufnahmeFuer,
  audioUrl,
  dateiname,
  entdeckerkreis2026,
  samstagTitel,
  samstageVorbei,
  type Buch,
} from '@/data/nordkreis-audios'

export const metadata: Metadata = {
  title: 'Audios · Nordkreis',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Dynamic on purpose. Which Saturdays show depends on today's date, and a
 * page generated at build time would not show a new Saturday until the next
 * deploy. Do not turn this back into a static page.
 */
export const dynamic = 'force-dynamic'

const jahrgang = entdeckerkreis2026

export default function Seite() {
  const vorbei = samstageVorbei(jahrgang)

  // Saturday numbers come from the position in the year; the content number
  // only picks the file and the recording, and is never displayed.
  const gewesen = jahrgang.samstage
    .slice(0, vorbei)
    .map((samstag, i) => ({
      n: i + 1,
      samstag,
      aufnahme: aufnahmeFuer(jahrgang, samstag.inhalt),
      datei:
        samstag.inhalt === undefined
          ? ''
          : dateiname({ gruppe: jahrgang.gruppe, zyklus: jahrgang.zyklus, inhalt: samstag.inhalt }),
    }))
    .reverse()

  // Only books already read, each once, in the order they were first read.
  // A book runs over three Saturdays, so repeats are the normal case.
  const buecher: Buch[] = []
  for (const x of [...gewesen].reverse()) {
    const buch = x.aufnahme?.buch
    if (buch && !buecher.some((b) => b.titel === buch.titel)) buecher.push(buch)
  }

  const kommend = jahrgang.samstage
    .map((samstag, i) => ({ n: i + 1, datum: samstag.datum }))
    .filter((x) => x.n > vorbei)

  const mitAudio = gewesen.filter((x) => x.datei && x.aufnahme?.verfuegbar)

  // Narrowed on purpose: both of these cross into client components.
  const sperrbildschirm = Object.fromEntries(
    mitAudio.map((x) => [x.datei, samstagTitel(x.n, x.aufnahme?.titel)])
  )
  const warteschlange = [...mitAudio].reverse().map((x) => ({
    nummer: x.n,
    titel: samstagTitel(x.n, x.aufnahme?.titel),
    src: audioUrl(x.datei),
  }))

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      <AudioStatistik
        titel={sperrbildschirm}
        album={`Nordkreis ${jahrgang.name} · Zyklus ${jahrgang.zyklus.toUpperCase()}`}
      />

      {/* KOPF */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-14 sm:px-8 dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis Logo"
            width={112}
            height={112}
            className="block h-20 w-auto md:h-24 dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis Logo"
            width={112}
            height={112}
            className="hidden h-20 w-auto md:h-24 dark:block"
          />
        </div>

        <h1 className="text-center text-4xl font-[400] md:text-5xl">Audios</h1>
        <p className="mt-3 text-center text-[#9A8F85] dark:text-[#F4EFE8]/60">
          {jahrgang.name} · {jahrgang.schuljahr}
        </p>

        <div className="mt-8 space-y-5 leading-relaxed opacity-90">
          <p>
            Zu jedem Samstag gibt es hier ein Audio. Darin steckt das Wichtigste aus der Stunde: die
            Lieder, die Rituale, die Sätze und das Wort der Woche, und wenn wir gerade ein Buch
            lesen, auch das Buch. Die Audios sind unterschiedlich lang, zwischen fünf und elf
            Minuten, je nachdem wie viel an dem Samstag dran war.
          </p>
          <p>
            Ihr könnt es direkt hier anhören oder herunterladen, zum Beispiel für das Auto. Spielt
            es in den zwei Wochen bis zum nächsten Samstag einfach ab, beim Frühstück, unterwegs, wo
            es gerade passt. Es darf nebenbei laufen, und Ihr müsst nie bis zum Ende hören.
          </p>
          <p>
            Bei jedem Samstag findet Ihr außerdem das Wort der Woche, ein paar Sätze für zu Hause
            und eine kleine Idee für die Zeit dazwischen. Was davon in Euren Alltag passt, hält das
            Gehörte frisch und unsere Verbindung lebendig, auch wenn wir uns nur alle zwei Wochen
            sehen. Ganz unten steht, welche Bücher wir lesen.
          </p>
        </div>
      </section>

      {warteschlange.length > 0 ? (
        <section>
          <AllesAbspielen titel={warteschlange} />
        </section>
      ) : null}

      {/* DIE SAMSTAGE */}
      <section>
        <h2 className="sr-only">Die Samstage</h2>

        {gewesen.length > 0 ? (
          <div className="space-y-6">
            {gewesen.map((x) => (
              <SamstagKarte
                key={x.n}
                nummer={x.n}
                datum={x.samstag.datum}
                titel={x.aufnahme?.titel ?? ''}
                wortDerWoche={x.aufnahme?.wortDerWoche ?? ''}
                formeln={x.aufnahme?.formeln ?? []}
                zwischenDenSamstagen={x.samstag.zwischenDenSamstagen ?? ''}
                buch={x.aufnahme?.buch?.titel ?? ''}
                datei={x.datei}
                dauer={x.aufnahme?.dauer ?? 0}
                verfuegbar={Boolean(x.datei && x.aufnahme?.verfuegbar)}
              />
            ))}
          </div>
        ) : (
          <p className="leading-relaxed opacity-90">
            Der erste Samstag ist am {formatDatum(jahrgang.samstage[0].datum)}. Danach findet Ihr
            hier das erste Audio.
          </p>
        )}

        {/* Folded: early in the year these far outnumber the Saturdays already held. */}
        {kommend.length > 0 ? (
          <details className="mt-8 rounded-2xl border border-[#9A8F85]/25 px-5 py-4 sm:px-8">
            <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-[#B3475A]">
              Nächste Samstage ({kommend.length})
            </summary>
            <ul className="mt-4 space-y-2 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
              {kommend.map((x) => (
                <li key={x.n} className="flex flex-wrap gap-x-2">
                  <span className="font-semibold">Samstag {x.n}</span>
                  <span>{formatDatum(x.datum)}</span>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {buecher.length > 0 ? (
        <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-8 sm:px-8 dark:bg-[#081C3C]">
          <h2 className="text-xl font-semibold">Die Bücher, die wir lesen</h2>
          <ul className="mt-4 space-y-3 leading-relaxed">
            {buecher.map((b) => (
              <li key={b.titel}>
                <span className="italic">{b.titel}</span>
                <span className="opacity-80">
                  {' · '}
                  {b.autor}
                  {b.illustration ? `, Bilder von ${b.illustration}` : ''}
                  {b.verlag ? ` · ${b.verlag}` : ''}
                  {b.erstausgabe ? `, ${b.erstausgabe}` : ''}
                </span>
                {b.isbn ? (
                  <span className="block text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
                    ISBN {b.isbn}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="pb-8 text-center text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
        Fragen? Schreibt mir an{' '}
        <a href="mailto:nordkreis@linguatash.com" className="text-[#B3475A] underline">
          nordkreis@linguatash.com
        </a>
      </p>
    </main>
  )
}
