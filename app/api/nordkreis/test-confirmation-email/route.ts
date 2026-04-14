// app/api/nordkreis/test-confirmation-email/route.ts
// DEV ONLY — open http://localhost:3000/api/nordkreis/test-confirmation-email

import { NextResponse } from 'next/server'
import { buildConfirmationEmailHtml } from '@/lib/nordkreis/confirmationEmail'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const html = buildConfirmationEmailHtml({
    parentName: 'Klaus Müller',
    childName: 'Emma Müller García',
    group: 'Entdeckerkreis (3–5 Jahre, I3–I5)',
    contractNo: 'NK-TEST-265417',
    enrollmentFeeDate: '21. April 2026',
    firstMonthlyDate: '3. Mai 2026',
    monthlyAmount: 45,
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
