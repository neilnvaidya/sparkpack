/**
 * Question Rush template – three colour-named cards at once, teams claim them.
 *
 * Was Math Rush: equations only, and so available on 4 of 19 packs. Now it takes
 * any question kind and runs on every pack.
 */

import { GameTemplate } from './types'
import QuestionRushGame from '@/components/templates/question-rush/QuestionRushGame'
import { questionRushContentSchema, type QuestionRushContent } from '@/lib/question-rush/content'

const questionRush: GameTemplate<QuestionRushContent> = {
  id: 'question_rush',
  slug: 'question-rush',
  name: 'Question Rush',
  description:
    'Three cards at once — teams race to claim them by calling out the colour',
  howToPlay: [
    'Three cards appear at once, each with a colour name — every team races to solve all three.',
    'A team calls out the colour of the card it wants, then its answer.',
    'The teacher taps that card and awards it to the fastest correct team; it locks in their colour.',
    'A fresh set is dealt each round. After the final round, the most points wins.',
  ],
  category: 'relay',
  durationOptions: [10, 15, 20],
  teamRange: [2, 6],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: questionRushContentSchema,
  generatePrompt: () => '',
  RuntimeComponent: QuestionRushGame,
}

export { questionRushContentSchema, type QuestionRushContent }
export default questionRush
