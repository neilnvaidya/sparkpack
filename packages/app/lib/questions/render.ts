/**
 * Rendering a curriculum item into the shape a game actually displays.
 *
 * This replaces the old `asQuestionAnswer`, which collapsed everything into a
 * `{prompt, answer}` string pair — an MCQ became "prompt   A: x   B: y" and a
 * true/false became "True or false: <statement>". Options and `isTrue` never
 * reached a renderer, so no component could lay them out. Structure now survives
 * to the component, which is what lets `QuestionView` draw option panels.
 *
 * Pure and React-free: `slices.ts` and the pack validator both reach it, and the
 * validator runs under plain Node.
 *
 * Under schema v1 an item's kind determines its form one-to-one. Schema v2 gives
 * a question several forms and a game picks one; `RenderedQuestion` is already
 * shaped for that, so the components will not change again.
 */

import type { CurriculumItem } from '@/lib/curriculum/schema'

export type QuestionForm = 'open' | 'mcq' | 'truefalse'

export const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

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
  /** mcq only. */
  options?: RenderedOption[]
  /** truefalse only. */
  isTrue?: boolean
}

export function renderItem(item: CurriculumItem): RenderedQuestion {
  switch (item.kind) {
    case 'equation':
      // Hide the result: "24 + 16 = ?"
      return {
        form: 'open',
        prompt: `${item.left} ${item.operator} ${item.right} = ?`,
        answer: item.result,
        acceptableAnswers: [item.result],
      }
    case 'qa':
      return {
        form: 'open',
        prompt: item.prompt,
        answer: item.answer,
        acceptableAnswers: [item.answer, ...item.acceptableAnswers],
      }
    case 'mcq': {
      const options = item.options.map((text, i) => ({
        label: OPTION_LABELS[i],
        text,
        correct: i === item.correctIndex,
      }))
      return {
        form: 'mcq',
        prompt: item.prompt,
        answer: item.options[item.correctIndex],
        acceptableAnswers: [item.options[item.correctIndex]],
        options,
      }
    }
    case 'truefalse':
      return {
        form: 'truefalse',
        prompt: item.statement,
        answer: item.isTrue ? 'True' : 'False',
        acceptableAnswers: [item.isTrue ? 'True' : 'False'],
        isTrue: item.isTrue,
      }
  }
}
