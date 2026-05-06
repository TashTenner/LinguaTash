// lib/nordkreis/confirmationEmail.ts
// Sent when you click Activate in the admin panel

export function buildConfirmationEmailHtml({
  parentName,
  childName,
  group,
  contractNo,
  enrollmentFeeDate,
  monthlyAmount = 45,
  firstMonthlyDate,
  numMonths = 10,
}: {
  parentName: string
  childName: string
  group: string
  contractNo: string
  enrollmentFeeDate: string
  monthlyAmount?: number
  firstMonthlyDate: string
  numMonths?: number
}): string {
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
  <title>Kursbestätigung Nordkreis</title>
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
            <td style="background:#f4efe8;padding:16px 32px;border-bottom:1px solid #e3ded7;">
              <img src="${logoCombined}" alt="LinguaTash Nordkreis" height="72"
                style="height:72px;width:auto;display:block;"/>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">

              <!-- Course confirmed banner -->
              <div style="background:#081C3C;border-radius:8px;padding:14px 18px;margin-bottom:28px;text-align:center;">
                <div style="color:#f4efe8;font-size:16px;font-weight:700;">Kurs bestätigt</div>
                <div style="color:#9a8f85;font-size:12px;margin-top:4px;">Curso confirmado</div>
              </div>

              <!-- Greeting -->
              <p style="font-size:20px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                Es geht los, ${parentName}!
              </p>
              <p style="font-size:13px;color:#9a8f85;margin:0 0 28px;">
                ¡Ya empieza, ${parentName}!
              </p>

              <!-- Main message DE -->
              <p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:#081C3C;">
                Wir freuen uns, Dir mitteilen zu können, dass der Kurs für
                <strong>${childName}</strong> in der Gruppe
                <strong>${group}</strong> nun offiziell bestätigt ist.
                Nordkreis startet durch!
              </p>
              <p style="font-size:15px;line-height:1.7;margin:0 0 28px;color:#081C3C;">
                Das ist die offizielle Kursbestätigung per E-Mail (Ref: <strong>${contractNo}</strong>).
                Damit wird der bei der Anmeldung unterzeichnete Vertrag rechtsverbindlich.
              </p>

              <!-- Main message ES -->
              <p style="font-size:13px;line-height:1.7;margin:0 0 28px;color:#9a8f85;">
                Nos complace informarte de que el curso de <strong>${childName}</strong>
                en el grupo <strong>${group}</strong> está oficialmente confirmado.
                Este correo electrónico es la confirmación oficial del curso (ref: <strong>${contractNo}</strong>),
                por lo que el contrato firmado durante la inscripción adquiere carácter vinculante.
              </p>

              <!-- Payment schedule -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#f4efe8;border-left:3px solid #b3475a;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="font-size:14px;font-weight:700;margin:0 0 12px;color:#081C3C;">
                      Zahlungsplan / Plan de pagos
                    </p>

                    <!-- Enrollment fee -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                      <tr>
                        <td style="width:20px;padding-top:2px;vertical-align:top;">
                          <div style="width:18px;height:18px;background:#b3475a;border-radius:50%;text-align:center;line-height:18px;font-size:10px;font-weight:700;color:#f4efe8;">1</div>
                        </td>
                        <td style="padding-left:10px;">
                          <div style="font-size:14px;font-weight:600;color:#081C3C;">
                            Einschreibegebühr: 60 &euro;
                          </div>
                          <div style="font-size:13px;color:#081C3C;margin-top:2px;">
                            Abbuchung am <strong>${enrollmentFeeDate}</strong>
                          </div>
                          <div style="font-size:11px;color:#9a8f85;margin-top:2px;">
                            Matrícula: 60 &euro; · Cargo el ${enrollmentFeeDate}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Monthly fee -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;padding-top:2px;vertical-align:top;">
                          <div style="width:18px;height:18px;background:#b3475a;border-radius:50%;text-align:center;line-height:18px;font-size:10px;font-weight:700;color:#f4efe8;">2</div>
                        </td>
                        <td style="padding-left:10px;">
                          <div style="font-size:14px;font-weight:600;color:#081C3C;">
                            Monatsbeitrag: ${monthlyAmount} &euro;/Monat &times; ${numMonths} Monate
                          </div>
                          <div style="font-size:13px;color:#081C3C;margin-top:2px;">
                            Erste Abbuchung am <strong>${firstMonthlyDate}</strong>, danach immer am 3. des Monats
                          </div>
                          <div style="font-size:11px;color:#9a8f85;margin-top:2px;">
                            Cuota mensual: ${monthlyAmount} &euro;/mes &times; ${numMonths} meses · Primer cargo el ${firstMonthlyDate}, luego siempre el día 3 de cada mes
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="font-size:11px;color:#9a8f85;margin:12px 0 0;line-height:1.5;">
                      Gemäß den Teilnahmebedingungen gilt eine Kündigungsfrist von mindestens 7 Tagen
                      ab diesem E-Mail-Datum. Bei Fragen wende Dich bitte an nordkreis@linguatash.com.<br/>
                      Según las condiciones de participación, el plazo de cancelación es de al menos 7 días
                      desde la fecha de este correo.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <p style="font-size:14px;font-weight:700;margin:0 0 12px;color:#081C3C;">
                Was passiert als nächstes? / ¿Qué ocurre ahora?
              </p>
              <p style="font-size:14px;line-height:1.7;margin:0 0 6px;color:#081C3C;">
                Wir werden uns in Kürze mit weiteren Details zum Kursbeginn, dem genauen
                Stundenplan und dem Treffpunkt bei Dir melden.
              </p>
              <p style="font-size:12px;line-height:1.7;margin:0 0 28px;color:#9a8f85;">
                Pronto te enviaremos más detalles sobre el inicio del curso, el horario exacto
                y el lugar de encuentro.
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
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildConfirmationEmailText({
  parentName,
  childName,
  group,
  contractNo,
  enrollmentFeeDate,
  monthlyAmount = 45,
  firstMonthlyDate,
  numMonths = 10,
}: {
  parentName: string
  childName: string
  group: string
  contractNo: string
  enrollmentFeeDate: string
  monthlyAmount?: number
  firstMonthlyDate: string
  numMonths?: number
}): string {
  return `Es geht los, ${parentName}!

Der Kurs für ${childName} in der Gruppe ${group} ist offiziell bestätigt (Ref: ${contractNo}).

Zahlungsplan:
1. Einschreibegebühr 60 Euro — Abbuchung am ${enrollmentFeeDate}
2. Monatsbeitrag ${monthlyAmount} Euro x ${numMonths} Monate — erste Abbuchung am ${firstMonthlyDate}, danach immer am 3. des Monats

Wir melden uns bald mit weiteren Details zum Kursbeginn.

Hast Du Fragen? Schreib uns an nordkreis@linguatash.com

Herzliche Grüße,
Tash
Nordkreis Team

---

¡Ya empieza, ${parentName}!

El curso de ${childName} en el grupo ${group} está oficialmente confirmado (ref: ${contractNo}).

Plan de pagos:
1. Matrícula 60 Euro — cargo el ${enrollmentFeeDate}
2. Cuota mensual ${monthlyAmount} Euro x ${numMonths} meses — primer cargo el ${firstMonthlyDate}, luego siempre el día 3

¿Preguntas? Escríbenos a nordkreis@linguatash.com`
}
