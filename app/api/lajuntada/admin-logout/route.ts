// app/api/lajuntada/admin-logout/route.ts
// Borra la cookie de sesión del panel de La Juntada. El middleware vuelve a
// mandar al login en cuanto no la encuentra.

import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('lajuntada_admin_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
