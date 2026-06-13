// app/api/metatrigger/sync-followers/route.ts
//
// Populates and refreshes the Follower MongoDB collection from Instagram's
// followers list. Must be run at least once before the follow-gate can work.
//
// Protected by CRON_SECRET — same pattern as Nordkreis cron endpoints.
//
// Run manually to seed the cache before going live:
//   curl -X POST https://linguatash.com/api/metatrigger/sync-followers \
//     -H "Authorization: Bearer YOUR_CRON_SECRET"
//
// To keep the cache current automatically, add to vercel.json:
//   {
//     "crons": [{
//       "path": "/api/metatrigger/sync-followers",
//       "schedule": "0 * * * *"
//     }]
//   }
// (runs hourly — sufficient because the follow check has a few-minute tolerance)

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Follower } from '@/lib/models/Follower'
import { streamFollowers } from '@/lib/metatrigger/instagram'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToDatabase()

  const syncedAt = new Date()
  let synced = 0

  for await (const follower of streamFollowers()) {
    await Follower.findOneAndUpdate(
      { platform: 'instagram', userId: follower.id },
      { platform: 'instagram', userId: follower.id, username: follower.username, syncedAt },
      { upsert: true }
    )
    synced++
  }

  // Remove anyone whose syncedAt wasn't updated — they unfollowed since last sync.
  const { deletedCount } = await Follower.deleteMany({
    platform: 'instagram',
    syncedAt: { $lt: syncedAt },
  })

  return NextResponse.json({ synced, removed: deletedCount })
}
