/**
 * Strategy Board Quiz template.
 * @see Docs/04-template-system.md
 */

import { z } from 'zod'
import { GameTemplate } from './types'
import StrategyBoardQuizGame from '@/components/templates/strategy-board-quiz/StrategyBoardQuizGame'

export const contentSchema = z.object({
  title: z.string(),
  learningFocus: z.string(),
  topics: z.array(z.string()),
  board: z.object({
    rows: z.number(),
    cols: z.number(),
    pointsPerRow: z.array(z.number()),
    cells: z.array(
      z.object({
        topic: z.string(),
        points: z.number(),
        prompt: z.string(),
        acceptableAnswers: z.array(z.string()),
      })
    ),
  }),
  teacherScript: z.array(z.string()),
  studentInstructions: z.array(z.string()),
  fastFinisherExtension: z.string(),
})

/** Strategy Board Quiz content type – use for form state and runtime. */
export type StrategyBoardQuizContent = z.infer<typeof contentSchema>

const strategyBoardQuiz: GameTemplate<StrategyBoardQuizContent> = {
  id: 'strategy_board_quiz',
  slug: 'strategy-board-quiz',
  name: 'Strategy Board Quiz',
  description:
    'Jeopardy-style quiz where teams choose challenges and can steal',
  category: 'board',
  durationOptions: [8, 10, 15],
  teamRange: [3, 5],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema,
  generatePrompt: (_params) => '',
  RuntimeComponent: StrategyBoardQuizGame,
}

export default strategyBoardQuiz
