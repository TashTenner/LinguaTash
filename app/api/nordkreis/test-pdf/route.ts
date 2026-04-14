// app/api/nordkreis/test-pdf/route.ts
// DEV ONLY — open http://localhost:3000/api/nordkreis/test-pdf in your browser

import { NextResponse } from 'next/server'
import { generateContractPdf } from '../../../../lib/nordkreis/generatePdf'

export const runtime = 'nodejs'

export async function GET() {
  console.log('[test-pdf] handler called')
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const dummyForm = {
    childFirstName: 'Emma',
    childSurname1: 'Müller',
    childSurname2: 'García',
    childDOB: '2019-03-15',
    schoolYear: 'I3',
    childGroup: 'Entdeckerkreis (3–5)',
    germanSpeakingParent: 'Mutter / Mother',
    medicalAllergies: 'Nussallergie',
    parent1FirstName: 'Klaus',
    parent1Surname1: 'Müller',
    parent1Surname2: '',
    parent1Phone: '+34 612 345 678',
    parent1Email: 'klaus.mueller@example.com',
    parent2FirstName: 'María',
    parent2Surname1: 'García',
    parent2Surname2: 'López',
    parent2Phone: '+34 698 765 432',
    parent2Email: 'maria.garcia@example.com',
    addressStreet: 'Carrer de la Providència 47, Entresuelo 2',
    city: 'Barcelona',
    postalCode: '08024',
    emergencyContactName: 'Anna Müller',
    emergencyContactPhone: '+34 611 222 333',
    additionalNotes: '',
    feeOption: '50b',
    monthlyAmount: 50,
    enrollmentFee: true,
    accountHolder: 'Klaus Müller',
    stripeCustomerId: 'cus_test_preview',
    signatureDataUrl: undefined, // no signature in test — shows placeholder box
  }

  try {
    console.log('[test-pdf] calling generateContractPdf')
    const pdfBytes = await generateContractPdf(
      dummyForm,
      process.env.TEACHER_SIGNATURE_BASE64 ?? null,
      `NK-TEST-${Date.now().toString().slice(-6)}`
    )
    console.log('[test-pdf] PDF generated, bytes:', pdfBytes?.length)

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="nordkreis-test.pdf"',
      },
    })
  } catch (err: unknown) {
    console.error('test-pdf error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
