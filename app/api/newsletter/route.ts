import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Each project newsletter is its own Kit form (own double opt-in email, own
// language) plus a tag, so that one subscriber list can be sent to by project.
// No `lista` in the request keeps the original behaviour: the homepage form.
const LISTAS: Record<string, { formEnv: string; tagEnv: string }> = {
  nordkreis: {
    formEnv: 'CONVERTKIT_NORDKREIS_FORM_ID',
    tagEnv: 'CONVERTKIT_NORDKREIS_TAG_ID',
  },
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let email: string | undefined
  let projects: string[] = []
  let lista: string | undefined
  let nombre: string | undefined
  let trampa: string | undefined

  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim() : undefined
    projects = Array.isArray(body?.projects) ? body.projects : []
    lista = typeof body?.lista === 'string' ? body.lista : undefined
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

  if (lista !== undefined && !LISTAS[lista]) {
    return NextResponse.json({ error: 'Unknown list' }, { status: 400 })
  }

  const config = lista ? LISTAS[lista] : undefined
  const FORM_ID = config ? process.env[config.formEnv] : process.env.CONVERTKIT_FORM_ID
  const TAG_ID = config ? process.env[config.tagEnv] : undefined
  const API_KEY = process.env.CONVERTKIT_API_KEY

  if (!FORM_ID || !API_KEY) {
    console.error(`Missing Kit form ID or CONVERTKIT_API_KEY (lista: ${lista ?? 'general'})`)
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const payload: Record<string, unknown> = { email, api_key: API_KEY }
  if (nombre) payload.first_name = nombre
  if (TAG_ID) payload.tags = [Number(TAG_ID)]
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
