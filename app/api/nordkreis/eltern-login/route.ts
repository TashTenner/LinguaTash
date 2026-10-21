// app/api/nordkreis/eltern-login/route.ts
// Checks the shared family password for /nordkreis/audios and, if correct,
// sets the cookie middleware.ts checks on the page and the audio routes.
//
// The cookie holds a hash of the password itself, so changing
// NORDKREIS_ELTERN_PASSWORD for a new school year signs every family out at
// once, with nothing to revoke.

import { NextRequest, NextResponse } from 'next/server'

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  const expected = process.env.NORDKREIS_ELTERN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'Passwort nicht konfiguriert' }, { status: 500 })
  }

  const { password } = await req.json()
  // Families type this on a phone; a trailing space or a capital from
  // autocorrect should not lock anyone out.
  if (typeof password !== 'string' || password.trim().toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('nordkreis_eltern_token', await sha256(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // one school year
  })
  return res
}
