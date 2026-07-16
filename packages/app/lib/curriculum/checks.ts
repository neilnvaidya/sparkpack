/**
 * Content checks that a machine can make but Zod cannot express.
 *
 * Zod validates one question's shape. These look at the relationship between an
 * authored sentence and its answer set — the place CONTENT-RULES puts the load
 * ("every distractor must be independently and unambiguously wrong", "every
 * distractor must read correctly inside the claim frame") and the place it
 * admits a machine cannot follow.
 *
 * Pure and React-free: `scripts/validate-packs.mjs` imports this under plain
 * Node, same as slice-requirements.ts. Keep it dependency-free.
 */

import type { CurriculumQuestion } from '@/lib/curriculum/schema'

/**
 * An `ask` that offers its own candidates: "Which is bigger: 1/3, or 1/4?",
 * "Out of the Sun, a torch and a mirror...", "Between 'apple' and 'orange'...".
 *
 * The marker is what separates a closed set from an arithmetic prompt. "What is
 * 18 - 9?" also contains its own answer, but 18 and 9 are operands, not
 * candidates, and `18` is a perfectly good distractor there.
 */
const ENUMERATION_MARKERS = [/\bor\b/i, /\bout of\b/i, /\bbetween\b/i]

/**
 * Whether `text` contains `token` as a standalone value.
 *
 * The boundaries exclude `/` and `.` as well as word characters, so `1/3` does
 * not match inside `11/3` and `9` does not match inside `1/9`.
 */
function namesValue(text: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\w/.])${escaped}(?![\\w/.])`, 'i').test(text)
}

export interface EnumeratedAskIssue {
  questionId: string
  ask: string
  /** Distractors the `ask` actually offers as candidates. */
  inSet: string[]
  /** Distractors that are not candidates the `ask` offered. The defect. */
  escapes: string[]
}

/**
 * Find questions whose `ask` names a closed set of candidates while their
 * `distractors` reach outside it.
 *
 * Why this is a defect rather than a style note: MCQ renders `ask` verbatim and
 * draws three distractors, so the question names two candidates and then puts
 * four options on the board. At best that is incoherent. At worst it is wrong —
 * "Which is bigger: 1/3, or 1/4?" drew `1/2` as an option and still marked
 * `1/3` correct, so a pupil who picked the genuinely largest option was marked
 * wrong.
 *
 * This was invisible while every question was dealt `open`, because `open` shows
 * no options and the escaping distractors never rendered.
 *
 * Returns one issue per offending question, in pack order.
 */
export function enumeratedAskIssues(
  questions: readonly CurriculumQuestion[]
): EnumeratedAskIssue[] {
  const issues: EnumeratedAskIssue[] = []
  for (const q of questions) {
    if (q.equation) continue
    const { ask } = q
    if (!ENUMERATION_MARKERS.some((m) => m.test(ask))) continue
    // The ask must offer the correct answer as one of its candidates, or it is
    // not presenting a closed set to choose from.
    if (!namesValue(ask, q.answer)) continue

    const inSet = q.distractors.filter((d) => namesValue(ask, d))
    const escapes = q.distractors.filter((d) => !namesValue(ask, d))
    // Needs at least one named distractor: otherwise the answer's appearance is
    // incidental ("Do we use 'a' or 'an' before a vowel sound?" names `an`
    // because that is the fact, not because it is offering a menu).
    if (inSet.length === 0 || escapes.length === 0) continue

    issues.push({ questionId: q.id, ask, inSet, escapes })
  }
  return issues
}
