import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const PRICE_PER_LANGUAGE = 4 // €4 per language

export async function POST(req: NextRequest) {
  console.log('[Checkout] Request received')

  try {
    const body = await req.json()
    console.log('[Checkout] Body:', body)

    const { languages, customer } = body

    // Validate languages
    if (!Array.isArray(languages) || languages.length === 0) {
      console.error('[Checkout] No languages selected')
      return NextResponse.json({ error: 'No languages selected' }, { status: 400 })
    }

    // Validate customer data
    if (!customer?.email || !customer?.nombre || !customer?.nif) {
      console.error('[Checkout] Missing required customer fields')
      return NextResponse.json(
        { error: 'Missing required customer fields: email, nombre, nif' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      console.error('[Checkout] Invalid email:', customer.email)
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Calculate total
    const totalCents = languages.length * PRICE_PER_LANGUAGE * 100 // Convert to cents

    console.log('[Checkout] Creating session for:', {
      languages,
      email: customer.email,
      nombre: customer.nombre,
      amount: totalCents,
    })

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Salten - Language Packs',
              description: `${languages.length} language pack(s)`,
              metadata: {
                languages: languages.join(','),
              },
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/resuena/salten/gracias`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/resuena/salten?canceled=true`,
      customer_email: customer.email,
      metadata: {
        nombre: customer.nombre,
        nif: customer.nif,
        languages: languages.join(','),
        telefono: customer.telefono || '',
        codigoPostal: customer.codigoPostal || '',
        ciudad: customer.ciudad || '',
      },
    })

    console.log('[Checkout] Session created:', session.id)

    return NextResponse.json({
      url: session.url,
    })
  } catch (err: any) {
    console.error('[Checkout] Error:', err.message)
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
