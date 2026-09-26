'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LaJuntadaAdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError('')

    const res = await fetch('/api/lajuntada/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/lajuntada/admin')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? 'No se pudo entrar')
      setEnviando(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Panel de La Juntada</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-[#9A8F85]/40 px-4 py-3"
            required
          />
        </div>

        {error && <p className="text-sm text-[#B3475A]">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
