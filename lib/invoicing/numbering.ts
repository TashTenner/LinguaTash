// lib/invoicing/numbering.ts
//
// Consecutive invoice numbers: NK-2026-0001, NK-2026-0002, …
//
// The rule from Spanish invoicing law is "correlativos y sin saltos": within a
// series, no number may be skipped or used twice. Two things break that, and
// this module exists to prevent both:
//
// - Drawing a new number on every attempt. Stripe retries a webhook that fails
//   or times out, and each retry would take another number. So the number is
//   tied to the payment (the key), and a retry gets the same one back.
// - Two deliveries of the same event racing each other. The record is created
//   first, atomically, and only the request that created it takes a number.

import { connectToDatabase } from '@/lib/mongodb'
import {
  IssuedInvoice,
  InvoiceCounter,
  type IIssuedInvoice,
  type InvoiceSeries,
} from '@/lib/models/IssuedInvoice'

/** Today's date in Madrid as YYYY-MM-DD: the date an invoice is issued on. */
export function madridToday(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' })
}

/** How long a record may sit without a number before a retry numbers it itself. */
const STALE_CLAIM_MS = 60_000

/**
 * The invoice number for `key`, taking the next one in the series only if this
 * key has never had one.
 *
 * Returns the record, whose `status` tells the caller whether the invoice was
 * already sent. Throws if another request is numbering the same key right now;
 * the webhook then answers 500 and Stripe retries a little later.
 */
export async function claimInvoiceNumber(
  key: string,
  series: InvoiceSeries,
  issueDate: string = madridToday()
): Promise<IIssuedInvoice> {
  await connectToDatabase()

  const res = await IssuedInvoice.findOneAndUpdate(
    { key },
    { $setOnInsert: { key, series, issueDate, number: null, status: 'reserved' } },
    { upsert: true, new: true, includeResultMetadata: true }
  )
  const record = res.value
  if (!record) throw new Error(`Could not claim invoice record for ${key}`)

  if (record.number) return record

  const createdHere = !res.lastErrorObject?.updatedExisting
  const stale = Date.now() - record.createdAt.getTime() > STALE_CLAIM_MS
  if (!createdHere && !stale) {
    throw new Error(`Invoice ${key} is being numbered by another request`)
  }

  const year = record.issueDate.slice(0, 4)
  const counter = await InvoiceCounter.findOneAndUpdate(
    { _id: `${series}-${year}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  )
  const number = `${series}-${year}-${String(counter.seq).padStart(4, '0')}`

  const numbered = await IssuedInvoice.findOneAndUpdate(
    { key, number: null },
    { $set: { number } },
    { new: true }
  )
  if (!numbered) throw new Error(`Invoice ${key} was numbered concurrently; ${number} is unused`)
  return numbered
}

/** Records that the invoice reached the customer, so a retry won't send it again. */
export async function markInvoiceSent(key: string): Promise<void> {
  await connectToDatabase()
  await IssuedInvoice.updateOne({ key }, { $set: { status: 'sent', sentAt: new Date() } })
}
