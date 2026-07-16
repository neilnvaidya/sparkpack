/**
 * Build-time wrong answers for an equation's hidden result.
 *
 * CONTENT-RULES forbids authoring equation distractors: the right answer
 * depends on which part a game hides, so a stored distractor would be wrong
 * half the time. This generates them instead, for the one hidden position
 * `renderOpen` already defaults to when no game overrides it: the result.
 * Question Rush still rotates left/right/result itself and never calls this.
 */

import type { CurriculumQuestion } from '@/lib/curriculum/schema'

type Equation = NonNullable<CurriculumQuestion['equation']>

function parseValue(s: string): { numerator: number; denominator: number } {
  const fraction = /^(-?\d+)\s*\/\s*(\d+)$/.exec(s)
  if (fraction) return { numerator: Number(fraction[1]), denominator: Number(fraction[2]) }
  return { numerator: Number(s), denominator: 1 }
}

function formatValue(numerator: number, denominator: number): string {
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`
}

/**
 * Five plausible wrong results, mixing the classic "used the wrong operation"
 * mistake with small nearby misses scaled to the answer's size. Same-denominator
 * fractions get numerator-only offsets so the wrong answers stay valid fractions.
 */
export function equationResultDistractors(equation: Equation): string[] {
  const left = parseValue(equation.left)
  const right = parseValue(equation.right)
  const correct = parseValue(equation.result)
  const denominator = correct.denominator

  const candidates: number[] = []
  if (equation.operator === '+') candidates.push(left.numerator - right.numerator)
  if (equation.operator === '-') candidates.push(left.numerator + right.numerator)
  if (equation.operator === '×') candidates.push(left.numerator + right.numerator)
  if (equation.operator === '÷') candidates.push(left.numerator - right.numerator)

  const step = denominator > 1 ? denominator : Math.abs(correct.numerator) >= 100 ? 10 : 1
  for (const offset of [step, -step, step * 2, -step * 2, 1, -1, 2, -2, 3, -3]) {
    candidates.push(correct.numerator + offset)
  }

  const seen = new Set([correct.numerator])
  const distractors: string[] = []
  for (const numerator of candidates) {
    if (numerator < 0 || seen.has(numerator)) continue
    seen.add(numerator)
    distractors.push(formatValue(numerator, denominator))
    if (distractors.length === 5) break
  }
  return distractors
}
