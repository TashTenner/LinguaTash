// lib/metatrigger/keywords.ts
//
// Keyword → action config. Currently hardcoded; structure mirrors what a
// MongoDB "keywords" collection would look like so the switch to DB-backed
// config is a drop-in replacement when needed (just query the collection
// and return the same KeywordAction shape).
//
// To add a new keyword: append an entry to KEYWORD_ACTIONS below.
//
// FOLLOW-GATE FLOW (followGate: true):
//   Comment trigger → public comment reply only (commentGateReply), no DM sent.
//                     Instructs the user to follow + DM the keyword.
//   DM trigger      → freebie DM sent (dmText + freebieUrl). No follow check
//                     needed — reaching your DMs is the gate.
//
// NO FOLLOW-GATE (followGate: false):
//   Comment trigger → public comment reply (commentReply) + DM sent immediately.

export interface KeywordAction {
  keyword: string              // uppercase; matched case-insensitively against incoming text
  followGate: boolean          // true = DM-gate flow; false = send freebie immediately on comment
  commentGateReply: string     // comment reply when followGate is true (tells user to follow + DM)
  commentReply: string | null  // comment reply when followGate is false (null = skip)
  dmText: string | null        // DM body sent on DM trigger (or immediately if followGate: false)
  freebieUrl: string | null    // substituted into dmText via {{FREEBIE_URL}}
  kitTagId: string | null      // Kit (ConvertKit) tag ID to apply after fulfilment (null = skip)
  enabled: boolean
}

const KEYWORD_ACTIONS: KeywordAction[] = [
  {
    keyword: 'HAFEN',
    followGate: true,
    commentGateReply:
      '¡Sígueme en Instagram y luego escríbeme HAFEN por DM para recibir tu regalo gratis! 🎁',
    commentReply: null, // unused while followGate: true
    dmText:
      '¡Hola! Aquí tienes tu regalo de LinguaTash — Die Beziehung ist die Methode:\n\n{{FREEBIE_URL}}\n\n¡Espero que te sea útil! 🌊',
    freebieUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/resuena/hafen`,
    kitTagId: null, // set to your Kit tag ID when Phase 4 is ready
    enabled: true,
  },
  {
    keyword: 'AUDIO',
    followGate: true,
    commentGateReply:
      '¡Sígueme en Instagram y luego escríbeme AUDIO por DM para recibir el acceso! 🎧',
    commentReply: null, // unused while followGate: true
    dmText:
      '¡Hola! Aquí tienes el acceso a Bloque 1 de LinguaTash:\n\n{{FREEBIE_URL}}\n\n¡Disfrútalo! 🎶',
    freebieUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/resuena/hafen`, // update to Bloque 1 URL when live
    kitTagId: null,
    enabled: true,
  },
]

/**
 * Look up the action for a given keyword string.
 * Returns null if the keyword is unknown or disabled.
 */
export function getKeywordAction(raw: string): KeywordAction | null {
  const normalised = raw.trim().toUpperCase()
  return KEYWORD_ACTIONS.find((a) => a.keyword === normalised && a.enabled) ?? null
}

/**
 * Returns the appropriate comment reply text based on the follow-gate setting.
 */
export function getCommentReply(action: KeywordAction): string | null {
  return action.followGate ? action.commentGateReply : action.commentReply
}

/**
 * Resolve the DM text, substituting {{FREEBIE_URL}} with the actual URL.
 */
export function resolveDmText(action: KeywordAction): string | null {
  if (!action.dmText) return null
  return action.dmText.replace('{{FREEBIE_URL}}', action.freebieUrl ?? '')
}
