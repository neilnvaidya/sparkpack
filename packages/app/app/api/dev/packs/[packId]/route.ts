/**
 * POST /api/dev/packs/[packId] — write a pack back to disk.
 *
 * The Zod parse is the gate: a pack that fails validation NEVER reaches disk, so
 * the worst the tool can do is refuse to save. That property is what makes it
 * safe to point at the corpus at all.
 *
 * Dev-only (see ../../guard).
 */

import { NextResponse } from 'next/server'
import { isDev, notFound } from '../../guard'
import { curriculumPackSchema } from '@/lib/curriculum/schema'
import { serializePack } from '@/lib/authoring/serialize-pack'
import { packPath, writePackFile } from '@/lib/authoring/fs'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ packId: string }> }
) {
  if (!isDev) return notFound()

  const { packId } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body is not JSON' }, { status: 400 })
  }

  const parsed = curriculumPackSchema.safeParse(body)
  if (!parsed.success) {
    // Flatten to something a human can act on in the editor, rather than
    // Zod's nested tree.
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    }))
    return NextResponse.json({ error: 'Pack is invalid — nothing written', issues }, { status: 422 })
  }

  if (parsed.data.id !== packId) {
    return NextResponse.json(
      { error: `Pack id "${parsed.data.id}" does not match route "${packId}"` },
      { status: 400 }
    )
  }

  try {
    // packPath re-validates the id shape before it touches the filesystem.
    packPath(packId)
    await writePackFile(packId, await serializePack(parsed.data))
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, questions: parsed.data.questions.length })
}
