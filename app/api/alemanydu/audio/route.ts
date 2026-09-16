import { NextRequest } from 'next/server'
import { getAudioObjeto, NOMBRE_VALIDO } from '@/lib/alemanydu/audioStorage'

/**
 * Playback for the Alemán·y·Du audio page.
 *
 * The bucket is private, so the native <audio> element points here instead of
 * at R2. Same origin means `media-src 'self'` covers it and there is no CSP
 * entry to keep in sync, which is the failure this project has hit before.
 *
 * Range requests are forwarded verbatim. Do not "simplify" that away: iOS will
 * not play media from a server that answers a range request with a 200.
 */
export async function GET(req: NextRequest) {
  const archivo = req.nextUrl.searchParams.get('file') ?? ''

  if (!NOMBRE_VALIDO.test(archivo)) {
    return new Response('Archivo no válido.', { status: 400 })
  }

  const range = req.headers.get('range') ?? undefined

  let objeto: Awaited<ReturnType<typeof getAudioObjeto>>
  try {
    objeto = await getAudioObjeto(archivo, range)
  } catch {
    return new Response('Error al leer el archivo.', { status: 502 })
  }

  if (!objeto) {
    return new Response('Archivo no encontrado.', { status: 404 })
  }

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    // Safe because every key is unique: neu and alles are unique per class, and
    // the songs and phrase tracks are versioned rather than overwritten.
    'Cache-Control': 'public, max-age=31536000, immutable',
  })

  if (objeto.longitud !== undefined) {
    headers.set('Content-Length', String(objeto.longitud))
  }
  if (objeto.rango) {
    headers.set('Content-Range', objeto.rango)
  }

  return new Response(objeto.cuerpo, {
    status: objeto.parcial ? 206 : 200,
    headers,
  })
}
