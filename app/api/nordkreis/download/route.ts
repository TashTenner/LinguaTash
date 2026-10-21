import { NextRequest } from 'next/server'
import { downloadName } from '@/data/nordkreis-audios'
import { CACHE_CONTROL, getAudioObjekt, NOMBRE_VALIDO } from '@/lib/nordkreis/audioStorage'

/**
 * Downloads for the Nordkreis audio page. Separate from playback only for
 * Content-Disposition, which makes the browser save the file. Behind the
 * family password, like the page and the player.
 *
 * The saved file is named after the Saturday, `Nordkreis · Entdeckerkreis ·
 * Samstag 3 · Hannas Tasche.mp3`, never after the object key: the key carries
 * the content number, which parents must never see. The name comes from our
 * own data, never from the request.
 */

/**
 * `filename*` carries the real name (the middle dot and umlauts need UTF-8);
 * `filename` is a plain ASCII fallback for anything that ignores it.
 */
function contentDisposition(name: string) {
  const ascii = name
    .normalize('NFD')
    .replace(/[^\x20-\x7e]/g, '')
    .replace(/["\\]/g, '')
    .replace(/\s+/g, ' ')
  const utf8 = encodeURIComponent(name).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
  return `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`
}
export async function GET(req: NextRequest) {
  const datei = req.nextUrl.searchParams.get('file') ?? ''

  if (!NOMBRE_VALIDO.test(datei)) {
    return new Response('Ungültige Datei.', { status: 400 })
  }

  let objekt: Awaited<ReturnType<typeof getAudioObjekt>>
  try {
    objekt = await getAudioObjekt(datei)
  } catch {
    return new Response('Fehler beim Lesen der Datei.', { status: 502 })
  }

  if (!objekt) {
    return new Response('Datei nicht gefunden.', { status: 404 })
  }

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': contentDisposition(downloadName(datei) ?? 'Nordkreis.mp3'),
    'Cache-Control': CACHE_CONTROL,
  })

  if (objekt.longitud !== undefined) headers.set('Content-Length', String(objekt.longitud))

  return new Response(objekt.cuerpo, { headers })
}
