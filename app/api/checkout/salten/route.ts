import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const PRICE_PER_LANGUAGE = 3 // €3 IVA incluido

const VALID_LANGUAGE_CODES = new Set(['es', 'ca', 'en', 'de', 'it', 'ru'])

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Salten — Español',
  ca: 'Salten — Catalán',
  en: 'Salten — Inglés',
  de: 'Salten — Alemán',
  it: 'Salten — Italiano',
  ru: 'Salten — Ruso',
}

export async function POST(req: NextRequest) {
  console.log('[Checkout] Request received')

  try {
    const body = await req.json()
    console.log('[Checkout] Body:', JSON.stringify(body, null, 2))

    const { languages, customer } = body

    // ── Validate languages ──────────────────────────────────────────────────
    if (!Array.isArray(languages) || languages.length === 0) {
      console.error('[Checkout] No languages selected')
      return NextResponse.json({ error: 'No languages selected' }, { status: 400 })
    }

    for (const code of languages) {
      if (!VALID_LANGUAGE_CODES.has(code)) {
        console.error('[Checkout] Invalid language code:', code)
        return NextResponse.json({ error: `Código de idioma no válido: ${code}` }, { status: 400 })
      }
    }

    // ── Validate required customer fields ───────────────────────────────────
    // nif is NOT required here — only needed if buyer checked "factura completa"
    if (!customer?.email || !customer?.nombre) {
      console.error('[Checkout] Missing required customer fields')
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: email y nombre' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      console.error('[Checkout] Invalid email:', customer.email)
      return NextResponse.json({ error: 'Formato de email no válido' }, { status: 400 })
    }

    console.log('[Checkout] Creating session for:', {
      languages,
      email: customer.email,
      nombre: customer.nombre,
      pais: customer.pais || 'not provided',
      newsletter: customer.newsletter,
      wantsFactura: !!customer.nif,
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // ── Create one line item per language (cleaner Stripe receipt) ──────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = languages.map(
      (code: string) => ({
        price_data: {
          currency: 'eur',
          unit_amount: PRICE_PER_LANGUAGE * 100, // cents
          product_data: {
            name: LANGUAGE_NAMES[code],
            description: '150 audios · 150 imágenes · 10 Joker · Documento de referencia',
          },
        },
        quantity: 1,
      })
    )

    // ── Stripe metadata (max 500 chars per value, max 50 keys) ──────────────
    // All factura fields are optional — only populated if buyer checked factura completa
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,

      metadata: {
        product: 'salten',
        languages: languages.join(','),
        nombre: customer.nombre,
        newsletter: customer.newsletter ? 'true' : 'false',
        // Factura completa fields (optional)
        nif: customer.nif || '',
        nombreEmpresa: customer.nombreEmpresa || '',
        domicilio: customer.domicilio || '',
        codigoPostal: customer.codigoPostal || '',
        ciudad: customer.ciudad || '',
        pais: customer.pais || '',
      },

      payment_intent_data: {
        metadata: {
          product: 'salten',
          languages: languages.join(','),
          nombre: customer.nombre,
          nif: customer.nif || '',
          pais: customer.pais || '',
        },
      },

      // Stripe collects billing address in checkout — gives us a 2nd country signal
      billing_address_collection: 'auto',

      success_url: `${baseUrl}/resuena/salten/gracias`,
      cancel_url: `${baseUrl}/resuena/salten?canceled=true`,
      locale: 'es',
    })

    console.log('[Checkout] ✓ Session created:', session.id)

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session'
    console.error('[Checkout] Error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
