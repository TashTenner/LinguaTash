// app/api/lajuntada/admin-login/route.ts
// Comprueba la contraseña del panel de La Juntada y, si es correcta, deja la
// cookie de sesión que middleware.ts mira en cada petición a /lajuntada/admin.
// Mismo mecanismo que el panel de Nordkreis, con su propia contraseña.

import { NextRequest, NextResponse } from 'next/server'

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  const expected = process.env.LAJUNTADA_ADMIN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'Contraseña no configurada' }, { status: 500 })
  }

  const { password } = await req.json()
  if (password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('lajuntada_admin_token', await sha256(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
  return res
}
