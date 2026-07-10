/**
 * Math Rush template – simultaneous bounty cards, team claims, JSON problem sets.
 */

import { GameTemplate } from './types'
import MathRushGame from '@/components/templates/math-rush/MathRushGame'
import { mathRushContentSchema, type MathRushContent } from '@/lib/math-rush/content'

const mathRush: GameTemplate<MathRushContent> = {
  id: 'math_rush',
  slug: 'math-rush',
  name: 'Math Rush',
  description:
    'Several math cards at once—teams claim bounties; reveal answers when you choose',
  category: 'relay',
  durationOptions: [10, 15, 20],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: mathRushContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: MathRushGame,
}

export { mathRushContentSchema, type MathRushContent }
export default mathRush
