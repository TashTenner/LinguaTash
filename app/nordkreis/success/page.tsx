'use client'

// app/nordkreis/success/page.tsx

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const name = params.get('name') ?? ''
  const email = params.get('email') ?? ''

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

        <h1 className="text-4xl" style={{ letterSpacing: '-0.04em' }}>
          <span className="font-[400]">Vielen Dank!</span>
        </h1>

        <p className="mt-3 text-lg font-semibold text-[#B3475A]">
          Du stehst auf der Warteliste · Estás en la lista de espera
        </p>

        {name && (
          <p className="mt-6 text-[#081C3C]/80 dark:text-[#F4EFE8]/80">
            Herzlich willkommen, <strong>{name}</strong>!
          </p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-[#081C3C]/70 dark:text-[#F4EFE8]/70">
          Ein unterzeichnetes Vertragsexemplar wurde an {email && <strong>{email}</strong>}{' '}
          gesendet.
        </p>

        <div className="mx-auto my-8 h-px w-20 bg-[#9A8F85]" />

        <div className="space-y-2 rounded-xl bg-[#081C3C]/5 p-4 text-sm leading-relaxed text-[#081C3C]/80 dark:bg-[#F4EFE8]/5 dark:text-[#F4EFE8]/80">
          <p>
            <strong>Kein Betrag wurde heute abgebucht.</strong>
          </p>
          <p>
            Wir melden uns, sobald Nordkreis die Mindestteilnehmerzahl erreicht hat, bevor die erste
            SEPA Lastschrift aktiviert wird.
          </p>
          <p className="text-xs text-[#9A8F85]">
            Hoy no se ha realizado ningún cargo. Nos pondremos en contacto cuando Nordkreis alcance
            el número mínimo de participantes, antes de activar el primer adeudo SEPA.
          </p>
        </div>

        <Link
          href="/nordkreis"
          className="mt-8 inline-block rounded-xl border border-[#9A8F85]/50 px-5 py-2.5 text-sm text-[#9A8F85] transition-all hover:border-[#081C3C] hover:text-[#081C3C] dark:hover:border-[#F4EFE8] dark:hover:text-[#F4EFE8]"
        >
          ← Zurück zu Nordkreis
        </Link>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
