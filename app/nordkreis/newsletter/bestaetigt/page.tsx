// /nordkreis/newsletter/bestaetigt: where Kit sends people after they click the
// confirmation link (set in the Nordkreis form's Incentive settings).

import Image from 'next/image'
import Link from '../../../../components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Anmeldung bestätigt',
  robots: { index: false, follow: false },
})

export default function NewsletterBestaetigtPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 text-center dark:bg-[#081C3C]">
        <div className="mb-6 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="block dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="hidden dark:block"
          />
        </div>

        <h1 className="text-4xl" style={{ letterSpacing: '-0.04em' }} lang="de">
          Schön, dass Du dabei bist!
        </h1>

        <p lang="de" className="mt-6 leading-relaxed opacity-90">
          Deine Anmeldung zum Nordkreis Newsletter ist bestätigt. Der nächste Newsletter kommt
          direkt in Dein Postfach.
        </p>
        <p lang="es" className="mt-4 leading-relaxed opacity-80">
          Tu suscripción al boletín de Nordkreis está confirmada. El próximo boletín llegará
          directamente a tu correo.
        </p>

        <Link
          href="/nordkreis"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-[#B3475A] px-6 py-2.5 font-medium text-white transition-transform duration-200 hover:scale-105"
        >
          Zu Nordkreis · Ir a Nordkreis
        </Link>
      </div>
    </main>
  )
}
