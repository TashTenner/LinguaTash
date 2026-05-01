// app/api/nordkreis/finalize-enrollment-fees/route.ts
//
// Daily cron job — called by Vercel Cron (see vercel.json).
// Finds all draft Nordkreis enrollment fee invoices where the 8-day
// waiting period has passed and finalizes them so Stripe charges the parent.

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const finalized: string[] = []
  const skipped: string[] = []
  const errors: string[] = []

  // List all draft invoices with nordkreis metadata
  // Stripe doesn't support metadata search directly — we fetch recent drafts and filter
  const invoices = await stripe.invoices.list({
    status: 'draft',
    limit: 100,
  })

  for (const invoice of invoices.data) {
    if (invoice.metadata?.nordkreis !== 'enrollment_fee') {
      skipped.push(invoice.id)
      continue
    }

    const finalizeAfter = invoice.metadata?.finalizeAfter
    if (!finalizeAfter) {
      skipped.push(invoice.id)
      continue
    }

    const finalizeDate = new Date(finalizeAfter)
    if (now < finalizeDate) {
      skipped.push(invoice.id)
      continue
    }

    try {
      await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true })
      finalized.push(invoice.id)
      console.log(`Nordkreis: finalized enrollment fee invoice ${invoice.id}`)
    } catch (err) {
      console.error(`Nordkreis: failed to finalize invoice ${invoice.id}`, err)
      errors.push(invoice.id)
    }
  }

  // Slack summary so you know the cron is alive
  if (process.env.SLACK_WEBHOOK_URL) {
    const emoji = errors.length > 0 ? '⚠️' : finalized.length > 0 ? '✅' : '🔄'
    fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${emoji} *Nordkreis Cron — Einschreibegebühren*\nFinalisiert: ${finalized.length} · Übersprungen: ${skipped.length} · Fehler: ${errors.length}${errors.length > 0 ? `\nFehler-IDs: ${errors.join(', ')}` : ''}`,
      }),
    }).catch(console.error)
  }

  return NextResponse.json({ finalized, skipped: skipped.length, errors })
}
