import { NextRequest } from 'next/server'
import { getAudioObjekt } from '@/lib/nordkreis/audioStorage'

/**
 * Public playback for /piepundbrumm. The files live in the Nordkreis bucket,
 * folder `piepundbrumm/`, but unlike the Nordkreis family audios they are
 * meant for anyone holding the printed QR card, so this route is NOT in the
 * middleware matcher.
 *
 * Node runtime and Range forwarding are both required: iOS will not play
 * media from a server that answers a range request with a 200. Do not add
 * `runtime = 'edge'`.
 */

/**
 * Exactly four files. This is what keeps the route from becoming a public
 * window onto the password protected Nordkreis recordings in the same bucket.
 * Do not widen it.
 */
const NOMBRE_VALIDO = /^piepundbrumm-0[1-4]\.mp3$/

/** Public and written once: a family replaying an audio all week loads it once. */
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

export async function GET(req: NextRequest, { params }: { params: Promise<{ datei: string }> }) {
  const { datei } = await params

  if (!NOMBRE_VALIDO.test(datei)) {
    return new Response('Ungültige Datei.', { status: 400 })
  }

  const range = req.headers.get('range') ?? undefined

  let objekt: Awaited<ReturnType<typeof getAudioObjekt>>
  try {
    objekt = await getAudioObjekt(`piepundbrumm/${datei}`, range)
  } catch {
    return new Response('Fehler beim Lesen der Datei.', { status: 502 })
  }

  if (!objekt) {
    return new Response('Datei nicht gefunden.', { status: 404 })
  }

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Cache-Control': CACHE_CONTROL,
  })

  if (objekt.longitud !== undefined) headers.set('Content-Length', String(objekt.longitud))
  if (objekt.rango) headers.set('Content-Range', objekt.rango)

  return new Response(objekt.cuerpo, { status: objekt.parcial ? 206 : 200, headers })
}
