// app/api/webhooks/nordkreis/route.ts
//
// Handles Stripe webhook events for Nordkreis payments.
// Separate from the Salten webhook (app/api/webhooks/stripe/route.ts).
//
// On a successful payment it does NOT issue an invoice. Income is recorded by
// hand in Declarando (decided 27 Sep 2026): as "ingreso sin factura", since the
// fees are VAT-exempt teaching, or as a complete invoice when a family asks for
// one. This webhook posts the details to Slack for that, and sends the family a
// payment confirmation. The version that issued numbered PDF invoices itself
// is on the archive/website-invoicing branch.
//
// Register this endpoint in Stripe Dashboard:
//   https://dashboard.stripe.com/webhooks
//   URL: https://linguatash.com/api/webhooks/nordkreis
//   Events to listen for:
//     - invoice.payment_succeeded
//     - invoice.payment_failed
//
// Add to .env.local:
//   STRIPE_NORDKREIS_WEBHOOK_SECRET=whsec_...
//
// To test locally with Stripe CLI:
//   stripe listen --forward-to localhost:3000/api/webhooks/nordkreis

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { buildPaymentEmailHtml, buildPaymentEmailText } from '@/lib/nordkreis/paymentEmail'
import {
  buildPaymentFailureEmailHtml,
  buildPaymentFailureEmailText,
} from '@/lib/nordkreis/paymentFailureEmail'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ── Charge numbering ──────────────────────────────────────────────────────────

/** The course runs September to June. */
const COURSE_MONTHS = 10

/**
 * Which of this family's monthly charges an invoice is, and out of how many:
 * a child who starts in November pays 1/8 in November and 8/8 in June, which
 * is what the confirmation email promised ("× 8 Monate").
 *
 * Counted from the subscription's first charge (trial_end) to the period the
 * invoice's first line bills, with the total taken from the subscription's
 * totalMonths metadata, set on activation.
 *
 * An invoice without such a subscription (a manual one) falls back to the
 * month of the course out of 10, September being 1. Returns undefined for
 * July and August, which are never billed, rather than inventing a number.
 */
function chargeNumber(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any,
  sub: Stripe.Subscription | null
): { monthNumber: number; totalMonths: number } | undefined {
  const start: number | undefined = invoice.lines?.data?.[0]?.period?.start ?? invoice.created
  if (!start) return undefined
  const billed = new Date(start * 1000)

  const totalMonths = Number(sub?.metadata?.totalMonths)
  if (sub?.trial_end && totalMonths > 0) {
    const first = new Date(sub.trial_end * 1000)
    const monthNumber =
      (billed.getUTCFullYear() - first.getUTCFullYear()) * 12 +
      (billed.getUTCMonth() - first.getUTCMonth()) +
      1
    if (monthNumber >= 1 && monthNumber <= totalMonths) return { monthNumber, totalMonths }
    return undefined
  }

  const month = billed.getUTCMonth() // 0 = January
  if (month >= 8) return { monthNumber: month - 7, totalMonths: COURSE_MONTHS } // Sep..Dec → 1..4
  if (month <= 5) return { monthNumber: month + 5, totalMonths: COURSE_MONTHS } // Jan..Jun → 5..10
  return undefined
}

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_NORDKREIS_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('Nordkreis webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    try {
      await handlePaymentSucceeded(invoice)
    } catch (err) {
      // 500 makes Stripe retry. Swallowing the error instead would leave a
      // payment with no invoice prompt and no confirmation to the family.
      console.error('[Nordkreis webhook] Payment not processed, Stripe will retry:', err)
      return NextResponse.json({ error: 'Payment not processed' }, { status: 500 })
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    await handlePaymentFailed(invoice).catch(console.error)
  }

  return NextResponse.json({ received: true })
}

// ── Handle successful payment ─────────────────────────────────────────────────

async function handlePaymentSucceeded(rawInvoice: Stripe.Invoice) {
  // Cast to any to access fields the current SDK types don't expose (e.g. subscription)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoice = rawInvoice as any

  // Skip €0 invoices — these are Stripe trial period invoices fired on subscription creation
  if ((invoice.amount_paid ?? 0) === 0) return

  const customerId: string =
    typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer?.id ?? '')

  if (!customerId) return

  // Fetch customer to get email and metadata
  const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer
  if (customer.deleted) return

  const parentEmail = customer.email ?? ''
  const parentName = customer.name ?? ''

  if (!parentEmail) {
    console.error('Nordkreis webhook: no email on customer', customerId)
    return
  }

  // Determine invoice type from description/metadata
  // Enrollment fee invoices have "Einschreibegebühr" in the description
  const lineItems = invoice.lines?.data ?? []
  const firstDesc = lineItems[0]?.description ?? ''
  const isEnrollment =
    firstDesc.toLowerCase().includes('einschreibegebühr') ||
    firstDesc.toLowerCase().includes('matrícula')

  // Get subscription metadata for child info
  // invoice.subscription was removed in newer Stripe SDK types
  // The subscription ID is available on the invoice lines or via parent
  const subscriptionId: string =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : (invoice.subscription?.id ?? invoice.lines?.data?.[0]?.subscription ?? '')

  let sub: Stripe.Subscription | null = null
  if (subscriptionId) {
    try {
      sub = await stripe.subscriptions.retrieve(subscriptionId)
    } catch (e) {
      console.error('Could not retrieve subscription:', e)
    }
  }

  let childGroup = ''
  // The number on the invoice counts this family's charges: a child who
  // starts in November pays 1/8 first, not 3/10. See chargeNumber.
  const numbering = isEnrollment ? undefined : chargeNumber(invoice, sub)
  const monthNumber = numbering?.monthNumber
  const totalMonths = numbering?.totalMonths

  // Which child this invoice is for. Siblings share a parent email, so the
  // email alone can't answer it: every source that names the child comes
  // before the sheet. The enrollment fee carries it in its own metadata.
  let childName: string = invoice.metadata?.childName || sub?.metadata?.childName || ''

  // A manual invoice has neither, only its line: "Nordkreis Monatsbeitrag — Name"
  if (!childName) childName = childNameFromDescription(firstDesc)

  // The group is only in the sheet, found by email and child together
  const sheetData = await getStudentFromSheets(parentEmail, childName)
  if (sheetData) {
    childName = childName || sheetData.childFullName
    childGroup = sheetData.childGroup
  }
  // The name for the invoice: the sheet's, as the parent typed it at enrollment,
  // with Stripe's as fallback. Some Stripe names carry double spaces.
  const clientName = (sheetData?.parentFullName || parentName).trim().replace(/\s+/g, ' ')

  const amountEur = (invoice.amount_paid ?? 0) / 100
  const paymentDate = madridToday()
  const invoiceType = isEnrollment ? 'enrollment_fee' : 'monthly'

  // 1. Tell Tash what to invoice in Declarando. This comes first and must
  //    succeed: it is the only prompt to issue the invoice, so if it fails the
  //    webhook answers 500 and Stripe retries before the family hears anything.
  await notifyDeclarandoInvoice({
    invoice,
    clientName,
    parentEmail,
    childName,
    childGroup,
    isEnrollment,
    monthNumber,
    totalMonths,
    amountEur,
    paymentDate,
  })

  // 2. Payment confirmation to the family, offering an invoice on request.
  await sendPaymentEmail({
    to: parentEmail,
    parentName,
    childName,
    childGroup,
    invoiceType,
    amountEur,
    paymentDate,
    monthNumber,
    totalMonths,
  })
}

// ── Declarando prompt ──────────────────────────────────────────────────────────

/** Today's date in Madrid as YYYY-MM-DD. */
function madridToday(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' })
}

/** "octubre de 2026": the month a fee pays for, from the period its line bills. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function billedMonthEs(invoice: any): string {
  const start: number | undefined = invoice.lines?.data?.[0]?.period?.start ?? invoice.created
  if (!start) return ''
  return new Date(start * 1000).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  })
}

/**
 * Posts everything needed to record the payment in Declarando, already worded
 * in Spanish so the concept can be pasted as it is.
 *
 * Income is entered there by hand (decided 27 Sep 2026), so this message is
 * the only thing standing between a payment and its record. It throws when
 * Slack is not configured or refuses the post, rather than failing quietly.
 */
async function notifyDeclarandoInvoice({
  invoice,
  clientName,
  parentEmail,
  childName,
  childGroup,
  isEnrollment,
  monthNumber,
  totalMonths,
  amountEur,
  paymentDate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any
  clientName: string
  parentEmail: string
  childName: string
  childGroup: string
  isEnrollment: boolean
  monthNumber?: number
  totalMonths?: number
  amountEur: number
  paymentDate: string
}) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) throw new Error('SLACK_WEBHOOK_URL is not set: no prompt to issue the invoice')

  const alumno = `${childName || '¿alumno?'}${childGroup ? `, ${childGroup}` : ''}`
  const concepto = isEnrollment
    ? `Nordkreis: matrícula curso 2026/27. Alumno: ${alumno}`
    : `Nordkreis: cuota mensual${monthNumber ? ` ${monthNumber} de ${totalMonths}` : ''} (${billedMonthEs(invoice)}). Alumno: ${alumno}`
  const [y, m, d] = paymentDate.split('-')
  const importe = amountEur.toFixed(2).replace('.', ',')

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // In the order of Declarando's form: Añadir ingreso → Sin factura. The
      // teaching epígrafe offers only "sin factura" or a complete invoice.
      text: [
        '🧾 *Nordkreis: Zahlung in Declarando eintragen*',
        '*Tipo:* ingreso sin factura (o factura completa si la familia la pide)',
        '*Actividad:* Enseñanza formación prof. no superior',
        `*Cliente:* ${clientName} · ${parentEmail}`,
        `*Concepto:* ${concepto}`,
        `*Importe:* ${importe} € · exento de IVA`,
        `*Cobrado:* ${d}/${m}/${y}, domiciliación SEPA vía Stripe`,
        `Stripe: \`${invoice.id}\``,
      ].join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Slack refused the Declarando prompt: ${res.status}`)
}

// ── Send payment confirmation ──────────────────────────────────────────────────

async function sendPaymentEmail({
  to,
  parentName,
  childName,
  childGroup,
  invoiceType,
  amountEur,
  paymentDate,
  monthNumber,
  totalMonths,
}: {
  to: string
  parentName: string
  childName: string
  childGroup: string
  invoiceType: 'enrollment_fee' | 'monthly'
  amountEur: number
  paymentDate: string
  monthNumber?: number
  totalMonths?: number
}) {
  const isEnrollment = invoiceType === 'enrollment_fee'
  const subject = isEnrollment
    ? 'Zahlungsbestätigung Einschreibegebühr · Nordkreis'
    : `Zahlungsbestätigung Monatsbeitrag${monthNumber ? ` ${monthNumber}/${totalMonths ?? 10}` : ''} · Nordkreis`
  const content = {
    parentName,
    childName,
    childGroup,
    invoiceType,
    amountEur,
    paymentDate,
    monthNumber,
    totalMonths,
  } as const

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAILERSEND_FROM_EMAIL,
        name: process.env.MAILERSEND_FROM_NAME ?? 'Nordkreis',
      },
      to: [{ email: to, name: parentName }],
      reply_to: { email: 'nordkreis@linguatash.com', name: 'Nordkreis' },
      subject,
      html: buildPaymentEmailHtml(content),
      text: buildPaymentEmailText(content),
    }),
  })

  if (!res.ok) {
    throw new Error(`Payment confirmation email failed: ${await res.text()}`)
  }
}

// ── Handle failed payment ─────────────────────────────────────────────────────

async function handlePaymentFailed(rawInvoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoice = rawInvoice as any
  const customerId: string =
    typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer?.id ?? '')

  if (!customerId) return

  const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer
  if (customer.deleted) return

  const parentEmail = customer.email ?? ''
  const parentName = customer.name ?? ''
  if (!parentEmail) return

  const amountEur = (invoice.amount_due ?? 0) / 100
  const attemptCount: number = invoice.attempt_count ?? 1

  // Which child: same order as for a successful payment, sheet last
  let childName: string = invoice.metadata?.childName ?? ''
  const subscriptionId: string =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : (invoice.subscription?.id ?? '')
  if (!childName && subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      childName = sub.metadata?.childName ?? ''
    } catch {
      // ignore
    }
  }
  if (!childName) childName = childNameFromDescription(invoice.lines?.data?.[0]?.description ?? '')
  if (!childName) {
    const sheetData = await getStudentFromSheets(parentEmail, '')
    childName = sheetData?.childFullName ?? ''
  }

  // 1. Email to parent. Whether it went out is checked, not assumed: the Slack
  //    alert below is the only place a refused email would ever surface, and
  //    without it Tash would believe the family had been told.
  const emailRes = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAILERSEND_FROM_EMAIL,
        name: process.env.MAILERSEND_FROM_NAME ?? 'Nordkreis',
      },
      to: [{ email: parentEmail, name: parentName }],
      reply_to: { email: 'nordkreis@linguatash.com', name: 'Nordkreis' },
      subject: `Zahlungsfehler Nordkreis · Pago fallido Nordkreis`,
      html: buildPaymentFailureEmailHtml({ parentName, childName, amountEur, attemptCount }),
      text: buildPaymentFailureEmailText({ parentName, childName, amountEur, attemptCount }),
    }),
  }).catch((err) => {
    console.error('Payment failure email could not be sent:', err)
    return null
  })
  const emailOk = !!emailRes?.ok
  if (emailRes && !emailRes.ok) {
    console.error('Payment failure email refused:', await emailRes.text())
  }

  // 2. Slack alert to admin
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `⚠️ *Nordkreis Zahlung fehlgeschlagen*\nBetrag: ${amountEur} €\nKind: ${childName} · ${parentEmail}\nVersuch: ${attemptCount}\nStripe Invoice: \`${invoice.id}\`${emailOk ? '' : '\n🚨 *E-Mail an die Familie NICHT zugestellt*: bitte selbst kontaktieren.'}`,
      }),
    }).catch(console.error)
  }

  console.log(
    `Nordkreis: payment failed for ${parentEmail}, invoice ${invoice.id}, attempt ${attemptCount}`
  )
}

// ── Get student data from Google Sheets ───────────────────────────────────────

/** Lowercase, trimmed, single spaces: the sheet has names like "Armand  Exner  Camps". */
function normalizarNombre(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * The child named on an invoice line we wrote ourselves, e.g.
 * "Nordkreis Monatsbeitrag — Erik Grimm Villaescusa" → "Erik Grimm Villaescusa".
 * Empty when the line doesn't follow that shape, rather than a guess.
 */
function childNameFromDescription(description: string): string {
  const match = description.match(/^Nordkreis .+? — (.+)$/)
  return match ? match[1].trim() : ''
}

/**
 * A student's row, found by parent email and, when known, the child's name.
 *
 * Siblings share a parent email, so the email alone matches more than one row.
 * With a name, the row must match both. Without one, a single match is safe
 * and several are ambiguous: returning null there leaves a field blank, which
 * is better than an invoice issued to the wrong child.
 */
async function getStudentFromSheets(parentEmail: string, childName: string) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) return null
  try {
    const token = await getSheetsToken()
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:O`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows: string[][] = data.values ?? []
    const email = parentEmail.trim().toLowerCase()
    // col O (index 14) = parent1Email
    const candidates = rows.filter((r) => (r[14] ?? '').trim().toLowerCase() === email)
    const byName = childName
      ? candidates.find((r) => normalizarNombre(r[5] ?? '') === normalizarNombre(childName))
      : undefined
    const row = byName ?? (candidates.length === 1 ? candidates[0] : undefined)
    if (!row) return null
    return {
      childFullName: row[5] ?? '', // F: Child Full Name
      childGroup: row[8] ?? '', // I: Group
      parentFullName: row[12] ?? '', // M: Parent 1 Full Name
    }
  } catch {
    return null
  }
}
