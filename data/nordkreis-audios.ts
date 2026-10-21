/**
 * Audios der Nordkreis Samstagsschule.
 *
 * Two things live here that must not be merged, for the same reason the
 * Alemán·y·Du data is split into audios and grupos:
 *
 * - An `Aufnahme` belongs to a group, a cycle and a CONTENT number. It is
 *   recorded once and plays again three years later for the next children:
 *   cycle A of 2026/2027 is cycle A of 2029/2030. So it carries no date and
 *   nothing that is only true this year. The Wort der Woche is fixed per
 *   cycle and lives here.
 * - A `Jahrgang` is one group in one school year. Each of its Saturdays has a
 *   date, the content it plays, and the Elternauftrag, which talks about what
 *   happened that particular Saturday and so cannot travel with the recording.
 *
 * The content number is not the Saturday number, and neither may be derived
 * from the other. In practice every row is identity: the contents build on
 * each other (song rotation, the Löwenjagd growing a station per audio), so
 * they always play in the order 1 to 20, and in July the DATES are chosen to
 * fit (14 before Easter, 15 after, 8 the only December date) rather than the
 * contents being reordered. `inhalt` stays explicit anyway, so a year that
 * needs an exception can have one without touching the recordings. Parents
 * only ever see Saturday numbers; the content number picks the file and is
 * never displayed.
 *
 * Import this module from server components only. Anything handed to a client
 * component must be a narrowed object built in the page.
 */

/** Group codes, used in file names. Names as on the public Nordkreis page. */
export const GRUPPEN = {
  spi: 'Spielkreis',
  ent: 'Entdeckerkreis',
  kom: 'Kompasskreis',
  nor: 'Nordlichter',
  pol: 'Polarkreis',
  den: 'Denkraum',
  wei: 'Weitblick',
  abs: 'Abschlusskreis',
} as const

export type Gruppe = keyof typeof GRUPPEN

/** A child passes through a group at most three times, hence three cycles. */
export type Zyklus = 'a' | 'b' | 'c'

export type Aufnahme = {
  gruppe: Gruppe
  zyklus: Zyklus
  /** Content number within the cycle, 1 to 20. Never shown to parents. */
  inhalt: number
  /** Content title, e.g. `Hannas Tasche`. Empty until known. German. */
  titel: string
  /** The single thing parents act on. Empty until known. */
  wortDerWoche: string
  /**
   * The three sentences of the Wort der Woche block, shown as «Für zu Hause».
   * They must match the recording word for word.
   */
  formeln: string[]
  /**
   * The book read in this audio. Belongs to the recording, not the year: in
   * 2029 the same audio reads the same book. A book runs over three
   * consecutive contents, so the same object repeats; the page lists it once.
   */
  buch?: Buch
  /** Duration in seconds. 0 when not recorded. */
  dauer: number
  /** Controls playable vs pending state. */
  verfuegbar: boolean
}

export type Buch = {
  titel: string
  autor: string
  illustration?: string
  verlag?: string
  /**
   * Year of the FIRST edition, never of a printing. Printings carry different
   * years (or none), and the first edition is the one fact that stays true
   * whichever copy a family finds.
   */
  erstausgabe?: number
  /** Shown, because a book only found secondhand is best searched by ISBN. */
  isbn?: string
}

export type Jahrgang = {
  gruppe: Gruppe
  zyklus: Zyklus
  /** `2026/2027`. */
  schuljahr: string
  /** Shown in the page header, e.g. `Entdeckerkreis`. */
  name: string
  /**
   * When the session ends, `HH:MM`. A Saturday appears on the page from then
   * on, not from midnight, so the page never lists a session that has not
   * happened yet.
   */
  endeUhrzeit: string
  /** Saturday 1 to 20, in order. The position is the Saturday number. */
  samstage: Samstag[]
}

export type Samstag = {
  datum: string
  /** Which content plays. Omitted while not yet decided. */
  inhalt?: number
  /**
   * «Zwischen den Samstagen»: what parents can do until the next session to
   * keep it fresh. An offer, not a task. May talk about what happened on this
   * Saturday of this year, which is why it lives here and not on the
   * recording. Can change any time without re-recording.
   */
  zwischenDenSamstagen?: string
}

/** `nk_ent_a03.mp3`. Derived, so it can never disagree with the numbers. */
export const dateiname = (a: Pick<Aufnahme, 'gruppe' | 'zyklus' | 'inhalt'>) =>
  `nk_${a.gruppe}_${a.zyklus}${String(a.inhalt).padStart(2, '0')}.mp3`

/** Link the native player points at. Same origin, see `lib/nordkreis/audioStorage.ts`. */
export const audioUrl = (datei: string) => `/api/nordkreis/audio?file=${encodeURIComponent(datei)}`

/** Same bytes, saved instead of streamed. */
export const downloadUrl = (datei: string) =>
  `/api/nordkreis/download?file=${encodeURIComponent(datei)}`

/**
 * 2026/2027: Entdeckerkreis and Kompasskreis were merged into one group,
 * which runs as the Entdeckerkreis (10:00 to 11:30), and every recording goes
 * under `ent`.
 *
 * `endeUhrzeit` only decides when the Saturday's card appears. The audio comes
 * later, whenever it is published; until then the card says «Noch nicht
 * verfügbar», which is true.
 */
export const entdeckerkreis2026: Jahrgang = {
  gruppe: 'ent',
  zyklus: 'a',
  schuljahr: '2026/2027',
  name: 'Entdeckerkreis',
  endeUhrzeit: '11:30',
  // Contents always play in order 1 to 20; the dates are chosen to fit.
  samstage: [
    {
      datum: '2026-09-19',
      inhalt: 1,
      zwischenDenSamstagen:
        'Erzählt Eurem Kind einmal am Tag etwas Kleines aus Eurem eigenen Tag. Wen Ihr getroffen habt, was schön war, was Euch geärgert hat. Mehr braucht es nicht. Kinder fangen fast immer von selbst an zu erzählen, wenn jemand vor ihnen angefangen hat, und das geht viel leichter, als sie zum Erzählen zu bringen.',
    },
    {
      datum: '2026-10-03',
      inhalt: 2,
      zwischenDenSamstagen:
        'Nehmt Euer Kind einmal mit zum Einkaufen und lasst es zwischen zwei Dingen wählen. Möchtest Du einen Apfel oder eine Banane? Diese Form ist der eigentliche Trick: sie liefert die Antwort gleich mit, und Euer Kind muss nur noch zugreifen. Am Markt am Samstag hat genau das die stillsten Kinder zum Sprechen gebracht.',
    },
    {
      datum: '2026-10-17',
      inhalt: 3,
      zwischenDenSamstagen:
        'Sucht Euch eine einzige Sache aus, die bei Euch sowieso jeden Tag passiert: die Hände nach dem Waschen, das Geschirr, das Abtrocknen nach dem Baden. Sprecht sie auf Deutsch mit, während sie gerade geschieht. Euer Kind muss nichts sagen und nichts können, es hört den Satz einfach, während die Sache passiert. Genau da bleibt Sprache am leichtesten hängen.',
    },
    { datum: '2026-10-31', inhalt: 4 },
    { datum: '2026-11-07', inhalt: 5 },
    { datum: '2026-11-14', inhalt: 6 },
    { datum: '2026-11-28', inhalt: 7 },
    { datum: '2026-12-12', inhalt: 8 },
    { datum: '2027-01-16', inhalt: 9 },
    { datum: '2027-01-30', inhalt: 10 },
    { datum: '2027-02-13', inhalt: 11 },
    { datum: '2027-02-27', inhalt: 12 },
    { datum: '2027-03-06', inhalt: 13 },
    { datum: '2027-03-13', inhalt: 14 },
    { datum: '2027-04-03', inhalt: 15 },
    { datum: '2027-04-17', inhalt: 16 },
    { datum: '2027-05-08', inhalt: 17 },
    { datum: '2027-05-22', inhalt: 18 },
    { datum: '2027-06-05', inhalt: 19 },
    { datum: '2027-06-19', inhalt: 20 },
  ],
}

const einSpatz: Buch = {
  titel: 'Ein Spatz sang auf dem Hühnerstall',
  autor: 'Alfred Könner',
  illustration: 'Rainer Flieger',
  verlag: 'Postreiter-Verlag, Halle',
  // First edition 1982. Tash's copy is the 3rd printing, with no year on it.
  erstausgabe: 1982,
  isbn: '3 7421 0023 8',
}

const leer = (inhalt: number): Aufnahme => ({
  gruppe: 'ent',
  zyklus: 'a',
  inhalt,
  titel: '',
  wortDerWoche: '',
  formeln: [],
  dauer: 0,
  verfuegbar: false,
})

/**
 * The recordings, by content number. Publishing one is: upload the file, fill
 * `dauer`, and flip `verfuegbar` to true. Title, Wort der Woche and formulas
 * can be filled before the audio exists; the card shows them either way.
 */
export const aufnahmen: Aufnahme[] = [
  {
    ...leer(1),
    titel: 'Wir fangen an',
    wortDerWoche: 'erzählen',
    formeln: [
      'Erzähl mir, mit wem Du heute gespielt hast.',
      'Und dann? Was war dann?',
      'Was war heute lustig?',
    ],
    buch: einSpatz,
    dauer: 326,
    verfuegbar: true,
  },
  {
    ...leer(2),
    titel: 'Der Markt',
    wortDerWoche: 'einkaufen',
    formeln: [
      'Wir gehen einkaufen. Holst Du die Milch?',
      'Möchtest Du einen Apfel oder eine Banane?',
      'Wie viele nehmen wir mit? Zwei oder drei?',
    ],
    buch: einSpatz,
    dauer: 614,
    verfuegbar: true,
  },
  {
    ...leer(3),
    titel: 'Hannas Tasche',
    wortDerWoche: 'abtrocknen',
    formeln: [
      'Trockne Dir bitte die Hände ab.',
      'Ich trockne das Geschirr ab.',
      'Nach dem Baden trocknen wir uns ab.',
    ],
    buch: einSpatz,
    dauer: 499,
    verfuegbar: true,
  },
  ...Array.from({ length: 17 }, (_, i) => leer(i + 4)),
]

/**
 * Every school year whose page is live. The download route looks a file up
 * here to give it a readable name.
 */
export const jahrgaenge: Jahrgang[] = [entdeckerkreis2026]

const uhrMadrid = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Now in Barcelona as `YYYY-MM-DDTHH:MM`, whatever zone the server runs in. */
export const jetztInMadrid = () => uhrMadrid.format(new Date()).replace(' ', 'T')

/**
 * How many Saturdays this group has already had. Derived from the dates, never
 * from a counter someone has to remember to bump.
 */
export const samstageVorbei = (jahrgang: Jahrgang, jetzt = jetztInMadrid()) =>
  jahrgang.samstage.filter((s) => `${s.datum}T${jahrgang.endeUhrzeit}` <= jetzt).length

export const aufnahmeFuer = (jahrgang: Jahrgang, inhalt?: number) =>
  inhalt === undefined
    ? undefined
    : aufnahmen.find(
        (a) => a.gruppe === jahrgang.gruppe && a.zyklus === jahrgang.zyklus && a.inhalt === inhalt
      )

/** `Samstag 3 · Hannas Tasche`, or `Samstag 3` while the title is unknown. */
export const samstagTitel = (nummer: number, titel?: string) =>
  titel ? `Samstag ${nummer} · ${titel}` : `Samstag ${nummer}`

/**
 * The name a downloaded file gets: `Nordkreis · Entdeckerkreis · Samstag 3 ·
 * Hannas Tasche.mp3`.
 * Parents never see a content number, not on the page and not in their
 * downloads folder. Uses the latest listed year that plays this file; null
 * when no live year does.
 */
export function downloadName(datei: string): string | null {
  for (const jahrgang of [...jahrgaenge].reverse()) {
    const index = jahrgang.samstage.findIndex(
      (s) =>
        s.inhalt !== undefined &&
        dateiname({ gruppe: jahrgang.gruppe, zyklus: jahrgang.zyklus, inhalt: s.inhalt }) === datei
    )
    if (index === -1) continue
    const aufnahme = aufnahmeFuer(jahrgang, jahrgang.samstage[index].inhalt)
    return `Nordkreis · ${jahrgang.name} · ${samstagTitel(index + 1, aufnahme?.titel)}.mp3`
  }
  return null
}
