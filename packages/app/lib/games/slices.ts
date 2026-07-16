/**
 * Game slices – the bridge from curriculum packs to playable games.
 *
 * A slice declares which curriculum item kinds it can consume (and how
 * many it needs) and knows how to build that template's content from a
 * pack. One pack can therefore offer several games; the library shows a
 * game card whenever the pack satisfies the slice's requirements.
 */

import type { z } from 'zod'
import type { CurriculumPack, CurriculumQuestion } from '@/lib/curriculum/schema'
import { textQuestions, questionsWithForm, questionsByStrand } from '@/lib/curriculum'
import { renderQuestion, renderBest, soleForm, formatEquation } from '@/lib/questions/render'
import { CARD_COLOR_OPTIONS } from '@/lib/constants/team-colors'
import {
  GAME_SLICE_META,
  isRequirementMet,
  questionsMatching,
  type GameSliceMeta,
} from '@/lib/games/slice-requirements'
import { questionRushContentSchema } from '@/lib/question-rush/content'
import { contentSchema as boardQuizContentSchema } from '@/lib/templates/strategy-board-quiz'
import { flashRoundContentSchema } from '@/lib/templates/flash-round'
import { trueFalseContentSchema } from '@/lib/templates/true-false'
import { threeInARowContentSchema } from '@/lib/templates/three-in-a-row'
import { summitClimbContentSchema } from '@/lib/templates/summit-climb'
import { riskItContentSchema } from '@/lib/templates/risk-it'
import { shuffleDeck } from '@/lib/question-rush/question'

export interface GameSlice extends GameSliceMeta {
  /** Build template content from a pack. Only call when isAvailable(). */
  build: (pack: CurriculumPack) => unknown
}

const POINTS_BY_DIFFICULTY: Record<1 | 2 | 3, number> = {
  1: 100,
  2: 150,
  3: 200,
}

// ─── Question Rush ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Rotate which single part is hidden so decks feel varied. One unknown, always. */
const HIDDEN_PARTS = ['result', 'right', 'left'] as const

/** Cards are named by colour, so a round can hold as many as there are colours. */
const RUSH_CARDS_PER_ROUND = CARD_COLOR_OPTIONS.length

function equationCard(q: CurriculumQuestion, i: number) {
  const equation = q.equation!
  const hidden = HIDDEN_PARTS[i % HIDDEN_PARTS.length]
  return {
    prompt: formatEquation(equation, hidden),
    answer: equation[hidden],
    equation: { ...equation, hidden },
  }
}

function buildQuestionRush(pack: CurriculumPack): z.infer<typeof questionRushContentSchema> {
  let equationIndex = 0
  const questions = pack.questions.map((q) => {
    const base = { id: q.id, points: POINTS_BY_DIFFICULTY[q.difficulty] }
    if (q.equation) {
      const card = equationCard(q, equationIndex++)
      return {
        ...base,
        ...renderQuestion(q, 'open'),
        prompt: card.prompt,
        answer: card.answer,
        acceptableAnswers: [card.answer],
        equation: card.equation,
      }
    }
    return { ...base, ...renderQuestion(q, soleForm(q)) }
  })

  return questionRushContentSchema.parse({
    title: pack.title,
    questionsPerRound: RUSH_CARDS_PER_ROUND,
    questions,
  })
}

// ─── Strategy Board Quiz ──────────────────────────────────────────────────────

const BOARD_POINTS = [100, 200, 300, 400]

function buildBoardQuiz(pack: CurriculumPack): z.infer<typeof boardQuizContentSchema> {
  const usable = textQuestions(pack)
  const groups = questionsByStrand(usable, pack.title)

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
      cells.push({
        topic: col.topic,
        points: BOARD_POINTS[r],
        question: renderQuestion(col.items[r], soleForm(col.items[r])),
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

function buildFlashRound(pack: CurriculumPack): z.infer<typeof flashRoundContentSchema> {
  // Easy → hard keeps the round feeling like a ramp-up.
  const sorted = [...pack.questions].sort((a, b) => a.difficulty - b.difficulty)
  return flashRoundContentSchema.parse({
    title: pack.title,
    questions: sorted.map((q) => renderQuestion(q, soleForm(q))),
  })
}

// ─── True or False Showdown ───────────────────────────────────────────────────

function buildTrueFalse(pack: CurriculumPack): z.infer<typeof trueFalseContentSchema> {
  const usable = questionsWithForm(pack, ['truefalse'])
  return trueFalseContentSchema.parse({
    title: pack.title,
    questions: usable.map((q) => renderQuestion(q, 'truefalse')),
  })
}

// ─── Three in a Row ───────────────────────────────────────────────────────────

function buildThreeInARow(pack: CurriculumPack): z.infer<typeof threeInARowContentSchema> {
  const usable = shuffleDeck(textQuestions(pack))
  return threeInARowContentSchema.parse({
    title: pack.title,
    questions: usable.map((q) => renderQuestion(q, soleForm(q))),
  })
}

// ─── Summit Climb ─────────────────────────────────────────────────────────────

function buildSummitClimb(pack: CurriculumPack): z.infer<typeof summitClimbContentSchema> {
  const items = textQuestions(pack)
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

  return summitClimbContentSchema.parse({
    title: pack.title,
    easy: easyItems.map((q) => renderQuestion(q, soleForm(q))),
    hard: hardItems.map((q) => renderQuestion(q, soleForm(q))),
  })
}

// ─── Risk It ──────────────────────────────────────────────────────────────────

function buildRiskIt(pack: CurriculumPack): z.infer<typeof riskItContentSchema> {
  const usable = textQuestions(pack)
  const groups = [...questionsByStrand(usable, pack.title).values()].map((list) => shuffleDeck(list))

  // Round-robin across strands so the ten questions span the topic.
  const picked: CurriculumQuestion[] = []
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
    questions: picked.slice(0, 10).map((q) => ({
      ...renderQuestion(q, soleForm(q)),
      hint: q.strand || pack.title,
    })),
  })
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const BUILDERS: Record<string, (pack: CurriculumPack) => unknown> = {
  question_rush: buildQuestionRush,
  strategy_board_quiz: buildBoardQuiz,
  flash_round: buildFlashRound,
  true_false_showdown: buildTrueFalse,
  three_in_a_row: buildThreeInARow,
  summit_climb: buildSummitClimb,
  risk_it: buildRiskIt,
}

export const GAME_SLICES: GameSlice[] = GAME_SLICE_META.map((meta) => {
  const build = BUILDERS[meta.templateId]
  if (!build) throw new Error(`No builder for game slice "${meta.templateId}"`)
  return { ...meta, build }
})

/** How many questions this pack can actually feed the game — the library's count. */
export function usableItemCount(pack: CurriculumPack, slice: GameSlice): number {
  return questionsMatching(pack, slice.requires).length
}

export function isSliceAvailable(pack: CurriculumPack, slice: GameSlice): boolean {
  return isRequirementMet(pack, slice.requires)
}

export function availableSlices(pack: CurriculumPack): GameSlice[] {
  return GAME_SLICES.filter((slice) => isSliceAvailable(pack, slice))
}
