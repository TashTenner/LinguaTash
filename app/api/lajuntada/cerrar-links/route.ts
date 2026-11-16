// app/api/lajuntada/cerrar-links/route.ts
//
// Cron diario (ver vercel.json), a las 21:00 UTC: de noche en Barcelona, con
// la juntada de ese domingo ya terminada.
//
// Un payment link de Stripe no caduca. Si nadie lo apaga, quien lo tenga en un
// WhatsApp viejo puede pagar una juntada que ya pasó, y eso termina en una
// devolución. Esto apaga el link de toda fecha que ya fue (o que se canceló),
// con un mensaje que manda a la próxima. Es lo mismo que el botón
// "Desactivar" del Dashboard.
//
// Slack, callado: una línea por link apagado, ⚠️ si algo falla, nada si no
// hay nada que hacer.
//
// Con ?probar=1 dice qué apagaría, sin apagar nada.

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { diaDe, fechasLaJuntada } from '@/content/lajuntada/fechas'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function avisar(texto: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL_LAJUNTADA || process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto }),
    })
  } catch (err) {
    console.warn('[La Juntada] Slack no contestó (no es grave):', err)
  }
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const probar = req.nextUrl.searchParams.get('probar') === '1'

  // La fecha de hoy en Barcelona, no en UTC: a las 21:00 UTC ya puede ser mañana allá.
  const hoy = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' })
  const proxima = fechasLaJuntada.find((f) => f.iso > hoy && f.estado !== 'cancelada')

  const terminadas = fechasLaJuntada.filter(
    (f) => f.stripeUrl && (f.iso <= hoy || f.estado === 'cancelada')
  )
  if (terminadas.length === 0) return NextResponse.json({ cerrados: [] })

  const cerrados: string[] = []
  const fallos: string[] = []

  try {
    // Una sola pasada por los links: son pocos y Stripe no deja buscar por URL.
    const porUrl = new Map<string, Stripe.PaymentLink>()
    for await (const link of stripe.paymentLinks.list({ limit: 100 })) porUrl.set(link.url, link)

    for (const fecha of terminadas) {
      const link = porUrl.get(fecha.stripeUrl!)
      if (!link) {
        fallos.push(`${fecha.fecha}: su link no aparece en Stripe (${fecha.stripeUrl})`)
        continue
      }
      if (!link.active) continue

      const mensaje = `La Juntada del ${diaDe(fecha)} ya pasó. ${
        proxima
          ? `La próxima es el ${diaDe(proxima)}: reservá desde linguatash.com/lajuntada.`
          : 'Las próximas fechas están en linguatash.com/lajuntada.'
      }`

      if (!probar) {
        try {
          await stripe.paymentLinks.update(link.id, { active: false, inactive_message: mensaje })
        } catch (err) {
          fallos.push(`${fecha.fecha}: ${err instanceof Error ? err.message : String(err)}`)
          continue
        }
      }
      cerrados.push(fecha.fecha)
    }
  } catch (err) {
    fallos.push(`no se pudo leer Stripe: ${err instanceof Error ? err.message : String(err)}`)
  }

  if (!probar) {
    for (const f of cerrados) {
      await avisar(`🔒 Link de La Juntada del ${f} desactivado: ya nadie puede pagar esa fecha.`)
    }
    if (fallos.length > 0) {
      await avisar(
        `⚠️ No se pudo cerrar un link de La Juntada. Desactivalo a mano en Stripe:\n${fallos.join('\n')}`
      )
    }
  }

  return NextResponse.json({ probar, cerrados, fallos }, { status: fallos.length ? 500 : 200 })
}
