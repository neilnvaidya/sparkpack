import addition from '@/lib/data/math-rush/addition.json'
import subtraction from '@/lib/data/math-rush/subtraction.json'
import multiplication from '@/lib/data/math-rush/multiplication.json'
import division from '@/lib/data/math-rush/division.json'
import fractions from '@/lib/data/math-rush/fractions.json'
import decimals from '@/lib/data/math-rush/decimals.json'
import { mathRushQuestionSchema, type MathRushQuestion } from './question'
import type { MathRushProblemSetId } from './content'

const BUILT_IN_SETS: Record<
  MathRushProblemSetId,
  { id: string; label: string; questions: unknown[] }
> = {
  addition: addition as { id: string; label: string; questions: unknown[] },
  subtraction: subtraction as { id: string; label: string; questions: unknown[] },
  multiplication: multiplication as { id: string; label: string; questions: unknown[] },
  division: division as { id: string; label: string; questions: unknown[] },
  fractions: fractions as { id: string; label: string; questions: unknown[] },
  decimals: decimals as { id: string; label: string; questions: unknown[] },
}

function parseQuestions(raw: unknown[]): MathRushQuestion[] {
  const out: MathRushQuestion[] = []
  for (const item of raw) {
    const parsed = mathRushQuestionSchema.safeParse(item)
    if (parsed.success) out.push(parsed.data)
  }
  return out
}

/**
 * Merge built-in sets and custom questions; dedupe by optional `id` (keep first).
 */
export function loadMathRushQuestions(
  setIds: MathRushProblemSetId[],
  customQuestions: MathRushQuestion[] = []
): MathRushQuestion[] {
  const seen = new Set<string>()
  const merged: MathRushQuestion[] = []

  for (const setId of setIds) {
    const pack = BUILT_IN_SETS[setId]
    if (!pack?.questions) continue
    for (const q of parseQuestions(pack.questions)) {
      const key = q.id ?? `${q.left}${q.operator}${q.right}=${q.result}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(q)
    }
  }

  for (const q of customQuestions) {
    const key = q.id ?? `${q.left}${q.operator}${q.right}=${q.result}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(q)
  }

  return merged
}

export function getBuiltInProblemSetLabel(id: MathRushProblemSetId): string {
  return BUILT_IN_SETS[id]?.label ?? id
}

export function shuffleDeck<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
