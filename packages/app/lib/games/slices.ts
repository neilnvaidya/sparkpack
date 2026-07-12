/**
 * Game slices – the bridge from curriculum packs to playable games.
 *
 * A slice declares which curriculum item kinds it can consume (and how
 * many it needs) and knows how to build that template's content from a
 * pack. One pack can therefore offer several games; the library shows a
 * game card whenever the pack satisfies the slice's requirements.
 */

import type { z } from 'zod'
import {
  type CurriculumPack,
  type CurriculumItem,
  type CurriculumItemKind,
  type EquationItem,
  type McqItem,
} from '@/lib/curriculum/schema'
import { itemsOfKind, itemsByStrand } from '@/lib/curriculum'
import { mathRushContentSchema } from '@/lib/math-rush/content'
import { contentSchema as boardQuizContentSchema } from '@/lib/templates/strategy-board-quiz'
import { flashRoundContentSchema } from '@/lib/templates/flash-round'
import { trueFalseContentSchema } from '@/lib/templates/true-false'
import { threeInARowContentSchema } from '@/lib/templates/three-in-a-row'
import { summitClimbContentSchema } from '@/lib/templates/summit-climb'
import { riskItContentSchema } from '@/lib/templates/risk-it'
import { shuffleDeck } from '@/lib/math-rush/question'

export interface GameSlice {
  templateId: string
  slug: string
  name: string
  tagline: string
  requires: {
    kinds: CurriculumItemKind[]
    min: number
    /** Optional per-difficulty floor; difficulty-2 items backfill short buckets. */
    minPerDifficulty?: Partial<Record<1 | 2 | 3, number>>
  }
  /** Build template content from a pack. Only call when isAvailable(). */
  build: (pack: CurriculumPack) => unknown
}

const POINTS_BY_DIFFICULTY: Record<1 | 2 | 3, number> = {
  1: 100,
  2: 150,
  3: 200,
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

function mcqPromptWithOptions(item: McqItem): string {
  const opts = item.options
    .map((opt, i) => `${OPTION_LETTERS[i]}: ${opt}`)
    .join('   ')
  return `${item.prompt}   ${opts}`
}

/** Prompt/answer view of any item, for Q&A-style games. */
function asQuestionAnswer(item: CurriculumItem): {
  prompt: string
  answer: string
  detail?: string
} {
  switch (item.kind) {
    case 'equation': {
      // Hide the result: "24 + 16 = ?"
      return {
        prompt: `${item.left} ${item.operator} ${item.right} = ?`,
        answer: item.result,
      }
    }
    case 'qa':
      return { prompt: item.prompt, answer: item.answer }
    case 'mcq':
      return {
        prompt: mcqPromptWithOptions(item),
        answer: `${OPTION_LETTERS[item.correctIndex]}: ${item.options[item.correctIndex]}`,
      }
    case 'truefalse':
      return {
        prompt: `True or false: ${item.statement}`,
        answer: item.isTrue ? 'True' : 'False',
      }
  }
}

// ─── Math Rush ────────────────────────────────────────────────────────────────

/** Rotate which single part is hidden so decks feel varied. */
const HIDDEN_PATTERNS: Array<[boolean, boolean, boolean]> = [
  [false, false, true], // 24 + 16 = ?
  [false, true, false], // 24 + ? = 40
  [true, false, false], // ? + 16 = 40
]

function buildMathRush(pack: CurriculumPack): z.infer<typeof mathRushContentSchema> {
  const equations = itemsOfKind(pack, ['equation']) as EquationItem[]
  const questions = equations.map((eq, i) => ({
    id: eq.id,
    points: POINTS_BY_DIFFICULTY[eq.difficulty],
    operator: eq.operator,
    left: eq.left,
    right: eq.right,
    result: eq.result,
    hiddenLeft: HIDDEN_PATTERNS[i % 3][0],
    hiddenRight: HIDDEN_PATTERNS[i % 3][1],
    hiddenResult: HIDDEN_PATTERNS[i % 3][2],
  }))
  return mathRushContentSchema.parse({
    title: pack.title,
    questionsPerRound: 4,
    questions,
  })
}

// ─── Strategy Board Quiz ──────────────────────────────────────────────────────

const BOARD_KINDS: CurriculumItemKind[] = ['qa', 'mcq', 'truefalse']
const BOARD_POINTS = [100, 200, 300, 400]

function buildBoardQuiz(pack: CurriculumPack): z.infer<typeof boardQuizContentSchema> {
  const usable = itemsOfKind(pack, BOARD_KINDS)
  const groups = itemsByStrand(usable, pack.title)

  // Columns = strands with the most items (2–4); rows = what every column can fill (2–4).
  const strands = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4)
  let cols = strands.length
  let rows = Math.min(4, ...strands.map(([, items]) => items.length))

  if (cols < 2 || rows < 2) {
    // Not enough strand structure – chunk everything into even columns.
    cols = Math.min(4, Math.floor(usable.length / 2))
    rows = Math.min(4, Math.floor(usable.length / cols))
    const chunkSize = Math.ceil(usable.length / cols)
    strands.length = 0
    for (let c = 0; c < cols; c++) {
      strands.push([
        `Round ${c + 1}`,
        usable.slice(c * chunkSize, (c + 1) * chunkSize),
      ])
    }
  }

  // Cells are stored row-major: row 0 = lowest points. Within each strand,
  // easier items go in lower-point rows.
  const columns = strands.map(([topic, items]) => ({
    topic,
    items: [...items].sort((a, b) => a.difficulty - b.difficulty).slice(0, rows),
  }))

  const cells = []
  for (let r = 0; r < rows; r++) {
    for (const col of columns) {
      const item = col.items[r]
      const { prompt, answer } = asQuestionAnswer(item)
      const acceptable =
        item.kind === 'qa' ? [item.answer, ...item.acceptableAnswers] : [answer]
      cells.push({
        topic: col.topic,
        points: BOARD_POINTS[r],
        prompt,
        acceptableAnswers: acceptable,
      })
    }
  }

  return boardQuizContentSchema.parse({
    title: pack.title,
    learningFocus: pack.description,
    topics: columns.map((c) => c.topic),
    board: {
      rows,
      cols,
      pointsPerRow: BOARD_POINTS.slice(0, rows),
      cells,
    },
    teacherScript: [
      'Teams take turns to pick a cell from the board.',
      'Read the question aloud and give teams time to discuss.',
      'Award the points for a correct answer; other teams may steal.',
    ],
    studentInstructions: [
      'Pick a category and points value with your team.',
      'Discuss quietly – other teams are listening for a steal!',
    ],
    fastFinisherExtension:
      'Ask the winning team to explain how they solved the hardest question.',
  })
}

// ─── Flash Round ──────────────────────────────────────────────────────────────

const FLASH_KINDS: CurriculumItemKind[] = ['equation', 'qa', 'mcq', 'truefalse']

function buildFlashRound(pack: CurriculumPack): z.infer<typeof flashRoundContentSchema> {
  const items = itemsOfKind(pack, FLASH_KINDS)
  // Easy → hard keeps the round feeling like a ramp-up.
  const sorted = [...items].sort((a, b) => a.difficulty - b.difficulty)
  return flashRoundContentSchema.parse({
    title: pack.title,
    questions: sorted.map((item) => asQuestionAnswer(item)),
  })
}

// ─── True or False Showdown ───────────────────────────────────────────────────

function buildTrueFalse(pack: CurriculumPack): z.infer<typeof trueFalseContentSchema> {
  const items = itemsOfKind(pack, ['truefalse'])
  return trueFalseContentSchema.parse({
    title: pack.title,
    statements: items.flatMap((item) =>
      item.kind === 'truefalse' ? [{ statement: item.statement, isTrue: item.isTrue }] : []
    ),
  })
}

// ─── Three in a Row ───────────────────────────────────────────────────────────

const STRATEGY_KINDS: CurriculumItemKind[] = ['qa', 'mcq', 'truefalse']

function buildThreeInARow(pack: CurriculumPack): z.infer<typeof threeInARowContentSchema> {
  const items = shuffleDeck(itemsOfKind(pack, STRATEGY_KINDS))
  return threeInARowContentSchema.parse({
    title: pack.title,
    questions: items.map((item) => {
      const { prompt, answer } = asQuestionAnswer(item)
      return { prompt, answer }
    }),
  })
}

// ─── Summit Climb ─────────────────────────────────────────────────────────────

function buildSummitClimb(pack: CurriculumPack): z.infer<typeof summitClimbContentSchema> {
  const items = itemsOfKind(pack, STRATEGY_KINDS)
  const diff1 = shuffleDeck(items.filter((i) => i.difficulty === 1))
  const diff3 = shuffleDeck(items.filter((i) => i.difficulty === 3))
  const diff2 = shuffleDeck(items.filter((i) => i.difficulty === 2))

  // Backfill each pool toward 8 with core (difficulty-2) items; split any leftovers.
  const need1 = Math.max(0, 8 - diff1.length)
  const need3 = Math.max(0, 8 - diff3.length)
  const easyItems = [...diff1, ...diff2.slice(0, need1)]
  const hardItems = [...diff3, ...diff2.slice(need1, need1 + need3)]
  const leftover = diff2.slice(need1 + need3)
  leftover.forEach((item, i) => (i % 2 === 0 ? easyItems : hardItems).push(item))

  const toQA = (item: CurriculumItem) => {
    const { prompt, answer } = asQuestionAnswer(item)
    return { prompt, answer }
  }
  return summitClimbContentSchema.parse({
    title: pack.title,
    easy: easyItems.map(toQA),
    hard: hardItems.map(toQA),
  })
}

// ─── Risk It ──────────────────────────────────────────────────────────────────

function buildRiskIt(pack: CurriculumPack): z.infer<typeof riskItContentSchema> {
  const usable = itemsOfKind(pack, STRATEGY_KINDS)
  const groups = [...itemsByStrand(usable, pack.title).values()].map((list) => shuffleDeck(list))

  // Round-robin across strands so the ten questions span the topic.
  const picked: CurriculumItem[] = []
  let progressed = true
  while (picked.length < 10 && progressed) {
    progressed = false
    for (const list of groups) {
      const item = list.shift()
      if (item) {
        picked.push(item)
        progressed = true
        if (picked.length >= 10) break
      }
    }
  }

  return riskItContentSchema.parse({
    title: pack.title,
    questions: picked.slice(0, 10).map((item) => {
      const { prompt, answer } = asQuestionAnswer(item)
      return { prompt, answer, hint: item.strand ?? pack.title }
    }),
  })
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const GAME_SLICES: GameSlice[] = [
  {
    templateId: 'math_rush',
    slug: 'math-rush',
    name: 'Math Rush',
    tagline: 'Teams race to claim number-sentence bounties',
    requires: { kinds: ['equation'], min: 6 },
    build: buildMathRush,
  },
  {
    templateId: 'strategy_board_quiz',
    slug: 'strategy-board-quiz',
    name: 'Strategy Board Quiz',
    tagline: 'Jeopardy-style board with steals',
    requires: { kinds: BOARD_KINDS, min: 8 },
    build: buildBoardQuiz,
  },
  {
    templateId: 'flash_round',
    slug: 'flash-round',
    name: 'Flash Round',
    tagline: 'Rapid-fire questions, first team to answer scores',
    requires: { kinds: FLASH_KINDS, min: 5 },
    build: buildFlashRound,
  },
  {
    templateId: 'true_false_showdown',
    slug: 'true-false-showdown',
    name: 'True or False Showdown',
    tagline: 'Commit to TRUE or FALSE before the reveal',
    requires: { kinds: ['truefalse'], min: 5 },
    build: buildTrueFalse,
  },
  {
    templateId: 'three_in_a_row',
    slug: 'three-in-a-row',
    name: 'Three in a Row',
    tagline: 'Claim squares to line up three in your colour',
    requires: { kinds: STRATEGY_KINDS, min: 16 },
    build: buildThreeInARow,
  },
  {
    templateId: 'summit_climb',
    slug: 'summit-climb',
    name: 'Summit Climb',
    tagline: 'Play it safe or gamble on hard questions to climb faster',
    requires: { kinds: STRATEGY_KINDS, min: 16, minPerDifficulty: { 1: 8, 3: 8 } },
    build: buildSummitClimb,
  },
  {
    templateId: 'risk_it',
    slug: 'risk-it',
    name: 'Risk It',
    tagline: 'Wager points on how sure you are before each question',
    requires: { kinds: STRATEGY_KINDS, min: 10 },
    build: buildRiskIt,
  },
]

export function usableItemCount(pack: CurriculumPack, slice: GameSlice): number {
  return itemsOfKind(pack, slice.requires.kinds).length
}

export function isSliceAvailable(pack: CurriculumPack, slice: GameSlice): boolean {
  const usable = itemsOfKind(pack, slice.requires.kinds)
  if (usable.length < slice.requires.min) return false

  const perDiff = slice.requires.minPerDifficulty
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

export function availableSlices(pack: CurriculumPack): GameSlice[] {
  return GAME_SLICES.filter((slice) => isSliceAvailable(pack, slice))
}
