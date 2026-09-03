// middleware.ts
// Gates the Nordkreis admin panel and its API routes behind a shared password.
// Everything else on the site (enrollment, checkout, webhooks) is untouched.

import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'nordkreis_admin_token'

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

async function expectedToken(): Promise<string | null> {
  const password = process.env.NORDKREIS_ADMIN_PASSWORD
  if (!password) return null
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
    '/nordkreis/admin',
    '/nordkreis/admin/login',
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
