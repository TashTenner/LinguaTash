// app/api/nordkreis/test-email/route.ts
// DEV ONLY — open http://localhost:3000/api/nordkreis/test-email in your browser
// Shows exactly how the enrollment confirmation email looks

import { NextResponse } from 'next/server'
import { buildEnrollmentEmailHtml } from '../../../../lib/nordkreis/enrollmentEmail'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const html = buildEnrollmentEmailHtml({
    parentName: 'Klaus Müller',
    contractNo: 'NK-TEST-265417',
    monthlyAmount: 50,
    enrollmentFee: true,
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
