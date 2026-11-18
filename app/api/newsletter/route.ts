import { NextRequest, NextResponse } from 'next/server'
import { esLista, suscribirAKit } from '@/lib/newsletter/kit'

export const dynamic = 'force-dynamic'

// A request with `lista` subscribes to that project's newsletter (see
// lib/newsletter/kit.ts). No `lista` keeps the original behaviour: the
// homepage waitlist form.

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let email: string | undefined
  let projects: string[] = []
  let lista: unknown
  let nombre: string | undefined
  let trampa: string | undefined

  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim() : undefined
    projects = Array.isArray(body?.projects) ? body.projects : []
    lista = body?.lista
    nombre = typeof body?.nombre === 'string' ? body.nombre.trim().slice(0, 100) : undefined
    trampa = typeof body?.website === 'string' ? body.website : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Honeypot: a field people never see. A bot that fills it gets a success
  // response and nothing is sent to Kit.
  if (trampa) {
    return NextResponse.json({ message: 'Subscribed' }, { status: 201 })
  }

  if (!email || !EMAIL_VALIDO.test(email)) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  if (lista !== undefined) {
    if (!esLista(lista)) {
      return NextResponse.json({ error: 'Unknown list' }, { status: 400 })
    }
    const { ok, status } = await suscribirAKit({ lista, email, nombre, origen: 'web' })
    return ok
      ? NextResponse.json({ message: 'Subscribed' }, { status: 201 })
      : NextResponse.json({ error: 'Error subscribing' }, { status })
  }

  // The homepage waitlist.
  const FORM_ID = process.env.CONVERTKIT_FORM_ID
  const API_KEY = process.env.CONVERTKIT_API_KEY

  if (!FORM_ID || !API_KEY) {
    console.error('Missing CONVERTKIT_FORM_ID or CONVERTKIT_API_KEY')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const payload: Record<string, unknown> = { email, api_key: API_KEY }
  if (projects.length > 0) {
    payload.fields = { projects: projects.join(', ') }
  }

  const res = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error('ConvertKit error', res.status, body)
    return NextResponse.json({ error: 'Error subscribing' }, { status: res.status })
  }

  return NextResponse.json({ message: 'Subscribed' }, { status: 201 })
}
