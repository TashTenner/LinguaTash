'use client'

// The homepage signup: the LinguaTash boletín, plus the newsletter of every
// project ticked here (each one is a Kit tag, all confirmed by the one
// LinguaTash confirmation email). See lib/newsletter/kit.ts.

import { useState } from 'react'
import Link from './Link'
import type { Lista } from '@/lib/newsletter/kit'

type Status = 'idle' | 'loading' | 'success' | 'error'

const PROJECTS: { nombre: string; lista: Lista }[] = [
  { nombre: 'Fonetikas', lista: 'fonetikas' },
  { nombre: 'Nordkreis', lista: 'nordkreis' },
  { nombre: 'Alemán·y·Du', lista: 'alemanydu' },
  { nombre: 'Resuena', lista: 'resuena' },
  { nombre: '1P2L', lista: '1p2l' },
  { nombre: 'La·Juntada', lista: 'lajuntada' },
]

const ERROR = 'Ha ocurrido un error. Inténtalo de nuevo o escríbeme a info@linguatash.com.'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Set<Lista>>(new Set())
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggle(project: Lista) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(project)) next.delete(project)
      else next.add(project)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const campo = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? ''
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lista: 'linguatash',
          email: campo('email'),
          tambien: [...selected],
          website: campo('website'),
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setSelected(new Set())
      } else {
        setErrorMsg(ERROR)
        setStatus('error')
      }
    } catch {
      setErrorMsg(ERROR)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-center text-sm font-medium text-[#B3475A]">
        ¡Casi listo! Revisa tu correo y confirma la suscripción con el botón del email.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      {/* Email row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={status === 'loading'}
          className="min-w-0 flex-1 rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2.5 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none disabled:opacity-60 dark:bg-[#081C3C] dark:text-[#F4EFE8]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-xl bg-[#B3475A] px-6 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:scale-105 disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando…' : 'Apuntarme'}
        </button>
      </div>

      {/* Project checkboxes */}
      <div>
        <p className="mb-2 text-center text-sm text-[#9A8F85]">
          ¿Quieres también el boletín de algún proyecto?{' '}
          <span className="opacity-60">(opcional)</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {PROJECTS.map(({ nombre, lista }) => {
            const checked = selected.has(lista)
            return (
              <button
                key={lista}
                type="button"
                aria-pressed={checked}
                onClick={() => toggle(lista)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-150 ${
                  checked
                    ? 'border-[#B3475A] bg-[#B3475A] text-white'
                    : 'border-[#9A8F85]/40 text-[#081C3C] hover:border-[#B3475A] dark:text-[#F4EFE8]'
                }`}
              >
                {nombre}
              </button>
            )
          })}
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers, filled only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="waitlist-website">Website</label>
        <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-center text-xs text-[#B3475A]">
          {errorMsg}
        </p>
      )}

      <p className="text-center text-xs opacity-60">
        Puedes darte de baja cuando quieras, con un clic.{' '}
        <Link href="/politica-de-privacidad" className="underline underline-offset-4">
          Privacidad
        </Link>
      </p>
    </form>
  )
}
