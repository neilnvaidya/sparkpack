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

/**
 * Preference ladders. `renderBest` takes the first form a question offers, so
 * order is the whole meaning: EASIEST_FIRST silently makes a question easier
 * where it can, HARDEST_FIRST does the opposite.
 *
 * Until the 3b content pass, most questions offer exactly one form, so both
 * ladders collapse to "whatever it offers". They only bite once a question can
 * actually be asked three ways.
 */
export const EASIEST_FIRST: QuestionForm[] = ['truefalse', 'mcq', 'open']
export const HARDEST_FIRST: QuestionForm[] = ['open', 'mcq', 'truefalse']

/** The easiest form a question currently offers — its position on the ladder. */
export function easiestForm(forms: QuestionForm[]): QuestionForm {
  return [...forms].sort((a, b) => FORM_RANK[a] - FORM_RANK[b])[0]
}
