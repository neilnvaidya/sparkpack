/**
 * True or False Showdown template – teams commit to TRUE or FALSE before
 * the reveal; teacher awards points to teams that called it right.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import { renderedQuestionSchema } from './question-content'
import TrueFalseShowdownGame from '@/components/templates/true-false/TrueFalseShowdownGame'

export const trueFalseContentSchema = z.object({
  title: z.string(),
  questions: z
    .array(renderedQuestionSchema)
    .min(5)
    .refine((qs) => qs.every((q) => q.form === 'truefalse'), {
      message: 'True or False Showdown only accepts truefalse questions',
    }),
})

export type TrueFalseContent = z.infer<typeof trueFalseContentSchema>

const trueFalseShowdown: GameTemplate<TrueFalseContent> = {
  id: 'true_false_showdown',
  slug: 'true-false-showdown',
  name: 'True or False Showdown',
  description:
    'Teams pick TRUE or FALSE before the big reveal — right calls score',
  howToPlay: [
    'A statement appears — each team decides together: TRUE or FALSE?',
    'Teams commit to their answer before the reveal.',
    'The teacher reveals the answer and gives a point to every team that called it right.',
    'After the last statement, the team with the most points wins.',
  ],
  category: 'discussion',
  durationOptions: [5, 10],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: trueFalseContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: TrueFalseShowdownGame,
}

export default trueFalseShowdown
