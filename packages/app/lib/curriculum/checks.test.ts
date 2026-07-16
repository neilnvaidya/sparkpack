import { describe, it, expect } from 'vitest'
import { enumeratedAskIssues } from '@/lib/curriculum/checks'
import type { CurriculumQuestion } from '@/lib/curriculum/schema'

const base: CurriculumQuestion = {
  id: 'q1',
  factKey: 'q1',
  strand: 'S',
  objectiveCodes: [],
  forms: ['open', 'mcq', 'truefalse'],
  ask: '',
  claim: 'X is {}.',
  claimIsTrue: null,
  answer: '',
  answerDetail: '',
  acceptableAnswers: [],
  distractors: [],
  equation: null,
} as unknown as CurriculumQuestion

const q = (over: Partial<CurriculumQuestion>): CurriculumQuestion =>
  ({ ...base, ...over }) as CurriculumQuestion

describe('enumeratedAskIssues', () => {
  it('flags a two-candidate ask whose distractors escape the set', () => {
    const issues = enumeratedAskIssues([
      q({
        ask: 'Which is bigger: 1/3, or 1/4?',
        answer: '1/3',
        distractors: ['1/4', '1/5', '1/6', '1/2', '1/8'],
      }),
    ])
    expect(issues).toHaveLength(1)
    expect(issues[0].inSet).toEqual(['1/4'])
    // 1/2 is the dangerous one: bigger than the answer, and it renders on screen.
    expect(issues[0].escapes).toEqual(['1/5', '1/6', '1/2', '1/8'])
  })

  it('flags an "Out of ..." ask', () => {
    const issues = enumeratedAskIssues([
      q({
        ask: 'Out of the Sun, a torch and a mirror, which one does NOT make its own light?',
        answer: 'mirror',
        distractors: ['Sun', 'torch', 'candle', 'lamp'],
      }),
    ])
    expect(issues[0].escapes).toEqual(['candle', 'lamp'])
  })

  it('passes an ask whose distractors all stay inside the named set', () => {
    expect(
      enumeratedAskIssues([
        q({
          ask: 'Which is bigger: 1/3, or 1/4?',
          answer: '1/3',
          distractors: ['1/4'],
        }),
      ])
    ).toEqual([])
  })

  it('does not flag arithmetic that happens to contain its own answer', () => {
    // 18 and 9 are operands, not candidates, and `18` is a good distractor.
    expect(
      enumeratedAskIssues([
        q({ ask: 'What is 18 - 9?', answer: '9', distractors: ['8', '18', '7', '27'] })
      ])
    ).toEqual([])
  })

  it('does not flag an ask that names the answer as the fact, not as a menu', () => {
    // "an" appears because it IS the fact under test; no distractor is offered
    // as a candidate by the sentence.
    expect(
      enumeratedAskIssues([
        q({
          ask: 'Do we use an apostrophe before a vowel sound?',
          answer: 'yes',
          distractors: ['no', 'sometimes'],
        }),
      ])
    ).toEqual([])
  })

  it('ignores equations, which never render an authored distractor', () => {
    expect(
      enumeratedAskIssues([
        q({
          ask: 'Is 2 or 3 the answer?',
          answer: '2',
          distractors: ['3', '9'],
          equation: { left: '1', operator: '+', right: '1', result: '2' },
        } as Partial<CurriculumQuestion>),
      ])
    ).toEqual([])
  })

  it('does not match a value inside a larger one', () => {
    // `1/3` must not match inside `11/3`, so this ask names no candidate.
    expect(
      enumeratedAskIssues([
        q({ ask: 'Is 11/3 or 11/4 bigger?', answer: '1/3', distractors: ['1/4', '9'] })
      ])
    ).toEqual([])
  })
})
