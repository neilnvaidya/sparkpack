/**
 * Stable serialisation for pack JSON.
 *
 * Every write goes through here so a save produces a reviewable `git diff` and
 * nothing else. Without a fixed key order, JSON.stringify would reorder keys on
 * whatever the editor happened to build, and every save would be a noise diff —
 * which matters, because `git diff` is the second review surface for the content
 * pass after the tool itself.
 *
 * The order matches the one declared in Docs/CONTENT-RULES.md.
 */

import type { CurriculumPack, CurriculumQuestion } from '@/lib/curriculum/schema'

const QUESTION_KEY_ORDER: (keyof CurriculumQuestion)[] = [
  'id',
  'factKey',
  'difficulty',
  'strand',
  'objectiveCodes',
  'forms',
  'ask',
  'claim',
  'claimIsTrue',
  'answer',
  'answerDetail',
  'acceptableAnswers',
  'distractors',
  'equation',
]

const PACK_KEY_ORDER: (keyof CurriculumPack)[] = [
  'schemaVersion',
  'id',
  'subject',
  'keyStage',
  'year',
  'topicId',
  'title',
  'description',
  'objectives',
  'questions',
]

function ordered<T extends object>(obj: T, keys: (keyof T)[]): T {
  const out = {} as T
  for (const key of keys) {
    if (key in obj) out[key] = obj[key]
  }
  // Anything not in the declared order still gets written — losing a key
  // silently would be far worse than an out-of-order diff.
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (!keys.includes(key)) out[key] = obj[key]
  }
  return out
}

export function orderQuestion(q: CurriculumQuestion): CurriculumQuestion {
  return ordered(q, QUESTION_KEY_ORDER)
}

/** Canonical pack JSON: declared key order, 2-space indent, trailing newline. */
export function serializePack(pack: CurriculumPack): string {
  const shaped = ordered(pack, PACK_KEY_ORDER)
  shaped.questions = pack.questions.map(orderQuestion)
  return JSON.stringify(shaped, null, 2) + '\n'
}

/**
 * A blank question in the CONTENT-RULES shape — every key present, blanks as
 * "", [] or null. Seeds "add question" in the tool and the 3b skeleton files.
 *
 * `factKey` defaults to the id, meaning "its own fact" (CONTENT-RULES).
 */
export function blankQuestion(id: string): CurriculumQuestion {
  return {
    id,
    factKey: id,
    difficulty: 2,
    strand: '',
    objectiveCodes: [],
    forms: ['open'],
    ask: '',
    claim: '',
    claimIsTrue: null,
    answer: '',
    answerDetail: '',
    acceptableAnswers: [],
    distractors: [],
    equation: null,
  }
}
