/**
 * Rendering a curriculum question into the shape a game displays.
 *
 * Replaces the old `asQuestionAnswer`, which collapsed everything into a
 * `{prompt, answer}` string pair — an MCQ became "prompt   A: x   B: y" and a
 * true/false became "True or false: <statement>", so options and `isTrue` never
 * reached a component. Structure now survives to the renderer.
 *
 * A question can offer several forms; the game picks one, and this turns that
 * choice into concrete text. Selection of *which* distractors and *which*
 * polarity happens here too, driven by an injected Rng — so it happens once per
 * game build (a teacher pressing Play), not per render. Play a topic twice and
 * the options differ; re-open the same stored game and they do not.
 *
 * Pure and React-free: slices.ts and the pack validator both reach it, and the
 * validator runs under plain Node.
 */

import type { CurriculumQuestion, QuestionForm } from '@/lib/curriculum/schema'
import { equationResultDistractors } from '@/lib/questions/equation-distractors'

export type { QuestionForm }

export const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

/** How many options an MCQ shows: the answer plus three distractors. */
export const MCQ_OPTION_COUNT = 4

export type Rng = () => number

export interface RenderedOption {
  label: string
  text: string
  correct: boolean
}

export interface RenderedQuestion {
  form: QuestionForm
  /** The text the teacher reads. Never carries baked-in options or a "True or false:" prefix. */
  prompt: string
  /** open: the model answer. mcq: the correct option's text. truefalse: "True" | "False". */
  answer: string
  /** Extra line shown under the answer on reveal. */
  answerDetail?: string
  /** Phrasings the teacher may accept for a spoken answer. */
  acceptableAnswers: string[]
  /** mcq only. Already selected, shuffled and lettered. */
  options?: RenderedOption[]
  /** truefalse only. */
  isTrue?: boolean
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** The number sentence with one part replaced by "?" — always exactly one unknown. */
export function formatEquation(
  equation: NonNullable<CurriculumQuestion['equation']>,
  hidden: 'left' | 'right' | 'result'
): string {
  const show = (part: 'left' | 'right' | 'result') =>
    hidden === part ? '?' : equation[part]
  return `${show('left')} ${equation.operator} ${show('right')} = ${show('result')}`
}

function renderOpen(q: CurriculumQuestion): RenderedQuestion {
  if (q.equation) {
    // Hide the result unless a game has asked for otherwise (Question Rush
    // rotates the hidden part itself and overrides these fields).
    return {
      form: 'open',
      prompt: formatEquation(q.equation, 'result'),
      answer: q.equation.result,
      acceptableAnswers: [q.equation.result],
    }
  }
  return {
    form: 'open',
    prompt: q.ask,
    answer: q.answer,
    // Spread rather than set undefined: an explicit undefined key still
    // serialises into stored content and the dump.
    ...(q.answerDetail ? { answerDetail: q.answerDetail } : {}),
    acceptableAnswers: [q.answer, ...q.acceptableAnswers],
  }
}

function renderMcq(q: CurriculumQuestion, rng: Rng): RenderedQuestion {
  if (q.equation) {
    const answer = q.equation.result
    const drawn = shuffle(equationResultDistractors(q.equation), rng).slice(
      0,
      MCQ_OPTION_COUNT - 1
    )
    const options = shuffle([answer, ...drawn], rng).map((text, i) => ({
      label: OPTION_LABELS[i],
      text,
      correct: text === answer,
    }))
    return {
      form: 'mcq',
      prompt: formatEquation(q.equation, 'result'),
      answer,
      acceptableAnswers: [answer],
      options,
    }
  }
  // Draw a fresh subset of the distractor pool, then shuffle in the answer, so
  // the same question dealt twice looks different.
  const drawn = shuffle(q.distractors, rng).slice(0, MCQ_OPTION_COUNT - 1)
  const options = shuffle([q.answer, ...drawn], rng).map((text, i) => ({
    label: OPTION_LABELS[i],
    text,
    correct: text === q.answer,
  }))
  return {
    form: 'mcq',
    prompt: q.ask,
    answer: q.answer,
    ...(q.answerDetail ? { answerDetail: q.answerDetail } : {}),
    acceptableAnswers: [q.answer],
    options,
  }
}

function renderTrueFalse(q: CurriculumQuestion, rng: Rng): RenderedQuestion {
  if (q.equation) {
    const isTrue = rng() < 0.5
    const shown = isTrue ? q.equation.result : shuffle(equationResultDistractors(q.equation), rng)[0]
    const full = (result: string) =>
      `${q.equation!.left} ${q.equation!.operator} ${q.equation!.right} = ${result}.`
    return {
      form: 'truefalse',
      prompt: full(shown),
      answer: isTrue ? 'True' : 'False',
      ...(isTrue ? {} : { answerDetail: `Actually: ${full(q.equation.result)}` }),
      acceptableAnswers: [isTrue ? 'True' : 'False'],
      isTrue,
    }
  }
  // Fill with the answer for TRUE, a distractor for FALSE — a deal-time
  // decision instead of an authoring habit, so polarity varies on replay.
  const isTrue = rng() < 0.5
  const fill = isTrue ? q.answer : shuffle(q.distractors, rng)[0]
  return {
    form: 'truefalse',
    prompt: q.claim.replace('{}', fill),
    answer: isTrue ? 'True' : 'False',
    // A false claim needs the correction spelled out on reveal.
    ...(isTrue
      ? q.answerDetail
        ? { answerDetail: q.answerDetail }
        : {}
      : { answerDetail: `Actually: ${q.claim.replace('{}', q.answer)}` }),
    acceptableAnswers: [isTrue ? 'True' : 'False'],
    isTrue,
  }
}

export function renderQuestion(
  q: CurriculumQuestion,
  form: QuestionForm,
  rng: Rng = Math.random
): RenderedQuestion {
  switch (form) {
    case 'open':
      return renderOpen(q)
    case 'mcq':
      return renderMcq(q, rng)
    case 'truefalse':
      return renderTrueFalse(q, rng)
  }
}

/**
 * Render in the first of `preference` the question actually offers.
 *
 * The direction matters: falling back from `open` to `truefalse` silently makes
 * a question easier, so games that care about difficulty must order this
 * deliberately rather than accept any form.
 */
export function renderBest(
  q: CurriculumQuestion,
  preference: QuestionForm[],
  rng: Rng = Math.random
): RenderedQuestion | null {
  const form = preference.find((f) => q.forms.includes(f))
  return form ? renderQuestion(q, form, rng) : null
}
