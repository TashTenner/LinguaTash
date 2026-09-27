// lib/models/IssuedInvoice.ts
//
// One record per invoice the website issues, and the counters behind their
// numbers. Spanish invoices must be numbered consecutively within a series,
// with no gaps and no repeats, so a number is only ever taken once per
// payment: a retry of the same Stripe event finds its record and reuses it.

import mongoose, { Schema, Document, Model } from 'mongoose'

/** NK = Nordkreis, NK-R = Nordkreis rectificativas, RES = Resuena (salten) */
export type InvoiceSeries = 'NK' | 'NK-R' | 'RES'

// reserved: the number is taken, the invoice is being produced
// sent: the invoice reached the customer; a retry must not send it again
export type IssuedInvoiceStatus = 'reserved' | 'sent'

export interface IIssuedInvoice extends Document {
  /** What the invoice is for, e.g. "stripe:in_123". Unique: one invoice per payment. */
  key: string
  series: InvoiceSeries
  /** e.g. "NK-2026-0005". Null only for the moment between claiming and numbering. */
  number: string | null
  /** YYYY-MM-DD in Madrid, fixed at claim so a retry prints the same date. */
  issueDate: string
  status: IssuedInvoiceStatus
  sentAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const IssuedInvoiceSchema = new Schema<IIssuedInvoice>(
  {
    key: { type: String, required: true, unique: true },
    series: { type: String, enum: ['NK', 'NK-R', 'RES'] satisfies InvoiceSeries[], required: true },
    number: { type: String, default: null },
    issueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['reserved', 'sent'] satisfies IssuedInvoiceStatus[],
      default: 'reserved',
    },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
)

// A number can never belong to two invoices, whatever goes wrong upstream.
IssuedInvoiceSchema.index(
  { number: 1 },
  { unique: true, partialFilterExpression: { number: { $type: 'string' } } }
)

export const IssuedInvoice: Model<IIssuedInvoice> =
  mongoose.models.IssuedInvoice ??
  mongoose.model<IIssuedInvoice>('IssuedInvoice', IssuedInvoiceSchema)

// ── Counters ──────────────────────────────────────────────────────────────────

export interface IInvoiceCounter {
  /** Series and year, e.g. "NK-2026". Numbering restarts each year. */
  _id: string
  seq: number
}

const InvoiceCounterSchema = new Schema<IInvoiceCounter>({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
})

export const InvoiceCounter: Model<IInvoiceCounter> =
  mongoose.models.InvoiceCounter ??
  mongoose.model<IInvoiceCounter>('InvoiceCounter', InvoiceCounterSchema)
