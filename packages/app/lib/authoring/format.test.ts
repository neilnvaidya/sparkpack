import { describe, it, expect } from 'vitest'
import { formatQuestion, applyFixes } from './format'
import { blankQuestion } from './serialize'
import { serializePack } from './serialize'
import type { CurriculumQuestion, CurriculumPack } from '@/lib/curriculum/schema'

const q = (over: Partial<CurriculumQuestion> = {}): CurriculumQuestion => ({
  ...blankQuestion('t-1'),
  ...over,
})

describe('formatQuestion — fixes (ask and claim only)', () => {
  it('capitalises an ask and gives it exactly one question mark', () => {
    const { fixes } = formatQuestion(q({ ask: 'what is the capital of Wales' }))
    expect(fixes).toHaveLength(1)
    expect(fixes[0].to).toBe('What is the capital of Wales?')
  })

  it('collapses a run of terminators rather than appending to them', () => {
    const { fixes } = formatQuestion(q({ ask: 'What is it??' }))
    expect(fixes[0].to).toBe('What is it?')
  })

  it('tidies whitespace', () => {
    const { fixes } = formatQuestion(q({ ask: '  What   is  it?  ' }))
    expect(fixes[0].to).toBe('What is it?')
  })

  it('preserves the {} slot when terminating a claim', () => {
    const { fixes } = formatQuestion(q({ ask: '', claim: 'the capital of Wales is {}' }))
    expect(fixes[0].to).toBe('The capital of Wales is {}.')
  })

  it('leaves a well-formed question alone', () => {
    const { fixes } = formatQuestion(
      q({ ask: 'What is the capital of Wales?', claim: 'The capital of Wales is {}.' })
    )
    expect(fixes).toHaveLength(0)
  })

  it('proposes nothing for a blank ask', () => {
    expect(formatQuestion(q({ ask: '' })).fixes).toHaveLength(0)
  })
})

describe('formatQuestion — the answer set is never rewritten', () => {
  it('does not propose a fix for any answer-set field', () => {
    const { fixes } = formatQuestion(
      q({
        ask: 'How long?',
        answer: '45 cm',
        distractors: ['405 mm', '4 m'],
        acceptableAnswers: ['forty five cm'],
      })
    )
    // "45 cm" must never become "45 Cm" — the whole scoping rule.
    expect(fixes.every((f) => f.field === 'ask' || f.field === 'claim')).toBe(true)
  })
})

describe('formatQuestion — warnings (human judgement)', () => {
  it('flags a distractor that cannot live in a claim frame', () => {
    const { warnings } = formatQuestion(q({ distractors: ['All of the above'] }))
    expect(warnings.some((w) => w.message.includes('nonsense inside the claim frame'))).toBe(true)
  })

  it('flags an ask that cannot stand alone', () => {
    const { warnings } = formatQuestion(q({ ask: 'Which of these is longest?' }))
    expect(warnings.some((w) => w.field === 'ask' && w.message.includes('stand alone'))).toBe(true)
  })

  it('flags a slotless claim', () => {
    const { warnings } = formatQuestion(q({ claim: 'Dark is the absence of light.' }))
    expect(warnings.some((w) => w.field === 'claim' && w.message.includes('Slotless'))).toBe(true)
  })

  it('flags register mismatch when the answer stands out by case', () => {
    const { warnings } = formatQuestion(q({ answer: 'Cardiff', distractors: ['swansea', 'newport'] }))
    expect(warnings.some((w) => w.message.includes('Leading case'))).toBe(true)
  })

  it('does not flag register for a consistent option set', () => {
    const { warnings } = formatQuestion(q({ answer: 'Cardiff', distractors: ['Swansea', 'Newport'] }))
    expect(warnings.some((w) => w.message.includes('Leading case'))).toBe(false)
  })

  it('flags authored equation distractors', () => {
    const { warnings } = formatQuestion(
      q({ equation: { operator: '+', left: '24', right: '16', result: '40' }, distractors: ['41'] })
    )
    expect(warnings.some((w) => w.message.includes('build time'))).toBe(true)
  })
})

describe('applyFixes', () => {
  it('applies only the fixes it is handed, without mutating', () => {
    const before = q({ ask: 'what is it' })
    const { fixes } = formatQuestion(before)
    const after = applyFixes(before, fixes)
    expect(after.ask).toBe('What is it?')
    expect(before.ask).toBe('what is it')
  })
})

describe('serializePack', () => {
  it('writes keys in the declared order regardless of input order', () => {
    const pack = {
      questions: [{ equation: null, id: 'a', factKey: 'a' }],
      id: 'x-y1-z',
      schemaVersion: 2,
    } as unknown as CurriculumPack
    const out = serializePack(pack)
    expect(out.indexOf('"schemaVersion"')).toBeLessThan(out.indexOf('"id"'))
    expect(out.indexOf('"id": "a"')).toBeLessThan(out.indexOf('"factKey"'))
    expect(out.endsWith('\n')).toBe(true)
  })

  it('keeps a key that is not in the declared order rather than dropping it', () => {
    const pack = { id: 'x', mystery: 1, questions: [] } as unknown as CurriculumPack
    expect(serializePack(pack)).toContain('"mystery"')
  })
})
