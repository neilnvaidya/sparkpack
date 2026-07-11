import { z } from 'zod'
import { mathRushQuestionSchema } from './question'

export const mathRushContentSchema = z.object({
  title: z.string(),
  questionsPerRound: z.number().int().min(1).max(6),
  questions: z.array(mathRushQuestionSchema).min(1),
})

export type MathRushContent = z.infer<typeof mathRushContentSchema>
