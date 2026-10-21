'use client'

import { useEffect, useRef, useState } from 'react'
import { registrar } from '@/components/alemanydu/track'

/**
 * One entry in the queue. Deliberately narrow: this is a client component, so
 * everything here is serialised into the page payload. Build these in the
 * page, never hand over a whole Aufnahme.
 */
export type Titel = {
  nummer: number
  titel: string
  src: string
}

/** Plays every published Saturday in order, for the car. */
export default function AllesAbspielen({ titel }: { titel: Titel[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const laeuft = index !== null
  const aktuell = index === null ? null : titel[index]

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    if (index === null) {
      el.pause()
      return
    }

    el.src = titel[index].src
    // A refused play (autoplay rules, network) falls back to idle rather than
    // leaving a button that claims to be playing.
    el.play().catch(() => setIndex(null))
  }, [index, titel])

  if (titel.length === 0) return null

  const beimEnde = () => setIndex((i) => (i === null || i + 1 >= titel.length ? null : i + 1))

  return (
    <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-5 py-6 sm:px-8 dark:bg-[#081C3C]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => {
            if (!laeuft) registrar('nk-audio-alles')
            setIndex(laeuft ? null : 0)
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B3475A] px-5 py-2.5 text-sm font-medium text-[#F4EFE8] transition-transform duration-200 hover:scale-105"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            {laeuft ? (
              <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
            ) : (
              <path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
            )}
          </svg>
          {laeuft ? 'Stopp' : 'Alle abspielen'}
        </button>

        <p className="text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">
          {aktuell ? `Es läuft: ${aktuell.titel}` : 'Alle Samstage der Reihe nach.'}
        </p>
      </div>

      {/*
        No caption track: there is no transcript of these recordings. What
        parents need in writing (Wort der Woche, the formulas) is on each card.
      */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        onEnded={beimEnde}
        controls
        hidden={!laeuft}
        aria-label="Alle Samstage der Reihe nach"
        className="mt-4 w-full"
      />
    </div>
  )
}
