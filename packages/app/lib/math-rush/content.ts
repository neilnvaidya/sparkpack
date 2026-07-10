import { z } from 'zod'
import { mathRushQuestionSchema } from './question'

export const problemSetIdSchema = z.enum([
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'fractions',
  'decimals',
])

export type MathRushProblemSetId = z.infer<typeof problemSetIdSchema>

export const PROBLEM_SET_IDS = problemSetIdSchema.options

export const mathRushContentSchema = z
  .object({
    title: z.string(),
    problemSetIds: z.array(problemSetIdSchema),
    questionsPerRound: z.number().int().min(1).max(6),
    customQuestions: z.array(mathRushQuestionSchema).optional().default([]),
  })
  .refine((c) => c.problemSetIds.length > 0 || c.customQuestions.length > 0, {
    message: 'At least one problem set or custom question is required',
  })

export type MathRushContent = z.infer<typeof mathRushContentSchema>
