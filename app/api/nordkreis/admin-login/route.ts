// app/api/nordkreis/admin-login/route.ts
// Checks the admin password and, if correct, sets the session cookie that
// middleware.ts checks on every request to the Nordkreis admin panel.

import { NextRequest, NextResponse } from 'next/server'

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  const expected = process.env.NORDKREIS_ADMIN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'Admin-Passwort nicht konfiguriert' }, { status: 500 })
  }

  const { password } = await req.json()
  if (password !== expected) {
    return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('nordkreis_admin_token', await sha256(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
