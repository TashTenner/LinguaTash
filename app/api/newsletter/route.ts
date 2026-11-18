import { NextRequest, NextResponse } from 'next/server'
import { esLista, suscribirAKit, type Lista } from '@/lib/newsletter/kit'

export const dynamic = 'force-dynamic'

// Two shapes of request (see lib/newsletter/kit.ts):
//
// - `lista`: a project's own signup form. Subscribes to that list.
// - `listas`: the homepage box, where people tick any of the seven boletines.
//   One ticked: that project's own form, so its confirmation email comes in
//   its own language and from its own sender. Several: the LinguaTash form,
//   one confirmation email for all, tagged with exactly what was ticked.
//
// A request with `tambien` is the homepage as it was deployed for a few hours
// on 2026-11-18 (the general boletín plus projects), still in some browsers.

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : undefined
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 100) : undefined

  // Honeypot: a field people never see. A bot that fills it gets a success
  // response and nothing is sent to Kit.
  if (typeof body.website === 'string' && body.website) {
    return NextResponse.json({ message: 'Subscribed' }, { status: 201 })
  }

  if (!email || !EMAIL_VALIDO.test(email)) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  let lista: Lista
  let etiquetas: Lista[] | undefined

  if (Array.isArray(body.listas)) {
    const elegidas = [...new Set(body.listas.filter(esLista))]
    if (elegidas.length === 0) {
      return NextResponse.json({ error: 'Choose at least one list' }, { status: 400 })
    }
    lista = elegidas.length === 1 ? elegidas[0] : 'linguatash'
    etiquetas = elegidas
  } else if (Array.isArray(body.tambien)) {
    lista = 'linguatash'
    etiquetas = ['linguatash', ...body.tambien.filter(esLista)]
  } else {
    const pedida = body.lista ?? 'linguatash'
    if (!esLista(pedida)) {
      return NextResponse.json({ error: 'Unknown list' }, { status: 400 })
    }
    lista = pedida
  }

  const { ok, status } = await suscribirAKit({ lista, email, nombre, origen: 'web', etiquetas })
  return ok
    ? NextResponse.json({ message: 'Subscribed' }, { status: 201 })
    : NextResponse.json({ error: 'Error subscribing' }, { status })
}
