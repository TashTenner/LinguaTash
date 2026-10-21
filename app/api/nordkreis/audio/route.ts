import { NextRequest } from 'next/server'
import { CACHE_CONTROL, getAudioObjekt, NOMBRE_VALIDO } from '@/lib/nordkreis/audioStorage'

/**
 * Playback for the Nordkreis audio page. Behind the family password
 * (middleware.ts), like the page itself: file names are guessable, so
 * protecting only the page would leave the MP3s open.
 *
 * Node runtime and Range forwarding are both required. iOS will not play media
 * from a server that answers a range request with a 200.
 */
export async function GET(req: NextRequest) {
  const datei = req.nextUrl.searchParams.get('file') ?? ''

  if (!NOMBRE_VALIDO.test(datei)) {
    return new Response('Ungültige Datei.', { status: 400 })
  }

  const range = req.headers.get('range') ?? undefined

  let objekt: Awaited<ReturnType<typeof getAudioObjekt>>
  try {
    objekt = await getAudioObjekt(datei, range)
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
