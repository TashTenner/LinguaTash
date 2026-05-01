// app/api/nordkreis/update-notes/route.ts
// Updates the internal notes (col AK) for a student in Google Sheets

import { NextRequest, NextResponse } from 'next/server'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'

export async function POST(req: NextRequest) {
  try {
    const { parentEmail, notes } = await req.json()

    if (!parentEmail) {
      return NextResponse.json({ error: 'Missing parentEmail' }, { status: 400 })
    }

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

    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const sheetRow = rowIndex + 1

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!AK${sheetRow}`)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[notes ?? '']] }),
      }
    )

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Update notes error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
