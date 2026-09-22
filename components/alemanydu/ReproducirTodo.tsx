'use client'

import { useEffect, useRef, useState } from 'react'
import { registrar } from './track'

/**
 * One entry in the queue. Deliberately narrow: this is a client component, so
 * everything here is serialised into the page payload. Build these objects in
 * the server component and never hand over a whole track.
 */
export type PistaEnCola = {
  clase: number
  titulo: string
  src: string
}

/**
 * Plays every available class in order, start to finish.
 *
 * The per class cards keep their own native players. This is the extra way in,
 * for the car: press once and the whole course so far plays through.
 */
export default function ReproducirTodo({ pistas }: { pistas: PistaEnCola[] }) {
  const [indice, setIndice] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sonando = indice !== null
  const actual = indice === null ? null : pistas[indice]

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    if (indice === null) {
      el.pause()
      return
    }

    el.src = pistas[indice].src
    // A browser can refuse to play (autoplay rules, a network error). Fall back
    // to the idle state rather than leaving a button that claims to be playing.
    el.play().catch(() => setIndice(null))
  }, [indice, pistas])

  if (pistas.length === 0) return null

  const alTerminar = () => setIndice((i) => (i === null || i + 1 >= pistas.length ? null : i + 1))

  return (
    <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-6 sm:px-8 dark:bg-[#081C3C]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => {
            if (!sonando) registrar('audio-todo')
            setIndice(sonando ? null : 0)
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B3475A] px-5 py-2.5 text-sm font-medium text-[#F4EFE8] transition-transform duration-200 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            {sonando ? (
              <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
            ) : (
              <path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
            )}
          </svg>
          {sonando ? 'Parar' : 'Reproducir todo'}
        </button>

        <p className="text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
          {actual ? `Sonando: ${actual.titulo}` : 'Todas las clases, en orden.'}
        </p>
      </div>

      {/*
        No caption track on purpose, same reason as the per class players: there
        is no public transcript, and German text beside the audio is the exact
        interference the course exists to prevent.
      */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        onEnded={alTerminar}
        controls
        hidden={!sonando}
        aria-label="Todas las clases en orden"
        className="mt-4 w-full"
      />
    </div>
  )
}
