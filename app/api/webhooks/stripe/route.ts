import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePdf, InvoiceData } from '../../../../lib/generateInvoicePdf'
import Stripe from 'stripe'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// ── Stripe ───────────────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

// ── R2 client ────────────────────────────────────────────────────────────────
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

// ── Language metadata ────────────────────────────────────────────────────────
const LANGUAGE_META: Record<string, { name: string; file: string }> = {
  es: { name: 'Español', file: 'salten/salten-es.zip' },
  ca: { name: 'Catalán', file: 'salten/salten-ca.zip' },
  en: { name: 'Inglés', file: 'salten/salten-en.zip' },
  de: { name: 'Alemán', file: 'salten/salten-de.zip' },
  it: { name: 'Italiano', file: 'salten/salten-it.zip' },
  ru: { name: 'Ruso', file: 'salten/salten-ru.zip' },
}

// ── EU country codes (for IVA determination) ─────────────────────────────────
const EU_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
])

// ── IVA rate helpers ─────────────────────────────────────────────────────────
// Price is IVA-included. We reverse-calculate base + tax.
// Spain / EU: 21% IVA. Outside EU: 0% (Art. 69 Ley IVA).
function getIvaRate(countryCode: string | null): number {
  if (!countryCode) return 21 // default to ES rate if unknown
  return EU_COUNTRIES.has(countryCode) ? 21 : 0
}

function splitPrice(totalWithIva: number, ivaRate: number) {
  // totalWithIva is in euros (e.g. 3.00)
  const base = totalWithIva / (1 + ivaRate / 100)
  const tax = totalWithIva - base
  return {
    base: Math.round(base * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: totalWithIva,
  }
}

// ── Invoice number generator ─────────────────────────────────────────────────
// Format: RESUENA-YYYY-XXXXXX (year + last 6 chars of Stripe session ID)
// No counter needed — derived deterministically from session ID, collision-free.
function generateInvoiceNumber(sessionId: string, createdAt: Date): string {
  const year = createdAt.getFullYear()
  const suffix = sessionId.replace('cs_', '').replace('cs_test_', '').slice(-6).toUpperCase()
  return `RESUENA-${year}-${suffix}`
}

// ── Generate signed R2 download URL (24h) ────────────────────────────────────
async function getDownloadUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: fileKey,
  })
  return getSignedUrl(r2, command, { expiresIn: 60 * 60 * 24 })
}

// ── Save file to R2 ──────────────────────────────────────────────────────────
async function saveToR2(
  key: string,
  body: string | Buffer | Uint8Array,
  contentType: string
): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
}

// ── Fetch country evidence from PaymentIntent ─────────────────────────────────
async function getCountryEvidence(paymentIntentId: string) {
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method'],
    })
    const pm = pi.payment_method as Stripe.PaymentMethod | null
    return {
      billingCountry: pm?.billing_details?.address?.country ?? null,
      cardCountry: pm?.card?.country ?? null,
      cardBrand: pm?.card?.brand ?? null,
      cardLast4: pm?.card?.last4 ?? null,
      cardFunding: pm?.card?.funding ?? null,
    }
  } catch (err) {
    console.error('[Webhook] Could not fetch PaymentIntent details:', err)
    return {
      billingCountry: null,
      cardCountry: null,
      cardBrand: null,
      cardLast4: null,
      cardFunding: null,
    }
  }
}

// ── Create Verifactu invoice ──────────────────────────────────────────────────
// Calls verifactu-api.com to register the invoice with AEAT.
// Returns the API response data for storage.
async function createVerifactuInvoice({
  invoiceNumber,
  issueDate,
  nombre,
  nif,
  languages,
  amountPerLanguage,
  ivaRate,
  sessionId,
}: {
  invoiceNumber: string
  issueDate: string
  nombre: string
  nif: string | null
  languages: string[]
  amountPerLanguage: number
  ivaRate: number
  sessionId: string
}) {
  const emisorNif = process.env.VERIFACTU_EMISOR_NIE!

  // Build one line item per language
  const items = languages.map((code) => {
    const { base } = splitPrice(amountPerLanguage, ivaRate)
    const langName = LANGUAGE_META[code]?.name ?? code
    return {
      description: `Salten — Pack ${langName} (descarga digital)`,
      quantity: 1,
      unit_price: base, // base imponible per unit
      tax_rate: ivaRate,
      aeat_code: '01', // IVA general / exempt
      regime_key: null,
      operation_qualification: ivaRate === 0 ? 'S2' : 'S1', // S2 = no sujeta, S1 = sujeta
    }
  })

  const body: Record<string, unknown> = {
    series: 'RESUENA',
    number: invoiceNumber,
    issue_date: issueDate,
    invoice_type: nif ? 'F1' : 'F2', // F1 = completa, F2 = simplificada
    description: `Salten — ${languages.length} pack${languages.length > 1 ? 's' : ''} de idioma${languages.length > 1 ? 's' : ''}`,
    currency: 'EUR',
    external_reference: sessionId,
    customer: {
      name: nombre,
      ...(nif ? { nif } : {}), // only include NIF for factura completa
    },
    items,
  }

  // Add non-EU IVA exemption note in description if applicable
  if (ivaRate === 0) {
    body.description = `${body.description} — Operación no sujeta a IVA (Art. 69 Ley 37/1992)`
  }

  console.log('[Verifactu] Sending invoice:', JSON.stringify(body, null, 2))

  const res = await fetch('http://verifacturapi.com/api/v1/verifactu/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VERIFACTU_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok || !data.ok) {
    throw new Error(`Verifactu API error: ${JSON.stringify(data)}`)
  }

  console.log('[Verifactu] ✓ Invoice registered:', invoiceNumber)
  return data
}

// ── Send download email via MailerSend ───────────────────────────────────────
async function sendDownloadEmail({
  toEmail,
  toName,
  languages,
  downloadLinks,
  invoiceNumber,
  pdfBytes,
}: {
  toEmail: string
  toName: string
  languages: string[]
  downloadLinks: { name: string; url: string }[]
  invoiceNumber: string
  pdfBytes?: Uint8Array
}) {
  const linksHtml = downloadLinks
    .map(
      ({ name, url }) =>
        `<tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e3ded7;">
            <strong>${name}</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e3ded7; text-align: right;">
            <a href="${url}"
               style="background: #b3475a; color: white; padding: 8px 18px; border-radius: 8px;
                      text-decoration: none; font-size: 14px; font-weight: 500;">
              Descargar
            </a>
          </td>
        </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background:#f4efe8; font-family:'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#081c3c;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background: white; border-radius: 16px; overflow: hidden;
                      border: 1px solid #e3ded7; max-width: 600px; width: 100%;">
          <tr>
            <td style="background: #081c3c; padding: 32px 40px; text-align: center;">
              <p style="margin:0; color: #b3475a; font-size: 12px; letter-spacing: 3px;
                        text-transform: uppercase; font-weight: 600;">Resuena · LinguaTash</p>
              <h1 style="margin: 12px 0 0; color: #f4efe8; font-size: 28px; font-weight: 600;">
                ¡Gracias por tu compra!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 8px; font-size: 16px;">Hola <strong>${toName}</strong>,</p>
              <p style="margin: 0 0 32px; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
                Tu compra de <strong>Salten</strong> ha sido completada.
                Aquí tienes tus enlaces de descarga. Cada enlace es válido durante <strong>24 horas</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border: 1px solid #e3ded7; border-radius: 12px; overflow: hidden; margin-bottom: 32px;">
                <tr style="background: #f4efe8;">
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 600;
                              text-transform: uppercase; letter-spacing: 1px; color: #9a8f85;">
                    Idioma
                  </td>
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 600;
                              text-transform: uppercase; letter-spacing: 1px; color: #9a8f85;
                              text-align: right;">
                    Descarga
                  </td>
                </tr>
                ${linksHtml}
              </table>
              <p style="margin: 0 0 8px; font-size: 14px; color: #9a8f85; line-height: 1.6;">
                Si los enlaces expiran antes de que puedas descargar los archivos, escríbenos a
                <a href="mailto:resuena@linguatash.com" style="color: #b3475a;">resuena@linguatash.com</a>
                y te los reenviamos.
              </p>
              <p style="margin: 16px 0 0; font-size: 13px; color: #9a8f85; line-height: 1.6;">
                Nº de factura: <strong>${invoiceNumber}</strong><br>
                La factura electrónica ha sido registrada conforme a la normativa Verifactu.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: #f4efe8; padding: 24px 40px; text-align: center; border-top: 1px solid #e3ded7;">
              <p style="margin: 0; font-size: 12px; color: #9a8f85;">
                LinguaTash · Reus, Catalunya ·
                <a href="https://linguatash.com" style="color: #b3475a;">linguatash.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAILERSEND_FROM_EMAIL,
        name: process.env.MAILERSEND_FROM_NAME,
      },
      to: [{ email: toEmail, name: toName }],
      subject: 'Salten — Tus archivos de descarga',
      html,
      text: `Hola ${toName},\n\nGracias por tu compra de Salten.\n\nTus enlaces de descarga (válidos 24h):\n\n${downloadLinks.map((l) => `${l.name}: ${l.url}`).join('\n')}\n\nNº factura: ${invoiceNumber}\n\nSi tienes cualquier problema escríbenos a resuena@linguatash.com\n\nLinguaTash`,
      ...(pdfBytes && {
        attachments: [
          {
            content: Buffer.from(pdfBytes as Uint8Array).toString('base64'),
            filename: `${invoiceNumber}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      }),
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`MailerSend error: ${error}`)
  }
}

// ── Add to MailerSend newsletter list ────────────────────────────────────────
async function addToNewsletter(email: string, nombre: string): Promise<void> {
  if (!process.env.MAILERSEND_LIST_ID) return // skip if not configured yet
  try {
    const res = await fetch(
      `https://api.mailersend.com/v1/email-verification/lists/${process.env.MAILERSEND_LIST_ID}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        },
        body: JSON.stringify({
          subscribers: [{ email, name: nombre }],
        }),
      }
    )
    if (res.ok) console.log('[Webhook] ✓ Added to newsletter:', email)
    else console.warn('[Webhook] Newsletter add failed:', await res.text())
  } catch (err) {
    console.warn('[Webhook] Newsletter add error (non-fatal):', err)
  }
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.log('[Webhook] Request received')

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  console.log('[Webhook] Has signature:', !!signature)

  if (!signature) {
    console.error('[Webhook] ERROR: Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // 1. Verify Stripe signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    console.log('[Webhook] ✓ Signature verified')
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Signature verification failed'
    console.error('[Webhook] Signature verification failed:', errorMessage)
    return NextResponse.json({ error: `Webhook error: ${errorMessage}` }, { status: 400 })
  }

  console.log('[Webhook] Event type:', event.type)
  if (event.type !== 'checkout.session.completed') {
    console.log('[Webhook] Ignoring event type')
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const {
    nombre,
    languages: languagesRaw,
    nif,
    nombreEmpresa,
    domicilio,
    codigoPostal,
    ciudad,
    pais: paisDeclarado,
    newsletter,
  } = session.metadata || {}

  const customerEmail = session.customer_email || session.customer_details?.email

  console.log('[Webhook] Order details:', {
    nombre,
    languagesRaw,
    customerEmail,
    paisDeclarado,
    newsletter,
    hasFactura: !!nif,
  })

  if (!customerEmail || !languagesRaw || !nombre) {
    console.error('[Webhook] Missing required metadata', session.metadata)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const languages = languagesRaw.split(',').filter(Boolean)
  const createdAt = new Date(event.created * 1000)
  const issueDate = createdAt.toISOString().split('T')[0] // YYYY-MM-DD
  const invoiceNumber = generateInvoiceNumber(session.id, createdAt)
  const amountPerLanguage = 3.0 // €3 IVA included per language

  try {
    // 2. Fetch country evidence from Stripe PaymentIntent
    const paymentIntentId = session.payment_intent as string | null
    const countryEvidence = paymentIntentId
      ? await getCountryEvidence(paymentIntentId)
      : {
          billingCountry: null,
          cardCountry: null,
          cardBrand: null,
          cardLast4: null,
          cardFunding: null,
        }

    // Determine IVA rate from best available country signal
    // Priority: declared (factura) > billing (Stripe) > card country
    const effectiveCountry =
      paisDeclarado || countryEvidence.billingCountry || countryEvidence.cardCountry || 'ES' // default to Spain if nothing available

    const ivaRate = getIvaRate(effectiveCountry)

    console.log('[Webhook] Country evidence:', {
      declared: paisDeclarado || 'not provided',
      billing: countryEvidence.billingCountry || 'unavailable',
      card: countryEvidence.cardCountry || 'unavailable',
      effectiveCountry,
      ivaRate,
    })

    // 3. Generate signed R2 download URLs
    console.log('[Webhook] Processing languages:', languages)
    const downloadLinks = await Promise.all(
      languages.map(async (code) => {
        const meta = LANGUAGE_META[code]
        if (!meta) throw new Error(`Unknown language code: ${code}`)
        console.log(`[Webhook] Generating R2 URL for: ${meta.file}`)
        const url = await getDownloadUrl(meta.file)
        return { name: meta.name, url }
      })
    )
    console.log('[Webhook] ✓ Download links generated')

    // 4. Register invoice with Verifactu / AEAT
    let verifactuResponse = null
    let verifactuQrUrl: string | null = null
    try {
      verifactuResponse = await createVerifactuInvoice({
        invoiceNumber,
        issueDate,
        nombre: nombreEmpresa || nombre,
        nif: nif || null,
        languages,
        amountPerLanguage,
        ivaRate,
        sessionId: session.id,
      })
      // Extract QR URL from response if available
      verifactuQrUrl = (verifactuResponse as any)?.data?.qr_code ?? null
      console.log('[Webhook] ✓ Verifactu invoice registered')
    } catch (verifactuErr: unknown) {
      console.error('[Webhook] Verifactu error (non-fatal):', verifactuErr)
    }

    // 5. Generate PDF invoice
    let pdfBytes: Uint8Array | null = null
    try {
      const invoiceData: InvoiceData = {
        invoiceNumber,
        issueDate,
        sessionId: session.id,
        buyerNombre: nombre,
        buyerEmail: customerEmail,
        buyerNif: nif || null,
        buyerNombreEmpresa: nombreEmpresa || null,
        buyerDomicilio: domicilio || null,
        buyerCodigoPostal: codigoPostal || null,
        buyerCiudad: ciudad || null,
        buyerPais: effectiveCountry,
        languages,
        languageNames: languages.map((code) => LANGUAGE_META[code]?.name ?? code),
        amountPerLanguage,
        ivaRate,
        verifactuQrUrl,
      }
      pdfBytes = await generateInvoicePdf(invoiceData)

      // Save PDF to R2: invoices/YYYY-MM-DD_RESUENA-YYYY-XXXXXX.pdf
      await saveToR2(
        `invoices/${issueDate}_${invoiceNumber}.pdf`,
        Buffer.from(pdfBytes as Uint8Array),
        'application/pdf'
      )
      console.log('[Webhook] ✓ PDF invoice saved to R2')

      // Also save JSON record alongside the PDF
      await saveToR2(
        `invoices/${issueDate}_${invoiceNumber}.json`,
        JSON.stringify(
          {
            invoiceNumber,
            issueDate,
            sessionId: session.id,
            paymentIntentId,
            customerEmail,
            nombre,
            nif: nif || null,
            nombreEmpresa: nombreEmpresa || null,
            domicilio: domicilio || null,
            codigoPostal: codigoPostal || null,
            ciudad: ciudad || null,
            languages,
            amountTotal: (session.amount_total ?? 0) / 100,
            ivaRate,
            effectiveCountry,
            countryEvidence: {
              declared: paisDeclarado || null,
              billing: countryEvidence.billingCountry,
              card: countryEvidence.cardCountry,
            },
            paymentMethod: {
              brand: countryEvidence.cardBrand,
              last4: countryEvidence.cardLast4,
              funding: countryEvidence.cardFunding,
            },
            verifactuResponse,
          },
          null,
          2
        ),
        'application/json'
      )
      console.log('[Webhook] ✓ JSON record saved to R2')
    } catch (pdfErr: unknown) {
      console.error('[Webhook] PDF generation error (non-fatal):', pdfErr)
    }

    // 6. Send download email (with PDF attachment if generated)
    await sendDownloadEmail({
      toEmail: customerEmail,
      toName: nombre,
      languages,
      downloadLinks,
      invoiceNumber,
      pdfBytes: pdfBytes ?? undefined,
    })
    console.log(`[Webhook] ✓ Email sent to ${customerEmail}`)

    // 7. Add to newsletter if buyer opted in
    if (newsletter === 'true') {
      await addToNewsletter(customerEmail, nombre)
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Webhook] Error processing order:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
