import { z } from 'zod'
import { questionRushQuestionSchema } from './question'
import { CARD_COLOR_OPTIONS } from '@/lib/constants/team-colors'

export const questionRushContentSchema = z.object({
  title: z.string(),
  /**
   * Capped by the reserved card colours: every card on screen must have a name a
   * team can call out, and there are only so many unmistakable colours.
   */
  questionsPerRound: z.number().int().min(1).max(CARD_COLOR_OPTIONS.length),
  questions: z.array(questionRushQuestionSchema).min(1),
})

export type QuestionRushContent = z.infer<typeof questionRushContentSchema>
