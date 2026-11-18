/**
 * Project newsletters in Kit: one form and one tag per project.
 *
 * The form brings its own double opt-in email in the project's language; the
 * tag is what a broadcast is sent to. Shared by /api/newsletter (the signup
 * forms on the site) and the Stripe webhook (the boletín question asked while
 * booking La Juntada), so both subscribe the same way.
 */

export const LISTAS = {
  nordkreis: {
    nombre: 'Nordkreis Newsletter',
    formEnv: 'CONVERTKIT_NORDKREIS_FORM_ID',
    tagEnv: 'CONVERTKIT_NORDKREIS_TAG_ID',
    // Each project's own channel when its webhook is set; the general one until then.
    slackEnv: 'SLACK_WEBHOOK_URL_NORDKREIS',
  },
  alemanydu: {
    nombre: 'Boletín de Alemán·y·Du',
    formEnv: 'CONVERTKIT_ALEMANYDU_FORM_ID',
    tagEnv: 'CONVERTKIT_ALEMANYDU_TAG_ID',
    slackEnv: 'SLACK_WEBHOOK_URL_ALEMANYDU',
  },
  fonetikas: {
    nombre: 'Boletín de Fonetikas',
    formEnv: 'CONVERTKIT_FONETIKAS_FORM_ID',
    tagEnv: 'CONVERTKIT_FONETIKAS_TAG_ID',
    slackEnv: 'SLACK_WEBHOOK_URL_FONETIKAS',
  },
  lajuntada: {
    nombre: 'Boletín de La Juntada',
    formEnv: 'CONVERTKIT_LAJUNTADA_FORM_ID',
    tagEnv: 'CONVERTKIT_LAJUNTADA_TAG_ID',
    slackEnv: 'SLACK_WEBHOOK_URL_LAJUNTADA',
  },
} as const

export type Lista = keyof typeof LISTAS

export function esLista(valor: unknown): valor is Lista {
  return typeof valor === 'string' && Object.prototype.hasOwnProperty.call(LISTAS, valor)
}

/**
 * Subscribes an address to a project's Kit form, with its tag. Kit then sends
 * the confirmation email; until it is clicked the person receives nothing.
 * Returns Kit's HTTP status (500 if this deployment is missing its config).
 */
export async function suscribirAKit({
  lista,
  email,
  nombre,
  origen,
}: {
  lista: Lista
  email: string
  nombre?: string
  /** Where the signup came from, for the Slack message: "web", "reserva del 13/12"… */
  origen: string
}): Promise<{ ok: boolean; status: number }> {
  const formId = process.env[LISTAS[lista].formEnv]
  const tagId = process.env[LISTAS[lista].tagEnv]
  const apiKey = process.env.CONVERTKIT_API_KEY

  if (!formId || !apiKey) {
    console.error(`[Kit] Missing ${LISTAS[lista].formEnv} or CONVERTKIT_API_KEY`)
    return { ok: false, status: 500 }
  }

  const payload: Record<string, unknown> = { email, api_key: apiKey }
  if (nombre) payload.first_name = nombre
  if (tagId) payload.tags = [Number(tagId)]

  const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error(`[Kit] Subscribe to ${lista} failed`, res.status, body)
  } else {
    await avisarEnSlack({ lista, email, nombre, origen })
  }
  return { ok: res.ok, status: res.status }
}

/**
 * One line in Slack per signup. It goes out when someone asks, not when they
 * confirm: Kit would only tell us about the confirmation through a webhook of
 * its own. Someone already subscribed who asks again (a second booking with
 * "Sí") also produces a line, and nothing changes for them in Kit. A Slack
 * failure never breaks the signup.
 */
async function avisarEnSlack({
  lista,
  email,
  nombre,
  origen,
}: {
  lista: Lista
  email: string
  nombre?: string
  origen: string
}): Promise<void> {
  const url = process.env[LISTAS[lista].slackEnv] ?? process.env.SLACK_WEBHOOK_URL
  if (!url) return
  const quien = nombre ? `${nombre} · ${email}` : email
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `📬 ${LISTAS[lista].nombre}: ${quien} (${origen}). Falta que confirme desde el mail de Kit.`,
      }),
    })
  } catch (err) {
    console.warn('[Kit] Slack notice failed (non-fatal):', err)
  }
}
