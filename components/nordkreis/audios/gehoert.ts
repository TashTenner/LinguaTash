/**
 * Which Saturdays this browser has already listened through.
 *
 * localStorage on purpose: a convenience for one parent on one phone, never
 * read by the server. Every access is wrapped, because storage can be blocked
 * or missing in a private window and none of that may break the page.
 */
const SCHLUESSEL = 'nordkreis:gehoert'

/** Fired after markieren(), so cards already on screen can update. */
export const EREIGNIS_AENDERUNG = 'nordkreis:gehoert-aenderung'

function alleLesen(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const roh = window.localStorage.getItem(SCHLUESSEL)
    const liste = roh ? JSON.parse(roh) : []
    return Array.isArray(liste) ? liste.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function schonGehoert(datei: string): boolean {
  return alleLesen().includes(datei)
}

export function markieren(datei: string) {
  if (typeof window === 'undefined' || !datei) return
  try {
    const liste = alleLesen()
    if (liste.includes(datei)) return
    window.localStorage.setItem(SCHLUESSEL, JSON.stringify([...liste, datei]))
    window.dispatchEvent(new CustomEvent(EREIGNIS_AENDERUNG))
  } catch {
    // A full or blocked store is not worth breaking playback over.
  }
}
