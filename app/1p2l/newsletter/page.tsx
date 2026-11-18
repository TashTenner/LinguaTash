// /1p2l/newsletter: the signup on its own, to link from social media.

import Link from '../../../components/Link'
import { genPageMetadata } from 'app/seo'
import BoletinForm from '@/components/BoletinForm'
import NewsletterTexto from '@/components/1p2l/NewsletterTexto'

export const metadata = genPageMetadata({
  title: '1P2L Newsletter',
  description:
    'The 1P2L newsletter: the monthly meeting and passing two languages on to your children. El boletín de 1P2L.',
})

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-12 dark:bg-[#081C3C]">
        <NewsletterTexto />
        <div className="mt-10">
          <BoletinForm lista="1p2l" />
        </div>
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/1p2l" className="text-[#B3475A] underline-offset-4 hover:underline">
          More about 1P2L · Más sobre 1P2L
        </Link>
      </p>
    </main>
  )
}
