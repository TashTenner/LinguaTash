// /nordkreis/newsletter: the signup page on its own, for QR codes (events at
// the Goethe-Institut and similar) and for sending as a link.

import Image from 'next/image'
import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import NewsletterForm from '@/components/nordkreis/NewsletterForm'
import NewsletterTexto from '@/components/nordkreis/NewsletterTexto'

export const metadata = genPageMetadata({
  title: 'Nordkreis Newsletter',
  description:
    'Der Newsletter der deutschen Samstagsschule Nordkreis in Barcelona. El boletín de Nordkreis.',
})

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="block h-20 w-auto dark:hidden"
          />
          <Image
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis"
            width={80}
            height={80}
            className="hidden h-20 w-auto dark:block"
          />
        </div>

        <NewsletterTexto />

        <div className="mt-10">
          <NewsletterForm />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/nordkreis" className="text-[#B3475A] underline-offset-4 hover:underline">
          Mehr über Nordkreis · Más sobre Nordkreis
        </Link>
      </p>
    </main>
  )
}
