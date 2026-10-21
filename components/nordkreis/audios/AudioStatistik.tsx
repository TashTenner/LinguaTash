'use client'

import { useEffect } from 'react'
import { registrar } from '@/components/alemanydu/track'
import { markieren } from './gehoert'

/**
 * One document level listener for every player on the page: sets the lock
 * screen metadata, counts plays in Umami, and marks a Saturday as heard when
 * it reaches the end. `play` and `ended` do not bubble, hence the capture
 * phase. The cards stay server components.
 *
 * Renders nothing.
 */
export default function AudioStatistik({
  titel,
  album,
}: {
  /** File name to lock screen title, e.g. `Samstag 3 · Hannas Tasche`. */
  titel: Record<string, string>
  /** e.g. `Nordkreis Entdeckerkreis · Zyklus A`. */
  album: string
}) {
  useEffect(() => {
    // Streaming from a page, iOS builds the now playing panel from this, not
    // from the ID3 tags in the file.
    const metadatenSetzen = (datei: string) => {
      if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: titel[datei] ?? 'Nordkreis',
          artist: 'Tash Tenner',
          album,
          artwork: [
            { src: '/static/images/nordkreis-icon.png', sizes: '1098x1096', type: 'image/png' },
          ],
        })
      } catch {
        // An unsupported or partial implementation must not stop playback.
      }
    }

    const dateiVon = (ziel: EventTarget | null) => {
      const el = ziel as HTMLAudioElement | null
      const src = el?.currentSrc || el?.src || ''
      const treffer = src.match(/[?&]file=([^&]+)/)
      return treffer ? decodeURIComponent(treffer[1]) : ''
    }

    const beimAbspielen = (e: Event) => {
      const el = e.target as HTMLAudioElement | null
      const datei = dateiVon(e.target)
      if (!el || !datei) return
      metadatenSetzen(datei)
      // `play` fires again on every resume; only count a start from the top.
      if (el.currentTime > 1) return
      registrar('nk-audio-play', { datei })
    }

    const beimEnde = (e: Event) => {
      const datei = dateiVon(e.target)
      if (!datei) return
      registrar('nk-audio-ende', { datei })
      markieren(datei)
    }

    document.addEventListener('play', beimAbspielen, true)
    document.addEventListener('ended', beimEnde, true)
    return () => {
      document.removeEventListener('play', beimAbspielen, true)
      document.removeEventListener('ended', beimEnde, true)
    }
  }, [titel, album])

  return null
}
