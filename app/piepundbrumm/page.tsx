import Image from 'next/image'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { formatDuracion } from '@/components/alemanydu/format'
import { AUDIOS_READY, piepUndBrummAudios, piepUndBrummUrl } from '@/data/piepundbrumm'

/**
 * /piepundbrumm is printed as a QR code on the Vorlesefest cards
 * (Goethe-Institut Barcelona, 21 November 2026). The address must never change.
 *
 * Public and indexable, unlike the Nordkreis family audios.
 */
export const metadata = genPageMetadata({
  title: 'Piep und Brumm zum Nachhören',
  description:
    'Drei kurze Audios auf Deutsch für Kinder von 3 bis 6 Jahren, zum Vorlesefest am Goethe-Institut Barcelona.',
  openGraph: {
    title: 'Piep und Brumm zum Nachhören | LinguaTash',
    description:
      'Drei kurze Audios auf Deutsch für Kinder von 3 bis 6 Jahren, zum Vorlesefest am Goethe-Institut Barcelona.',
    url: './',
    siteName: 'LinguaTash',
    locale: 'de_DE',
    type: 'website',
  },
})

const tipps = [
  'Hört beim ersten Mal zusammen und macht selbst mit. Kinder machen nach, was Ihr macht.',
  'In den Pausen antwortet Euer Kind. Wartet ab und sagt nichts vor. Die Antwort kommt danach im Audio.',
  'Lieber kurz und oft: ein Audio am Tag, beim Frühstück, im Auto oder vor dem Schlafen.',
  'Hört jedes Audio eine Woche lang. Kinder lieben Wiederholung, und so bleiben die Wörter hängen.',
]

export default function PiepUndBrummSeite() {
  return (
    <main
      lang="de"
      className="mx-auto max-w-3xl space-y-10 px-0 pb-10 font-['Noto_Sans'] text-[#081C3C] sm:px-4 dark:text-[#F4EFE8]"
    >
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-10 sm:px-8 sm:py-14 dark:bg-[#081C3C]">
        <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">
          Piep und Brumm zum Nachhören
        </h1>
        <p className="mt-5 text-lg leading-relaxed opacity-90">
          Beim Vorlesefest am Goethe-Institut Barcelona haben wir zwei Tiergeschichten gehört: vom
          kleinen Spatz, der überall singt, und vom großen Bären, der sich nicht ins Wasser traut.
          Mit diesen drei Audios könnt Ihr zu Hause wiederholen, was die Kinder gehört haben. So
          bleibt es hängen.
        </p>
      </section>

      <section aria-label="Die drei Audios" className="space-y-4">
        {!AUDIOS_READY ? (
          <p className="rounded-2xl border-l-4 border-[#B3475A] bg-[#E3DED7] px-5 py-4 font-semibold dark:bg-[#081C3C]">
            Die Audios sind ab Montag, 23. November, hier zu hören.
          </p>
        ) : null}

        {piepUndBrummAudios.map((audio) => {
          const zeit = formatDuracion(audio.dauer)
          return (
            <article
              key={audio.nummer}
              className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-6 sm:px-8 dark:bg-[#081C3C]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  <span className="mr-2 text-[#B3475A]">{audio.nummer}</span>
                  {audio.titel}
                </h2>
                {AUDIOS_READY && zeit ? (
                  <span className="shrink-0 text-sm text-[#9A8F85] tabular-nums dark:text-[#F4EFE8]/60">
                    {zeit}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 leading-relaxed opacity-90">{audio.beschreibung}</p>

              {AUDIOS_READY ? (
                // Native controls on purpose, as on every audio page of the site:
                // lock screen playback and CarPlay come for free. No caption
                // track: the pauses are for the child to answer, not to read.
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio
                  controls
                  preload="none"
                  src={piepUndBrummUrl(audio.nummer)}
                  aria-label={`Audio ${audio.nummer}: ${audio.titel}`}
                  className="mt-4 h-14 w-full"
                />
              ) : null}
            </article>
          )
        })}
      </section>

      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-8 sm:px-8 dark:bg-[#081C3C]">
        <h2 className="text-xl font-semibold">So klappt es zu Hause</h2>
        <ul className="mt-4 space-y-3">
          {tipps.map((tipp) => (
            <li key={tipp} className="flex gap-3 leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B3475A]"
              />
              <span className="opacity-90">{tipp}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-5 py-8 text-center sm:px-8 dark:bg-[#081C3C]">
        <div className="mb-5 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis Logo"
            width={56}
            height={56}
            className="block h-14 w-auto dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis Logo"
            width={56}
            height={56}
            className="hidden h-14 w-auto dark:block"
          />
        </div>
        <p className="mx-auto max-w-xl leading-relaxed opacity-90">
          Nordkreis ist eine deutsche Samstagsschule in Gràcia für Kinder aus deutschsprachigen
          Familien. Auch dort arbeite ich mit Audios: So können die Kinder zu Hause wiederholen, was
          wir am Samstag gemacht haben, und die Zeit bis zum nächsten Mal wird nicht zu lang.
        </p>
        <Link
          href="/nordkreis"
          className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#B3475A] px-6 py-3 font-semibold text-[#F4EFE8] transition-opacity hover:opacity-90"
        >
          Mehr über Nordkreis
        </Link>
      </section>

      <p className="px-1 text-sm leading-relaxed text-[#9A8F85] dark:text-[#F4EFE8]/60">
        Die Audios sind eigene Aufnahmen von Tash Tenner. Die Bücher „Ein Spatz sang auf dem
        Hühnerstall“ (Alfred Könner) und „Dr. Brumm geht baden“ (Daniel Napp) werden darin nicht
        vorgelesen.
      </p>
    </main>
  )
}
