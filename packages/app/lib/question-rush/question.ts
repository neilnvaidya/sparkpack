/**
 * Question Rush cards.
 *
 * Was Math Rush, which could only ever hold a number sentence — so it ran on 4
 * of the 19 packs. A card now carries any rendered question; the equation is an
 * optional display payload rather than the whole model. Maths packs still render
 * exactly as before, because the equation branch is untouched.
 *
 * React-free: game-store.ts imports this.
 */

import { z } from 'zod'
import { renderedQuestionSchema } from '@/lib/templates/question-content'

export const cardEquationSchema = z.object({
  operator: z.enum(['+', '-', '×', '÷']),
  left: z.string(),
  right: z.string(),
  result: z.string(),
  /** Which part shows as "?" — exactly one, so a card has exactly one unknown. */
  hidden: z.enum(['left', 'right', 'result']),
})

export const questionRushQuestionSchema = renderedQuestionSchema.extend({
  id: z.string().optional(),
  points: z.number().positive(),
  /** Number sentences only; drives the "24 + ? = 40" display. */
  equation: cardEquationSchema.optional(),
})

export type QuestionRushQuestion = z.infer<typeof questionRushQuestionSchema>
export type CardEquation = z.infer<typeof cardEquationSchema>

/** The whole number sentence with nothing hidden; for text cards, just the answer. */
export function buildAnswerLine(q: QuestionRushQuestion): string {
  if (!q.equation) return q.answer
  const { left, operator, right, result } = q.equation
  return `${left} ${operator} ${right} = ${result}`
}

export function cloneQuestion(q: QuestionRushQuestion): QuestionRushQuestion {
  return { ...q }
}

export function shuffleDeck<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
