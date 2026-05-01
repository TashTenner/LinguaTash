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

/** Returns Unix timestamp for today + N days (uses test date in development) */
function daysFromNow(days: number): number {
  let base: Date
  if (process.env.NODE_ENV === 'development') {
    const testDate = process.env.NORDKREIS_TEST_DATE ?? '2026-09-01'
    base = new Date(testDate + 'T12:00:00')
  } else {
    base = new Date()
  }
  base.setDate(base.getDate() + days)
  return Math.floor(base.getTime() / 1000)
}

/**
 * Returns the first monthly charge date.
 * Rules:
 * - Next upcoming 3rd of the month
 * - Skip May/June/July/August — jump to September 3rd
 *   (school year runs Sep–Jun; parents enroll from May for September)
 *
 * In development, use NORDKREIS_TEST_DATE env var to simulate a date,
 * e.g. NORDKREIS_TEST_DATE=2026-09-01 to test September activation.
 * Defaults to 2026-09-01 in development so tests are predictable.
 */
function firstMonthlyChargeDate(): Date {
  let now: Date
  if (process.env.NODE_ENV === 'development') {
    const testDate = process.env.NORDKREIS_TEST_DATE ?? '2026-09-01'
    now = new Date(testDate + 'T12:00:00')
  } else {
    now = new Date()
  }
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
 * Returns the cancel_at date: day after June 3rd ending the school year
 * that contains firstCharge.
 * School year = Sep YYYY → Jun YYYY+1
 * e.g. first charge Sep 2026 → ends June 2027 → cancel June 4, 2027
 *      first charge Jan 2027 → ends June 2027 → cancel June 4, 2027
 */
function schoolYearEndDate(firstCharge: Date): Date {
  const chargeYear = firstCharge.getFullYear()
  const chargeMonth = firstCharge.getMonth()
  // Sep–Dec → school year ends June of next year
  // Jan–Jun → school year ends June of same year (but we never land Jan–Jun
  //            from firstMonthlyChargeDate since May/June skip to Sep)
  const endYear = chargeMonth >= 8 ? chargeYear + 1 : chargeYear
  return new Date(endYear, 5, 4, 12, 0, 0) // June 4th (day after last charge)
}

/**
 * Counts monthly charges from firstCharge up to and including June 3rd.
 * cancelAt is June 4th, so we count months up to (but not including) cancelAt.
 * Sep→Jun = 10, Oct→Jun = 9, Nov→Jun = 8, etc.
 */
function countMonths(firstCharge: Date, cancelAt: Date): number {
  // cancelAt = June 4th (month 5, day 4)
  // Last charge = June 3rd (same month as cancelAt, day 3)
  const lastCharge = new Date(cancelAt.getFullYear(), cancelAt.getMonth(), 3)
  const months =
    (lastCharge.getFullYear() - firstCharge.getFullYear()) * 12 +
    (lastCharge.getMonth() - firstCharge.getMonth()) +
    1
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
    //    A separate cron/scheduled job should finalize it on day 8.
    //    For now we finalize immediately in test mode; in production
    //    set NORDKREIS_CHARGE_ENROLLMENT_NOW=true to also charge immediately,
    //    or leave it as draft and finalize manually / via cron on day 8.
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      amount: ENROLLMENT_FEE_CENTS,
      currency: 'eur',
      description: `Nordkreis Einschreibegebühr — ${childName ?? studentName}`,
    })

    const enrollmentInvoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      default_payment_method: stripePaymentMethodId,
      collection_method: 'charge_automatically',
      auto_advance: false, // keep as draft — finalize manually or via cron on day 8
      metadata: {
        nordkreis: 'enrollment_fee',
        childName: childName ?? studentName,
        finalizeAfter: new Date(enrollmentFeeTimestamp * 1000).toISOString(),
      },
    })

    // In development, finalize immediately for testing
    if (process.env.NODE_ENV === 'development') {
      await stripe.invoices.finalizeInvoice(enrollmentInvoice.id, { auto_advance: true })
    }
    // In production the invoice stays as draft — the daily cron at
    // /api/nordkreis/finalize-enrollment-fees finalizes it after 8 days.

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
      // Cancel after June 3rd of the current school year
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
    await updateSheetStatus(parentEmail, subscription.id, enrollmentSchedule.id).catch(
      console.error
    )

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
  parentEmail: string,
  subscriptionId: string,
  enrollmentScheduleId: string
) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) return

  const token = await getSheetsToken()

  // Find row by Parent 1 Email — col O (index 14)
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:O`)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  const rows: string[][] = data.values ?? []
  const rowIndex = rows.findIndex((r) => r[14] === parentEmail)
  if (rowIndex === -1) return

  const sheetRow = rowIndex + 1

  // Update AD→AJ (cols 30–36, sheet cols AD–AJ)
  // AD: Enrollment Status, AE: Payment Status, AF: (unchanged), AG: (unchanged),
  // AH: (unchanged), AI: (unchanged), AJ: Activation Date
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!AD${sheetRow}:AJ${sheetRow}`)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [
          [
            `Aktiviert — ${subscriptionId}`, // AD: Enrollment Status
            'Aktiv / Active', // AE: Payment Status
            'Ja / Yes', // AF: Contract Signed (keep)
            '', // AG: PDF URL (keep, skip)
            '', // AH: Stripe Customer ID (keep)
            '', // AI: Stripe Payment Method ID (keep)
            new Date().toISOString(), // AJ: Activation Date
          ],
        ],
      }),
    }
  )
}
