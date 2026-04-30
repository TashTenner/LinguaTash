'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const PROJECTS = ['Fonetikas', 'Nordkreis', 'Alemán·y·Du', 'Resuena', '1P2L'] as const

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggle(project: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(project) ? next.delete(project) : next.add(project)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const emailValue = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, projects: [...selected] }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setSelected(new Set())
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
          className="min-w-0 flex-1 rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2.5 text-sm text-[#081C3C] placeholder:text-[#9A8F85] focus:border-[#B3475A] focus:outline-none focus:ring-2 focus:ring-[#B3475A]/20 disabled:opacity-60 dark:bg-[#081C3C] dark:text-[#F4EFE8]"
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
          ¿Qué proyectos te interesan? <span className="opacity-60">(opcional)</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {PROJECTS.map((project) => {
            const checked = selected.has(project)
            return (
              <button
                key={project}
                type="button"
                onClick={() => toggle(project)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-150 ${
                  checked
                    ? 'border-[#B3475A] bg-[#B3475A] text-white'
                    : 'border-[#9A8F85]/40 text-[#081C3C] hover:border-[#B3475A] dark:text-[#F4EFE8]'
                }`}
              >
                {project}
              </button>
            )
          })}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-center text-xs text-[#B3475A]">{errorMsg}</p>
      )}
    </form>
  )
}
