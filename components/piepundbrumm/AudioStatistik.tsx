'use client'

import { useEffect } from 'react'
import { registrar } from '@/components/alemanydu/track'

/**
 * Same pattern as components/nordkreis/audios/AudioStatistik.tsx: one
 * document level listener for every player on the page. Counts plays and
 * completed listens in Umami as `pub-audio-play` and `pub-audio-ende`, with
 * the file name as `datei`, and sets the lock screen metadata.
 *
 * `play` and `ended` do not bubble, hence the capture phase. Renders nothing.
 */
export default function AudioStatistik({
  titel,
}: {
  /** File name to lock screen title, e.g. `piepundbrumm-01.mp3` to `Wer macht das?`. */
  titel: Record<string, string>
}) {
  useEffect(() => {
    const metadatenSetzen = (datei: string) => {
      if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: titel[datei] ?? 'Piep und Brumm',
          artist: 'Tash Tenner',
          album: 'Piep und Brumm zum Nachhören',
          artwork: [
            { src: '/static/images/nordkreis-icon.png', sizes: '1098x1096', type: 'image/png' },
          ],
        })
      } catch {
        // An unsupported or partial implementation must not stop playback.
      }
    }

    // The file is the last path segment: /api/piepundbrumm/audio/piepundbrumm-01.mp3
    const dateiVon = (ziel: EventTarget | null) => {
      const el = ziel as HTMLAudioElement | null
      const src = el?.currentSrc || el?.src || ''
      const treffer = src.match(/\/api\/piepundbrumm\/audio\/(piepundbrumm-\d{2}\.mp3)/)
      return treffer ? treffer[1] : ''
    }

    const beimAbspielen = (e: Event) => {
      const el = e.target as HTMLAudioElement | null
      const datei = dateiVon(e.target)
      if (!el || !datei) return
      metadatenSetzen(datei)
      // `play` fires again on every resume; only count a start from the top.
      if (el.currentTime > 1) return
      registrar('pub-audio-play', { datei })
    }

    const beimEnde = (e: Event) => {
      const datei = dateiVon(e.target)
      if (!datei) return
      registrar('pub-audio-ende', { datei })
    }

    document.addEventListener('play', beimAbspielen, true)
    document.addEventListener('ended', beimEnde, true)
    return () => {
      document.removeEventListener('play', beimAbspielen, true)
      document.removeEventListener('ended', beimEnde, true)
    }
  }, [titel])

  return null
}
