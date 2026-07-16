import { describe, expect, test } from 'vitest'
import { renderQuestion, type Rng } from './render'
import type { CurriculumQuestion } from '@/lib/curriculum/schema'

function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const wales: CurriculumQuestion = {
  id: 'ca-wales',
  factKey: 'capital-wales',
  strand: 'Capital cities',
  objectiveCodes: [],
  forms: ['open', 'mcq', 'truefalse'],
  ask: 'What is the capital city of Wales?',
  claim: 'The capital city of Wales is {}.',
  answer: 'Cardiff',
  answerDetail: '',
  acceptableAnswers: ['cardiff'],
  distractors: ['Swansea', 'Newport', 'Bangor', 'Aberystwyth', 'Wrexham'],
  equation: null,
}

describe('mcq', () => {
  test('shows the answer plus three drawn distractors', () => {
    const q = renderQuestion(wales, 'mcq', seeded(1))
    expect(q.options).toHaveLength(4)
    expect(q.options!.filter((o) => o.correct)).toHaveLength(1)
    expect(q.options!.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D'])
    expect(q.prompt).toBe('What is the capital city of Wales?')
    // The prompt must never carry the options — that was the original bug.
    expect(q.prompt).not.toContain('A:')
  })

  test('a different game draws different distractors in different places', () => {
    const shape = (seed: number) =>
      renderQuestion(wales, 'mcq', seeded(seed)).options!.map((o) => o.text).join('|')
    const shapes = new Set([1, 2, 3, 4, 5, 6, 7, 8].map(shape))
    // Playing the same topic a handful of times should not look identical.
    expect(shapes.size).toBeGreaterThan(1)
  })

  test('the same seed is stable, so re-opening a stored game is unchanged', () => {
    expect(renderQuestion(wales, 'mcq', seeded(7))).toEqual(
      renderQuestion(wales, 'mcq', seeded(7))
    )
  })

  test('never offers the answer twice', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const texts = renderQuestion(wales, 'mcq', seeded(seed)).options!.map((o) => o.text)
      expect(new Set(texts).size).toBe(texts.length)
    }
  })
})

describe('truefalse', () => {
  test('a slotted claim varies polarity and fills the slot', () => {
    const rendered = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => renderQuestion(wales, 'truefalse', seeded(s)))
    expect(new Set(rendered.map((r) => r.isTrue)).size).toBe(2)

    for (const r of rendered) {
      expect(r.prompt).not.toContain('{}')
      // No "True or false:" prefix — the TRUE/FALSE panels say it.
      expect(r.prompt).not.toMatch(/true or false/i)
      expect(r.prompt.startsWith('The capital city of Wales is ')).toBe(true)
      if (r.isTrue) expect(r.prompt).toContain('Cardiff')
      else expect(r.prompt).not.toContain('Cardiff')
    }
  })

  test('a false claim explains the correction on reveal', () => {
    const falsy = [1, 2, 3, 4, 5, 6, 7, 8]
      .map((s) => renderQuestion(wales, 'truefalse', seeded(s)))
      .find((r) => !r.isTrue)!
    expect(falsy.answerDetail).toBe('Actually: The capital city of Wales is Cardiff.')
  })

  test('an equation varies polarity with a generated wrong result', () => {
    const eq: CurriculumQuestion = {
      ...wales,
      ask: '',
      claim: '',
      answer: '',
      acceptableAnswers: [],
      distractors: [],
      equation: { operator: '+', left: '24', right: '16', result: '40' },
    }
    const rendered = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => renderQuestion(eq, 'truefalse', seeded(s)))
    expect(new Set(rendered.map((r) => r.isTrue)).size).toBe(2)
    for (const r of rendered) {
      expect(r.prompt).toBe(r.isTrue ? '24 + 16 = 40.' : r.prompt)
      if (!r.isTrue) {
        expect(r.prompt).not.toBe('24 + 16 = 40.')
        expect(r.answerDetail).toBe('Actually: 24 + 16 = 40.')
      }
    }
  })
})

describe('open', () => {
  test('uses the ask and accepts the alternatives', () => {
    const q = renderQuestion(wales, 'open', seeded(1))
    expect(q.prompt).toBe('What is the capital city of Wales?')
    expect(q.answer).toBe('Cardiff')
    expect(q.acceptableAnswers).toEqual(['Cardiff', 'cardiff'])
  })

  test('an equation hides exactly one part', () => {
    const eq: CurriculumQuestion = {
      ...wales,
      forms: ['open'],
      ask: '',
      claim: '',
      answer: '',
      acceptableAnswers: [],
      distractors: [],
      equation: { operator: '+', left: '24', right: '16', result: '40' },
    }
    const q = renderQuestion(eq, 'open', seeded(1))
    expect(q.prompt).toBe('24 + 16 = ?')
    expect(q.answer).toBe('40')
  })

  test('an equation can also be dealt as mcq, with generated distractors', () => {
    const eq: CurriculumQuestion = {
      ...wales,
      forms: ['open', 'mcq', 'truefalse'],
      ask: '',
      claim: '',
      answer: '',
      acceptableAnswers: [],
      distractors: [],
      equation: { operator: '+', left: '24', right: '16', result: '40' },
    }
    const q = renderQuestion(eq, 'mcq', seeded(1))
    expect(q.prompt).toBe('24 + 16 = ?')
    expect(q.answer).toBe('40')
    expect(q.options).toHaveLength(4)
    expect(q.options!.filter((o) => o.correct)).toHaveLength(1)
    expect(new Set(q.options!.map((o) => o.text)).size).toBe(4)
  })
})
