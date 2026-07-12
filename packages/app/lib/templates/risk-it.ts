/**
 * Risk It template – confidence wagering. Every team wagers 1, 3 or 5 from
 * its bank before each question, knowing only the subtopic; right adds the
 * wager, wrong loses it.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import RiskItGame from '@/components/templates/risk-it/RiskItGame'

export const riskItContentSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        prompt: z.string(),
        answer: z.string(),
        /** Subtopic shown at the wager stage before the question. */
        hint: z.string(),
      })
    )
    .min(10),
})

export type RiskItContent = z.infer<typeof riskItContentSchema>

const riskIt: GameTemplate<RiskItContent> = {
  id: 'risk_it',
  slug: 'risk-it',
  name: 'Risk It',
  description: 'Wager points on how sure you are before each question is revealed',
  howToPlay: [
    'Every team starts with a bank of 10 points.',
    'Before each question you see only the subtopic — each team wagers 1, 3 or 5.',
    'The question appears; right answers add the wager, wrong answers lose it (never below 0).',
    'The final question always risks 5. After ten questions, the biggest bank wins.',
  ],
  category: 'discussion',
  durationOptions: [10, 15],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: riskItContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: RiskItGame,
}

export default riskIt
