// app/api/nordkreis/finalize-enrollment-fees/route.ts
//
// Daily cron job — called by Vercel Cron (see vercel.json).
// Finds all draft Nordkreis enrollment fee invoices where the 8-day
// waiting period has passed and finalizes them so Stripe charges the parent.
//
// Slack, deliberately quiet:
//   - a fee is sent to Stripe for collection → one line per child
//   - a finalization or the whole run fails  → ⚠️ with the reason
//   - Mondays                                → Wochenüberblick: enrollment
//     fees still waiting, the next monthly charge, open invoices
//   - any other day with nothing to do       → nothing
// The payment itself (and its Declarando prompt) is posted by the
// invoice.payment_succeeded webhook once the money arrives, not here.
//
// Add ?wochenueberblick=1 to force the weekly overview when testing.

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const TZ = 'Europe/Madrid'

interface Problem {
  childName: string
  reason: string
}

export async function GET(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const forceOverview = req.nextUrl.searchParams.get('wochenueberblick') === '1'
  const isMonday = now.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short' }) === 'Mon'

  try {
    const finalized: { childName: string; amountEur: number }[] = []
    const errors: Problem[] = []
    const pending: { childName: string; amountEur: number; finalizeAfter: Date | null }[] = []

    // Stripe can't filter by metadata, so page through every draft and pick ours
    for await (const invoice of stripe.invoices.list({ status: 'draft', limit: 100 })) {
      if (invoice.metadata?.nordkreis !== 'enrollment_fee') continue

      const childName = invoice.metadata?.childName || invoice.id
      const amountEur = (invoice.amount_due ?? 0) / 100
      const finalizeAfter = invoice.metadata?.finalizeAfter
        ? new Date(invoice.metadata.finalizeAfter)
        : null

      // A draft without a date is never finalized: report it rather than skip it silently
      if (!finalizeAfter) {
        errors.push({ childName, reason: `kein finalizeAfter-Datum (${invoice.id})` })
        continue
      }

      if (now < finalizeAfter) {
        pending.push({ childName, amountEur, finalizeAfter })
        continue
      }

      try {
        await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: true })
        finalized.push({ childName, amountEur })
        console.log(`Nordkreis: finalized enrollment fee invoice ${invoice.id}`)
      } catch (err) {
        console.error(`Nordkreis: failed to finalize invoice ${invoice.id}`, err)
        errors.push({ childName, reason: `${errorMessage(err)} (${invoice.id})` })
      }
    }

    const messages: string[] = []

    if (finalized.length > 0) {
      messages.push(
        [
          `✅ *Nordkreis — Einschreibegebühr zum Einzug freigegeben*`,
          ...finalized.map((f) => `• ${f.childName} · ${formatEur(f.amountEur)}`),
          `_Die Zahlung meldet sich hier, sobald sie eingegangen ist._`,
        ].join('\n')
      )
    }

    if (errors.length > 0) {
      messages.push(
        [
          `⚠️ *Nordkreis — Einschreibegebühr nicht freigegeben*`,
          ...errors.map((e) => `• ${e.childName}: ${e.reason}`),
        ].join('\n')
      )
    }

    if (isMonday || forceOverview) {
      messages.push(await weeklyOverview(pending))
    }

    for (const text of messages) await postToSlack(text)

    return NextResponse.json({
      finalized: finalized.length,
      pending: pending.length,
      errors,
      overview: isMonday || forceOverview,
    })
  } catch (err) {
    // The whole run failed (Stripe down, bad key…): no fee was charged today
    console.error('Nordkreis cron failed', err)
    await postToSlack(
      `⚠️ *Nordkreis Cron fehlgeschlagen*\nHeute wurde keine Einschreibegebühr freigegeben.\n${errorMessage(err)}`
    )
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}

// ── Monday overview ───────────────────────────────────────────────────────────

async function weeklyOverview(
  pending: { childName: string; amountEur: number; finalizeAfter: Date | null }[]
): Promise<string> {
  const lines: string[] = [`🗓️ *Nordkreis — Wochenüberblick*`]

  // 1. Enrollment fees still inside their 8 days
  lines.push('', `*Einschreibegebühren ausstehend: ${pending.length}*`)
  pending
    .sort((a, b) => (a.finalizeAfter?.getTime() ?? 0) - (b.finalizeAfter?.getTime() ?? 0))
    .forEach((p) =>
      lines.push(
        `• ${p.childName} · ${formatEur(p.amountEur)} · Einzug ab ${p.finalizeAfter ? formatDate(p.finalizeAfter) : '?'}`
      )
    )

  // 2. Monthly fees: running subscriptions, grouped by their next charge date
  const nextCharges = new Map<string, { date: Date; count: number; totalEur: number }>()
  const troubled: string[] = []
  let running = 0

  for await (const sub of stripe.subscriptions.list({ status: 'all', limit: 100 })) {
    if (sub.metadata?.project !== 'nordkreis') continue
    const childName = sub.metadata?.childName || sub.id

    if (sub.status === 'past_due' || sub.status === 'unpaid') {
      troubled.push(
        `• ${childName} · Abo ${sub.status === 'past_due' ? 'überfällig' : 'unbezahlt'}`
      )
    }
    if (sub.status !== 'active' && sub.status !== 'trialing' && sub.status !== 'past_due') continue
    running++

    // Trialing subscriptions charge first at trial_end, the rest at the end of the period
    const nextTs =
      sub.status === 'trialing' && sub.trial_end
        ? sub.trial_end
        : (sub.items.data[0]?.current_period_end ?? null)
    // No further charge once the subscription is set to end before then
    if (!nextTs || (sub.cancel_at && sub.cancel_at <= nextTs)) continue

    const amountEur = sub.items.data.reduce(
      (sum, item) => sum + ((item.price.unit_amount ?? 0) * (item.quantity ?? 1)) / 100,
      0
    )
    const date = new Date(nextTs * 1000)
    const key = formatDate(date)
    const entry = nextCharges.get(key) ?? { date, count: 0, totalEur: 0 }
    entry.count++
    entry.totalEur += amountEur
    nextCharges.set(key, entry)
  }

  lines.push('', `*Monatsbeiträge: ${running} laufende Abos*`)
  const upcoming = [...nextCharges.values()].sort((a, b) => a.date.getTime() - b.date.getTime())
  if (upcoming.length === 0) lines.push('• kein weiterer Einzug geplant')
  upcoming.forEach((c) =>
    lines.push(
      `• Nächster Einzug ${formatDate(c.date)}: ${c.count} ${c.count === 1 ? 'Kind' : 'Kinder'} · ${formatEur(c.totalEur)}`
    )
  )

  // 3. Open invoices: a SEPA debit still on its way, or one that failed and waits for a retry
  for await (const inv of stripe.invoices.list({ status: 'open', limit: 100 })) {
    const subMeta = inv.parent?.subscription_details?.metadata
    const description = inv.lines?.data?.[0]?.description ?? ''
    const isNordkreis =
      inv.metadata?.nordkreis === 'enrollment_fee' ||
      subMeta?.project === 'nordkreis' ||
      description.startsWith('Nordkreis')
    if (!isNordkreis) continue

    const childName = inv.metadata?.childName || subMeta?.childName || description || inv.id
    const since = inv.status_transitions?.finalized_at
      ? formatDate(new Date(inv.status_transitions.finalized_at * 1000))
      : '?'
    const attempts = inv.attempt_count > 1 ? ` · Versuch ${inv.attempt_count}` : ''
    troubled.push(
      `• ${childName} · ${formatEur((inv.amount_due ?? 0) / 100)} · offen seit ${since}${attempts}`
    )
  }

  if (troubled.length > 0) {
    lines.push('', `*Offen (Einzug läuft oder fehlgeschlagen): ${troubled.length}*`, ...troubled)
  } else {
    lines.push('', `*Offene Rechnungen: keine*`)
  }

  return lines.join('\n')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function postToSlack(text: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return
  // Awaited: on Vercel the function may be frozen as soon as the response is sent
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).catch(console.error)
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('de-DE', { timeZone: TZ, day: '2-digit', month: '2-digit' })
}

function formatEur(eur: number): string {
  return `${eur.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
