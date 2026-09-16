import { NextRequest } from 'next/server'
import { getAudioObjeto, NOMBRE_VALIDO } from '@/lib/alemanydu/audioStorage'

/**
 * Downloads for the Alemán·y·Du audio page.
 *
 * Separate from the playback route only because of Content-Disposition: this is
 * what makes the browser save the file instead of streaming it. `<a download>`
 * cannot do the job on its own once the bytes come from anywhere but our own
 * origin, and the bucket is private in any case.
 *
 * This handler must never become a generic fetch proxy. The only thing it
 * accepts is an object name matching the allowlist, and the only place it ever
 * reads from is the Alemán·y·Du bucket.
 */
export async function GET(req: NextRequest) {
  const archivo = req.nextUrl.searchParams.get('file') ?? ''

  if (!NOMBRE_VALIDO.test(archivo)) {
    return new Response('Archivo no válido.', { status: 400 })
  }

  let objeto: Awaited<ReturnType<typeof getAudioObjeto>>
  try {
    objeto = await getAudioObjeto(archivo)
  } catch {
    return new Response('Error al leer el archivo.', { status: 502 })
  }

  if (!objeto) {
    return new Response('Archivo no encontrado.', { status: 404 })
  }

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': `attachment; filename="${archivo}"`,
    'Cache-Control': 'public, max-age=31536000, immutable',
  })

  if (objeto.longitud !== undefined) {
    headers.set('Content-Length', String(objeto.longitud))
  }

  return new Response(objeto.cuerpo, { headers })
}
