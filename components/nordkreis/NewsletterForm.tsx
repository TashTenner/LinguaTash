'use client'

// Signup for the Nordkreis Newsletter. Posts to /api/newsletter with
// lista: 'nordkreis', which subscribes to the Nordkreis Kit form (double opt-in,
// confirmation mail in German) and applies the nordkreis tag.

import { useState } from 'react'
import Link from '../Link'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const campo = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? ''

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lista: 'nordkreis',
          email: campo('email'),
          nombre: campo('vorname'),
          website: campo('website'),
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="mx-auto max-w-md space-y-3 text-center">
        <p lang="de" className="font-semibold text-[#B3475A]">
          Fast geschafft! Schau bitte in Dein Postfach und bestätige Deine Anmeldung.
        </p>
        <p lang="es" className="text-sm opacity-80">
          ¡Casi listo! Revisa tu correo y confirma la suscripción.
        </p>
      </div>
    )
  }

  const campoClase =
    'w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2.5 text-base text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none disabled:opacity-60 dark:bg-[#081C3C] dark:text-[#F4EFE8]'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 text-left">
      <div>
        <label htmlFor="newsletter-vorname" className="mb-1 block text-sm font-medium">
          Vorname · Nombre <span className="font-normal opacity-60">(optional)</span>
        </label>
        <input
          id="newsletter-vorname"
          name="vorname"
          type="text"
          autoComplete="given-name"
          maxLength={100}
          disabled={status === 'loading'}
          className={campoClase}
        />
      </div>

      <div>
        <label htmlFor="newsletter-email" className="mb-1 block text-sm font-medium">
          Mailadresse · Correo electrónico
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={status === 'loading'}
          className={campoClase}
        />
      </div>

      {/* Honeypot: hidden from people and screen readers, filled only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-11 w-full rounded-xl bg-[#B3475A] px-6 py-2.5 text-base font-medium text-white transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
      >
        {status === 'loading' ? 'Einen Moment …' : 'Anmelden · Suscribirme'}
      </button>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-[#B3475A]">
          Das hat leider nicht geklappt. Bitte versuch es noch einmal oder schreib an
          nordkreis@linguatash.com.
        </p>
      )}

      <p className="text-center text-xs leading-relaxed opacity-70">
        Abmelden jederzeit mit einem Klick · Puedes darte de baja cuando quieras.{' '}
        <Link href="/politica-de-privacidad" className="underline underline-offset-4">
          Datenschutz · Privacidad
        </Link>
      </p>
    </form>
  )
}
