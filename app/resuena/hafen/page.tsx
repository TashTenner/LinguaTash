import { Metadata } from 'next'
import Link from '../../../components/Link'
import siteMetadata from '@/data/siteMetadata'

const AUDIO_URL =
  process.env.NEXT_PUBLIC_HAFEN_AUDIO_URL ||
  '/static/hafen/die-beziehung-ist-die-methode-tash-tenner-linguatash.mp3'
const AUDIO_FILENAME = 'die-beziehung-ist-die-methode-tash-tenner-linguatash.mp3'

const PDF_URL =
  process.env.NEXT_PUBLIC_HAFEN_PDF_URL ||
  '/static/hafen/die-beziehung-ist-die-methode-tash-tenner-linguatash.pdf'
const PDF_FILENAME = 'die-beziehung-ist-die-methode-tash-tenner-linguatash.pdf'

const pageTitle = 'Die Beziehung ist die Methode · Eine Audiobotschaft von Tash · LinguaTash'
const pageDescription =
  'Sieben Minuten für deutschsprachige Eltern, die ihre Heimatsprache an ihre Kinder weitergeben. Audio zum Hören oder Mitlesen. Kostenlos.'

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteMetadata.siteUrl}/resuena/hafen`,
    siteName: siteMetadata.title,
    images: [`${siteMetadata.siteUrl}/resuena/hafen/opengraph-image`],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: 'summary_large_image',
    images: [`${siteMetadata.siteUrl}/resuena/hafen/opengraph-image`],
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/resuena/hafen`,
  },
}

const downloadLinkCls =
  'rounded-xl border border-[#9A8F85]/50 px-6 py-3 text-center text-sm font-medium text-[#081C3C] transition hover:border-[#B3475A] hover:text-[#B3475A] dark:text-[#F4EFE8]'

export default function HafenPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="space-y-6 pt-10 text-center">
        <p className="font-[Caveat] text-6xl text-[#B3475A] md:text-7xl">Schön, dass Du da bist.</p>

        <p className="mx-auto max-w-xl leading-relaxed opacity-90">
          Hier ist Deine Audiobotschaft. Sieben Minuten. Wie eine WhatsApp Sprachnachricht von mir
          an Dich. Du kannst nur zuhören, oder im PDF mitlesen. Beides geht.
        </p>
      </section>

      {/* AUDIO PLAYER */}
      <section className="flex justify-center">
        <div className="w-full max-w-xl rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-10 dark:bg-[#081C3C]">
          <p className="mb-2 text-center text-sm font-medium tracking-widest text-[#B3475A] uppercase">
            Die Beziehung ist die Methode
          </p>
          <p className="mb-6 text-center text-sm opacity-70">
            Wie Du mit Deinem Kind sprichst, ist schon Sprachvermittlung
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls preload="metadata" src={AUDIO_URL} className="mx-auto w-full">
            Dein Browser unterstützt kein Audio. Du kannst die Datei direkt herunterladen.
          </audio>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a href={AUDIO_URL} download={AUDIO_FILENAME} className={downloadLinkCls}>
          Audio herunterladen (MP3)
        </a>
        <a href={PDF_URL} download={PDF_FILENAME} className={downloadLinkCls}>
          PDF zum Mitlesen herunterladen
        </a>
      </section>

      {/* SHARING NOTE */}
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm leading-relaxed italic opacity-70">
          Wenn diese Audiobotschaft Dich erreicht und Du jemanden kennst, dem sie auch guttun
          könnte, leite sie gerne weiter. Sprache wächst durch Beziehungen, auch zwischen Eltern.
        </p>
      </section>

      {/* BROWSER HINT */}
      <section className="mx-auto max-w-xl text-center">
        <p className="text-xs leading-relaxed text-[#9A8F85]">
          Hinweis: Für das beste Hörerlebnis öffne diese Seite in Deinem Browser. In Instagram tippe
          oben rechts auf die drei Punkte und wähle „In Safari öffnen“ oder „In Chrome öffnen“.
        </p>
      </section>

      {/* NORDKREIS BRIDGE */}
      <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-[#9A8F85]/30 bg-[#E3DED7]/60 px-6 py-10 text-center dark:bg-[#081C3C]/60">
        <p className="font-[Caveat] text-4xl text-[#B3475A]">Falls Du in Barcelona wohnst.</p>
        <p className="leading-relaxed opacity-90">
          Im September startet Nordkreis. Eine deutsche Samstagsschule und eine deutsche
          Gemeinschaft an der La Salle Gràcia. Mehr dazu unter linguatash.com/nordkreis.
        </p>
        <Link
          href="/nordkreis"
          className="inline-block rounded-xl border border-[#9A8F85]/50 px-6 py-2 text-sm font-medium text-[#B3475A] transition hover:border-[#B3475A]"
        >
          Nordkreis entdecken
        </Link>
      </section>

      {/* CLOSING SIGNATURE */}
      <section className="space-y-3 py-10 text-center">
        <p className="font-[Caveat] text-6xl text-[#B3475A]">Das Ohr zuerst.</p>
        <p className="text-xs opacity-60">Tash · LinguaTash · linguatash.com</p>
      </section>
    </main>
  )
}
