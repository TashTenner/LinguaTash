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
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

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

  return NextResponse.json({ received: true })
}

// ── Handle successful payment ─────────────────────────────────────────────────

async function handlePaymentSucceeded(rawInvoice: Stripe.Invoice) {
  // Cast to any to access fields the current SDK types don't expose (e.g. subscription)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoice = rawInvoice as any
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
  let totalMonths = 10
  let monthNumber: number | undefined

  if (subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      childName = sub.metadata?.childName ?? ''
      childGroup = '' // not stored in sub metadata — we'll get from Sheets
      totalMonths = parseInt(sub.metadata?.totalMonths ?? '10')

      // Calculate which month this is based on subscription start
      if (!isEnrollment && sub.start_date) {
        const startDate = new Date(sub.start_date * 1000)
        const invoiceDate = new Date((invoice.created ?? Date.now() / 1000) * 1000)
        const diff =
          (invoiceDate.getFullYear() - startDate.getFullYear()) * 12 +
          (invoiceDate.getMonth() - startDate.getMonth())
        monthNumber = Math.max(1, diff + 1)
      }
    } catch (e) {
      console.error('Could not retrieve subscription:', e)
    }
  }

  // Try to get child info from Google Sheets if not in metadata
  if (!childName || !childGroup) {
    const sheetData = await getStudentFromSheets(parentEmail)
    if (sheetData) {
      childName = childName || sheetData.childFullName
      childGroup = childGroup || sheetData.childGroup
    }
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

  // 3. Send email with PDF attached
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

  // 4. Notify Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    fetch(process.env.SLACK_WEBHOOK_URL, {
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

// ── Get student data from Google Sheets ───────────────────────────────────────

async function getStudentFromSheets(parentEmail: string) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) return null
  try {
    const token = await getSheetsToken()
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:I`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows: string[][] = data.values ?? []
    // col O (index 14) = parent1Email — but we only fetched A:I here for efficiency
    // Fetch a wider range to find email
    const res2 = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:O`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data2 = await res2.json()
    const rows2: string[][] = data2.values ?? []
    const row = rows2.find((r) => r[14] === parentEmail)
    if (!row) return null
    return {
      childFullName: row[5] ?? '', // F: Child Full Name
      childGroup: row[8] ?? '', // I: Group
    }
  } catch {
    return null
  }
}
