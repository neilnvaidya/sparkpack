/**
 * Points and ordering, by form.
 *
 * Form IS the difficulty ladder. A fact asked open, with nothing on screen, is
 * harder than the same fact as one of four options, which is harder than the
 * same fact as a 50/50 true-or-false. That is the whole scale — there is no
 * second axis.
 *
 * This replaces `POINTS_BY_DIFFICULTY` and the authored `difficulty` field,
 * which asked an author to rate the intrinsic hardness of a fact independent of
 * how it is asked. Two axes were more precision than the content could carry:
 * see "difficulty is deleted here" in Docs/CONTENT-PASS-PLAN.md.
 *
 * Pure and React-free — the validator imports this under plain Node.
 */

import type { QuestionForm } from '@/lib/curriculum/schema'

/** Values are a first guess; tune after a classroom trial. One file, one edit. */
export const FORM_POINTS: Record<QuestionForm, number> = {
  open: 300,
  mcq: 200,
  truefalse: 100,
}

export function pointsFor(form: QuestionForm): number {
  return FORM_POINTS[form]
}

/** Ascending scaffolding: truefalse (easiest) → open (hardest). */
export const FORM_RANK: Record<QuestionForm, number> = {
  truefalse: 0,
  mcq: 1,
  open: 2,
}

/** The ladder itself, easiest rung first. */
export const FORM_LADDER: QuestionForm[] = ['truefalse', 'mcq', 'open']

/**
 * The form for rung `index` of `count`, spread evenly across the ladder.
 *
 * This is where a game's difficulty gradient comes from now. It used to be read
 * off the question — sort a pack by its forms and the easy ones surfaced first.
 * That only worked while the corpus was half-enriched. Post-3b every question
 * offers all three forms, so *every* question is easy, medium and hard, and any
 * ordering of questions by difficulty is a constant sort. The gradient is a
 * property of the position in the game, and the game must choose it.
 *
 * Rounding rather than truncating means the ends are always hit: rung 0 is the
 * easiest form and rung `count - 1` the hardest, for any count >= 2.
 */
export function formForRung(index: number, count: number): QuestionForm {
  if (count <= 1) return FORM_LADDER[0]
  const top = FORM_LADDER.length - 1
  const clamped = Math.min(Math.max(index, 0), count - 1)
  return FORM_LADDER[Math.round((clamped * top) / (count - 1))]
}

/**
 * Preference order starting at `target`, then the nearest rungs outward.
 *
 * `renderBest` takes the first form a question offers, so order is the whole
 * meaning. Radiating from the target means a question that cannot be asked the
 * chosen way degrades to the closest thing it can, rather than to an arbitrary
 * form at the far end of the ladder.
 */
export function preferFrom(target: QuestionForm): QuestionForm[] {
  return [...FORM_LADDER].sort(
    (a, b) =>
      Math.abs(FORM_RANK[a] - FORM_RANK[target]) -
      Math.abs(FORM_RANK[b] - FORM_RANK[target])
  )
}

/** Ask a question the gentlest / harshest way it can be asked. */
export const EASIEST_FIRST: QuestionForm[] = preferFrom('truefalse')
export const HARDEST_FIRST: QuestionForm[] = preferFrom('open')
