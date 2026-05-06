// lib/nordkreis/paymentEmail.ts
// Sent after each successful Stripe charge (enrollment fee + monthly payments)

import type { NordkreisInvoiceType } from './generateInvoicePdf'

export function buildPaymentEmailHtml({
  parentName,
  childName,
  childGroup,
  invoiceType,
  invoiceNumber,
  amountEur,
  issueDate,
  monthNumber,
  totalMonths,
}: {
  parentName: string
  childName: string
  childGroup: string
  invoiceType: NordkreisInvoiceType
  invoiceNumber: string
  amountEur: number
  issueDate: string
  monthNumber?: number
  totalMonths?: number
}): string {
  const baseUrl =
    process.env.NORDKREIS_EMAIL_BASE_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ??
    'https://linguatash.com'
  const logoCombined = `${baseUrl}/static/images/LinguaTashNordkreisLogoContract.png`

  const isEnrollment = invoiceType === 'enrollment_fee'

  const dateDe = new Date(issueDate + 'T12:00:00').toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const dateEs = new Date(issueDate + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const subjectDE = isEnrollment
    ? 'Rechnung Einschreibegebühr'
    : `Rechnung Monatsbeitrag${monthNumber ? ` ${monthNumber}/${totalMonths ?? 10}` : ''}`
  const descDE = isEnrollment
    ? `Einschreibegebühr für ${childName} (${childGroup})`
    : `Monatsbeitrag${monthNumber ? ` ${monthNumber} von ${totalMonths ?? 10}` : ''} für ${childName} (${childGroup})`
  const descES = isEnrollment
    ? `Matrícula para ${childName} (${childGroup})`
    : `Cuota mensual${monthNumber ? ` ${monthNumber} de ${totalMonths ?? 10}` : ''} para ${childName} (${childGroup})`

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subjectDE} · Nordkreis</title>
</head>
<body style="margin:0;padding:0;background:#f4efe8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#081C3C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#081C3C;border-radius:12px 12px 0 0;padding:24px 32px 20px;">
              <div style="color:#f4efe8;font-size:22px;font-weight:700;letter-spacing:-0.03em;">Nordkreis</div>
              <div style="color:#9a8f85;font-size:13px;margin-top:4px;">
                Deutsche Gemeinschaft &amp; Samstagsschule &middot; Barcelona
              </div>
            </td>
          </tr>

          <!-- Logo row -->
          <tr>
            <td style="background:#081C3C;padding:16px 32px;border-bottom:1px solid #e3ded7;">
              <img src="${logoCombined}" alt="LinguaTash Nordkreis" height="72"
                style="height:72px;width:auto;display:block;"/>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">

              <!-- Payment confirmed banner -->
              <div style="background:#081C3C;border-radius:8px;padding:14px 18px;margin-bottom:28px;text-align:center;">
                <div style="color:#f4efe8;font-size:15px;font-weight:700;">
                  ${isEnrollment ? 'Einschreibegebühr eingegangen' : 'Monatsbeitrag eingegangen'}
                </div>
                <div style="color:#9a8f85;font-size:12px;margin-top:4px;">
                  ${isEnrollment ? 'Matrícula recibida' : 'Cuota mensual recibida'}
                </div>
              </div>

              <!-- Greeting -->
              <p style="font-size:18px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                Vielen Dank, ${parentName}!
              </p>
              <p style="font-size:13px;color:#9a8f85;margin:0 0 24px;">
                Gracias, ${parentName}.
              </p>

              <!-- Payment details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#f4efe8;border-left:3px solid #b3475a;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="font-size:13px;font-weight:700;margin:0 0 12px;color:#081C3C;">
                      Zahlungsdetails / Detalles del pago
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;width:140px;">Beschreibung / Descripción</td>
                        <td style="font-size:13px;color:#081C3C;padding:3px 0;">${descDE}</td>
                      </tr>
                      <tr>
                        <td style="font-size:12px;color:#9a8f85;padding:3px 0;"></td>
                        <td style="font-size:12px;color:#9a8f85;padding:3px 0;">${descES}</td>
                      </tr>
                      <tr><td colspan="2" style="padding:4px 0;border-bottom:1px solid #e3ded7;"></td></tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:4px 0;">Betrag / Importe</td>
                        <td style="font-size:15px;font-weight:700;color:#081C3C;padding:4px 0;">${amountEur.toFixed(2)} €</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">Datum / Fecha</td>
                        <td style="font-size:13px;color:#081C3C;padding:3px 0;">${dateDe} / ${dateEs}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">Rechnungsnr. / Factura</td>
                        <td style="font-size:12px;color:#081C3C;font-family:monospace;padding:3px 0;">${invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">MwSt. / IVA</td>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">Befreit / Exento (Art. 20 Ley 37/1992)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PDF note -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 6px;color:#081C3C;">
                Die vollständige Rechnung findest Du als PDF-Anhang in dieser E-Mail.
              </p>
              <p style="font-size:12px;color:#9a8f85;margin:0 0 28px;">
                La factura completa se adjunta como PDF a este correo electrónico.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e3ded7;margin:0 0 28px;"/>

              <!-- Contact -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 6px;color:#081C3C;">
                Hast Du Fragen? Schreib uns direkt an
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#b3475a;text-decoration:none;font-weight:600;">nordkreis@linguatash.com</a>.
              </p>
              <p style="font-size:12px;color:#9a8f85;margin:0 0 28px;">
                ¿Preguntas? Escríbenos a
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#b3475a;text-decoration:none;">nordkreis@linguatash.com</a>.
              </p>

              <!-- Signature -->
              <p style="font-size:14px;line-height:1.8;margin:0;color:#081C3C;">
                Herzliche Grüße,<br/>
                <strong>Tash</strong><br/>
                <span style="color:#9a8f85;font-size:13px;">Nordkreis Team</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#e3ded7;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
              <p style="font-size:11px;color:#9a8f85;margin:0 0 4px;">
                Nordkreis &middot; Barcelona &middot;
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#9a8f85;text-decoration:none;">nordkreis@linguatash.com</a>
                &middot; linguatash.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildPaymentEmailText({
  parentName,
  childName,
  childGroup,
  invoiceType,
  invoiceNumber,
  amountEur,
  issueDate,
  monthNumber,
  totalMonths,
}: {
  parentName: string
  childName: string
  childGroup: string
  invoiceType: NordkreisInvoiceType
  invoiceNumber: string
  amountEur: number
  issueDate: string
  monthNumber?: number
  totalMonths?: number
}): string {
  const isEnrollment = invoiceType === 'enrollment_fee'
  const desc = isEnrollment
    ? `Einschreibegebühr für ${childName} (${childGroup})`
    : `Monatsbeitrag ${monthNumber ?? ''}/${totalMonths ?? 10} für ${childName} (${childGroup})`
  return `Vielen Dank, ${parentName}!

${isEnrollment ? 'Einschreibegebühr eingegangen' : 'Monatsbeitrag eingegangen'}.

${desc}
Betrag: ${amountEur.toFixed(2)} Euro
Datum: ${issueDate}
Rechnungsnummer: ${invoiceNumber}
MwSt.: Befreit — Bildungsaktivität (Art. 20 Ley 37/1992)

Die vollständige Rechnung findest Du als PDF-Anhang.

Fragen? nordkreis@linguatash.com

Herzliche Grüße,
Tash · Nordkreis Team`
}
