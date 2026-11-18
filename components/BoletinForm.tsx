'use client'

// Signup for a project's boletín, in Spanish. Each project brings its own
// register: La Juntada speaks in vos, Alemán·y·Du in tú. Posts to
// /api/newsletter, which subscribes to that project's Kit form and tag.

import { useState } from 'react'
import Link from './Link'
import type { Lista } from '@/lib/newsletter/kit'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Textos {
  nombre: string
  email: string
  boton: string
  enviando: string
  exito: string
  error: string
  pie: string
}

const TEXTOS: Partial<Record<Lista, Textos>> = {
  lajuntada: {
    nombre: 'Tu nombre',
    email: 'Tu email',
    boton: 'Quiero el boletín',
    enviando: 'Un momento…',
    exito: '¡Casi listo! Revisá tu correo y confirmá la suscripción con el botón del mail.',
    error: 'No se pudo. Probá de nuevo o escribime a lajuntada@linguatash.com.',
    pie: 'Te podés dar de baja cuando quieras, con un clic.',
  },
  alemanydu: {
    nombre: 'Tu nombre',
    email: 'Tu email',
    boton: 'Quiero el boletín',
    enviando: 'Un momento…',
    exito: '¡Casi listo! Revisa tu correo y confirma la suscripción con el botón del email.',
    error: 'No se ha podido. Inténtalo de nuevo o escríbeme a alemanydu@linguatash.com.',
    pie: 'Puedes darte de baja cuando quieras, con un clic.',
  },
}

export default function BoletinForm({ lista }: { lista: Lista }) {
  const [status, setStatus] = useState<Status>('idle')
  const t = TEXTOS[lista]
  if (!t) return null

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
          lista,
          email: campo('email'),
          nombre: campo('nombre'),
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
      <p role="status" className="mx-auto max-w-md text-center font-semibold text-[#B3475A]">
        {t.exito}
      </p>
    )
  }

  const campoClase =
    'w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2.5 text-base text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:ring-2 focus:ring-[#B3475A]/20 focus:outline-none disabled:opacity-60 dark:bg-[#081C3C] dark:text-[#F4EFE8]'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 text-left">
      <div>
        <label htmlFor={`boletin-${lista}-nombre`} className="mb-1 block text-sm font-medium">
          {t.nombre} <span className="font-normal opacity-60">(opcional)</span>
        </label>
        <input
          id={`boletin-${lista}-nombre`}
          name="nombre"
          type="text"
          autoComplete="given-name"
          maxLength={100}
          disabled={status === 'loading'}
          className={campoClase}
        />
      </div>

      <div>
        <label htmlFor={`boletin-${lista}-email`} className="mb-1 block text-sm font-medium">
          {t.email}
        </label>
        <input
          id={`boletin-${lista}-email`}
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
        <label htmlFor={`boletin-${lista}-website`}>Website</label>
        <input
          id={`boletin-${lista}-website`}
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
        {status === 'loading' ? t.enviando : t.boton}
      </button>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-[#B3475A]">
          {t.error}
        </p>
      )}

      <p className="text-center text-xs leading-relaxed opacity-70">
        {t.pie}{' '}
        <Link href="/politica-de-privacidad" className="underline underline-offset-4">
          Privacidad
        </Link>
      </p>
    </form>
  )
}
