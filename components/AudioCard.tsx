'use client'

import { useRef } from 'react'

function AudioCard({ label, src }) {
  const audioRef = useRef(null)

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <div className="rounded-xl border border-[#9A8F85]/40 p-4 text-center">
      <p className="mb-3 text-sm font-medium">{label}</p>

      <button
        onClick={play}
        className="rounded-lg bg-[#B3475A] px-4 py-2 text-white transition hover:scale-105"
      >
        ▶️ Escuchar
      </button>

      <audio ref={audioRef}>
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default AudioCard
