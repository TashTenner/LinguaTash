// lib/models/MetaInteraction.ts
//
// Records each time a user triggers a keyword on Instagram, Facebook, or WhatsApp.
// Used for deduplication (never reply twice) and for the admin dashboard.
//
// GDPR-minimal: we store only what's needed to operate the automation.
// No names, message content, or profile data beyond the platform user ID.

import mongoose, { Schema, Document, Model } from 'mongoose'

export type Platform = 'instagram' | 'facebook' | 'whatsapp'

// awaiting_follow: DM sent with follow prompt, waiting for user to tap the button
// fulfilled: freebie link has been delivered
export type InteractionStatus = 'awaiting_follow' | 'fulfilled'

export interface IMetaInteraction extends Document {
  platform: Platform
  userId: string        // platform-specific user ID (e.g. Instagram IGSID)
  keyword: string       // uppercased keyword that was matched, e.g. "HAFEN"
  status: InteractionStatus
  lastTriggeredAt: Date
  fulfilledAt: Date | null  // set when status transitions to 'fulfilled'
  createdAt: Date
  updatedAt: Date
}

const MetaInteractionSchema = new Schema<IMetaInteraction>(
  {
    platform: {
      type: String,
      enum: ['instagram', 'facebook', 'whatsapp'] satisfies Platform[],
      required: true,
    },
    userId: { type: String, required: true },
    keyword: { type: String, required: true, uppercase: true },
    status: {
      type: String,
      enum: ['awaiting_follow', 'fulfilled'] satisfies InteractionStatus[],
      default: 'awaiting_follow',
    },
    lastTriggeredAt: { type: Date, required: true },
    fulfilledAt: { type: Date, default: null },
  },
  { timestamps: true }
)

// Primary lookup: "has this user already triggered this keyword on this platform?"
MetaInteractionSchema.index({ platform: 1, userId: 1, keyword: 1 }, { unique: true })

// Allows the admin dashboard to sort/filter by recency efficiently.
MetaInteractionSchema.index({ lastTriggeredAt: -1 })

// Mongoose re-registration guard (hot reload in Next.js dev mode).
export const MetaInteraction: Model<IMetaInteraction> =
  mongoose.models.MetaInteraction ??
  mongoose.model<IMetaInteraction>('MetaInteraction', MetaInteractionSchema)
