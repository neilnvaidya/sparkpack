/**
 * Game slice requirements – what each game needs from a pack.
 *
 * Split out from `slices.ts` so tooling can read it. `slices.ts` pulls in the
 * template modules, which import React components; this module is deliberately
 * runtime-dependency-free (type-only imports, no JSON, no components) so
 * `scripts/validate-packs.mjs` can import it under plain Node. Keep it that way:
 * anything imported here must be strippable or the validator breaks.
 *
 * This is the single source of truth for availability. `slices.ts` attaches the
 * builders; the validator reports against the same data.
 */

import type {
  CurriculumPack,
  CurriculumQuestion,
  QuestionForm,
} from '@/lib/curriculum/schema'

export const ALL_FORMS: QuestionForm[] = ['open', 'mcq', 'truefalse']

export interface SliceRequirement {
  /** A question counts if it offers any of these forms. */
  forms: QuestionForm[]
  min: number
  /**
   * Exclude number sentences. Board-style games want prose with a strand to
   * file under; `forms` cannot express this, because an equation and a plain
   * question both declare `open`.
   */
  textOnly?: boolean
  /**
   * Whether a slice may deal two questions that share a `factKey` — i.e. two
   * forms of the same fact. Default `'distinct'`: at most one question per
   * factKey, so a game never gives away one question by asking another.
   * `'forms'` (only Three in a Row) allows the same fact to reappear, because
   * that game fills 16 cells from fewer facts by showing some twice in
   * different forms — a deliberate, named exception, not a loophole.
   */
  factReuse?: 'distinct' | 'forms'
}

export interface GameSliceMeta {
  templateId: string
  slug: string
  name: string
  tagline: string
  requires: SliceRequirement
}

/** Questions a requirement can actually use, in pack order. */
export function questionsMatching(
  pack: CurriculumPack,
  requires: SliceRequirement
): CurriculumQuestion[] {
  const matching = pack.questions.filter(
    (q) =>
      (!requires.textOnly || q.equation === null) &&
      q.forms.some((f) => requires.forms.includes(f))
  )
  if (requires.factReuse === 'forms') return matching

  // Default: at most one question per factKey, so a slice can never deal two
  // askings of the same fact — the entire point of authoring a shared factKey.
  const seen = new Set<string>()
  return matching.filter((q) => {
    if (seen.has(q.factKey)) return false
    seen.add(q.factKey)
    return true
  })
}

export function isRequirementMet(pack: CurriculumPack, requires: SliceRequirement): boolean {
  return questionsMatching(pack, requires).length >= requires.min
}

export const GAME_SLICE_META: GameSliceMeta[] = [
  {
    templateId: 'question_rush',
    slug: 'question-rush',
    name: 'Question Rush',
    tagline: 'Three cards at once — call the colour, claim the card',
    // Any kind: this used to be equation-only, which meant 4 packs of 19.
    requires: { forms: ALL_FORMS, min: 6 },
  },
  {
    templateId: 'strategy_board_quiz',
    slug: 'strategy-board-quiz',
    name: 'Strategy Board Quiz',
    tagline: 'Jeopardy-style board with steals',
    requires: { forms: ALL_FORMS, min: 8, textOnly: true },
  },
  {
    templateId: 'flash_round',
    slug: 'flash-round',
    name: 'Flash Round',
    tagline: 'Rapid-fire questions, first team to answer scores',
    requires: { forms: ALL_FORMS, min: 5 },
  },
  {
    templateId: 'true_false_showdown',
    slug: 'true-false-showdown',
    name: 'True or False Showdown',
    tagline: 'Commit to TRUE or FALSE before the reveal',
    requires: { forms: ['truefalse'], min: 5 },
  },
  {
    templateId: 'three_in_a_row',
    slug: 'three-in-a-row',
    name: 'Three in a Row',
    tagline: 'Claim squares to line up three in your colour',
    // Allowed to fill its 16 cells from fewer facts by showing some twice in
    // different forms — see SliceRequirement.factReuse.
    requires: { forms: ALL_FORMS, min: 16, textOnly: true, factReuse: 'forms' },
  },
  {
    templateId: 'summit_climb',
    slug: 'summit-climb',
    name: 'Summit Climb',
    tagline: 'Play it safe or gamble on hard questions to climb faster',
    // 16 splits into two pools of 8. There is no per-difficulty floor any more:
    // steady vs risky is how a question is asked, not which questions the pack
    // happens to own, so no pack can be short of "easy content".
    requires: { forms: ALL_FORMS, min: 16, textOnly: true },
  },
  {
    templateId: 'risk_it',
    slug: 'risk-it',
    name: 'Risk It',
    tagline: 'Wager points on how sure you are before each question',
    requires: { forms: ALL_FORMS, min: 10, textOnly: true },
  },
]
