/**
 * Formatting helpers for the Alemán·y·Du audio pages.
 *
 * Dates are plain ISO days with no time, so they are formatted in UTC. Reading
 * them in the server's local zone would shift a Monday to the Sunday before on
 * any host west of Greenwich.
 */

const partesFecha = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

function partes(iso: string) {
  const lista = partesFecha.formatToParts(new Date(`${iso}T00:00:00Z`))
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    lista.find((p) => p.type === tipo)?.value ?? ''
  return { weekday: valor('weekday'), day: valor('day'), month: valor('month') }
}

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** `2026-09-14` becomes `Lunes 14 de septiembre`. No year, by design. */
export function formatFecha(iso: string): string {
  if (!iso) return ''
  const { weekday, day, month } = partes(iso)
  return `${capitalizar(weekday)} ${day} de ${month}`
}

/** `2026-09-14` becomes `14 de septiembre`. Used for the songs track caption. */
export function formatDia(iso: string): string {
  if (!iso) return ''
  const { day, month } = partes(iso)
  return `${day} de ${month}`
}

/** `115` becomes `1:55`. Returns an empty string for `0`, which means not recorded. */
export function formatDuracion(segundos: number): string {
  if (!segundos || segundos <= 0) return ''
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const resto = Math.floor(segundos % 60)
  const dosDigitos = (n: number) => String(n).padStart(2, '0')
  return horas > 0
    ? `${horas}:${dosDigitos(minutos)}:${dosDigitos(resto)}`
    : `${minutos}:${dosDigitos(resto)}`
}

const partesMes = new Intl.DateTimeFormat('es-ES', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** `2026-09-14` becomes `Septiembre 2026`. Used to group the course calendar. */
export function formatMesAno(iso: string): string {
  if (!iso) return ''
  const lista = partesMes.formatToParts(new Date(`${iso}T00:00:00Z`))
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    lista.find((p) => p.type === tipo)?.value ?? ''
  const mes = valor('month')
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${valor('year')}`
}

/** `2026-09-14` becomes `14`. The month is already in the group heading. */
export function diaDelMes(iso: string): string {
  if (!iso) return ''
  return String(Number(iso.slice(8, 10)))
}
