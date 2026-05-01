// app/api/nordkreis/pending-fees/route.ts
// Returns draft enrollment fee invoices waiting to be finalized (the 8-day window)

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  try {
    const invoices = await stripe.invoices.list({ status: 'draft', limit: 100 })

    const pending = invoices.data
      .filter((inv) => inv.metadata?.nordkreis === 'enrollment_fee')
      .map((inv) => {
        const finalizeAfter = inv.metadata?.finalizeAfter ?? null
        const childName = inv.metadata?.childName ?? ''
        const daysLeft = finalizeAfter
          ? Math.ceil((new Date(finalizeAfter).getTime() - Date.now()) / 86_400_000)
          : null
        return {
          invoiceId: inv.id,
          childName,
          amountEur: (inv.amount_due ?? 0) / 100,
          finalizeAfter,
          daysLeft,
          customerId:
            typeof inv.customer === 'string'
              ? inv.customer
              : ((inv.customer as { id: string })?.id ?? ''),
        }
      })
      .sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))

    return NextResponse.json({ pending })
  } catch (err: unknown) {
    console.error('Pending fees error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
