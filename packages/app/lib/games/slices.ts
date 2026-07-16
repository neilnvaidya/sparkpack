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
import { questionsByStrand } from '@/lib/curriculum'
import {
  renderQuestion,
  renderBest,
  formatEquation,
  type RenderedQuestion,
} from '@/lib/questions/render'
import {
  pointsFor,
  formForRung,
  preferFrom,
  EASIEST_FIRST,
  HARDEST_FIRST,
} from '@/lib/questions/scoring'
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

const SLICE_META_BY_ID = new Map(GAME_SLICE_META.map((m) => [m.templateId, m]))

/**
 * Ask `q` at rung `index` of `count` on the easy → hard ladder.
 *
 * This is the one place a game's difficulty gradient is decided, and it is
 * decided by POSITION. Sorting questions by difficulty — which is what this
 * replaced — cannot work on an enriched corpus: every question offers all three
 * forms, so every question is simultaneously the easiest and the hardest thing
 * in the pack and any such sort is a constant. What varies is where a question
 * sits in the game, so that is what picks the form.
 */
function renderAtRung(
  q: CurriculumQuestion,
  index: number,
  count: number
): RenderedQuestion {
  const rendered = renderBest(q, preferFrom(formForRung(index, count)))
  if (!rendered) throw new Error(`No usable form for question "${q.id}"`)
  return rendered
}

/**
 * The questions a builder may actually deal — same filtering the availability
 * check uses (lib/games/slice-requirements.ts), so a pack that claims a game is
 * available can always actually build it, and factKey reuse rules apply
 * uniformly rather than being reimplemented per builder.
 */
function poolFor(templateId: string, pack: CurriculumPack): CurriculumQuestion[] {
  const meta = SLICE_META_BY_ID.get(templateId)
  if (!meta) throw new Error(`No slice meta for template "${templateId}"`)
  return questionsMatching(pack, meta.requires)
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
  const questions = poolFor('question_rush', pack).map((q, i) => {
    if (q.equation) {
      // Equations stay open: the game rotates which part is hidden, which is
      // this game's own difficulty variation and does not go through the ladder.
      const card = equationCard(q, equationIndex++)
      return {
        id: q.id,
        points: pointsFor('open'),
        ...renderQuestion(q, 'open'),
        prompt: card.prompt,
        answer: card.answer,
        acceptableAnswers: [card.answer],
        equation: card.equation,
      }
    }
    // Rung within the round, not across the deck: three cards sit face-up at
    // once, so a round should offer a cheap one, a middling one and a dear one
    // to choose between. A ramp across the whole deck would put three
    // equally-hard cards on the table every time.
    const rendered = renderAtRung(q, i % RUSH_CARDS_PER_ROUND, RUSH_CARDS_PER_ROUND)
    // Points follow the form it was actually dealt in, not the question.
    return { id: q.id, points: pointsFor(rendered.form), ...rendered }
  })

  return questionRushContentSchema.parse({
    title: pack.title,
    questionsPerRound: RUSH_CARDS_PER_ROUND,
    questions,
  })
}

// ─── Strategy Board Quiz ──────────────────────────────────────────────────────

/**
 * One row per rung of the ladder, and no more.
 *
 * The board prints its points before anyone picks, so the points column is a
 * promise about difficulty. There are exactly three ways to ask a question, so
 * there are exactly three honest rows: 100 is a true/false, 200 an mcq, 300 an
 * open question. A fourth row had nothing left to be — it dealt a second mcq
 * and charged 400 for it.
 */
const BOARD_POINTS = [100, 200, 300]
const BOARD_MAX_ROWS = BOARD_POINTS.length

function buildBoardQuiz(pack: CurriculumPack): z.infer<typeof boardQuizContentSchema> {
  const usable = poolFor('strategy_board_quiz', pack)
  const groups = questionsByStrand(usable, pack.title)

  // Columns = strands with the most items (2–4); rows = what every column can fill.
  const strands = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4)
  let cols = strands.length
  let rows = Math.min(BOARD_MAX_ROWS, ...strands.map(([, items]) => items.length))

  if (cols < 2 || rows < 2) {
    // Not enough strand structure – chunk everything into even columns.
    cols = Math.min(4, Math.floor(usable.length / 2))
    rows = Math.min(BOARD_MAX_ROWS, Math.floor(usable.length / cols))
    const chunkSize = Math.ceil(usable.length / cols)
    strands.length = 0
    for (let c = 0; c < cols; c++) {
      strands.push([
        `Round ${c + 1}`,
        usable.slice(c * chunkSize, (c + 1) * chunkSize),
      ])
    }
  }

  // Cells are stored row-major: row 0 = lowest points.
  const columns = strands.map(([topic, items]) => ({
    topic,
    items: items.slice(0, rows),
  }))

  const cells = []
  for (let r = 0; r < rows; r++) {
    // The row IS the difficulty. A board prints its points before anyone picks,
    // so the 100 row must genuinely be the gentlest asking and the top row the
    // hardest — otherwise the points column is lying to the teams. Every
    // question can be asked every way, so the row chooses, not the question.
    for (const col of columns) {
      cells.push({
        topic: col.topic,
        points: BOARD_POINTS[r],
        question: renderAtRung(col.items[r], r, rows),
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
  // A genuine ramp: true/false first, open last. This used to sort the pack and
  // hope the easy questions floated up; the ramp is now dealt, not discovered.
  const pool = poolFor('flash_round', pack)
  return flashRoundContentSchema.parse({
    title: pack.title,
    questions: pool.map((q, i) => renderAtRung(q, i, pool.length)),
  })
}

// ─── True or False Showdown ───────────────────────────────────────────────────

function buildTrueFalse(pack: CurriculumPack): z.infer<typeof trueFalseContentSchema> {
  const usable = poolFor('true_false_showdown', pack)
  return trueFalseContentSchema.parse({
    title: pack.title,
    questions: usable.map((q) => renderQuestion(q, 'truefalse')),
  })
}

// ─── Three in a Row ───────────────────────────────────────────────────────────

function buildThreeInARow(pack: CurriculumPack): z.infer<typeof threeInARowContentSchema> {
  // Cells are claimed in any order and all cost the same, so there is no ramp to
  // build — what the grid wants is a spread, so claiming a square is sometimes a
  // gift and sometimes a fight. The deck is shuffled first, so an even walk up
  // the ladder lands the forms in no guessable pattern on the grid.
  const usable = shuffleDeck(poolFor('three_in_a_row', pack))
  return threeInARowContentSchema.parse({
    title: pack.title,
    questions: usable.map((q, i) => renderAtRung(q, i, usable.length)),
  })
}

// ─── Summit Climb ─────────────────────────────────────────────────────────────

/**
 * Steady rungs and risky rungs used to be two pools of CONTENT: the pack had to
 * supply 8 genuinely easy facts and 8 genuinely hard ones, which is why the slice
 * carried a `minPerDifficulty` floor and why one pack could not offer the game.
 *
 * Difficulty is a property of the ASKING now, so any fact can be either rung: a
 * steady one asks it the gentlest way it can be asked, a risky one the hardest.
 * The pools are just a deal — no pack can be short of "easy content" again.
 *
 * This is the one game that wants the ends of the ladder rather than a walk
 * along it, so it asks for a form directly instead of going through a rung: a
 * steady rung is a true/false and a risky rung is an open question, with nothing
 * in between. That is the bet the game is offering.
 */
function buildSummitClimb(pack: CurriculumPack): z.infer<typeof summitClimbContentSchema> {
  const deck = shuffleDeck(poolFor('summit_climb', pack))
  const easyItems = deck.filter((_, i) => i % 2 === 0)
  const hardItems = deck.filter((_, i) => i % 2 === 1)

  const render = (items: CurriculumQuestion[], ladder: typeof EASIEST_FIRST) =>
    items.map((q) => {
      const rendered = renderBest(q, ladder)
      if (!rendered) throw new Error(`No usable form for question "${q.id}"`)
      return rendered
    })

  return summitClimbContentSchema.parse({
    title: pack.title,
    easy: render(easyItems, EASIEST_FIRST),
    hard: render(hardItems, HARDEST_FIRST),
  })
}

// ─── Risk It ──────────────────────────────────────────────────────────────────

function buildRiskIt(pack: CurriculumPack): z.infer<typeof riskItContentSchema> {
  const usable = poolFor('risk_it', pack)
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

  // Pinned to one form, deliberately — the only game here with no gradient.
  // Teams wager before seeing the question, knowing only the strand. Varying the
  // form would make them bet on an unknown fact asked an unknown way: two
  // unknowns, one of which we chose for them, and a 5-point wager on a
  // true/false is a different bet from the same wager on an open question.
  // Announcing the form at the wager stage is the better fix and probably the
  // better game, but it needs the wager screen to say so — see "Risk It and
  // variable forms" in Docs/CONTENT-PASS-PLAN.md. Until then: mcq, the middle
  // rung, so the bet means the same thing every time.
  return riskItContentSchema.parse({
    title: pack.title,
    questions: picked.slice(0, 10).map((q) => ({
      ...renderQuestion(q, 'mcq'),
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
