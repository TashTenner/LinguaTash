/**
 * Thin wrapper on the Umami tracker.
 *
 * Analytics must never break playback. If Umami is blocked, still loading, or
 * absent entirely, every call here is a silent no op. Nothing in the audio path
 * may depend on this having worked.
 */
type VentanaConUmami = Window & {
  umami?: { track: (evento: string, datos?: Record<string, string>) => void }
}

export function registrar(evento: string, datos?: Record<string, string>) {
  if (typeof window === 'undefined') return
  try {
    ;(window as VentanaConUmami).umami?.track(evento, datos)
  } catch {
    // Never let a stats call take the page down with it.
  }
}
