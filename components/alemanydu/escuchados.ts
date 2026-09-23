/**
 * Which classes this browser has already listened through.
 *
 * Kept in localStorage on purpose: it is a convenience for one parent on one
 * phone, not something worth an account or a row in a database. It never
 * leaves the device and it is never read back by the server.
 *
 * Every access is wrapped: storage can be unavailable in a private window, or
 * blocked entirely, and none of that may break the page.
 */
const CLAVE = 'alemanydu:escuchados'

/** Fired after marcar(), so cards already on screen can update themselves. */
export const EVENTO_CAMBIO = 'alemanydu:escuchados-cambio'

function leerTodos(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const bruto = window.localStorage.getItem(CLAVE)
    const lista = bruto ? JSON.parse(bruto) : []
    return Array.isArray(lista) ? lista.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function yaEscuchado(archivo: string): boolean {
  return leerTodos().includes(archivo)
}

export function marcar(archivo: string) {
  if (typeof window === 'undefined' || !archivo) return
  try {
    const lista = leerTodos()
    if (lista.includes(archivo)) return
    window.localStorage.setItem(CLAVE, JSON.stringify([...lista, archivo]))
    window.dispatchEvent(new CustomEvent(EVENTO_CAMBIO))
  } catch {
    // A full or blocked store is not worth breaking playback over.
  }
}
