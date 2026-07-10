import { z } from 'zod'

const operatorSchema = z
  .enum(['+', '-', '×', '÷', '*', '/'])
  .transform((op) => (op === '*' ? '×' : op === '/' ? '÷' : op))

export const mathRushQuestionSchema = z
  .object({
    id: z.string().optional(),
    points: z.number().positive(),
    operator: operatorSchema,
    left: z.string(),
    right: z.string(),
    result: z.string(),
    hiddenLeft: z.boolean(),
    hiddenRight: z.boolean(),
    hiddenResult: z.boolean(),
  })
  .refine(
    (q) => [q.hiddenLeft, q.hiddenRight, q.hiddenResult].filter(Boolean).length === 2,
    { message: 'Exactly two of hiddenLeft, hiddenRight, hiddenResult must be true' }
  )

export type MathRushQuestion = z.infer<typeof mathRushQuestionSchema>

export function buildAnswerLine(q: MathRushQuestion): string {
  return `${q.left} ${q.operator} ${q.right} = ${q.result}`
}

export function cloneQuestion(q: MathRushQuestion): MathRushQuestion {
  return { ...q }
}
