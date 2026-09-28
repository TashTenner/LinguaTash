'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Los dos botones del panel. Es lo único que necesita ser cliente: el resto
 * de la página lee Stripe en el servidor y se dibuja de una vez.
 */
export default function AdminAcciones() {
  const router = useRouter()
  const [recargando, startTransition] = useTransition()
  const [saliendo, setSaliendo] = useState(false)

  function recargar() {
    // refresh() vuelve a pedir la página al servidor, que vuelve a leer Stripe.
    startTransition(() => router.refresh())
  }

  async function salir() {
    setSaliendo(true)
    await fetch('/api/lajuntada/admin-logout', { method: 'POST' })
    router.push('/lajuntada/admin/login')
    router.refresh()
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={recargar}
        disabled={recargando}
        className="rounded-xl bg-[#b3475a] px-5 py-2 text-sm font-medium text-[#f4efe8] transition-colors hover:bg-[#9f3f50] disabled:opacity-60"
      >
        {recargando ? 'Actualizando...' : 'Actualizar'}
      </button>

      <button
        type="button"
        onClick={salir}
        disabled={saliendo}
        className="rounded-xl border border-[#9a8f85]/60 px-5 py-2 text-sm font-medium transition-colors hover:bg-[#e3ded7] disabled:opacity-60"
      >
        {saliendo ? 'Saliendo...' : 'Salir'}
      </button>
    </div>
  )
}
