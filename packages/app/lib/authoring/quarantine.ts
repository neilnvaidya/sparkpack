/**
 * Form-resistant questions — Docs/CONTENT-PASS-PLAN.md, step 3b.
 *
 * Some facts genuinely resist a form: "Name the four countries of the UK" cannot
 * be MCQ or true/false without becoming a different question. Rather than let a
 * permanently-open-only question sit in a corpus whose value is uniformity, it is
 * pulled out and parked here — not deleted, not shipped — awaiting the future
 * "pick all that are correct" multi-select form.
 *
 * Because these leave the packs, `forms.length === 3` can become a blanket rule
 * with no per-question opt-out (step 5).
 *
 * THIS FILE LIVES OUTSIDE lib/curriculum/packs/. It has to: validate-packs.mjs
 * globs that directory and Zod-parses everything in it as a pack, so a quarantine
 * file there would fail the build on sight. It is never imported by the app.
 */

import { z } from 'zod'
import { curriculumQuestionSchema, subjectSchema } from '@/lib/curriculum/schema'

export const QUARANTINE_PATH = 'content-quarantine/form-resistant.json'

/**
 * A quarantined question keeps full provenance. A quarantined question with no
 * route home is a deleted question with extra steps.
 */
export const quarantinedQuestionSchema = z.object({
  question: curriculumQuestionSchema,
  subject: subjectSchema,
  year: z.number().int().min(1).max(6),
  topicId: z.string(),
  /** The pack it was pulled from, so it can be put back. */
  packId: z.string(),
  /**
   * Which forms it resists and why. This is the design input for the fourth
   * form — arguably worth more than the question itself, since it is what tells
   * you what multi-select has to handle.
   */
  reason: z.string().min(1),
  quarantinedAt: z.string(),
})

export type QuarantinedQuestion = z.infer<typeof quarantinedQuestionSchema>

export const quarantineFileSchema = z.object({
  note: z.string(),
  questions: z.array(quarantinedQuestionSchema),
})

export type QuarantineFile = z.infer<typeof quarantineFileSchema>

export const EMPTY_QUARANTINE: QuarantineFile = {
  note: 'Form-resistant questions pulled from packs during the 3b content pass. Not shipped, not deleted — awaiting a "pick all that are correct" multi-select form. See Docs/CONTENT-PASS-PLAN.md.',
  questions: [],
}

export function serializeQuarantine(file: QuarantineFile): string {
  return JSON.stringify(file, null, 2) + '\n'
}
