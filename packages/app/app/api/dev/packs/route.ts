/**
 * GET /api/dev/packs — every pack, read fresh from disk, for the authoring tool.
 * Dev-only (see ../guard).
 */

import { NextResponse } from 'next/server'
import { isDev, notFound } from '../guard'
import { readAllPacks } from '@/lib/authoring/fs'
import { readQuarantine } from '@/lib/authoring/fs'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isDev) return notFound()
  try {
    const [packs, quarantine] = await Promise.all([readAllPacks(), readQuarantine()])
    return NextResponse.json({ packs, quarantine })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
