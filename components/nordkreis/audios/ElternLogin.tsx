'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function ElternLogin() {
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')
  const [laedt, setLaedt] = useState(false)
  const router = useRouter()

  const absenden = async (e: FormEvent) => {
    e.preventDefault()
    setFehler('')
    setLaedt(true)
    try {
      const res = await fetch('/api/nordkreis/eltern-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwort }),
      })
      if (!res.ok) {
        throw new Error(
          res.status === 401 ? 'Das Passwort stimmt nicht.' : 'Gerade klappt es nicht.'
        )
      }
      router.push('/nordkreis/audios')
      router.refresh()
    } catch (e: unknown) {
      setFehler(e instanceof Error ? e.message : 'Gerade klappt es nicht.')
    } finally {
      setLaedt(false)
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 font-['Noto_Sans']">
      <form
        onSubmit={absenden}
        className="w-full max-w-sm rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]"
      >
        <h1 className="mb-1 text-lg font-semibold text-[#081C3C] dark:text-[#F4EFE8]">
          Nordkreis Audios
        </h1>
        <p className="mb-6 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
          Das Passwort habt Ihr von mir per E-Mail bekommen. Ihr gebt es auf diesem Gerät nur einmal
          ein.
        </p>
        <label htmlFor="passwort" className="sr-only">
          Passwort
        </label>
        <input
          id="passwort"
          type="password"
          autoComplete="current-password"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          placeholder="Passwort"
          className="mb-4 min-h-11 w-full rounded-xl border border-[#9A8F85]/40 bg-transparent px-4 py-2.5 text-[#081C3C] outline-none focus:border-[#B3475A] dark:text-[#F4EFE8]"
        />
        {fehler ? <p className="mb-4 text-sm text-[#B3475A]">{fehler}</p> : null}
        <button
          type="submit"
          disabled={laedt || !passwort}
          className="min-h-11 w-full rounded-xl bg-[#B3475A] py-2.5 text-sm font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50] disabled:opacity-50"
        >
          {laedt ? 'Wird geprüft' : 'Weiter'}
        </button>
        <p className="mt-6 text-xs text-[#9A8F85] dark:text-[#F4EFE8]/60">
          Kein Passwort?{' '}
          <a href="mailto:nordkreis@linguatash.com" className="text-[#B3475A] underline">
            nordkreis@linguatash.com
          </a>
        </p>
      </form>
    </main>
  )
}
