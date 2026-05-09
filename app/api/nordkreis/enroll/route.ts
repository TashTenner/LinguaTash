// app/api/nordkreis/enroll/route.ts
// PDF (pdf-lib) → Cloudflare R2 → MailerSend → Google Sheets
//
// Sheet columns A→AK (37 columns):
// A  Timestamp
// B  Contract No
// C  Child First Name
// D  Child Surname 1
// E  Child Surname 2
// F  Child Full Name
// G  Date of Birth
// H  School Year
// I  Group
// J  Parent 1 First Name
// K  Parent 1 Surname 1
// L  Parent 1 Surname 2
// M  Parent 1 Full Name
// N  Parent 1 Phone
// O  Parent 1 Email
// P  Parent 2 First Name
// Q  Parent 2 Surname 1
// R  Parent 2 Surname 2
// S  Parent 2 Full Name
// T  Parent 2 Phone
// U  Parent 2 Email
// V  Address Street
// W  City
// X  Postal Code
// Y  German-speaking Parent
// Z  Medical / Allergies
// AA Additional Notes
// AB Emergency Contact Name
// AC Emergency Contact Phone
// AD Enrollment Status
// AE Payment Status
// AF Contract Signed
// AG Contract PDF URL
// AH Stripe Customer ID
// AI Stripe Payment Method ID
// AJ Activation Date          ← blank on enrollment, filled on activation
// AK Internal Notes           ← blank, filled manually

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { generateContractPdf } from '@/lib/nordkreis/generatePdf'
import { getSheetsToken, SHEET_NAME, SHEET_ID } from '@/lib/nordkreis/googleAuth'
import { buildEnrollmentEmailHtml, buildEnrollmentEmailText } from '@/lib/nordkreis/enrollmentEmail'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

async function uploadToR2(pdfBytes: Uint8Array, key: string): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket:
        process.env.CLOUDFLARE_R2_NORDKREIS_CONTRACTS_BUCKET ??
        process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
      Body: Buffer.from(pdfBytes),
      ContentType: 'application/pdf',
    })
  )
  return key
}

async function sendEmail(
  to: string,
  name: string,
  pdfBytes: Uint8Array,
  contractNo: string,
  monthlyAmount: number,
  enrollmentFee: boolean
) {
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
      to: [{ email: to, name }],
      reply_to: { email: 'nordkreis@linguatash.com', name: 'Nordkreis' },
      subject: `Deine Nordkreis Anmeldung · ${contractNo}`,
      html: buildEnrollmentEmailHtml({
        parentName: name,
        contractNo,
        monthlyAmount,
        enrollmentFee,
      }),
      text: buildEnrollmentEmailText({
        parentName: name,
        contractNo,
        monthlyAmount,
        enrollmentFee,
      }),
      attachments: [
        {
          content: Buffer.from(pdfBytes).toString('base64'),
          filename: `Nordkreis-Vertrag-${contractNo}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`MailerSend: ${await res.text()}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveToSheets(form: Record<string, any>, contractNo: string, pdfKey: string) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) return
  try {
    const token = await getSheetsToken()

    const childFull = [form.childFirstName, form.childSurname1, form.childSurname2]
      .filter(Boolean)
      .join(' ')
    const parent1Full = [form.parent1FirstName, form.parent1Surname1, form.parent1Surname2]
      .filter(Boolean)
      .join(' ')
    const parent2Full = form.parent2FirstName
      ? [form.parent2FirstName, form.parent2Surname1, form.parent2Surname2]
          .filter(Boolean)
          .join(' ')
      : ''

    const row = [
      new Date().toISOString(), // A: Timestamp
      contractNo, // B: Contract No
      form.childFirstName ?? '', // C: Child First Name
      form.childSurname1 ?? '', // D: Child Surname 1
      form.childSurname2 ?? '', // E: Child Surname 2
      childFull, // F: Child Full Name
      form.childDOB ?? '', // G: Date of Birth
      form.schoolYear ?? '', // H: School Year
      form.childGroup ?? '', // I: Group
      form.parent1FirstName ?? '', // J: Parent 1 First Name
      form.parent1Surname1 ?? '', // K: Parent 1 Surname 1
      form.parent1Surname2 ?? '', // L: Parent 1 Surname 2
      parent1Full, // M: Parent 1 Full Name
      form.parent1Phone ?? '', // N: Parent 1 Phone
      form.parent1Email ?? '', // O: Parent 1 Email
      form.parent2FirstName ?? '', // P: Parent 2 First Name
      form.parent2Surname1 ?? '', // Q: Parent 2 Surname 1
      form.parent2Surname2 ?? '', // R: Parent 2 Surname 2
      parent2Full, // S: Parent 2 Full Name
      form.parent2Phone ?? '', // T: Parent 2 Phone
      form.parent2Email ?? '', // U: Parent 2 Email
      form.addressStreet ?? '', // V: Address Street
      form.city ?? '', // W: City
      form.postalCode ?? '', // X: Postal Code
      form.germanSpeakingParent ?? '', // Y: German-speaking Parent
      form.medicalAllergies ?? '', // Z: Medical / Allergies
      form.additionalNotes ?? '', // AA: Additional Notes
      form.emergencyContactName ?? '', // AB: Emergency Contact Name
      form.emergencyContactPhone ?? '', // AC: Emergency Contact Phone
      'Warteliste / Waitlist', // AD: Enrollment Status
      'Ausstehend / Pending', // AE: Payment Status
      'Ja / Yes', // AF: Contract Signed
      pdfKey, // AG: Contract PDF URL
      form.stripeCustomerId ?? '', // AH: Stripe Customer ID
      form.stripePaymentMethodId ?? '', // AI: Stripe Payment Method ID
      '', // AJ: Activation Date (filled on activation)
      '', // AK: Internal Notes (filled manually)
    ]

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A:AK`)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    )
  } catch (err) {
    console.error('Sheets (non-fatal):', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.json()

    const required = [
      'childFirstName',
      'childDOB',
      'childGroup',
      'parent1FirstName',
      'parent1Email',
      'signatureDataUrl',
    ]
    for (const f of required) {
      if (!form[f]) return NextResponse.json({ error: `Missing: ${f}` }, { status: 400 })
    }

    const contractNo = `NK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const monthlyAmount: number = form.monthlyAmount ?? 45
    const enrollmentFee: boolean = form.enrollmentFee ?? true

    const pdfBytes = await generateContractPdf(
      form,
      process.env.TEACHER_SIGNATURE_BASE64 ?? null,
      contractNo
    )

    const now = new Date()
    const r2Key = `nordkreis/vertraege/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${contractNo}.pdf`
    const pdfKey = await uploadToR2(pdfBytes, r2Key)

    const parentName = `${form.parent1FirstName ?? ''} ${form.parent1Surname1 ?? ''}`.trim()
    await sendEmail(
      form.parent1Email,
      parentName,
      pdfBytes,
      contractNo,
      monthlyAmount,
      enrollmentFee
    )

    await saveToSheets(form, contractNo, pdfKey)

    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `📋 *Neue Nordkreis Anmeldung*\nKind: ${form.childFirstName} ${form.childSurname1 ?? ''} · ${form.childGroup}\nElternteil: ${parentName} · ${form.parent1Email}\nRef: \`${contractNo}\``,
        }),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, contractNo })
  } catch (err: unknown) {
    console.error('Enroll error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
