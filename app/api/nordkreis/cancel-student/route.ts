// app/api/nordkreis/cancel-student/route.ts
//
// Cancels a student:
// 1. Voids the draft €60 enrollment fee invoice (if still unpaid)
// 2. Cancels the Stripe subscription (if active)
// 3. Soft-deletes in Google Sheets (sets Enrollment Status to "Storniert")

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { parentEmail, contractNo, stripeCustomerId, enrollmentStatus } = await req.json()

    if (!parentEmail) {
      return NextResponse.json({ error: 'Missing parentEmail' }, { status: 400 })
    }

    // 1. Void draft enrollment fee invoice (if it exists and is still a draft)
    if (stripeCustomerId) {
      try {
        const invoices = await stripe.invoices.list({
          customer: stripeCustomerId,
          status: 'draft',
          limit: 10,
        })
        for (const invoice of invoices.data) {
          if (invoice.metadata?.nordkreis === 'enrollment_fee') {
            await stripe.invoices.voidInvoice(invoice.id)
            console.log(`Nordkreis: voided enrollment fee invoice ${invoice.id}`)
          }
        }
      } catch (err) {
        console.error('Nordkreis: failed to void enrollment fee invoice', err)
        // Non-fatal — continue with cancellation
      }
    }

    // 2. Cancel Stripe subscription (extract ID from enrollmentStatus "Aktiviert — sub_xxx")
    const subscriptionMatch = enrollmentStatus?.match(/sub_\w+/)
    if (subscriptionMatch) {
      try {
        await stripe.subscriptions.cancel(subscriptionMatch[0])
        console.log(`Nordkreis: cancelled subscription ${subscriptionMatch[0]}`)
      } catch (err) {
        console.error('Nordkreis: failed to cancel subscription', err)
        // Non-fatal — continue with sheet update
      }
    }

    // 3. Soft-delete in Google Sheets
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets not configured' }, { status: 500 })
    }

    const token = await getSheetsToken()

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:O`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows: string[][] = data.values ?? []
    const rowIndex = rows.findIndex((r) => r[14] === parentEmail)

    if (rowIndex < 1) {
      return NextResponse.json({ error: 'Student not found in sheet' }, { status: 404 })
    }

    const sheetRow = rowIndex + 1

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!AD${sheetRow}`)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [[`Storniert / Cancelled — ${new Date().toISOString().split('T')[0]}`]],
        }),
      }
    )

    console.log(`Nordkreis: cancelled student ${contractNo} (${parentEmail})`)

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Cancel student error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
