// app/api/nordkreis/test-invoice-pdf/route.ts
// DEV ONLY — open http://localhost:3000/api/nordkreis/test-invoice-pdf in your browser
// Add ?type=monthly to preview monthly invoice (default is enrollment fee)

import { NextRequest, NextResponse } from 'next/server'
import { generateNordkreisInvoicePdf } from '@/lib/nordkreis/generateInvoicePdf'

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const type = req.nextUrl.searchParams.get('type') === 'monthly' ? 'monthly' : 'enrollment_fee'

  const pdfBytes = await generateNordkreisInvoicePdf({
    invoiceNumber: `NORDKREIS-2026-TEST01`,
    issueDate: new Date().toISOString().split('T')[0],
    stripeInvoiceId: 'in_test_preview',
    invoiceType: type,
    monthNumber: type === 'monthly' ? 3 : undefined,
    totalMonths: 10,
    buyerName: 'Klaus Müller',
    buyerEmail: 'klaus.mueller@example.com',
    childName: 'Emma Müller García',
    childGroup: 'Entdeckerkreis (3–5 Jahre, I3–I5)',
    amountEur: type === 'enrollment_fee' ? 60 : 45,
  })

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="nordkreis-invoice-test-${type}.pdf"`,
    },
  })
}
