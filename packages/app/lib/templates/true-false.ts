/**
 * True or False Showdown template – teams commit to TRUE or FALSE before
 * the reveal; teacher awards points to teams that called it right.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import TrueFalseShowdownGame from '@/components/templates/true-false/TrueFalseShowdownGame'

export const trueFalseContentSchema = z.object({
  title: z.string(),
  statements: z
    .array(
      z.object({
        statement: z.string(),
        isTrue: z.boolean(),
        /** Optional explanation shown after the reveal. */
        note: z.string().optional(),
      })
    )
    .min(5),
})

export type TrueFalseContent = z.infer<typeof trueFalseContentSchema>

const trueFalseShowdown: GameTemplate<TrueFalseContent> = {
  id: 'true_false_showdown',
  slug: 'true-false-showdown',
  name: 'True or False Showdown',
  description:
    'Teams pick TRUE or FALSE before the big reveal — right calls score',
  category: 'discussion',
  durationOptions: [5, 10],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: trueFalseContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: TrueFalseShowdownGame,
}

export default trueFalseShowdown
