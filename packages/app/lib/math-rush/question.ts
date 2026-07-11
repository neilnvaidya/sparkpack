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
    (q) => [q.hiddenLeft, q.hiddenRight, q.hiddenResult].filter(Boolean).length === 1,
    { message: 'Exactly one of hiddenLeft, hiddenRight, hiddenResult must be true' }
  )

export type MathRushQuestion = z.infer<typeof mathRushQuestionSchema>

export function buildAnswerLine(q: MathRushQuestion): string {
  return `${q.left} ${q.operator} ${q.right} = ${q.result}`
}

export function cloneQuestion(q: MathRushQuestion): MathRushQuestion {
  return { ...q }
}

export function shuffleDeck<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
