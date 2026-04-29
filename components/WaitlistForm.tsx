'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error ?? 'Ha ocurrido un error. Inténtalo de nuevo.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Ha ocurrido un error. Inténtalo de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-center text-sm font-medium text-[#B3475A]">
        ¡Apuntado! Te avisaremos cuando haya novedades.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        disabled={status === 'loading'}
        className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2.5 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:outline-none focus:ring-2 focus:ring-[#B3475A]/20 disabled:opacity-60 dark:bg-[#081C3C] dark:text-[#F4EFE8] sm:w-72"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-[#B3475A] px-6 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:scale-105 disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? 'Enviando…' : 'Unirme a la lista'}
      </button>
      {status === 'error' && (
        <p className="w-full text-center text-xs text-[#B3475A] sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  )
}
