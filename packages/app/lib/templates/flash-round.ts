/**
 * Flash Round template – rapid-fire whole-class quiz. One question at a
 * time, teacher reveals the answer and awards a point to the fastest team.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import FlashRoundGame from '@/components/templates/flash-round/FlashRoundGame'

export const flashRoundContentSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        prompt: z.string(),
        answer: z.string(),
        /** Optional extra detail shown under the answer (e.g. options recap). */
        detail: z.string().optional(),
      })
    )
    .min(5),
})

export type FlashRoundContent = z.infer<typeof flashRoundContentSchema>

const flashRound: GameTemplate<FlashRoundContent> = {
  id: 'flash_round',
  slug: 'flash-round',
  name: 'Flash Round',
  description:
    'Rapid-fire questions for the whole class — reveal, award, next',
  category: 'relay',
  durationOptions: [5, 10, 15],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: flashRoundContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: FlashRoundGame,
}

export default flashRound
