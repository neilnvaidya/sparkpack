/**
 * POST /api/dev/quarantine — move a form-resistant question out of its pack.
 *
 * One operation, deliberately: pulling from the pack and appending to the
 * quarantine file must not be two calls the UI can half-complete. A crash
 * between them either loses the question or ships it twice.
 *
 * Order matters — append to quarantine FIRST, then rewrite the pack. If the
 * second write fails the question exists in both places, which review will
 * catch. The reverse loses it.
 *
 * Dev-only (see ../guard).
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isDev, notFound } from '../guard'
import { curriculumPackSchema } from '@/lib/curriculum/schema'
import { serializePack } from '@/lib/authoring/serialize'
import { serializeQuarantine } from '@/lib/authoring/quarantine'
import {
  packPath,
  readQuarantine,
  writePackFile,
  writeQuarantine,
} from '@/lib/authoring/fs'
import { readFile } from 'node:fs/promises'

const bodySchema = z.object({
  packId: z.string(),
  questionId: z.string(),
  reason: z.string().min(1, 'A reason is required — it is the design input for the fourth form'),
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isDev) return notFound()

  const parsedBody = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues.map((i) => i.message).join('; ') },
      { status: 400 }
    )
  }
  const { packId, questionId, reason } = parsedBody.data

  try {
    const raw = JSON.parse(await readFile(packPath(packId), 'utf8'))
    const pack = curriculumPackSchema.parse(raw)

    const question = pack.questions.find((q) => q.id === questionId)
    if (!question) {
      return NextResponse.json({ error: `No question "${questionId}" in ${packId}` }, { status: 404 })
    }
    if (pack.questions.length === 1) {
      return NextResponse.json(
        { error: 'Cannot quarantine the last question — a pack needs at least one.' },
        { status: 400 }
      )
    }

    const quarantine = await readQuarantine()
    quarantine.questions.push({
      question,
      subject: pack.subject,
      year: pack.year,
      topicId: pack.topicId,
      packId: pack.id,
      reason,
      quarantinedAt: new Date().toISOString(),
    })
    await writeQuarantine(serializeQuarantine(quarantine))

    const next = { ...pack, questions: pack.questions.filter((q) => q.id !== questionId) }
    await writePackFile(packId, serializePack(curriculumPackSchema.parse(next)))

    return NextResponse.json({ ok: true, remaining: next.questions.length })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
