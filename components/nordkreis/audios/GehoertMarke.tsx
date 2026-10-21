'use client'

import { useEffect, useState } from 'react'
import { EREIGNIS_AENDERUNG, schonGehoert } from './gehoert'

/**
 * A quiet mark on Saturdays this browser has already played through. Renders
 * nothing on the server and reads storage only after mounting, so there is no
 * hydration mismatch.
 */
export default function GehoertMarke({ datei }: { datei: string }) {
  const [gehoert, setGehoert] = useState(false)

  useEffect(() => {
    const pruefen = () => setGehoert(schonGehoert(datei))
    pruefen()
    window.addEventListener(EREIGNIS_AENDERUNG, pruefen)
    return () => window.removeEventListener(EREIGNIS_AENDERUNG, pruefen)
  }, [datei])

  if (!gehoert) return null

  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M9.55 17.6 4.4 12.45l1.414-1.414 3.736 3.736 8.636-8.636L19.6 7.55z" />
      </svg>
      Schon gehört
    </p>
  )
}
