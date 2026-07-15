/**
 * Three in a Row template – a 4×4 grid of face-down questions; teams claim
 * cells by answering, aiming for three of their colour in a line.
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import { renderedQuestionSchema } from './question-content'
import ThreeInARowGame from '@/components/templates/three-in-a-row/ThreeInARowGame'

export const threeInARowContentSchema = z.object({
  title: z.string(),
  /** First 16 fill the grid; any extras are spares swapped in on a miss. */
  questions: z.array(renderedQuestionSchema).min(16),
})

export type ThreeInARowContent = z.infer<typeof threeInARowContentSchema>

const threeInARow: GameTemplate<ThreeInARowContent> = {
  id: 'three_in_a_row',
  slug: 'three-in-a-row',
  name: 'Three in a Row',
  description: 'Claim squares by answering — get three in your colour in a line to win',
  howToPlay: [
    'Teams take turns to pick a face-down square and answer the question inside.',
    'Correct: the square fills with your team’s colour. Wrong: it stays open and the turn passes.',
    'Line up three of your squares in a row, column or diagonal to win.',
    'If the grid fills with no line, the team with the most squares wins.',
  ],
  category: 'board',
  durationOptions: [10, 15],
  teamRange: [2, 4],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: threeInARowContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: ThreeInARowGame,
}

export default threeInARow
