/**
 * Dates are plain ISO days with no time, so they are formatted in UTC. Reading
 * them in the server's zone would shift a Saturday to the Friday before on any
 * host west of Greenwich.
 */
const datum = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** `2026-10-17` becomes `17. Oktober 2026`. */
export function formatDatum(iso: string): string {
  if (!iso) return ''
  return datum.format(new Date(`${iso}T00:00:00Z`))
}
