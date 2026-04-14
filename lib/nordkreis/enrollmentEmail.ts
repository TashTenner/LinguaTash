// lib/nordkreis/enrollmentEmail.ts
//
// Generates the HTML email body for enrollment confirmation.
// German + Spanish, personal tone, both logos, Tash signature.

export function buildEnrollmentEmailHtml({
  parentName,
  contractNo,
  monthlyAmount = 50,
  enrollmentFee = true,
}: {
  parentName: string
  contractNo: string
  monthlyAmount?: number
  enrollmentFee?: boolean
}): string {
  const total = monthlyAmount * 10 + (enrollmentFee ? 60 : 0)

  // Combined logo URL — set NEXT_PUBLIC_BASE_URL in .env.local (already present)
  const baseUrl =
    process.env.NORDKREIS_EMAIL_BASE_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ??
    'https://linguatash.com'
  const logoCombined = `${baseUrl}/static/images/LinguaTashNordkreisLogoContract.png`

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nordkreis Anmeldung</title>
</head>
<body style="margin:0;padding:0;background:#f4efe8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#081C3C;">

  <!-- Outer wrapper -->
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

          <!-- Logo row on cream background -->
          <tr>
            <td style="background:#f4efe8;padding:14px 32px;border-bottom:1px solid #e3ded7;">
              <img src="${logoCombined}"
                alt="LinguaTash Nordkreis" height="72"
                style="height:72px;width:auto;display:block;"/>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">

              <!-- Greeting -->
              <p style="font-size:20px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                Herzlich willkommen, ${parentName}!
              </p>
              <p style="font-size:13px;color:#9a8f85;margin:0 0 28px;">
                Bienvenido/a, ${parentName}!
              </p>

              <!-- Main message DE -->
              <p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:#081C3C;">
                Vielen Dank für Deine Anmeldung bei Nordkreis. Wir freuen uns sehr, Dich und
                Dein Kind in unserer deutschen Gemeinschaft begrüßen zu dürfen.
              </p>
              <p style="font-size:15px;line-height:1.7;margin:0 0 28px;color:#081C3C;">
                Dein unterzeichnetes Vertragsexemplar ist dieser E-Mail beigefügt
                (Referenz: <strong>${contractNo}</strong>). Bitte bewahre es gut auf.
              </p>

              <!-- Main message ES -->
              <p style="font-size:13px;line-height:1.7;margin:0 0 28px;color:#9a8f85;">
                Gracias por inscribirse en Nordkreis. Adjunto a este correo encontrará
                su copia del contrato firmado (referencia: <strong>${contractNo}</strong>).
                Le rogamos que la guarde en un lugar seguro.
              </p>

              <!-- No charge notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#f4efe8;border-left:3px solid #b3475a;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="font-size:15px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                      Heute wird kein Betrag abgebucht.
                    </p>
                    <p style="font-size:14px;line-height:1.6;margin:0 0 12px;color:#081C3C;">
                      Sobald die Mindestteilnehmerzahl erreicht ist, melden wir uns per
                      E-Mail bei Dir. Erst dann wird der monatliche Lastschriftauftrag
                      (${monthlyAmount}&nbsp;&euro;/Monat &times; 10 Monate${enrollmentFee ? ` + 60&nbsp;&euro; Einschreibegebühr` : ''})
                      aktiviert. Der Gesamtbetrag beläuft sich auf
                      <strong>${total}&nbsp;&euro;</strong>.
                    </p>
                    <p style="font-size:12px;line-height:1.6;margin:0;color:#9a8f85;">
                      Hoy no se realiza ningún cargo. Una vez alcanzado el número mínimo de
                      participantes, le avisaremos por correo electrónico antes de activar
                      el adeudo SEPA (${monthlyAmount}&nbsp;&euro;/mes &times; 10 meses${enrollmentFee ? ` + 60&nbsp;&euro; matrícula` : ''}).
                      Importe total: <strong>${total}&nbsp;&euro;</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What happens next DE -->
              <p style="font-size:14px;font-weight:700;margin:0 0 8px;color:#081C3C;">
                Wie geht es weiter?
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background:#081C3C;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#f4efe8;">1</div>
                  </td>
                  <td style="font-size:14px;line-height:1.6;color:#081C3C;padding-left:8px;">
                    Wir prüfen die Anmeldungen und bilden die Gruppen.
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background:#081C3C;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#f4efe8;">2</div>
                  </td>
                  <td style="font-size:14px;line-height:1.6;color:#081C3C;padding-left:8px;">
                    Sobald ein Kurs startet, erhältst Du eine Bestätigungs-E-Mail mit
                    allen Details zum Starttermin.
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="28" valign="top" style="padding-top:2px;">
                    <div style="width:20px;height:20px;background:#081C3C;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#f4efe8;">3</div>
                  </td>
                  <td style="font-size:14px;line-height:1.6;color:#081C3C;padding-left:8px;">
                    Vor der ersten Abbuchung erhältst Du eine separate Rechnung für
                    die Einschreibegebühr. Ab dann folgt monatlich eine PDF-Rechnung
                    per E-Mail.
                  </td>
                </tr>
              </table>

              <!-- What happens next ES -->
              <p style="font-size:12px;line-height:1.6;color:#9a8f85;margin:0 0 28px;">
                <strong>¿Qué ocurre a continuación?</strong><br/>
                1. Revisaremos las inscripciones y formaremos los grupos.<br/>
                2. Cuando un curso esté listo para comenzar, recibirá un correo de confirmación con todos los detalles.<br/>
                3. Antes del primer cargo recibirá una factura separada por la matrícula. A partir de entonces, recibirá una factura en PDF por correo electrónico cada mes.
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
                ¿Tienes alguna pregunta? Escríbenos a
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
              <p style="font-size:10px;color:#b4b2a9;margin:0;">
                Diese E-Mail wurde an ${parentName} gesendet. /
                Este correo fue enviado a ${parentName}.
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

export function buildEnrollmentEmailText({
  parentName,
  contractNo,
  monthlyAmount = 50,
  enrollmentFee = true,
}: {
  parentName: string
  contractNo: string
  monthlyAmount?: number
  enrollmentFee?: boolean
}): string {
  const total = monthlyAmount * 10 + (enrollmentFee ? 60 : 0)
  return `Herzlich willkommen, ${parentName}!

Vielen Dank für Deine Anmeldung bei Nordkreis. Dein unterzeichnetes Vertragsexemplar ist dieser E-Mail beigefügt (Referenz: ${contractNo}).

Heute wird kein Betrag abgebucht. Sobald die Mindestteilnehmerzahl erreicht ist, melden wir uns per E-Mail. Erst dann wird der Lastschriftauftrag aktiviert (${monthlyAmount} Euro/Monat x 10 Monate${enrollmentFee ? ' + 60 Euro Einschreibegebuehr' : ''}, Gesamtbetrag: ${total} Euro).

Wie geht es weiter?
1. Wir prüfen die Anmeldungen und bilden die Gruppen.
2. Sobald ein Kurs startet, erhältst Du eine Bestätigungs-E-Mail mit allen Details.
3. Vor der ersten Abbuchung erhältst Du eine separate Rechnung für die Einschreibegebühr. Ab dann folgt monatlich eine PDF-Rechnung.

Hast Du Fragen? Schreib uns an nordkreis@linguatash.com.

Herzliche Grüße,
Tash
Nordkreis Team

---

Bienvenido/a, ${parentName}!

Gracias por inscribirse en Nordkreis. Su contrato firmado está adjunto a este correo (referencia: ${contractNo}).

Hoy no se realiza ningún cargo. Le avisaremos por correo cuando el curso esté confirmado.

¿Preguntas? Escríbanos a nordkreis@linguatash.com.`
}
