// lib/nordkreis/generateInvoicePdf.ts
//
// Generates a bilingual (German + Spanish) PDF invoice for Nordkreis payments.
// Same visual style as lib/generateInvoicePdf.ts (Resuena).
// No IVA — educational activity exempt under Art. 20 Ley 37/1992.
//
// Invoice numbering: NORDKREIS-YYYY-XXXXXX
//
// ENV VARS (shared with Resuena):
//   EMISOR_NOMBRE, EMISOR_NIE, EMISOR_DIRECCION, EMISOR_CP,
//   EMISOR_CIUDAD, EMISOR_PAIS
//   LOGO_NORDKREIS_CONTRACT_PATH — e.g. "static/images/LinguaTashNordkreisLogoContract.png"

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

// ── Colors (identical to generateInvoicePdf.ts) ───────────────────────────────
const NAVY = rgb(0.031, 0.11, 0.235) // #081C3C
const ROSE = rgb(0.702, 0.278, 0.353) // #B3475A
const CREAM = rgb(0.957, 0.937, 0.91) // #F4EFE8
const MUTED = rgb(0.604, 0.561, 0.522) // #9A8F85
const WHITE = rgb(1, 1, 1)
const BLACK = rgb(0, 0, 0)

const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 48
const COL_W = (PAGE_W - MARGIN * 2) / 2 - 8

// ── Types ─────────────────────────────────────────────────────────────────────

export type NordkreisInvoiceType = 'enrollment_fee' | 'monthly'

export interface NordkreisInvoiceData {
  invoiceNumber: string // NORDKREIS-YYYY-XXXXXX
  issueDate: string // YYYY-MM-DD
  stripeInvoiceId: string // Stripe invoice ID for reference
  invoiceType: NordkreisInvoiceType
  monthNumber?: number // e.g. 3 (for "Monat 3 von 10")
  totalMonths?: number // e.g. 10
  // Buyer
  buyerName: string
  buyerEmail: string
  // Child
  childName: string
  childGroup: string
  // Amount
  amountEur: number // e.g. 60.00 or 45.00
}

// ── Helpers (identical signatures to generateInvoicePdf.ts) ───────────────────

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = BLACK
) {
  page.drawText(String(text ?? ''), { x, y, font, size, color })
}

function drawLine(page: PDFPage, x1: number, y1: number, x2: number, color = MUTED) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y1 }, thickness: 0.5, color })
}

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

async function loadLogo(pdfDoc: PDFDocument, relativePath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', relativePath)
    if (!fs.existsSync(fullPath)) return null
    return await pdfDoc.embedPng(fs.readFileSync(fullPath))
  } catch {
    return null
  }
}

// ── Main generator ─────────────────────────────────────────────────────────────

export async function generateNordkreisInvoicePdf(data: NordkreisInvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([PAGE_W, PAGE_H])

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const logoPath =
    process.env.LOGO_NORDKREIS_CONTRACT_PATH || 'static/images/LinguaTashNordkreisLogoContract.png'
  const logo = await loadLogo(pdfDoc, logoPath)

  const emisor = {
    nombre: process.env.EMISOR_NOMBRE || 'Natascha Tenner',
    nie: process.env.EMISOR_NIE || '[NIE pendiente]',
    direccion: process.env.EMISOR_DIRECCION || 'Carrer de la Providència 47, Entresuelo 2',
    cp: process.env.EMISOR_CP || '08024',
    ciudad: process.env.EMISOR_CIUDAD || 'Barcelona',
    pais: process.env.EMISOR_PAIS || 'España',
    email: 'nordkreis@linguatash.com',
  }

  const [y, m, d] = data.issueDate.split('-')
  const dateFormatted = `${d}/${m}/${y}`
  const dateDe = new Date(data.issueDate + 'T12:00:00').toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Description lines
  const isEnrollment = data.invoiceType === 'enrollment_fee'
  const descDE = isEnrollment
    ? `Nordkreis — Einschreibegebühr (${data.childGroup})`
    : `Nordkreis — Monatsbeitrag${data.monthNumber ? ` ${data.monthNumber} von ${data.totalMonths ?? 10}` : ''} (${data.childGroup})`
  const descES = isEnrollment
    ? `Nordkreis — Matrícula (${data.childGroup})`
    : `Nordkreis — Cuota mensual${data.monthNumber ? ` ${data.monthNumber} de ${data.totalMonths ?? 10}` : ''} (${data.childGroup})`
  const descChild = `Kind / Niño·a: ${data.childName}`

  let curY = PAGE_H - MARGIN

  // ── HEADER BAR ──────────────────────────────────────────────────────────────
  drawRect(page, 0, PAGE_H - 56, PAGE_W, 56, NAVY)
  drawText(page, 'RECHNUNG / FACTURA', MARGIN, PAGE_H - 22, fontBold, 16, CREAM)
  drawText(page, `Nr. ${data.invoiceNumber}`, MARGIN, PAGE_H - 38, fontRegular, 9, CREAM)
  drawText(
    page,
    `Datum / Fecha: ${dateDe} (${dateFormatted})`,
    MARGIN,
    PAGE_H - 50,
    fontRegular,
    9,
    CREAM
  )

  // ── LOGO STRIP ───────────────────────────────────────────────────────────────
  const LOGO_H = 52
  drawRect(page, 0, PAGE_H - 56 - LOGO_H, PAGE_W, LOGO_H, CREAM)
  const stripCY = PAGE_H - 56 - LOGO_H / 2
  if (logo) {
    const h = LOGO_H - 8
    const w = logo.width * (h / logo.height)
    page.drawImage(logo, { x: MARGIN, y: stripCY - h / 2, width: w, height: h })
  }
  const brandLine = 'linguatash.com'
  drawText(
    page,
    brandLine,
    PAGE_W - MARGIN - fontRegular.widthOfTextAtSize(brandLine, 8),
    stripCY - 4,
    fontRegular,
    8,
    MUTED
  )
  drawLine(page, 0, PAGE_H - 56 - LOGO_H, PAGE_W, MUTED)

  curY = PAGE_H - 56 - LOGO_H - 16

  // ── EMISOR + RECEPTOR ────────────────────────────────────────────────────────
  const leftX = MARGIN
  const rightX = MARGIN + COL_W + 16

  drawText(page, 'LEISTUNGSERBRINGER / EMISOR', leftX, curY, fontBold, 7, ROSE)
  drawText(page, 'KUNDE / RECEPTOR', rightX, curY, fontBold, 7, ROSE)
  curY -= 4
  drawLine(page, leftX, curY, leftX + COL_W, ROSE)
  drawLine(page, rightX, curY, rightX + COL_W, ROSE)
  curY -= 12

  const emisorLines = [
    emisor.nombre,
    `NIE/NIF: ${emisor.nie}`,
    emisor.direccion,
    `${emisor.cp} ${emisor.ciudad}, ${emisor.pais}`,
    emisor.email,
    'linguatash.com',
  ]
  const receptorLines = [data.buyerName, data.buyerEmail, descChild]

  const maxLines = Math.max(emisorLines.length, receptorLines.length)
  for (let i = 0; i < maxLines; i++) {
    if (emisorLines[i]) drawText(page, emisorLines[i], leftX, curY, fontRegular, 8)
    if (receptorLines[i]) drawText(page, receptorLines[i], rightX, curY, fontRegular, 8)
    curY -= 13
  }
  curY -= 10

  // ── LINE ITEMS TABLE ─────────────────────────────────────────────────────────
  drawRect(page, MARGIN, curY - 2, PAGE_W - MARGIN * 2, 16, NAVY)

  const col = {
    desc: MARGIN + 4,
    qty: PAGE_W - MARGIN - 160,
    total: PAGE_W - MARGIN - 50,
  }

  drawText(page, 'Beschreibung / Descripción', col.desc, curY + 3, fontBold, 7, CREAM)
  drawText(page, 'Menge / Uds', col.qty, curY + 3, fontBold, 7, CREAM)
  drawText(page, 'Betrag / Importe', col.total, curY + 3, fontBold, 7, CREAM)
  curY -= 16

  // Row 1 — DE description
  drawRect(page, MARGIN, curY - 4, PAGE_W - MARGIN * 2, 16, CREAM)
  drawText(page, descDE, col.desc, curY + 3, fontRegular, 7.5)
  drawText(page, '1', col.qty, curY + 3, fontRegular, 7.5)
  drawText(page, `${data.amountEur.toFixed(2)} €`, col.total, curY + 3, fontRegular, 7.5)
  curY -= 16

  // Row 2 — ES description (lighter row)
  drawRect(page, MARGIN, curY - 4, PAGE_W - MARGIN * 2, 16, WHITE)
  drawText(page, descES, col.desc, curY + 3, fontRegular, 7.5, MUTED)
  curY -= 16

  curY -= 4
  drawLine(page, MARGIN, curY, PAGE_W - MARGIN)
  curY -= 14

  // ── IVA EXEMPT NOTE ──────────────────────────────────────────────────────────
  drawRect(page, MARGIN, curY - 4, PAGE_W - MARGIN * 2, 16, CREAM)
  drawText(
    page,
    'Exento de IVA — Actividad educativa / Art. 20 Ley 37/1992  ·  Befreit von MwSt. — Bildungsaktivität',
    MARGIN + 4,
    curY + 3,
    fontRegular,
    7,
    MUTED
  )
  curY -= 20

  // ── TOTAL ─────────────────────────────────────────────────────────────────────
  curY -= 6
  const totX = PAGE_W - MARGIN - 200
  drawRect(page, totX - 4, curY - 5, PAGE_W - MARGIN - totX + 4, 20, NAVY)
  const totalValue = `${data.amountEur.toFixed(2)} €`
  drawText(page, 'GESAMT / TOTAL', totX, curY + 3, fontBold, 9, CREAM)
  drawText(
    page,
    totalValue,
    PAGE_W - MARGIN - 2 - fontBold.widthOfTextAtSize(totalValue, 9),
    curY + 3,
    fontBold,
    9,
    CREAM
  )
  curY -= 28

  // ── PAYMENT METHOD ────────────────────────────────────────────────────────────
  curY -= 8
  drawText(
    page,
    'Zahlungsmethode / Método de pago: SEPA-Lastschrift via Stripe / Adeudo SEPA via Stripe',
    MARGIN,
    curY,
    fontRegular,
    7.5,
    MUTED
  )
  drawText(
    page,
    `Stripe-Referenz / Referencia Stripe: ${data.stripeInvoiceId}`,
    MARGIN,
    curY - 12,
    fontRegular,
    7,
    MUTED
  )

  // ── FOOTER ────────────────────────────────────────────────────────────────────
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
    'Documento generado conforme a la normativa fiscal española / Dokument gemäß spanischer Steuervorschriften',
    MARGIN,
    footerY - 14,
    fontRegular,
    6,
    MUTED
  )

  return pdfDoc.save()
}

// ── Invoice number generator ──────────────────────────────────────────────────

export function generateNordkreisInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const seq = String(Date.now()).slice(-6)
  return `NORDKREIS-${year}-${seq}`
}
