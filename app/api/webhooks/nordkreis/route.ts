// app/api/webhooks/nordkreis/route.ts
//
// Handles Stripe webhook events for Nordkreis payments.
// Separate from the Salten webhook (app/api/webhooks/stripe/route.ts).
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
import {
  generateNordkreisInvoicePdf,
  generateNordkreisInvoiceNumber,
} from '@/lib/nordkreis/generateInvoicePdf'
import { buildPaymentEmailHtml, buildPaymentEmailText } from '@/lib/nordkreis/paymentEmail'
import {
  buildPaymentFailureEmailHtml,
  buildPaymentFailureEmailText,
} from '@/lib/nordkreis/paymentFailureEmail'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { registerVerifactuInvoice } from '@/lib/verifactu'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

// ── Course months ─────────────────────────────────────────────────────────────

/** The course runs September to June. */
const COURSE_MONTHS = 10

/**
 * Which month of the course an invoice pays for: September is 1, June is 10.
 *
 * Read from the period the first line bills, not from when the invoice was
 * created. A subscription line covers Oct 3 → Nov 3 and is October; a manual
 * line has a single instant, the day it was added. Returns undefined for July
 * and August, which are never billed, rather than inventing a number.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function courseMonth(invoice: any): number | undefined {
  const start: number | undefined = invoice.lines?.data?.[0]?.period?.start ?? invoice.created
  if (!start) return undefined
  const month = new Date(start * 1000).getUTCMonth() // 0 = January
  if (month >= 8) return month - 7 // Sep..Dec → 1..4
  if (month <= 5) return month + 5 // Jan..Jun → 5..10
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
    await handlePaymentSucceeded(invoice).catch(console.error)
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

  let childName = ''
  let childGroup = ''
  // The number on the invoice is the month of the course, not a count of
  // this family's charges: October is always 2/10, whether September came
  // through the subscription, a manual invoice, or not at all.
  const totalMonths = COURSE_MONTHS
  const monthNumber = isEnrollment ? undefined : courseMonth(invoice)

  // Which child this invoice is for. Siblings share a parent email, so the
  // email alone can't answer it: every source that names the child comes
  // before the sheet. The enrollment fee carries it in its own metadata.
  childName = invoice.metadata?.childName ?? ''

  if (!childName && subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      childName = sub.metadata?.childName ?? ''
    } catch (e) {
      console.error('Could not retrieve subscription:', e)
    }
  }

  // A manual invoice has neither, only its line: "Nordkreis Monatsbeitrag — Name"
  if (!childName) childName = childNameFromDescription(firstDesc)

  // The group is only in the sheet, found by email and child together
  const sheetData = await getStudentFromSheets(parentEmail, childName)
  if (sheetData) {
    childName = childName || sheetData.childFullName
    childGroup = sheetData.childGroup
  }

  const amountEur = (invoice.amount_paid ?? 0) / 100
  const issueDate = new Date((invoice.created ?? Date.now() / 1000) * 1000)
    .toISOString()
    .split('T')[0]
  const invoiceNumber = generateNordkreisInvoiceNumber()

  // 1. Generate PDF invoice
  const pdfBytes = await generateNordkreisInvoicePdf({
    invoiceNumber,
    issueDate,
    stripeInvoiceId: invoice.id,
    invoiceType: isEnrollment ? 'enrollment_fee' : 'monthly',
    monthNumber,
    totalMonths,
    buyerName: parentName,
    buyerEmail: parentEmail,
    childName,
    childGroup,
    amountEur,
  })

  // 2. Upload to R2
  const invoiceDate = new Date()
  const r2Key = `nordkreis/rechnungen/${invoiceDate.getFullYear()}/${String(invoiceDate.getMonth() + 1).padStart(2, '0')}/${invoiceNumber}.pdf`
  await r2.send(
    new PutObjectCommand({
      Bucket:
        process.env.CLOUDFLARE_R2_NORDKREIS_INVOICES_BUCKET ??
        process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: r2Key,
      Body: Buffer.from(pdfBytes),
      ContentType: 'application/pdf',
    })
  )

  // 3. Register with Verifactu / AEAT (non-fatal)
  try {
    const exemptDesc = isEnrollment
      ? `Matrícula Nordkreis — ${childName} — Enseñanza de alemán (exenta Art. 20.1.9ª Ley 37/1992)`
      : `Cuota mensual Nordkreis ${monthNumber ?? ''}/${totalMonths} — ${childName} — Enseñanza de alemán (exenta Art. 20.1.9ª Ley 37/1992)`
    await registerVerifactuInvoice({
      series: 'NORDKREIS',
      invoiceNumber,
      issueDate,
      invoiceType: 'F2',
      description: exemptDesc,
      externalReference: invoice.id,
      customerName: parentName,
      items: [
        {
          description: exemptDesc,
          quantity: 1,
          unit_price: amountEur,
          tax_rate: 0,
          aeat_code: '01',
          operation_qualification: 'E1',
        },
      ],
    })
    console.log('[Nordkreis webhook] ✓ Verifactu registered:', invoiceNumber)
  } catch (err) {
    console.error('[Nordkreis webhook] Verifactu error (non-fatal):', err)
  }

  // 4. Send email with PDF attached
  await sendPaymentEmail({
    to: parentEmail,
    parentName,
    childName,
    childGroup,
    invoiceType: isEnrollment ? 'enrollment_fee' : 'monthly',
    invoiceNumber,
    amountEur,
    issueDate,
    monthNumber,
    totalMonths,
    pdfBytes,
  })

  // 5. Notify Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `💶 *Nordkreis Zahlung eingegangen*\n${isEnrollment ? 'Einschreibegebühr' : `Monatsbeitrag ${monthNumber ?? ''}`}: ${amountEur} €\nKind: ${childName} · ${parentEmail}\nRechnung: \`${invoiceNumber}\``,
      }),
    }).catch(console.error)
  }
}

// ── Send payment email ─────────────────────────────────────────────────────────

async function sendPaymentEmail({
  to,
  parentName,
  childName,
  childGroup,
  invoiceType,
  invoiceNumber,
  amountEur,
  issueDate,
  monthNumber,
  totalMonths,
  pdfBytes,
}: {
  to: string
  parentName: string
  childName: string
  childGroup: string
  invoiceType: 'enrollment_fee' | 'monthly'
  invoiceNumber: string
  amountEur: number
  issueDate: string
  monthNumber?: number
  totalMonths?: number
  pdfBytes: Uint8Array
}) {
  const isEnrollment = invoiceType === 'enrollment_fee'
  const subject = isEnrollment
    ? `Rechnung Einschreibegebühr · Nordkreis · ${invoiceNumber}`
    : `Rechnung Monatsbeitrag${monthNumber ? ` ${monthNumber}/${totalMonths ?? 10}` : ''} · Nordkreis · ${invoiceNumber}`

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
      html: buildPaymentEmailHtml({
        parentName,
        childName,
        childGroup,
        invoiceType,
        invoiceNumber,
        amountEur,
        issueDate,
        monthNumber,
        totalMonths,
      }),
      text: buildPaymentEmailText({
        parentName,
        childName,
        childGroup,
        invoiceType,
        invoiceNumber,
        amountEur,
        issueDate,
        monthNumber,
        totalMonths,
      }),
      attachments: [
        {
          content: Buffer.from(pdfBytes).toString('base64'),
          filename: `${invoiceNumber}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error('Payment email failed:', await res.text())
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

  // 1. Email to parent
  await fetch('https://api.mailersend.com/v1/email', {
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
  }).catch(console.error)

  // 2. Slack alert to admin
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `⚠️ *Nordkreis Zahlung fehlgeschlagen*\nBetrag: ${amountEur} €\nKind: ${childName} · ${parentEmail}\nVersuch: ${attemptCount}\nStripe Invoice: \`${invoice.id}\``,
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
    }
  } catch {
    return null
  }
}
