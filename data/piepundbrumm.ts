/**
 * Piep und Brumm zum Nachhören: three short audios for the Vorlesefest at the
 * Goethe-Institut Barcelona, Saturday 21 November 2026.
 *
 * The page is public and its address is printed on a QR card, so
 * `/piepundbrumm` must never move.
 *
 * Publishing: run `scripts/publicar-piepundbrumm.mjs` for each WAV, paste the
 * printed `dauer` here, then set AUDIOS_READY to true.
 */

/**
 * The one switch. While false, the page shows titles and descriptions with a
 * single note instead of the players.
 */
export const AUDIOS_READY = false

export type PiepUndBrummAudio = {
  nummer: number
  titel: string
  beschreibung: string
  /** Seconds, from the publish script. */
  dauer: number
}

export const piepUndBrummAudios: PiepUndBrummAudio[] = [
  {
    nummer: 1,
    titel: 'Wer macht das?',
    beschreibung: 'Tierlaute raten: Spatz, Krähe, Frosch, Katze, Bär und Fisch.',
    dauer: 0,
  },
  {
    nummer: 2,
    titel: 'Wo ist der Spatz?',
    beschreibung: 'Auf dem Dach, im Baum, unter dem Tisch: Euer Kind sagt, wo er sitzt.',
    dauer: 0,
  },
  {
    nummer: 3,
    titel: 'Ab ins Wasser!',
    beschreibung: 'Schwimmflügel aufpusten, springen, tauchen und Blasen zählen.',
    dauer: 0,
  },
]

/** Object name inside the `piepundbrumm/` folder of the Nordkreis bucket. */
export const piepUndBrummDatei = (nummer: number) =>
  `piepundbrumm-${String(nummer).padStart(2, '0')}.mp3`

/** Same origin, so `media-src 'self'` covers it. */
export const piepUndBrummUrl = (nummer: number) =>
  `/api/piepundbrumm/audio/${piepUndBrummDatei(nummer)}`
