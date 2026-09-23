'use client'

import { useEffect } from 'react'
import { marcar } from './escuchados'
import { registrar } from './track'

/**
 * Counts plays without turning every card into a client component.
 *
 * `play` and `ended` do not bubble, so they are caught in the capture phase on
 * the document. One listener therefore covers every player on the page, the per
 * class cards and the Reproducir todo queue alike, while the cards stay server
 * components and the data module stays server side.
 *
 * Why an event and not a count of requests: the class audios are cached for a
 * year, so a parent replaying one all week never touches the server again after
 * the first time. Counting requests would measure first fetches per device.
 * This measures presses, which is the actual question.
 *
 * Renders nothing.
 */
export default function AudioStats({ titulos }: { titulos: Record<string, string> }) {
  useEffect(() => {
    /**
     * What the phone shows on the lock screen and in the car.
     *
     * When audio streams from a page, iOS builds the now playing panel from the
     * page, not from the ID3 tags in the file: without this it shows the site
     * icon and the browser tab title. The embedded cover art still matters, but
     * only for a file someone downloaded and played from Files.
     */
    const ponerMetadatos = (archivo: string) => {
      if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: titulos[archivo] ?? 'Alemán·y·Du',
          artist: 'Alemán·y·Du',
          album: 'Alemán·y·Du · pre-A1',
          artwork: [
            {
              src: '/static/images/alemanydu-cover.jpg',
              sizes: '1400x1400',
              type: 'image/jpeg',
            },
          ],
        })
      } catch {
        // An unsupported or partial implementation must not stop playback.
      }
    }

    const archivoDe = (destino: EventTarget | null) => {
      const el = destino as HTMLAudioElement | null
      const src = el?.currentSrc || el?.src || ''
      const encontrado = src.match(/[?&]file=([^&]+)/)
      return encontrado ? decodeURIComponent(encontrado[1]) : ''
    }

    const alReproducir = (e: Event) => {
      const el = e.target as HTMLAudioElement | null
      if (!el) return
      const archivo = archivoDe(e.target)
      if (!archivo) return

      // Always, including on resume and when the queue advances a track, so the
      // lock screen never lags behind what is actually playing.
      ponerMetadatos(archivo)

      // `play` fires again on every resume after a pause. Only count a start
      // from the beginning, so pausing halfway does not read as a second play.
      // A genuine replay seeks back to zero and is still counted.
      if (el.currentTime > 1) return
      registrar('audio-play', { archivo })
    }

    const alTerminar = (e: Event) => {
      const archivo = archivoDe(e.target)
      if (!archivo) return
      registrar('audio-fin', { archivo })
      // Reaching the end is the honest signal that a class was listened to.
      marcar(archivo)
    }

    document.addEventListener('play', alReproducir, true)
    document.addEventListener('ended', alTerminar, true)
    return () => {
      document.removeEventListener('play', alReproducir, true)
      document.removeEventListener('ended', alTerminar, true)
    }
  }, [titulos])

  return null
}
