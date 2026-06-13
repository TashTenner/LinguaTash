// lib/models/Follower.ts
//
// Follower cache — populated by the sync-followers endpoint and kept current
// via periodic re-syncs. Used by the webhook handler to verify follow status
// before delivering a freebie link.
//
// Only stores platform + userId (the IGSID). Username is optional — useful
// for debugging in the admin dashboard but not required for the follow check.

import mongoose, { Schema, Document, Model } from 'mongoose'
import { Platform } from './MetaInteraction'

export interface IFollower extends Document {
  platform: Platform
  userId: string
  username: string | null
  syncedAt: Date
}

const FollowerSchema = new Schema<IFollower>({
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'whatsapp'] satisfies Platform[],
    required: true,
  },
  userId: { type: String, required: true },
  username: { type: String, default: null },
  syncedAt: { type: Date, required: true },
})

// Fast single-user lookup: "is this IGSID in our follower set?"
FollowerSchema.index({ platform: 1, userId: 1 }, { unique: true })

// Mongoose re-registration guard (hot reload in Next.js dev mode).
export const Follower: Model<IFollower> =
  mongoose.models.Follower ?? mongoose.model<IFollower>('Follower', FollowerSchema)
