// app/api/nordkreis/cancel-student/route.ts
//
// Soft-deletes a student by setting Enrollment Status to "Storniert / Cancelled"
// in Google Sheets column AD. Does NOT delete the row or touch Stripe.
// If there is an active Stripe subscription, you should cancel it manually
// in the Stripe dashboard.

import { NextRequest, NextResponse } from 'next/server'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'

export async function POST(req: NextRequest) {
  try {
    const { parentEmail, contractNo } = await req.json()

    if (!parentEmail) {
      return NextResponse.json({ error: 'Missing parentEmail' }, { status: 400 })
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets not configured' }, { status: 500 })
    }

    const token = await getSheetsToken()

    // Find row by Parent 1 Email — col O (index 14)
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

    // Update col AD (Enrollment Status) only
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
