'use client'

// app/nordkreis/admin/login/page.tsx

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/nordkreis/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falsches Passwort')
      router.push('/nordkreis/admin')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4EFE8] px-4 font-['Noto_Sans'] dark:bg-[#081C3C]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-transparent bg-white p-8 shadow-xl dark:border-[#9A8F85]/20 dark:bg-[#0d2547]"
      >
        <h1 className="mb-1 text-lg font-bold text-[#081C3C] dark:text-[#F4EFE8]">
          Nordkreis Admin
        </h1>
        <p className="mb-6 text-sm text-[#9A8F85]">Bitte Passwort eingeben.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          className="mb-4 w-full rounded-xl border border-[#9A8F85]/40 bg-transparent px-4 py-2.5 text-sm text-[#081C3C] outline-none focus:border-[#B3475A] dark:text-[#F4EFE8]"
        />
        {error && <p className="mb-4 text-sm text-[#B3475A]">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl bg-[#B3475A] py-2.5 text-sm font-semibold text-[#F4EFE8] transition-all hover:bg-[#9f3f50] disabled:opacity-50"
        >
          {loading ? 'Wird geprüft…' : 'Anmelden'}
        </button>
      </form>
    </div>
  )
}
