'use client'

import { useState } from 'react'

/**
 * Copia una lista de emails separada por comas, lista para pegar en el campo
 * CCO de Gmail. CCO y no Para: las familias no se conocen todas entre sí y
 * nadie dio su email para que lo vean las demás.
 */
export default function CopiarEmails({ etiqueta, emails }: { etiqueta: string; emails: string[] }) {
  const [estado, setEstado] = useState<'listo' | 'copiado' | 'error'>('listo')

  async function copiar() {
    try {
      await navigator.clipboard.writeText(emails.join(', '))
      setEstado('copiado')
    } catch {
      setEstado('error')
    }
    setTimeout(() => setEstado('listo'), 2500)
  }

  return (
    <button
      type="button"
      onClick={copiar}
      disabled={emails.length === 0}
      className="rounded-xl border border-[#9a8f85]/60 px-5 py-2 text-sm font-medium transition-colors hover:bg-[#e3ded7] disabled:opacity-50"
    >
      {estado === 'copiado'
        ? `Copiados ${emails.length}, pegalos en CCO`
        : estado === 'error'
          ? 'No se pudo copiar'
          : `${etiqueta} (${emails.length})`}
    </button>
  )
}
