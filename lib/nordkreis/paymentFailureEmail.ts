// lib/nordkreis/paymentFailureEmail.ts
// Sent to parent when a Stripe charge fails

function baseUrl() {
  return (
    process.env.NORDKREIS_EMAIL_BASE_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ??
    'https://linguatash.com'
  )
}

function logo() {
  return `${baseUrl()}/static/images/LinguaTashNordkreisLogoContract.png`
}

export function buildPaymentFailureEmailHtml({
  parentName,
  childName,
  amountEur,
  attemptCount,
}: {
  parentName: string
  childName: string
  amountEur: number
  attemptCount: number
}): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Zahlungsfehler · Nordkreis</title>
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

          <!-- Logo -->
          <tr>
            <td style="background:#f4efe8;padding:16px 32px;border-bottom:1px solid #e3ded7;">
              <img src="${logo()}" alt="LinguaTash Nordkreis" height="72"
                style="height:72px;width:auto;display:block;"/>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">

              <!-- Banner -->
              <div style="background:#b3475a;border-radius:8px;padding:14px 18px;margin-bottom:28px;text-align:center;">
                <div style="color:#f4efe8;font-size:15px;font-weight:700;">Zahlungsfehler</div>
                <div style="color:#f4efe8;font-size:12px;margin-top:4px;opacity:0.8;">Pago fallido</div>
              </div>

              <!-- Greeting -->
              <p style="font-size:18px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                Hallo ${parentName},
              </p>
              <p style="font-size:13px;color:#9a8f85;margin:0 0 24px;">
                Hola ${parentName},
              </p>

              <!-- Payment details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#f4efe8;border-left:3px solid #b3475a;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;width:160px;">Kind / Niño·a</td>
                        <td style="font-size:13px;color:#081C3C;padding:3px 0;font-weight:600;">${childName}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">Betrag / Importe</td>
                        <td style="font-size:15px;font-weight:700;color:#b3475a;padding:3px 0;">${amountEur.toFixed(2)} €</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#9a8f85;padding:3px 0;">Versuch / Intento</td>
                        <td style="font-size:13px;color:#081C3C;padding:3px 0;">${attemptCount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- DE content -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 8px;color:#081C3C;">
                Leider konnte der Betrag von <strong>${amountEur.toFixed(2)} €</strong> nicht von Deinem Konto eingezogen werden.
                Stripe wird es in den nächsten Tagen erneut versuchen.
              </p>
              <p style="font-size:14px;line-height:1.7;margin:0 0 24px;color:#081C3C;">
                Falls das Problem bestehen bleibt, melde Dich bitte bei uns, damit wir gemeinsam eine Lösung finden.
              </p>

              <hr style="border:none;border-top:1px solid #e3ded7;margin:0 0 24px;"/>

              <!-- ES content -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 8px;color:#081C3C;">
                Lamentablemente no se ha podido realizar el cobro de <strong>${amountEur.toFixed(2)} €</strong> en tu cuenta.
                Stripe lo volverá a intentar en los próximos días.
              </p>
              <p style="font-size:14px;line-height:1.7;margin:0 0 28px;color:#081C3C;">
                Si el problema persiste, contáctanos para encontrar una solución juntos.
              </p>

              <hr style="border:none;border-top:1px solid #e3ded7;margin:0 0 28px;"/>

              <!-- Contact -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 4px;color:#081C3C;">
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#b3475a;text-decoration:none;font-weight:600;">nordkreis@linguatash.com</a>
              </p>

              <!-- Signature -->
              <p style="font-size:14px;line-height:1.8;margin:24px 0 0;color:#081C3C;">
                Herzliche Grüße,<br/>
                <strong>Tash</strong><br/>
                <span style="color:#9a8f85;font-size:13px;">Nordkreis Team</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#e3ded7;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
              <p style="font-size:11px;color:#9a8f85;margin:0;">
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

export function buildPaymentFailureEmailText({
  parentName,
  childName,
  amountEur,
  attemptCount,
}: {
  parentName: string
  childName: string
  amountEur: number
  attemptCount: number
}): string {
  return `Hallo ${parentName},

Leider konnte der Betrag von ${amountEur.toFixed(2)} € für ${childName} nicht eingezogen werden (Versuch ${attemptCount}).
Stripe wird es in den nächsten Tagen erneut versuchen.

Bei Fragen: nordkreis@linguatash.com

---

Hola ${parentName},

Lamentablemente no se ha podido realizar el cobro de ${amountEur.toFixed(2)} € para ${childName} (intento ${attemptCount}).
Stripe lo volverá a intentar en los próximos días.

Contacto: nordkreis@linguatash.com
`
}
