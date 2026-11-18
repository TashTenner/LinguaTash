'use client'

// The homepage box: any of the seven boletines, ticked by the reader. None is
// ticked in advance (a pre-ticked box is not consent) and at least one is
// needed. One ticked goes through that project's own form, so the
// confirmation comes in its language; several go through the LinguaTash form
// with one confirmation for all. See app/api/newsletter/route.ts.

import { useState } from 'react'
import Link from './Link'
import type { Lista } from '@/lib/newsletter/kit'

type Status = 'idle' | 'loading' | 'success' | 'error'

const BOLETINES: { nombre: string; lista: Lista }[] = [
  { nombre: 'LinguaTash general', lista: 'linguatash' },
  { nombre: 'Fonetikas', lista: 'fonetikas' },
  { nombre: 'Nordkreis', lista: 'nordkreis' },
  { nombre: 'Alemán·y·Du', lista: 'alemanydu' },
  { nombre: 'Resuena', lista: 'resuena' },
  { nombre: '1P2L', lista: '1p2l' },
  { nombre: 'La·Juntada', lista: 'lajuntada' },
]

const ERROR = 'Ha ocurrido un error. Inténtalo de nuevo o escríbeme a info@linguatash.com.'
const NINGUNO = 'Elige al menos un boletín.'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Set<Lista>>(new Set())
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggle(lista: Lista) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(lista)) next.delete(lista)
      else next.add(lista)
      return next
    })
    if (errorMsg === NINGUNO) {
      setErrorMsg('')
      setStatus('idle')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (selected.size === 0) {
      setErrorMsg(NINGUNO)
      setStatus('error')
      return
    }
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
          listas: [...selected],
          email: campo('email'),
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
      {/* The boletines */}
      <fieldset>
        <legend className="mb-2 w-full text-center text-sm text-[#9A8F85]">
          ¿Qué boletines quieres recibir?
        </legend>
        <div className="flex flex-wrap justify-center gap-2">
          {BOLETINES.map(({ nombre, lista }) => {
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
        <p className="mt-2 text-center text-xs opacity-60">
          LinguaTash general: novedades de todos los proyectos, 3 o 4 veces al año.
        </p>
      </fieldset>

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
