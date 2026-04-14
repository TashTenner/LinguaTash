// app/api/nordkreis/test-payment-email/route.ts
// DEV ONLY — http://localhost:3000/api/nordkreis/test-payment-email
// Add ?type=monthly to preview monthly payment email

import { NextRequest, NextResponse } from 'next/server'
import { buildPaymentEmailHtml } from '@/lib/nordkreis/paymentEmail'

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const type = req.nextUrl.searchParams.get('type') === 'monthly' ? 'monthly' : 'enrollment_fee'

  const html = buildPaymentEmailHtml({
    parentName: 'Klaus Müller',
    childName: 'Emma Müller García',
    childGroup: 'Entdeckerkreis (3–5 Jahre, I3–I5)',
    invoiceType: type,
    invoiceNumber: 'NORDKREIS-2026-TEST01',
    amountEur: type === 'enrollment_fee' ? 60 : 45,
    issueDate: new Date().toISOString().split('T')[0],
    monthNumber: type === 'monthly' ? 3 : undefined,
    totalMonths: 10,
  })

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
