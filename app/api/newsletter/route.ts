import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let email: string | undefined
  let projects: string[] = []

  try {
    const body = await req.json()
    email = body?.email
    projects = Array.isArray(body?.projects) ? body.projects : []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

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
