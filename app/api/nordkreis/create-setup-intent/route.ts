// app/api/nordkreis/create-setup-intent/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const customer = await stripe.customers.create({ name, email })

    // mandate_data is collected on the frontend via confirmSepaDebitSetup —
    // it cannot be passed here unless confirm: true is also set
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['sepa_debit'],
    })

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    })
  } catch (err: unknown) {
    console.error('create-setup-intent error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
