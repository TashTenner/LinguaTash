import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * Reads the Alemán·y·Du audio objects out of R2.
 *
 * The bucket is PRIVATE. Nothing is served from a public bucket or from a
 * custom domain: both the player and the download button go through our own
 * route handlers, so every audio URL is same origin. That is what keeps
 * `media-src 'self'` sufficient and removes the whole class of bug where audio
 * plays in local development and fails silently on the deployed site.
 */

/**
 * The only object names that may ever be requested. Anything else is rejected
 * before it reaches R2, so these handlers can never become a generic proxy.
 */
export const NOMBRE_VALIDO = /^ayd_(pre_a1_c\d{2}|frase_prueba)\.mp3$/

/**
 * How long a given object may be cached.
 *
 * A class audio is written once and never replaced (the level is in the name,
 * so A1.1 cannot collide with pre-A1), so it can be cached hard:
 * a parent replaying the same track all week in the car then downloads it once
 * instead of every day. `ayd_frase_prueba.mp3` is the only file that can be
 * re-recorded under the same name, so it gets a short cache and a new version
 * reaches everyone within a day.
 */
export const cacheControlPara = (archivo: string) =>
  /^ayd_pre_a1_c\d{2}\.mp3$/.test(archivo)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=86400'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const bucket = () => process.env.CLOUDFLARE_R2_ALEMANYDU_AUDIO_BUCKET!

export type AudioObjeto = {
  /** The object body, ready to hand to a Response. */
  cuerpo: ReadableStream
  /** Bytes in this response, which is the slice when a range was asked for. */
  longitud?: number
  /** Present only for a range response, e.g. `bytes 0-1023/204800`. */
  rango?: string
  /** True when R2 answered with a partial body and we must reply 206. */
  parcial: boolean
}

/**
 * Fetches one object, passing the browser's Range header straight through.
 *
 * Range matters more than it looks: Safari and iOS refuse to play media at all
 * unless the server answers a range request with a 206, so without this a
 * parent on an iPhone gets a player that does nothing when pressed.
 *
 * Returns null when the object does not exist.
 */
export async function getAudioObjeto(archivo: string, range?: string): Promise<AudioObjeto | null> {
  try {
    const salida = await r2.send(
      new GetObjectCommand({
        Bucket: bucket(),
        Key: archivo,
        Range: range,
      })
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
    console.error('[alemanydu/audio] R2 error:', err)
    throw err
  }
}
