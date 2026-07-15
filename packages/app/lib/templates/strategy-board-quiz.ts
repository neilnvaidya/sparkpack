/**
 * Strategy Board Quiz template.
 * @see Docs/04-template-system.md
 */

import { GameTemplate } from './types'
import { contentSchema, type StrategyBoardQuizContent } from './strategy-board-quiz-content'
import StrategyBoardQuizGame from '@/components/templates/strategy-board-quiz/StrategyBoardQuizGame'

export { contentSchema }
export type { StrategyBoardQuizContent }

const strategyBoardQuiz: GameTemplate<StrategyBoardQuizContent> = {
  id: 'strategy_board_quiz',
  slug: 'strategy-board-quiz',
  name: 'Strategy Board Quiz',
  description:
    'Jeopardy-style quiz where teams choose challenges and can steal',
  howToPlay: [
    'Teams take turns to pick a question from the board — higher points mean harder questions.',
    'The team discusses while the timer runs, then gives one answer.',
    'Correct: the teacher awards the points. Wrong: the other teams get a chance to steal.',
    'When the board is empty, the team with the most points wins.',
  ],
  category: 'board',
  durationOptions: [8, 10, 15],
  teamRange: [3, 5],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema,
  generatePrompt: (_params) => '',
  RuntimeComponent: StrategyBoardQuizGame,
}

export default strategyBoardQuiz
