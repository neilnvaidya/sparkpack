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
  CurriculumItem,
  CurriculumItemKind,
  CurriculumPack,
} from '@/lib/curriculum/schema'

export const BOARD_KINDS: CurriculumItemKind[] = ['qa', 'mcq', 'truefalse']
export const FLASH_KINDS: CurriculumItemKind[] = ['equation', 'qa', 'mcq', 'truefalse']
export const STRATEGY_KINDS: CurriculumItemKind[] = ['qa', 'mcq', 'truefalse']

export interface SliceRequirement {
  kinds: CurriculumItemKind[]
  min: number
  /** Optional per-difficulty floor; difficulty-2 items backfill short buckets. */
  minPerDifficulty?: Partial<Record<1 | 2 | 3, number>>
}

export interface GameSliceMeta {
  templateId: string
  slug: string
  name: string
  tagline: string
  requires: SliceRequirement
}

/** Items of the given kinds, in pack order. */
export function itemsMatchingKinds(
  pack: CurriculumPack,
  kinds: CurriculumItemKind[]
): CurriculumItem[] {
  return pack.items.filter((item) => kinds.includes(item.kind))
}

export function isRequirementMet(pack: CurriculumPack, requires: SliceRequirement): boolean {
  const usable = itemsMatchingKinds(pack, requires.kinds)
  if (usable.length < requires.min) return false

  const perDiff = requires.minPerDifficulty
  if (perDiff) {
    const count = (d: 1 | 2 | 3) => usable.filter((i) => i.difficulty === d).length
    let backfill = count(2)
    for (const d of [1, 3] as const) {
      const need = perDiff[d] ?? 0
      const have = count(d)
      if (have >= need) continue
      const shortfall = need - have
      if (shortfall > backfill) return false
      backfill -= shortfall
    }
  }
  return true
}

export const GAME_SLICE_META: GameSliceMeta[] = [
  {
    templateId: 'question_rush',
    slug: 'question-rush',
    name: 'Question Rush',
    tagline: 'Three cards at once — call the colour, claim the card',
    // Any kind: this used to be equation-only, which meant 4 packs of 19.
    requires: { kinds: FLASH_KINDS, min: 6 },
  },
  {
    templateId: 'strategy_board_quiz',
    slug: 'strategy-board-quiz',
    name: 'Strategy Board Quiz',
    tagline: 'Jeopardy-style board with steals',
    requires: { kinds: BOARD_KINDS, min: 8 },
  },
  {
    templateId: 'flash_round',
    slug: 'flash-round',
    name: 'Flash Round',
    tagline: 'Rapid-fire questions, first team to answer scores',
    requires: { kinds: FLASH_KINDS, min: 5 },
  },
  {
    templateId: 'true_false_showdown',
    slug: 'true-false-showdown',
    name: 'True or False Showdown',
    tagline: 'Commit to TRUE or FALSE before the reveal',
    requires: { kinds: ['truefalse'], min: 5 },
  },
  {
    templateId: 'three_in_a_row',
    slug: 'three-in-a-row',
    name: 'Three in a Row',
    tagline: 'Claim squares to line up three in your colour',
    requires: { kinds: STRATEGY_KINDS, min: 16 },
  },
  {
    templateId: 'summit_climb',
    slug: 'summit-climb',
    name: 'Summit Climb',
    tagline: 'Play it safe or gamble on hard questions to climb faster',
    requires: { kinds: STRATEGY_KINDS, min: 16, minPerDifficulty: { 1: 8, 3: 8 } },
  },
  {
    templateId: 'risk_it',
    slug: 'risk-it',
    name: 'Risk It',
    tagline: 'Wager points on how sure you are before each question',
    requires: { kinds: STRATEGY_KINDS, min: 10 },
  },
]
