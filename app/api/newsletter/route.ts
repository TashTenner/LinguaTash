import { NextRequest, NextResponse } from 'next/server'
import { esLista, suscribirAKit, type Lista } from '@/lib/newsletter/kit'

export const dynamic = 'force-dynamic'

// Subscribes to one list's newsletter (see lib/newsletter/kit.ts). `tambien`
// adds other lists' tags through the same confirmation: the homepage form
// signs up to the LinguaTash boletín plus the projects ticked there. A request
// without `lista` is treated as the LinguaTash boletín, which is what the
// homepage form used to send before it named its list.

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let email: string | undefined
  let lista: unknown
  let tambien: unknown
  let nombre: string | undefined
  let trampa: string | undefined

  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim() : undefined
    lista = body?.lista ?? 'linguatash'
    tambien = body?.tambien
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

  if (!esLista(lista)) {
    return NextResponse.json({ error: 'Unknown list' }, { status: 400 })
  }

  const extras: Lista[] = Array.isArray(tambien) ? tambien.filter(esLista) : []

  const { ok, status } = await suscribirAKit({
    lista,
    email,
    nombre,
    origen: 'web',
    tambien: extras,
  })
  return ok
    ? NextResponse.json({ message: 'Subscribed' }, { status: 201 })
    : NextResponse.json({ error: 'Error subscribing' }, { status })
}
