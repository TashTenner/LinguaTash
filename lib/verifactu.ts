// lib/verifactu.ts
// Shared helper for registering invoices with verifacturapi.com (Verifactu / AEAT)
//
// While not yet connected to AEAT (pre-autónoma), invoices are stored in the
// verifacturapi.com sandbox. When the account is upgraded, they forward to AEAT
// automatically — no code changes needed.

export interface VerifactuItem {
  description: string
  quantity: number
  unit_price: number // base price excluding tax
  tax_rate: number // 0, 4, 10, or 21
  aeat_code: string // '01' = régimen general
  operation_qualification: 'S1' | 'S2' | 'E1' | 'N1'
  // S1 = sujeta y no exenta, S2 = no sujeta Art.69, E1 = exenta Art.20
}

export interface VerifactuInvoiceInput {
  series: string
  invoiceNumber: string
  issueDate: string // YYYY-MM-DD
  invoiceType: 'F1' | 'F2' // F1 = full (with NIF), F2 = simplified
  description: string
  externalReference?: string
  customerName: string
  customerNif?: string | null
  items: VerifactuItem[]
}

export async function registerVerifactuInvoice(
  input: VerifactuInvoiceInput
): Promise<{ qrUrl: string | null }> {
  const baseUrl = 'https://verifacturapi.com'
  const targetUrl = `${baseUrl}/api/v1/verifactu/create`

  const body: Record<string, unknown> = {
    series: input.series,
    number: input.invoiceNumber,
    issue_date: input.issueDate,
    invoice_type: input.invoiceType,
    description: input.description,
    currency: 'EUR',
    ...(input.externalReference ? { external_reference: input.externalReference.slice(-64) } : {}),
    customer: {
      name: input.customerName,
      ...(input.customerNif ? { nif: input.customerNif } : {}),
    },
    items: input.items,
  }

  console.log('[Verifactu] Registering invoice:', input.invoiceNumber)

  const res = await fetch(targetUrl, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VERIFACTU_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  // Follow redirects manually to preserve POST body
  let finalRes = res
  if ([301, 302, 307, 308].includes(res.status)) {
    const redirectUrl = res.headers.get('location')
    if (!redirectUrl) throw new Error('Verifactu redirect with no Location header')
    finalRes = await fetch(redirectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VERIFACTU_API_KEY}`,
      },
      body: JSON.stringify(body),
    })
  }

  const rawText = await finalRes.text()
  console.log('[Verifactu] Response', finalRes.status, rawText.slice(0, 300))

  let data: Record<string, unknown>
  try {
    data = JSON.parse(rawText) as Record<string, unknown>
  } catch {
    throw new Error(`Verifactu non-JSON (${finalRes.status}): ${rawText.slice(0, 200)}`)
  }

  if (!finalRes.ok) {
    throw new Error(`Verifactu error ${finalRes.status}: ${JSON.stringify(data)}`)
  }

  console.log('[Verifactu] ✓ Registered:', input.invoiceNumber)
  const qrUrl = (data as { data?: { qr_code?: string } })?.data?.qr_code ?? null
  return { qrUrl }
}
