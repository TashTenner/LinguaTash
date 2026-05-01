// lib/nordkreis/cancellationEmail.ts
// Sent to parent when admin cancels their enrollment

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

export function buildCancellationEmailHtml({
  parentName,
  childName,
  contractNo,
}: {
  parentName: string
  childName: string
  contractNo?: string
}): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Abmeldung bestätigt · Nordkreis</title>
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
              <div style="background:#9a8f85;border-radius:8px;padding:14px 18px;margin-bottom:28px;text-align:center;">
                <div style="color:#f4efe8;font-size:15px;font-weight:700;">Abmeldung bestätigt</div>
                <div style="color:#e3ded7;font-size:12px;margin-top:4px;">Baja confirmada</div>
              </div>

              <!-- Greeting -->
              <p style="font-size:18px;font-weight:700;margin:0 0 6px;color:#081C3C;">
                Hallo ${parentName},
              </p>
              <p style="font-size:13px;color:#9a8f85;margin:0 0 24px;">
                Hola ${parentName},
              </p>

              <!-- DE content -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 8px;color:#081C3C;">
                Deine Abmeldung für <strong>${childName}</strong> bei Nordkreis wurde bestätigt.
                Es werden keine weiteren Zahlungen eingezogen${contractNo ? ` (Vertrag ${contractNo})` : ''}.
                Falls eine Zahlung noch ausstehend war, wurde sie storniert.
              </p>
              <p style="font-size:14px;line-height:1.7;margin:0 0 28px;color:#081C3C;">
                Wir wünschen euch alles Gute und hoffen, euch vielleicht in einer anderen Saison wiederzusehen.
              </p>

              <hr style="border:none;border-top:1px solid #e3ded7;margin:0 0 24px;"/>

              <!-- ES content -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 8px;color:#081C3C;">
                La baja de <strong>${childName}</strong> en Nordkreis ha sido confirmada.
                No se realizarán más cobros${contractNo ? ` (contrato ${contractNo})` : ''}.
                Si había algún pago pendiente, ha sido cancelado.
              </p>
              <p style="font-size:14px;line-height:1.7;margin:0 0 28px;color:#081C3C;">
                Os deseamos lo mejor y esperamos veros en otra temporada.
              </p>

              <hr style="border:none;border-top:1px solid #e3ded7;margin:0 0 28px;"/>

              <!-- Contact -->
              <p style="font-size:14px;line-height:1.7;margin:0 0 4px;color:#081C3C;">
                Bei Fragen:
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#b3475a;text-decoration:none;font-weight:600;">nordkreis@linguatash.com</a>
              </p>
              <p style="font-size:12px;color:#9a8f85;margin:0 0 28px;">
                ¿Preguntas?
                <a href="mailto:nordkreis@linguatash.com"
                  style="color:#b3475a;text-decoration:none;">nordkreis@linguatash.com</a>
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

export function buildCancellationEmailText({
  parentName,
  childName,
  contractNo,
}: {
  parentName: string
  childName: string
  contractNo?: string
}): string {
  return `Hallo ${parentName},

Deine Abmeldung für ${childName} bei Nordkreis wurde bestätigt.
Es werden keine weiteren Zahlungen eingezogen${contractNo ? ` (Vertrag ${contractNo})` : ''}.

Wir wünschen euch alles Gute.

---

Hola ${parentName},

La baja de ${childName} en Nordkreis ha sido confirmada.
No se realizarán más cobros${contractNo ? ` (contrato ${contractNo})` : ''}.

Os deseamos lo mejor.

nordkreis@linguatash.com
`
}
