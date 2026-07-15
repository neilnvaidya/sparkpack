/**
 * The stored shape of a rendered question — one schema, every template.
 *
 * Mirrors `RenderedQuestion` in lib/questions/render.ts. It exists separately
 * because template content is persisted to localStorage and re-parsed on load,
 * so it needs a Zod contract; keep the two in step.
 *
 * React-free: game-store.ts imports the template schemas.
 */

import { z } from 'zod'

export const questionFormSchema = z.enum(['open', 'mcq', 'truefalse'])

export const renderedOptionSchema = z.object({
  label: z.string(),
  text: z.string(),
  correct: z.boolean(),
})

export const renderedQuestionSchema = z.object({
  form: questionFormSchema,
  prompt: z.string(),
  answer: z.string(),
  answerDetail: z.string().optional(),
  acceptableAnswers: z.array(z.string()).default([]),
  options: z.array(renderedOptionSchema).optional(),
  isTrue: z.boolean().optional(),
})

export type RenderedQuestionContent = z.infer<typeof renderedQuestionSchema>
