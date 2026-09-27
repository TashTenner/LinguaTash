// app/api/nordkreis/activate-student/route.ts
//
// When you click Activate in the admin panel, this route:
// 1. Creates a one-time €60 PaymentIntent scheduled for today + 8 days
// 2. Creates a recurring €45/month subscription anchored to the next 3rd of the month
// 3. Sends a confirmation email to the parent with exact charge dates
// 4. Updates Google Sheets (Enrollment Status, Payment Status, Activation Date)

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'
import {
  buildConfirmationEmailHtml,
  buildConfirmationEmailText,
} from '@/lib/nordkreis/confirmationEmail'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const MONTHLY_AMOUNT_CENTS = 4500 // €45.00
const ENROLLMENT_FEE_CENTS = 6000 // €60.00
const ENROLLMENT_FEE_DELAY_DAYS = 8

// ── Date helpers ──────────────────────────────────────────────────────────────

/** Returns the base date: NORDKREIS_TEST_DATE if set, otherwise today. */
function baseDate(): Date {
  const testDate = process.env.NORDKREIS_TEST_DATE
  return testDate ? new Date(testDate + 'T12:00:00') : new Date()
}

/** Returns Unix timestamp for today + N days. Set NORDKREIS_TEST_DATE to simulate a different date. */
function daysFromNow(days: number): number {
  const base = baseDate()
  base.setDate(base.getDate() + days)
  return Math.floor(base.getTime() / 1000)
}

/**
 * Returns the first monthly charge date.
 * - Next upcoming 3rd of the month
 * - Skips May/June/July/August → September 3rd
 * Set NORDKREIS_TEST_DATE to simulate activation on a different date.
 */
function firstMonthlyChargeDate(): Date {
  const now = baseDate()
  const d = new Date(now.getFullYear(), now.getMonth(), 3, 12, 0, 0)
  if (d <= now) d.setMonth(d.getMonth() + 1)
  // Summer months (May, June, July, August) → first charge is September
  const m = d.getMonth()
  if (m === 4 || m === 5 || m === 6 || m === 7) {
    d.setMonth(8) // September
  }
  return d
}

/**
 * Returns the cancel_at date: July 3rd after the school year that contains
 * firstCharge, at the exact same instant of day as the billing anchor.
 * School year = Sep YYYY → Jun YYYY+1
 * e.g. first charge Sep 2026 → last charge June 3, 2027 → cancel July 3, 2027
 *
 * It must be the END of June's billing period, not the day after the June
 * charge. Stripe shortens whichever period contains cancel_at and prorates its
 * invoice, with no way to switch that off: a June 4th cancel makes June's
 * invoice cover one day, about €1.50 instead of €45.
 *
 * Built in UTC from firstCharge itself so the time of day matches the anchor
 * to the second. Built in local time, a winter activation would land an hour
 * early after the switch to summer time, and June would still be prorated.
 */
function schoolYearEndDate(firstCharge: Date): Date {
  // Sep–Dec → school year ends June of next year
  // Jan–Jun → school year ends June of same year (but we never land Jan–Jun
  //            from firstMonthlyChargeDate since May/June skip to Sep)
  const endYear =
    firstCharge.getUTCMonth() >= 8 ? firstCharge.getUTCFullYear() + 1 : firstCharge.getUTCFullYear()
  const end = new Date(firstCharge)
  end.setUTCFullYear(endYear, 6, 3) // July 3rd, same time of day
  return end
}

/**
 * Counts monthly charges from firstCharge up to and including June.
 * cancelAt is July 3rd, the moment a July charge would have been taken, so
 * every month before it is charged.
 * Sep→Jun = 10, Oct→Jun = 9, Nov→Jun = 8, etc.
 */
function countMonths(firstCharge: Date, cancelAt: Date): number {
  const months =
    (cancelAt.getUTCFullYear() - firstCharge.getUTCFullYear()) * 12 +
    (cancelAt.getUTCMonth() - firstCharge.getUTCMonth())
  return Math.max(1, months)
}

/** Formats a Unix timestamp as German date string, e.g. "21. April 2026" */
function formatDateDE(unixTs: number): string {
  return new Date(unixTs * 1000).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const {
      stripeCustomerId,
      stripePaymentMethodId,
      studentName,
      childName,
      childGroup,
      parentName,
      parentEmail,
      contractNo,
    } = await req.json()

    if (!stripeCustomerId || !stripePaymentMethodId) {
      return NextResponse.json({ error: 'Missing Stripe IDs' }, { status: 400 })
    }

    // 1. Attach payment method to customer (safe if already attached)
    try {
      await stripe.paymentMethods.attach(stripePaymentMethodId, { customer: stripeCustomerId })
    } catch (e: unknown) {
      if (!(e instanceof Error) || !e.message.includes('already been attached')) throw e
    }

    // 2. Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: stripePaymentMethodId },
    })

    // 3. Calculate charge dates
    const enrollmentFeeTimestamp = daysFromNow(ENROLLMENT_FEE_DELAY_DAYS)
    const firstMonthlyDate_ = firstMonthlyChargeDate()
    const cancelAtDate = schoolYearEndDate(firstMonthlyDate_)
    const numMonths = countMonths(firstMonthlyDate_, cancelAtDate)
    const firstMonthlyTimestamp = Math.floor(firstMonthlyDate_.getTime() / 1000)
    const cancelAtTimestamp = Math.floor(cancelAtDate.getTime() / 1000)
    const enrollmentFeeDateStr = formatDateDE(enrollmentFeeTimestamp)
    const firstMonthlyDateStr = formatDateDE(firstMonthlyTimestamp)

    // 4. Create one-time €60 enrollment fee.
    //    Strategy: create a draft invoice, do NOT auto-advance it.
    // Create the invoice FIRST (empty draft), then attach the item to it explicitly.
    // This prevents the subscription creation from grabbing the pending item.
    const enrollmentInvoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      default_payment_method: stripePaymentMethodId,
      collection_method: 'charge_automatically',
      auto_advance: false, // stays as draft — cron finalizes after 8 days
      metadata: {
        nordkreis: 'enrollment_fee',
        childName: childName ?? studentName,
        finalizeAfter: new Date(enrollmentFeeTimestamp * 1000).toISOString(),
      },
    })

    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      amount: ENROLLMENT_FEE_CENTS,
      currency: 'eur',
      description: `Nordkreis Einschreibegebühr — ${childName ?? studentName}`,
      invoice: enrollmentInvoice.id, // explicitly attach — subscription cannot grab this
    })

    // Invoice stays as draft. The daily Vercel cron at
    // /api/nordkreis/finalize-enrollment-fees finalizes it after 8 days.
    // To test immediately: manually finalize the invoice in the Stripe dashboard.

    const enrollmentSchedule = { id: enrollmentInvoice.id }

    // 5. Create recurring €45/month subscription anchored to next 3rd of month
    const monthlyProduct = await stripe.products.create({
      name: `Nordkreis Monatsbeitrag — ${childName ?? studentName}`,
    })
    const monthlyPrice = await stripe.prices.create({
      currency: 'eur',
      unit_amount: MONTHLY_AMOUNT_CENTS,
      recurring: { interval: 'month' },
      product: monthlyProduct.id,
    })

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: monthlyPrice.id }],
      default_payment_method: stripePaymentMethodId,
      payment_settings: {
        payment_method_types: ['sepa_debit'],
        save_default_payment_method: 'on_subscription',
      },
      // trial_end sets the first billing date without charging during the trial.
      // This is the correct Stripe pattern when the first charge is far in the future
      // (billing_cycle_anchor is rejected if it's more than one billing cycle away).
      trial_end: firstMonthlyTimestamp,
      // Cancel when June's period ends — see schoolYearEndDate for why not June 4th
      cancel_at: cancelAtTimestamp,
      metadata: {
        childName: childName ?? studentName,
        totalMonths: String(numMonths),
        project: 'nordkreis',
        contractNo: contractNo ?? '',
      },
    })

    // 6. Send confirmation email to parent
    await sendConfirmationEmail({
      to: parentEmail,
      parentName,
      childName: childName ?? studentName,
      group: childGroup ?? '',
      contractNo: contractNo ?? '',
      enrollmentFeeDate: enrollmentFeeDateStr,
      firstMonthlyDate: firstMonthlyDateStr,
      numMonths,
    })

    // 7. Update Google Sheets
    await updateSheetStatus(contractNo, subscription.id, enrollmentSchedule.id).catch(console.error)

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      enrollmentScheduleId: enrollmentSchedule.id,
      enrollmentFeeDate: enrollmentFeeDateStr,
      firstMonthlyDate: firstMonthlyDateStr,
    })
  } catch (err: unknown) {
    console.error('Activation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// ── Send confirmation email ───────────────────────────────────────────────────

async function sendConfirmationEmail({
  to,
  parentName,
  childName,
  group,
  contractNo,
  enrollmentFeeDate,
  firstMonthlyDate,
  numMonths,
}: {
  to: string
  parentName: string
  childName: string
  group: string
  contractNo: string
  enrollmentFeeDate: string
  firstMonthlyDate: string
  numMonths: number
}) {
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
      subject: `Kursbestätigung Nordkreis · ${childName}`,
      html: buildConfirmationEmailHtml({
        parentName,
        childName,
        group,
        contractNo,
        enrollmentFeeDate,
        firstMonthlyDate,
        monthlyAmount: MONTHLY_AMOUNT_CENTS / 100,
        numMonths,
      }),
      text: buildConfirmationEmailText({
        parentName,
        childName,
        group,
        contractNo,
        enrollmentFeeDate,
        firstMonthlyDate,
        monthlyAmount: MONTHLY_AMOUNT_CENTS / 100,
        numMonths,
      }),
    }),
  })
  if (!res.ok) {
    console.error('Confirmation email failed:', await res.text())
    // Non-fatal — Stripe charges are already scheduled
  }
}

// ── Update Google Sheets ──────────────────────────────────────────────────────

async function updateSheetStatus(
  contractNo: string,
  subscriptionId: string,
  enrollmentScheduleId: string
) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) return

  const token = await getSheetsToken()

  // Find row by Contract No — col B (index 1), always unique
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:B`)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  const rows: string[][] = data.values ?? []
  const rowIndex = rows.findIndex((r) => r[1] === contractNo)
  if (rowIndex === -1) return

  const sheetRow = rowIndex + 1

  // Update only the columns that change on activation — leave AG/AH/AI untouched
  const batchBody = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: `${SHEET_NAME}!AD${sheetRow}:AE${sheetRow}`,
        values: [[`Aktiviert — ${subscriptionId}`, 'Aktiv / Active']],
      },
      {
        range: `${SHEET_NAME}!AJ${sheetRow}`,
        values: [[new Date().toISOString()]],
      },
    ],
  }
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(batchBody),
  })
}
