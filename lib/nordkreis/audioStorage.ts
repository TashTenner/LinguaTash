import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * Reads the Nordkreis audio objects out of R2.
 *
 * Same design as `lib/alemanydu/audioStorage.ts`, against its own bucket: the
 * bucket is PRIVATE and every audio URL goes through our own route handlers,
 * so `media-src 'self'` covers playback and no CSP entry can drift.
 *
 * Kept separate rather than shared on purpose. The Alemán·y·Du handlers are
 * live and fragile in ways that only show up on an iPhone, and a refactor to
 * share them would put those at risk for the sake of fifty lines.
 */

/**
 * The only object names that may ever be requested: `nk_<gruppe>_<zyklus><NN>.mp3`
 * at the bucket root. Anything else is rejected before it reaches R2, so these
 * handlers can never become a generic proxy. Do not widen it.
 */
export const NOMBRE_VALIDO = /^nk_(spi|ent|kom|nor|pol|den|wei|abs)_[abc]\d{2}\.mp3$/

/**
 * Recordings are written once and never replaced, so a parent replaying one
 * all fortnight downloads it once. `private`, not `public`: the files sit
 * behind the family password and no shared cache may hand them to anyone else.
 */
export const CACHE_CONTROL = 'private, max-age=31536000, immutable'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const bucket = () => process.env.CLOUDFLARE_R2_NORDKREIS_AUDIO_BUCKET!

export type AudioObjekt = {
  cuerpo: ReadableStream
  longitud?: number
  rango?: string
  parcial: boolean
}

/**
 * Fetches one object, passing the browser's Range header straight through.
 * Safari and iOS refuse to play media unless a range request gets a 206.
 *
 * Returns null when the object does not exist.
 */
export async function getAudioObjekt(datei: string, range?: string): Promise<AudioObjekt | null> {
  try {
    const salida = await r2.send(
      new GetObjectCommand({ Bucket: bucket(), Key: datei, Range: range })
    )

    if (!salida.Body) return null

    return {
      cuerpo: (
        salida.Body as { transformToWebStream: () => ReadableStream }
      ).transformToWebStream(),
      longitud: salida.ContentLength,
      rango: salida.ContentRange,
      parcial: Boolean(salida.ContentRange),
    }
  } catch (err) {
    const codigo = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode
    if (codigo === 404 || (err as { name?: string })?.name === 'NoSuchKey') return null
    console.error('[nordkreis/audio] R2 error:', err)
    throw err
  }
}
