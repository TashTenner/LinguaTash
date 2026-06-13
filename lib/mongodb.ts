// lib/mongodb.ts
//
// Cached Mongoose connection for Vercel serverless functions.
// Vercel spins up a new Node process per cold start, but reuses the process
// across warm invocations. Storing the promise on the global object prevents
// opening a new Atlas connection on every request.
//
// Add to .env.local (and Vercel env vars):
//   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI env var is not set')
}

// Extend the global type to hold our cached connection promise.
declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined
}

let cached = global._mongoosePromise

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached) return cached

  cached = global._mongoosePromise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 5, // keep Atlas M0 (500 max) well under limit across Vercel instances
  })

  return cached
}
