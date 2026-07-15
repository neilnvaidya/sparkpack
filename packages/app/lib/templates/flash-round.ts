/**
 * Flash Round template – rapid-fire whole-class quiz. One question at a
 * time, teacher reveals the answer and awards a point to the fastest team.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import { renderedQuestionSchema } from './question-content'
import FlashRoundGame from '@/components/templates/flash-round/FlashRoundGame'

export const flashRoundContentSchema = z.object({
  title: z.string(),
  questions: z.array(renderedQuestionSchema).min(5),
})

export type FlashRoundContent = z.infer<typeof flashRoundContentSchema>

const flashRound: GameTemplate<FlashRoundContent> = {
  id: 'flash_round',
  slug: 'flash-round',
  name: 'Flash Round',
  description:
    'Rapid-fire questions for the whole class — reveal, award, next',
  howToPlay: [
    'One question at a time — teams race to answer first.',
    'The teacher reveals the answer and gives the point to the quickest correct team.',
    'Questions get harder as the round goes on.',
    'After the last question, the team with the most points wins.',
  ],
  category: 'relay',
  durationOptions: [5, 10, 15],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: flashRoundContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: FlashRoundGame,
}

export default flashRound
