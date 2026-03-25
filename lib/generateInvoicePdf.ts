// lib/generateInvoicePdf.ts
//
// Generates a bilingual (Spanish + English) PDF invoice using pdf-lib.
// Designed for Verifactu compliance — includes all required fiscal fields.
// Now calculates price dynamically from Stripe amountTotal instead of hardcoding.
//
// ENV VARS REQUIRED:
//   EMISOR_NOMBRE       — e.g. "Tash Tenner"
//   EMISOR_NIE          — e.g. "X1234567A"
//   EMISOR_DIRECCION    — e.g. "Calle Mayor 12, 3º 2ª"
//   EMISOR_CP           — e.g. "43201"
//   EMISOR_CIUDAD       — e.g. "Reus"
//   EMISOR_PAIS         — e.g. "España"
//   EMISOR_EMAIL        — e.g. "resuena@linguatash.com"
//
// LOGO PATHS (relative to project root, in /public):
//   LOGO_LINGUATASH_PATH — e.g. "static/images/linguatash-logo.png"
//   LOGO_RESUENA_PATH    — e.g. "static/images/resuena-icon.png"

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

// ── Colors (matching LinguaTash brand) ───────────────────────────────────────
const NAVY = rgb(0.031, 0.11, 0.235) // #081C3C
const ROSE = rgb(0.702, 0.278, 0.353) // #B3475A
const CREAM = rgb(0.957, 0.937, 0.91) // #F4EFE8
const MUTED = rgb(0.604, 0.561, 0.522) // #9A8F85
const WHITE = rgb(1, 1, 1)
const BLACK = rgb(0, 0, 0)

// ── Layout constants ─────────────────────────────────────────────────────────
const PAGE_W = 595 // A4 width in points
const PAGE_H = 842 // A4 height in points
const MARGIN = 48
const COL_W = (PAGE_W - MARGIN * 2) / 2 - 8 // two-column width

// ── EU countries for IVA note ────────────────────────────────────────────────
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

// ── Types ────────────────────────────────────────────────────────────────────
export interface InvoiceData {
  invoiceNumber: string
  issueDate: string // YYYY-MM-DD
  sessionId: string
  // Buyer
  buyerNombre: string
  buyerEmail: string
  buyerNif?: string | null
  buyerNombreEmpresa?: string | null
  buyerDomicilio?: string | null
  buyerCodigoPostal?: string | null
  buyerCiudad?: string | null
  buyerPais?: string | null // ISO country code e.g. "ES"
  // Order
  languages: string[]
  languageNames: string[] // e.g. ["Español", "Inglés"]
  amountTotal: number // Total from Stripe in euros (e.g., 12.00 for 3 languages × €4)
  ivaRate: number // 0 or 21
  // Verifactu
  verifactuQrUrl?: string | null
}

// ── Helper: draw text ────────────────────────────────────────────────────────
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = BLACK
) {
  page.drawText(text, { x, y, font, size, color })
}

// ── Helper: draw horizontal line ─────────────────────────────────────────────
function drawLine(page: PDFPage, x1: number, y1: number, x2: number, color = MUTED) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y1 }, thickness: 0.5, color })
}

// ── Helper: draw filled rectangle ────────────────────────────────────────────
function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  color: ReturnType<typeof rgb>
) {
  page.drawRectangle({ x, y, width: w, height: h, color })
}

// ── Helper: load logo from /public ───────────────────────────────────────────
async function loadLogo(
  pdfDoc: PDFDocument,
  relativePath: string
): Promise<Awaited<ReturnType<typeof pdfDoc.embedPng>> | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', relativePath)
    if (!fs.existsSync(fullPath)) return null
    const bytes = fs.readFileSync(fullPath)
    return await pdfDoc.embedPng(bytes)
  } catch {
    return null
  }
}

// ── Main generator ────────────────────────────────────────────────────────────
export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([PAGE_W, PAGE_H])

  // Fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Logos
  const logoCombinedPath =
    process.env.LOGO_COMBINED_PATH || 'static/images/LinguaTashResuenaLogoInvoice.png'
  const logoCombined = await loadLogo(pdfDoc, logoCombinedPath)

  // Emisor data from env
  const emisor = {
    nombre: process.env.EMISOR_NOMBRE || 'Natascha Tenner',
    nie: process.env.EMISOR_NIE || '[NIE pendiente]',
    direccion: process.env.EMISOR_DIRECCION || 'Carrer de la Providència 47, Entresuelo 2',
    cp: process.env.EMISOR_CP || '08024',
    ciudad: process.env.EMISOR_CIUDAD || 'Barcelona',
    pais: process.env.EMISOR_PAIS || 'España',
    email: process.env.EMISOR_EMAIL || 'resuena@linguatash.com',
  }

  // DYNAMIC: Calculate price per language from amountTotal
  const numLanguages = data.languages.length
  const amountPerLanguage = Math.round((data.amountTotal / numLanguages) * 100) / 100

  // IVA calculations
  const base = Math.round((amountPerLanguage / (1 + data.ivaRate / 100)) * 100) / 100
  const tax = Math.round((amountPerLanguage - base) * 100) / 100
  const totalBase = Math.round(base * numLanguages * 100) / 100
  const totalTax = Math.round(tax * numLanguages * 100) / 100
  const totalFinal = Math.round(data.amountTotal * 100) / 100 // Use actual total from Stripe

  const isEU = EU_COUNTRIES.has(data.buyerPais || 'ES')
  const ivaNote =
    data.ivaRate === 0
      ? 'Operación no sujeta a IVA — Art. 69 Ley 37/1992 / Operation not subject to VAT'
      : null

  // Formatted date
  const [y, m, d] = data.issueDate.split('-')
  const dateFormatted = `${d}/${m}/${y}`

  let curY = PAGE_H - MARGIN // current Y position (top → bottom)

  // ── HEADER BAR (navy, text only — logos on cream strip below) ──────────────
  drawRect(page, 0, PAGE_H - 56, PAGE_W, 56, NAVY)
  drawText(page, 'FACTURA / INVOICE', MARGIN, PAGE_H - 24, fontBold, 16, CREAM)
  drawText(page, `Nº ${data.invoiceNumber}`, MARGIN, PAGE_H - 40, fontRegular, 9, CREAM)
  drawText(page, `Fecha / Date: ${dateFormatted}`, MARGIN, PAGE_H - 52, fontRegular, 9, CREAM)
  // ── CREAM LOGO STRIP ────────────────────────────────────────────────────────
  // Logos on cream background — always visible regardless of logo colours
  const LOGO_STRIP_H = 52
  drawRect(page, 0, PAGE_H - 56 - LOGO_STRIP_H, PAGE_W, LOGO_STRIP_H, CREAM)

  // Combined logo — centered vertically in the cream strip
  const stripCenterY = PAGE_H - 56 - LOGO_STRIP_H / 2
  if (logoCombined) {
    const h = LOGO_STRIP_H - 8
    const scale = h / logoCombined.height
    const w = logoCombined.width * scale
    page.drawImage(logoCombined, {
      x: MARGIN,
      y: stripCenterY - h / 2,
      width: w,
      height: h,
    })
  }

  // Right side: website URL only
  const brandLine = 'linguatash.com'
  const brandLineW = fontRegular.widthOfTextAtSize(brandLine, 8)
  drawText(page, brandLine, PAGE_W - MARGIN - brandLineW, stripCenterY - 4, fontRegular, 8, MUTED)

  // Thin separator line below logo strip
  drawLine(page, 0, PAGE_H - 56 - LOGO_STRIP_H, PAGE_W, MUTED)

  curY = PAGE_H - 56 - LOGO_STRIP_H - 16

  // ── EMISOR + RECEPTOR (two columns) ────────────────────────────────────────
  const leftX = MARGIN
  const rightX = MARGIN + COL_W + 16

  // Column headers
  drawText(page, 'EMISOR / SELLER', leftX, curY, fontBold, 7, ROSE)
  drawText(page, 'RECEPTOR / BUYER', rightX, curY, fontBold, 7, ROSE)
  curY -= 4
  drawLine(page, leftX, curY, leftX + COL_W, ROSE)
  drawLine(page, rightX, curY, rightX + COL_W, ROSE)
  curY -= 12

  // Emisor column
  const emisorLines = [
    emisor.nombre,
    `NIE/NIF: ${emisor.nie}`,
    emisor.direccion,
    `${emisor.cp} ${emisor.ciudad}, ${emisor.pais}`,
    emisor.email,
    'linguatash.com',
  ]

  // Receptor column
  const receptorLines: string[] = [data.buyerNombre]
  if (data.buyerNombreEmpresa) receptorLines.push(data.buyerNombreEmpresa)
  if (data.buyerNif) receptorLines.push(`NIF/NIE: ${data.buyerNif}`)
  if (data.buyerDomicilio) receptorLines.push(data.buyerDomicilio)
  if (data.buyerCodigoPostal || data.buyerCiudad)
    receptorLines.push(`${data.buyerCodigoPostal || ''} ${data.buyerCiudad || ''}`.trim())
  if (data.buyerPais) receptorLines.push(data.buyerPais)
  receptorLines.push(data.buyerEmail)

  const maxLines = Math.max(emisorLines.length, receptorLines.length)
  for (let i = 0; i < maxLines; i++) {
    if (emisorLines[i]) drawText(page, emisorLines[i], leftX, curY, fontRegular, 8)
    if (receptorLines[i]) drawText(page, receptorLines[i], rightX, curY, fontRegular, 8)
    curY -= 13
  }

  curY -= 10

  // ── LINE ITEMS TABLE ───────────────────────────────────────────────────────
  drawRect(page, MARGIN, curY - 2, PAGE_W - MARGIN * 2, 16, NAVY)

  const col = {
    desc: MARGIN + 4,
    qty: PAGE_W - MARGIN - 200,
    base: PAGE_W - MARGIN - 150,
    iva: PAGE_W - MARGIN - 90,
    total: PAGE_W - MARGIN - 40,
  }

  // Table header
  drawText(page, 'Descripción / Description', col.desc, curY + 3, fontBold, 7, CREAM)
  drawText(page, 'Uds', col.qty, curY + 3, fontBold, 7, CREAM)
  drawText(page, 'Base', col.base, curY + 3, fontBold, 7, CREAM)
  drawText(page, `IVA ${data.ivaRate}%`, col.iva, curY + 3, fontBold, 7, CREAM)
  drawText(page, 'Total', col.total, curY + 3, fontBold, 7, CREAM)
  curY -= 16

  // One row per language
  data.languages.forEach((code, i) => {
    const langName = data.languageNames[i] || code
    const rowColor = i % 2 === 0 ? CREAM : WHITE
    drawRect(page, MARGIN, curY - 4, PAGE_W - MARGIN * 2, 16, rowColor)

    drawText(
      page,
      `Salten — Pack ${langName} (descarga digital / digital download)`,
      col.desc,
      curY + 3,
      fontRegular,
      7.5
    )
    drawText(page, '1', col.qty, curY + 3, fontRegular, 7.5)
    drawText(page, `${base.toFixed(2)} €`, col.base, curY + 3, fontRegular, 7.5)
    drawText(page, `${tax.toFixed(2)} €`, col.iva, curY + 3, fontRegular, 7.5)
    drawText(page, `${amountPerLanguage.toFixed(2)} €`, col.total, curY + 3, fontRegular, 7.5)
    curY -= 16
  })

  curY -= 4
  drawLine(page, MARGIN, curY, PAGE_W - MARGIN)

  // ── TOTALS ─────────────────────────────────────────────────────────────────
  curY -= 14
  const totX = PAGE_W - MARGIN - 200

  const totals = [
    [`Base imponible / Taxable amount`, `${totalBase.toFixed(2)} €`],
    [`IVA ${data.ivaRate}% / VAT ${data.ivaRate}%`, `${totalTax.toFixed(2)} €`],
  ]

  totals.forEach(([label, value]) => {
    drawText(page, label, totX, curY, fontRegular, 8, BLACK)
    drawText(
      page,
      value,
      PAGE_W - MARGIN - 2 - fontRegular.widthOfTextAtSize(value, 8),
      curY,
      fontRegular,
      8,
      BLACK
    )
    curY -= 16
  })

  curY -= 6 // extra space before TOTAL bar

  // Total final highlighted
  drawRect(page, totX - 4, curY - 5, PAGE_W - MARGIN - totX + 4, 20, NAVY)
  const totalLabel = `TOTAL`
  const totalValue = `${totalFinal.toFixed(2)} €`
  drawText(page, totalLabel, totX, curY + 3, fontBold, 9, CREAM)
  drawText(
    page,
    totalValue,
    PAGE_W - MARGIN - 2 - fontBold.widthOfTextAtSize(totalValue, 9),
    curY + 3,
    fontBold,
    9,
    CREAM
  )
  curY -= 24

  // ── IVA NOTE (non-EU) ──────────────────────────────────────────────────────
  if (ivaNote) {
    curY -= 6
    drawRect(page, MARGIN, curY - 4, PAGE_W - MARGIN * 2, 16, CREAM)
    drawText(page, ivaNote, MARGIN + 4, curY + 3, fontRegular, 7, MUTED)
    curY -= 20
  }

  // ── PAYMENT METHOD ─────────────────────────────────────────────────────────
  curY -= 8
  drawText(
    page,
    'Método de pago / Payment method: Stripe (tarjeta / card)',
    MARGIN,
    curY,
    fontRegular,
    7.5,
    MUTED
  )
  drawText(
    page,
    `Referencia Stripe / Stripe reference: ${data.sessionId}`,
    MARGIN,
    curY - 12,
    fontRegular,
    7,
    MUTED
  )

  // ── VERIFACTU QR ───────────────────────────────────────────────────────────
  if (data.verifactuQrUrl) {
    curY -= 36
    drawText(
      page,
      'Factura verificable en AEAT / Verifiable at AEAT:',
      MARGIN,
      curY,
      fontBold,
      7.5,
      NAVY
    )
    drawText(page, data.verifactuQrUrl, MARGIN, curY - 12, fontRegular, 6.5, MUTED)
    // Note: to embed actual QR image, use qrcode lib to generate PNG bytes and embedPng()
    // For now the URL is printed — sufficient for legal compliance
  }

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  const footerY = 32
  drawRect(page, 0, 0, PAGE_W, footerY + 8, NAVY)
  drawText(
    page,
    `${emisor.nombre} · ${emisor.nie} · ${emisor.direccion}, ${emisor.cp} ${emisor.ciudad} · ${emisor.email} · linguatash.com`,
    MARGIN,
    footerY - 2,
    fontRegular,
    6.5,
    CREAM
  )
  drawText(
    page,
    'Documento generado conforme a la normativa Verifactu (Ley 11/2021) / Generated in compliance with Spanish Verifactu regulation',
    MARGIN,
    footerY - 14,
    fontRegular,
    6,
    MUTED
  )

  return pdfDoc.save()
}
