/**
 * Strategy Board Quiz content schema, kept apart from the template module.
 *
 * The template module imports the React runtime component, and that component
 * imports the game store — so the store cannot import the template module back
 * without a cycle. Math Rush already splits its schema out for the same reason
 * (lib/question-rush/content.ts); this mirrors it. Keep this file React-free.
 */

import { z } from 'zod'
import { renderedQuestionSchema } from './question-content'

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
        question: renderedQuestionSchema,
      })
    ),
  }),
  teacherScript: z.array(z.string()),
  studentInstructions: z.array(z.string()),
  fastFinisherExtension: z.string(),
})

export type StrategyBoardQuizContent = z.infer<typeof contentSchema>
