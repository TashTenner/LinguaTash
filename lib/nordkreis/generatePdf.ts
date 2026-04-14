// lib/nordkreis/generatePdf.ts
//
// Nordkreis enrollment contract — German + Spanish, auto-pagination
// Uses pdf-lib (same as generateInvoicePdf.ts)

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

// ── Colors ────────────────────────────────────────────────────────────────────
const NAVY = rgb(0.031, 0.11, 0.235)
const ROSE = rgb(0.702, 0.278, 0.353)
const CREAM = rgb(0.957, 0.937, 0.91)
const MUTED = rgb(0.604, 0.561, 0.522)
const SURF = rgb(0.89, 0.871, 0.843)
const WHITE = rgb(1, 1, 1)
const BLACK = rgb(0, 0, 0)

// ── Layout ────────────────────────────────────────────────────────────────────
const PW = 595
const PH = 842
const ML = 48
const MR = 48
const CW = PW - ML - MR // 499
const FOOTER_H = 36
const HEADER_H = 56 + 56 // navy bar + logo strip = 112px
const BODY_TOP = PH - HEADER_H - 20 // first content Y on any page
const BODY_BOTTOM = FOOTER_H + 14 // lowest Y before footer

// ── Font sizes ────────────────────────────────────────────────────────────────
const FS_BODY = 8.5
const FS_SMALL = 7.5
const FS_LABEL = 7.5

// ── Helpers ───────────────────────────────────────────────────────────────────

function txt(
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

function hline(page: PDFPage, x1: number, y: number, x2: number, color = MUTED, thickness = 0.5) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color })
}

function fillRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  color: ReturnType<typeof rgb>
) {
  page.drawRectangle({ x, y, width: w, height: h, color })
}

async function loadImage(pdfDoc: PDFDocument, relativePath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', relativePath)
    if (!fs.existsSync(fullPath)) return null
    return await pdfDoc.embedPng(fs.readFileSync(fullPath))
  } catch {
    return null
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (current) lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

// ── Spanish translations for common field values ──────────────────────────────
function translateValue(value: string): string {
  const map: Record<string, string> = {
    'Mutter / Mother': 'Mutter / Madre',
    'Vater / Father': 'Vater / Padre',
    'Beide / Both': 'Beide / Ambos',
    'Other person': 'Otra persona',
    'Keine / None': 'Keine / Ninguna',
  }
  return map[value] ?? value
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NordkreisContractData {
  childFirstName: string
  childSurname1?: string
  childSurname2?: string
  childDOB: string
  schoolYear?: string
  childGroup: string
  germanSpeakingParent?: string
  medicalAllergies?: string
  parent1FirstName: string
  parent1Surname1?: string
  parent1Surname2?: string
  parent1Phone?: string
  parent1Email: string
  parent2FirstName?: string
  parent2Surname1?: string
  parent2Surname2?: string
  parent2Phone?: string
  parent2Email?: string
  addressStreet?: string
  city?: string
  postalCode?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  additionalNotes?: string
  feeOption?: string
  monthlyAmount?: number
  enrollmentFee?: boolean
  accountHolder: string
  stripeCustomerId?: string
  signatureDataUrl?: string
}

// ── Main generator ─────────────────────────────────────────────────────────────

export async function generateContractPdf(
  form: NordkreisContractData,
  teacherSignatureBase64: string | null,
  contractNo: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const reg = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const logoPath =
    process.env.LOGO_NORDKREIS_CONTRACT_PATH || 'static/images/LinguaTashNordkreisLogoContract.png'
  const logo = await loadImage(pdfDoc, logoPath)

  const monthly = form.monthlyAmount ?? 50
  const total10 = monthly * 10
  const grandTotal = form.enrollmentFee ? total10 + 60 : total10

  const childFull = [form.childFirstName, form.childSurname1, form.childSurname2]
    .filter(Boolean)
    .join(' ')
  const parent1Full = [form.parent1FirstName, form.parent1Surname1, form.parent1Surname2]
    .filter(Boolean)
    .join(' ')
  const parent2Full = form.parent2FirstName
    ? [form.parent2FirstName, form.parent2Surname1, form.parent2Surname2].filter(Boolean).join(' ')
    : null

  const dateStr = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const dateStrES = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Emisor — always use nordkreis email for this contract
  const emisor = {
    nombre: process.env.EMISOR_NOMBRE || 'Natascha Tenner',
    nie: process.env.EMISOR_NIE || '',
    direccion: process.env.EMISOR_DIRECCION || '',
    cp: process.env.EMISOR_CP || '',
    ciudad: process.env.EMISOR_CIUDAD || 'Barcelona',
    email: 'nordkreis@linguatash.com',
  }

  // ── Header renderer (called on every page) ────────────────────────────────────
  function renderHeader(page: PDFPage, pageNum: number) {
    // Navy bar
    fillRect(page, 0, PH - 56, PW, 56, NAVY)
    txt(page, 'ANMELDEVERTRAG / CONTRATO DE INSCRIPCIÓN', ML, PH - 20, bold, 13, CREAM)
    txt(page, `Nr: ${contractNo}`, ML, PH - 36, reg, 9, CREAM)
    txt(page, `Datum / Fecha: ${dateStr} / ${dateStrES}`, ML, PH - 50, reg, 9, CREAM)

    // Logo strip
    fillRect(page, 0, PH - 112, PW, 56, CREAM)
    const stripCY = PH - 84
    if (logo) {
      const h = 44
      const w = logo.width * (h / logo.height)
      page.drawImage(logo, { x: ML, y: stripCY - h / 2, width: w, height: h })
    }
    const nkLabel = 'Nordkreis · Gemeinschaft & Samstagsschule · Barcelona · linguatash.com'
    txt(page, nkLabel, PW - MR - reg.widthOfTextAtSize(nkLabel, 7.5), stripCY - 4, reg, 7.5, MUTED)
    hline(page, 0, PH - 112, PW, MUTED)

    // Footer
    fillRect(page, 0, 0, PW, FOOTER_H, NAVY)
    txt(
      page,
      `Nordkreis · ${emisor.nombre} · ${emisor.nie} · ${emisor.email} · ${contractNo}`,
      ML,
      23,
      reg,
      6.5,
      CREAM
    )
    txt(page, `${dateStr} · Seite ${pageNum} / Página ${pageNum}`, ML, 11, reg, 6.5, MUTED)
    const gdprText = 'Dokument gemäß DSGVO / Documento conforme al RGPD'
    txt(page, gdprText, PW - MR - reg.widthOfTextAtSize(gdprText, 6.5), 11, reg, 6.5, MUTED)
  }

  // ── Cursor — tracks Y, auto-creates new pages ─────────────────────────────────
  class Cursor {
    y: number
    page: PDFPage
    pageNum: number

    constructor(page: PDFPage, pageNum: number) {
      this.page = page
      this.y = BODY_TOP
      this.pageNum = pageNum
    }

    private ensureSpace(needed: number) {
      if (this.y - needed < BODY_BOTTOM) {
        this.pageNum++
        this.page = pdfDoc.addPage([PW, PH])
        renderHeader(this.page, this.pageNum)
        this.y = BODY_TOP
      }
    }

    gap(px = 6) {
      this.y -= px
    }

    section(de: string, es: string) {
      this.ensureSpace(32)
      this.gap(8)
      fillRect(this.page, ML, this.y - 2, CW, 19, NAVY)
      txt(this.page, `${de} / ${es}`, ML + 4, this.y + 5, bold, 9, CREAM)
      this.y -= 24
    }

    // row: label on left, value on right — with enough space between them
    row(labelDE: string, labelES: string, value?: string | null) {
      if (!value) return
      this.ensureSpace(15)
      const label = `${labelDE} / ${labelES}:`
      // Label in muted, value starts at fixed x=230 to avoid overlap
      txt(this.page, label, ML + 4, this.y, reg, FS_LABEL, MUTED)
      txt(this.page, value, ML + 200, this.y, reg, FS_BODY, BLACK)
      this.y -= 15
    }

    wrappedText(text: string, color = BLACK, size = FS_BODY, indent = 4) {
      const maxW = CW - indent - 8
      const lines = wrapText(text, reg, size, maxW)
      for (const l of lines) {
        this.ensureSpace(size + 5)
        txt(this.page, l, ML + indent, this.y, reg, size, color)
        this.y -= size + 4
      }
    }

    tableHeaderRow(cols: [string, number][]) {
      this.ensureSpace(16)
      fillRect(this.page, ML, this.y - 3, CW, 16, SURF)
      for (const [label, x] of cols) {
        txt(this.page, label, x, this.y + 2, bold, 7.5, NAVY)
      }
      this.y -= 17
    }

    tableRow(cols: [string, number][], bgColor: ReturnType<typeof rgb>) {
      this.ensureSpace(15)
      fillRect(this.page, ML, this.y - 3, CW, 14, bgColor)
      for (const [label, x] of cols) {
        txt(this.page, label, x, this.y + 1, reg, FS_BODY)
      }
      this.y -= 15
    }

    hline(color = MUTED) {
      this.ensureSpace(6)
      hline(this.page, ML, this.y, PW - MR, color)
      this.y -= 6
    }

    totalRow(label: string, value: string, bg = SURF) {
      this.ensureSpace(18)
      fillRect(this.page, ML, this.y - 4, CW, 17, bg)
      txt(this.page, label, ML + 4, this.y + 3, reg, FS_BODY, bg === NAVY ? CREAM : MUTED)
      txt(
        this.page,
        value,
        PW - MR - 8 - reg.widthOfTextAtSize(value, FS_BODY),
        this.y + 3,
        bg === NAVY ? bold : reg,
        bg === NAVY ? 10 : FS_BODY,
        bg === NAVY ? CREAM : BLACK
      )
      this.y -= 19
    }
  }

  // ── Build document ────────────────────────────────────────────────────────────
  const p1 = pdfDoc.addPage([PW, PH])
  renderHeader(p1, 1)
  const cur = new Cursor(p1, 1)

  // Warteliste notice
  cur.gap(14)
  fillRect(cur.page, ML, cur.y - 6, CW, 38, SURF)
  txt(
    cur.page,
    'WARTELISTE — Heute wird kein Betrag abgebucht.',
    ML + 6,
    cur.y + 20,
    bold,
    10,
    NAVY
  )
  txt(
    cur.page,
    'LISTA DE ESPERA — Hoy no se realiza ningún cargo.',
    ML + 6,
    cur.y + 7,
    bold,
    9,
    ROSE
  )
  cur.y -= 52

  // ── 1. Kind ───────────────────────────────────────────────────────────────────
  cur.section('1. Kind', 'Niño/a')
  cur.row('Vollständiger Name', 'Nombre completo', childFull)
  cur.row('Geburtsdatum', 'Fecha de nacimiento', form.childDOB)
  cur.row('Schuljahr', 'Curso escolar', form.schoolYear ?? '—')
  cur.row('Gruppe', 'Grupo', form.childGroup)
  cur.row(
    'Deutschspr. Elternteil',
    'Padre/madre germanohablante',
    translateValue(form.germanSpeakingParent ?? '—')
  )
  cur.row(
    'Medizin. Hinweise',
    'Información médica / alergias',
    translateValue(form.medicalAllergies || 'Keine / Ninguna')
  )

  // ── 2. Kursanbieter ───────────────────────────────────────────────────────────
  cur.section('2. Kursanbieter', 'Proveedor del curso')
  cur.row('Name', 'Nombre', emisor.nombre)
  if (emisor.nie) cur.row('NIE/NIF', 'NIE/NIF', emisor.nie)
  if (emisor.direccion)
    cur.row('Adresse', 'Dirección', `${emisor.direccion}, ${emisor.cp} ${emisor.ciudad}`.trim())
  cur.row('E-Mail', 'Correo electrónico', emisor.email)

  // ── 3. Erziehungsberechtigte ──────────────────────────────────────────────────
  cur.section('3. Erziehungsberechtigte', 'Padres o tutores')
  cur.row('Elternteil 1', 'Padre/madre 1', parent1Full)
  cur.row('E-Mail', 'Correo electrónico', form.parent1Email)
  cur.row('Telefon', 'Teléfono', form.parent1Phone ?? '—')
  if (parent2Full) {
    cur.row('Elternteil 2', 'Padre/madre 2', parent2Full)
    if (form.parent2Email) cur.row('E-Mail', 'Correo electrónico', form.parent2Email)
    if (form.parent2Phone) cur.row('Telefon', 'Teléfono', form.parent2Phone)
  }
  cur.row(
    'Adresse',
    'Dirección',
    form.addressStreet
      ? `${form.addressStreet}, ${form.city ?? ''} ${form.postalCode ?? ''}`.trim()
      : '—'
  )
  cur.row(
    'Notfallkontakt',
    'Contacto de emergencia',
    form.emergencyContactName
      ? `${form.emergencyContactName} · ${form.emergencyContactPhone ?? ''}`
      : '—'
  )

  // ── 4. Beiträge ───────────────────────────────────────────────────────────────
  cur.section('4. Beiträge', 'Cuotas')

  cur.tableHeaderRow([
    ['Beschreibung / Descripción', ML + 4],
    ['Monate / Meses', PW - MR - 130],
    ['Betrag / Importe', PW - MR - 65],
  ])

  cur.tableRow(
    [
      [`Monatsbeitrag / Cuota mensual (${form.childGroup})`, ML + 4],
      ['10', PW - MR - 118],
      [`${monthly.toFixed(2)} €`, PW - MR - 59],
    ],
    CREAM
  )

  if (form.enrollmentFee) {
    cur.tableRow(
      [
        ['Einschreibegebühr / Matrícula (einmalig / pago único)', ML + 4],
        ['1', PW - MR - 118],
        ['60.00 €', PW - MR - 59],
      ],
      WHITE
    )
  }

  cur.hline()
  cur.totalRow(
    `Monatsbeiträge gesamt / Total cuotas mensuales (10 × ${monthly} €):`,
    `${total10.toFixed(2)} €`
  )
  if (form.enrollmentFee) {
    cur.totalRow('Einschreibegebühr / Matrícula:', '60.00 €')
  }
  cur.gap(4)
  // Grand total — navy background
  fillRect(cur.page, ML, cur.y - 5, CW, 22, NAVY)
  txt(cur.page, 'GESAMTBETRAG / IMPORTE TOTAL:', ML + 6, cur.y + 6, bold, 9, CREAM)
  const gtStr = `${grandTotal.toFixed(2)} €`
  txt(cur.page, gtStr, PW - MR - 8 - bold.widthOfTextAtSize(gtStr, 11), cur.y + 5, bold, 11, CREAM)
  cur.y -= 28

  cur.wrappedText(
    'Heute wird kein Betrag abgebucht. / Hoy no se realiza ningún cargo.',
    MUTED,
    FS_SMALL
  )
  cur.gap(4)

  // ── 5. Teilnahmebedingungen ───────────────────────────────────────────────────
  cur.section('5. Teilnahmebedingungen', 'Condiciones de participación')

  const terms: [string, string][] = [
    [
      '1.  Die Kursbestätigung erfolgt per E-Mail, sobald die Mindestteilnehmerzahl erreicht wurde.',
      '1.  La confirmación del curso se realizará por correo electrónico una vez alcanzado el número mínimo de participantes.',
    ],
    [
      '2.  Monatsbeitrag und Einschreibegebühr werden erst nach der E-Mail-Kursbestätigung aktiviert.',
      '2.  La cuota mensual y la matrícula solo se activarán tras la confirmación del curso por correo electrónico.',
    ],
    [
      '3.  Nach der Kursbestätigung kann dieser Vertrag mit einer Frist von mindestens 7 Tagen gekündigt werden. Bei späterer Kündigung kann eine Stornogebühr in Höhe einer Monatsrate anfallen.',
      '3.  Tras la confirmación del curso, este contrato puede rescindirse con un preaviso mínimo de 7 días. En caso de rescisión posterior, podrá aplicarse una penalización equivalente a una mensualidad.',
    ],
    [
      '4.  Nordkreis behält sich das Recht vor, Kurse abzusagen oder zu verschieben. In diesem Fall werden alle Zahlungsermächtigungen hinfällig.',
      '4.  Nordkreis se reserva el derecho de cancelar o posponer los cursos. En tal caso, todas las autorizaciones de pago quedarán sin efecto.',
    ],
    [
      '5.  Die personenbezogenen Daten werden gemäß der DSGVO ausschließlich zur Kursverwaltung verarbeitet und nicht an Dritte weitergegeben.',
      '5.  Los datos personales se tratarán conforme al RGPD exclusivamente para la gestión del curso y no se cederán a terceros.',
    ],
    [
      '6.  Jeden Monat erhalten Sie per E-Mail eine PDF-Rechnung über die monatliche Zahlung. Die Rechnung über die Einschreibegebühr wird vor der ersten Monatsabbuchung separat per E-Mail zugesandt.',
      '6.  Cada mes recibirá por correo electrónico una factura en PDF correspondiente al pago mensual. La factura de la matrícula se enviará por correo electrónico de forma separada antes del primer cargo mensual.',
    ],
  ]

  for (const [de, es] of terms) {
    cur.wrappedText(de, BLACK, FS_BODY)
    cur.wrappedText(es, MUTED, FS_SMALL)
    cur.gap(6)
  }

  // ── 6. SEPA ───────────────────────────────────────────────────────────────────
  cur.section('6. SEPA-Lastschriftmandat', 'Mandato de adeudo SEPA')
  cur.row('Kontoinhaber', 'Titular de la cuenta', form.accountHolder)
  cur.row(
    'Zahlungsmethode',
    'Método de pago',
    `SEPA-Lastschrift via Stripe (Ref: ${form.stripeCustomerId ?? 'ausstehend / pendiente'})`
  )
  cur.row(
    'Monatsbeitrag',
    'Cuota mensual',
    `${monthly.toFixed(2)} € × 10 Monate/meses = ${total10.toFixed(2)} €`
  )
  if (form.enrollmentFee) {
    cur.row('Einschreibegebühr', 'Matrícula', '60.00 € (einmalig / pago único)')
  }
  cur.row('Gesamtbetrag', 'Importe total', `${grandTotal.toFixed(2)} €`)
  cur.row(
    'Aktivierung',
    'Activación',
    'Erst nach E-Mail-Kursbestätigung / Solo tras confirmación por correo electrónico'
  )
  cur.gap(6)

  cur.wrappedText(
    `Mit der Unterzeichnung erteilt der/die Erziehungsberechtigte Nordkreis die Erlaubnis, per SEPA-Lastschrift Zahlungen in Höhe von ${monthly} €/Monat für 10 aufeinanderfolgende Monate (verarbeitet durch Stripe Payments Europe Ltd.) einzuziehen. Diese Erlaubnis gilt ausschließlich nach einer Kursbestätigung per E-Mail. Das Erstattungsrecht besteht innerhalb von 8 Wochen ab dem Abbuchungsdatum gemäß SEPA Core Direct Debit Scheme.`,
    BLACK,
    FS_BODY
  )
  cur.gap(4)
  cur.wrappedText(
    `Mediante la firma de este contrato, el padre/madre/tutor autoriza a Nordkreis a cobrar mediante adeudo directo SEPA ${monthly} €/mes durante 10 meses consecutivos (gestionado por Stripe Payments Europe Ltd.). Esta autorización solo será válida tras la confirmación del curso por correo electrónico. El derecho a reembolso se ejercerá en un plazo de 8 semanas desde la fecha del cargo, conforme al esquema SEPA Core.`,
    MUTED,
    FS_SMALL
  )
  cur.gap(12)

  // ── 7. Unterschriften ────────────────────────────────────────────────────────
  cur.section('7. Unterschriften', 'Firmas')

  // Need at least 160px for signature boxes + lines + names
  if (cur.y - 160 < BODY_BOTTOM) {
    cur.pageNum++
    cur.page = pdfDoc.addPage([PW, PH])
    renderHeader(cur.page, cur.pageNum)
    cur.y = BODY_TOP
    // Re-draw section header on new page
    cur.gap(8)
    fillRect(cur.page, ML, cur.y - 2, CW, 19, NAVY)
    txt(cur.page, '7. Unterschriften / Firmas', ML + 4, cur.y + 5, bold, 9, CREAM)
    cur.y -= 24
  }

  const col1 = ML + 4
  const col2 = ML + CW / 2 + 10
  const sigLabelY = cur.y

  txt(
    cur.page,
    'Erziehungsberechtigte(r) / Padre, madre o tutor/a:',
    col1,
    sigLabelY,
    reg,
    FS_LABEL,
    MUTED
  )
  txt(cur.page, 'Nordkreis — Schulleitung / Dirección:', col2, sigLabelY, reg, FS_LABEL, MUTED)
  cur.y -= 10

  const sigW = 155
  const sigH = 54
  const sigBoxY = cur.y - sigH

  // Parent signature box
  if (form.signatureDataUrl) {
    try {
      const sigImage = await pdfDoc.embedPng(
        Buffer.from(form.signatureDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64')
      )
      cur.page.drawImage(sigImage, { x: col1, y: sigBoxY, width: sigW, height: sigH })
    } catch {
      fillRect(cur.page, col1, sigBoxY, sigW, sigH, SURF)
      txt(cur.page, 'Unterschrift / Firma', col1 + 20, sigBoxY + sigH / 2 - 4, reg, 7.5, MUTED)
    }
  } else {
    fillRect(cur.page, col1, sigBoxY, sigW, sigH, SURF)
    txt(cur.page, 'Unterschrift / Firma', col1 + 20, sigBoxY + sigH / 2 - 4, reg, 7.5, MUTED)
  }

  // Teacher signature box
  if (teacherSignatureBase64) {
    try {
      const tImage = await pdfDoc.embedPng(Buffer.from(teacherSignatureBase64, 'base64'))
      cur.page.drawImage(tImage, { x: col2, y: sigBoxY, width: sigW, height: sigH })
    } catch {
      fillRect(cur.page, col2, sigBoxY, sigW, sigH, SURF)
      txt(cur.page, 'Unterschrift / Firma', col2 + 20, sigBoxY + sigH / 2 - 4, reg, 7.5, MUTED)
    }
  } else {
    fillRect(cur.page, col2, sigBoxY, sigW, sigH, SURF)
    txt(cur.page, 'Unterschrift / Firma', col2 + 20, sigBoxY + sigH / 2 - 4, reg, 7.5, MUTED)
  }

  // Signature lines
  const lineY = sigBoxY - 6
  hline(cur.page, col1, lineY, col1 + sigW, ROSE, 0.8)
  hline(cur.page, col2, lineY, col2 + sigW, ROSE, 0.8)

  // Names and dates below lines — spaced properly
  txt(cur.page, parent1Full, col1, lineY - 14, reg, 9, BLACK)
  txt(cur.page, `Datum: ${dateStr}`, col1, lineY - 27, reg, 7.5, MUTED)
  txt(cur.page, emisor.nombre, col2, lineY - 14, reg, 9, BLACK)
  txt(cur.page, `Datum: ${dateStr}`, col2, lineY - 27, reg, 7.5, MUTED)

  cur.y = lineY - 52

  // Binding clause fits directly under signatures — draw on same page, no overflow check

  // ── Binding clause — always on same page as signatures ──────────────────────
  const clauseY = lineY - 70 // fixed position: 70px below signature line
  fillRect(cur.page, ML, clauseY - 6, CW, 36, SURF)
  txt(
    cur.page,
    'Dieser Vertrag wird mit der E-Mail-Kursbestätigung durch Nordkreis rechtsverbindlich. Es wird kein weiterer Vertrag ausgestellt.',
    ML + 6,
    clauseY + 18,
    reg,
    FS_BODY,
    NAVY
  )
  txt(
    cur.page,
    'Este contrato será vinculante con la confirmación por correo electrónico de Nordkreis. No se emitirá ningún contrato adicional.',
    ML + 6,
    clauseY + 5,
    reg,
    FS_SMALL,
    ROSE
  )

  return pdfDoc.save()
}
