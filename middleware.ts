// middleware.ts
// Gates the Nordkreis and La Juntada admin panels behind their own passwords,
// and the Nordkreis family audio page behind the shared family password.
// Everything else on the site (enrollment, checkout, webhooks) is untouched.

import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'nordkreis_admin_token'
const LAJUNTADA_COOKIE = 'lajuntada_admin_token'
const ELTERN_COOKIE = 'nordkreis_eltern_token'

// The audio routes are gated together with the page: file names like
// nk_ent_a03.mp3 are guessable, so a password on the page alone would protect
// nothing.
const ELTERN_API_PATHS = new Set(['/api/nordkreis/audio', '/api/nordkreis/download'])

const PROTECTED_API_PATHS = new Set([
  '/api/nordkreis/admin-students',
  '/api/nordkreis/activate-student',
  '/api/nordkreis/cancel-student',
  '/api/nordkreis/update-notes',
  '/api/nordkreis/pending-fees',
  '/api/nordkreis/test-payment-email',
  '/api/nordkreis/test-pdf',
  '/api/nordkreis/test-confirmation-email',
  '/api/nordkreis/test-email',
  '/api/nordkreis/test-invoice-pdf',
])

async function hash(password: string | undefined): Promise<string | null> {
  if (!password) return null
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function expectedToken(): Promise<string | null> {
  return hash(process.env.NORDKREIS_ADMIN_PASSWORD)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // La Juntada: su propio panel, su propia contraseña, su propia cookie.
  if (pathname === '/lajuntada/admin/login') {
    return NextResponse.next()
  }

  if (pathname === '/lajuntada/admin') {
    const esperado = await hash(process.env.LAJUNTADA_ADMIN_PASSWORD)
    const token = req.cookies.get(LAJUNTADA_COOKIE)?.value
    if (esperado && token === esperado) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/lajuntada/admin/login', req.url))
  }

  if (pathname === '/nordkreis/audios/anmelden') {
    return NextResponse.next()
  }

  if (pathname === '/nordkreis/audios' || ELTERN_API_PATHS.has(pathname)) {
    const esperado = await hash(process.env.NORDKREIS_ELTERN_PASSWORD)
    const token = req.cookies.get(ELTERN_COOKIE)?.value
    if (esperado && token === esperado) {
      return NextResponse.next()
    }
    if (ELTERN_API_PATHS.has(pathname)) {
      return new NextResponse('Nicht angemeldet.', { status: 401 })
    }
    return NextResponse.redirect(new URL('/nordkreis/audios/anmelden', req.url))
  }

  if (pathname === '/nordkreis/admin/login') {
    return NextResponse.next()
  }

  const isProtectedPage = pathname === '/nordkreis/admin'
  const isProtectedApi = PROTECTED_API_PATHS.has(pathname)
  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next()
  }

  const expected = await expectedToken()
  const token = req.cookies.get(COOKIE_NAME)?.value
  const valid = !!expected && token === expected

  if (valid) {
    return NextResponse.next()
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.redirect(new URL('/nordkreis/admin/login', req.url))
}

export const config = {
  matcher: [
    '/lajuntada/admin',
    '/lajuntada/admin/login',
    '/nordkreis/admin',
    '/nordkreis/admin/login',
    '/nordkreis/audios',
    '/nordkreis/audios/anmelden',
    '/api/nordkreis/audio',
    '/api/nordkreis/download',
    '/api/nordkreis/admin-students',
    '/api/nordkreis/activate-student',
    '/api/nordkreis/cancel-student',
    '/api/nordkreis/update-notes',
    '/api/nordkreis/pending-fees',
    '/api/nordkreis/test-payment-email',
    '/api/nordkreis/test-pdf',
    '/api/nordkreis/test-confirmation-email',
    '/api/nordkreis/test-email',
    '/api/nordkreis/test-invoice-pdf',
  ],
}
