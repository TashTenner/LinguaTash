// app/api/nordkreis/admin-students/route.ts
// Reads all enrollment rows from Google Sheets for the admin panel

import { NextResponse } from 'next/server'
import { getSheetsReadOnlyToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'

export async function GET() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) {
    return NextResponse.json({ error: 'Google Sheets not configured' }, { status: 500 })
  }

  try {
    const token = await getSheetsReadOnlyToken()

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:AK`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows: string[][] = data.values ?? []

    if (rows.length < 2) return NextResponse.json({ students: [] })

    // Skip header row — columns A→AK
    const students = rows
      .slice(1)
      .map((r) => ({
        enrolledAt: r[0] ?? '', // A
        contractNo: r[1] ?? '', // B
        childFirstName: r[2] ?? '', // C
        childSurname1: r[3] ?? '', // D
        childSurname2: r[4] ?? '', // E
        childFullName: r[5] ?? '', // F
        childDOB: r[6] ?? '', // G
        schoolYear: r[7] ?? '', // H
        childGroup: r[8] ?? '', // I
        parent1FirstName: r[9] ?? '', // J
        parent1Surname1: r[10] ?? '', // K
        parent1Surname2: r[11] ?? '', // L
        parent1FullName: r[12] ?? '', // M
        parent1Phone: r[13] ?? '', // N
        parent1Email: r[14] ?? '', // O
        parent2FirstName: r[15] ?? '', // P
        parent2Surname1: r[16] ?? '', // Q
        parent2Surname2: r[17] ?? '', // R
        parent2FullName: r[18] ?? '', // S
        parent2Phone: r[19] ?? '', // T
        parent2Email: r[20] ?? '', // U
        addressStreet: r[21] ?? '', // V
        city: r[22] ?? '', // W
        postalCode: r[23] ?? '', // X
        germanSpeakingParent: r[24] ?? '', // Y
        medicalAllergies: r[25] ?? '', // Z
        additionalNotes: r[26] ?? '', // AA
        emergencyContactName: r[27] ?? '', // AB
        emergencyContactPhone: r[28] ?? '', // AC
        enrollmentStatus: r[29] ?? 'Warteliste / Waitlist', // AD
        paymentStatus: r[30] ?? 'Ausstehend / Pending', // AE
        contractSigned: r[31] ?? '', // AF
        pdfUrl: r[32] ?? '', // AG
        stripeCustomerId: r[33] ?? '', // AH
        stripePaymentMethodId: r[34] ?? '', // AI
        activationDate: r[35] ?? '', // AJ
        internalNotes: r[36] ?? '', // AK
      }))
      .filter((s) => s.childFirstName || s.childFullName)

    return NextResponse.json({ students })
  } catch (err: unknown) {
    console.error('Admin students error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
