/**
 * Summit Climb template – teams climb a shared 7-rung mountain, choosing a
 * Steady (easy) or Risky (hard) question each turn.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import { renderedQuestionSchema } from './question-content'
import SummitClimbGame from '@/components/templates/summit-climb/SummitClimbGame'

export const summitClimbContentSchema = z.object({
  title: z.string(),
  /** Steady path pool (easier). */
  easy: z.array(renderedQuestionSchema).min(1),
  /** Risky path pool (harder). */
  hard: z.array(renderedQuestionSchema).min(1),
})

export type SummitClimbContent = z.infer<typeof summitClimbContentSchema>

const summitClimb: GameTemplate<SummitClimbContent> = {
  id: 'summit_climb',
  slug: 'summit-climb',
  name: 'Summit Climb',
  description: 'Choose a safe or risky question each turn — first team to the summit wins',
  howToPlay: [
    'On its turn a team chooses the Steady path (easy) or the Risky path (hard).',
    'Steady: right climbs 1 rung, wrong stays put.',
    'Risky: right climbs 2 rungs, wrong slips down 1.',
    'First team to reach the summit (rung 7) wins.',
  ],
  category: 'board',
  durationOptions: [10, 15],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: summitClimbContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: SummitClimbGame,
}

export default summitClimb
