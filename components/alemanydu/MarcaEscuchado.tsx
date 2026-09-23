'use client'

import { useEffect, useState } from 'react'
import { EVENTO_CAMBIO, yaEscuchado } from './escuchados'

/**
 * A quiet mark on classes this browser has already played through.
 *
 * By March there will be twenty odd classes on the page and a parent will
 * genuinely lose track of which ones they have done. This answers that at a
 * glance, with no account and nothing leaving the device.
 *
 * It renders nothing on the server and reads storage only after mounting, so
 * the server and the first client render agree and React does not complain
 * about a hydration mismatch.
 */
export default function MarcaEscuchado({ archivo }: { archivo: string }) {
  const [escuchado, setEscuchado] = useState(false)

  useEffect(() => {
    const revisar = () => setEscuchado(yaEscuchado(archivo))
    revisar()
    window.addEventListener(EVENTO_CAMBIO, revisar)
    return () => window.removeEventListener(EVENTO_CAMBIO, revisar)
  }, [archivo])

  if (!escuchado) return null

  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M9.55 17.6 4.4 12.45l1.414-1.414 3.736 3.736 8.636-8.636L19.6 7.55z" />
      </svg>
      Ya escuchado
    </p>
  )
}
