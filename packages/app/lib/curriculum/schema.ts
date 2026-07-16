/**
 * Curriculum content schema – the source of truth for all game content.
 *
 * A CurriculumPack is a curated set of items for one topic in the
 * UK National Curriculum taxonomy (Key Stage → Year → Subject → Topic).
 * Items are template-agnostic; game slices (lib/games/slices.ts) adapt
 * them into playable game content. One pack can power several games.
 */

import { z } from 'zod'

export const subjectSchema = z.enum([
  'maths',
  'english',
  'science',
  'history',
  'geography',
])
export type Subject = z.infer<typeof subjectSchema>

export const keyStageSchema = z.enum(['KS1', 'KS2'])
export type KeyStage = z.infer<typeof keyStageSchema>

/**
 * A statutory learning objective from the National Curriculum programme
 * of study. `code` is our stable shorthand (e.g. "Y3-AS-2"); `statement`
 * keeps the curriculum wording so no information is lost.
 */
export const objectiveSchema = z.object({
  code: z.string(),
  statement: z.string(),
})
export type Objective = z.infer<typeof objectiveSchema>

export const questionFormSchema = z.enum(['open', 'mcq', 'truefalse'])
export type QuestionForm = z.infer<typeof questionFormSchema>

/** A number sentence, e.g. 24 + 16 = 40. Games choose which part to hide. */
export const questionEquationSchema = z.object({
  operator: z.enum(['+', '-', '×', '÷']),
  left: z.string(),
  right: z.string(),
  result: z.string(),
})

/**
 * One question = one fact, expressible in up to three forms.
 *
 * Two surfaces plus one answer set:
 *   ask        "What is the capital city of Wales?"   → open AND mcq
 *   claim      "The capital city of Wales is {}."     → truefalse only
 *   answer + distractors                              → mcq options, truefalse fills
 *
 * The distractors do triple duty: MCQ options, the source of FALSE claims
 * (fill the slot with a distractor), and replay variety (3 of 5+ are chosen per
 * game). Authoring two strings, an answer and five distractors yields three
 * difficulty levels.
 *
 * FORM IS THE DIFFICULTY LADDER — there is no `difficulty` field. It existed,
 * rating the intrinsic hardness of a fact independent of the asking, and was
 * removed: two axes were more precision than the content could carry, and the
 * values were never authored on that basis anyway. Games order by form via
 * lib/questions/scoring.ts.
 *
 * EVERY KEY IS ALWAYS PRESENT — no .optional(), no .default(). Blanks are "" or
 * [] or null. This uniformity is deliberate: a content authoring tool is meant
 * to be generated from this schema, and a shape that varies per question is not
 * worth building a form against.
 */
export const curriculumQuestionSchema = z.object({
  id: z.string(),
  /** Questions sharing a factKey test the same fact; games avoid dealing both. */
  factKey: z.string(),
  /** Sub-topic grouping, e.g. board-quiz categories. "" only for equations. */
  strand: z.string(),
  /**
   * At least one, and every code must be declared by the pack (checked below).
   *
   * A question must be curriculum-tied or it leaves the corpus. The reverse is
   * NOT true and is fine: an objective with no question is a content gap, and
   * reporting those gaps is most of why this field exists. But a question with
   * no objective is content the library can say nothing about — it cannot be
   * found by objective or reported on, and it looks like coverage while being
   * none. That quietly falsifies the objectives-first premise.
   *
   * Enforceable as of step 6: every question in every pack tags at least one.
   * The six that could not (Y1 classification content in a Y2 pack) are in
   * content-quarantine/no-objective.json with a route home.
   */
  objectiveCodes: z.array(z.string()).min(1),
  /**
   * Forms this question may be presented in. Every non-quarantined question
   * offers all three, full stop — a question that genuinely resists a form
   * lives in content-quarantine/form-resistant.json, not here with a shorter
   * `forms` array. See REQUIRED_FORMS below.
   */
  forms: z.array(questionFormSchema).min(1),
  /** Interrogative surface. Must stand alone — never "which of these". Equations leave this "". */
  ask: z.string(),
  /** Declarative frame with exactly one "{}" slot. Equations leave this "". */
  claim: z.string(),
  /** CANONICAL SHORT answer — must read as an MCQ option and as a slot fill. Equations leave this "". */
  answer: z.string(),
  /** Fuller model answer the teacher reads on reveal. "" when there is none. */
  answerDetail: z.string(),
  acceptableAnswers: z.array(z.string()),
  /**
   * Plausible wrong answers; 3 are chosen per game. Equations leave this [] —
   * their distractors are generated at build time (lib/questions/equation-distractors.ts)
   * because the right answer depends on which part a game hides.
   */
  distractors: z.array(z.string()),
  /** Number sentences only; null for everything else. */
  equation: questionEquationSchema.nullable(),
})

export type CurriculumQuestion = z.infer<typeof curriculumQuestionSchema>

/** Every non-equation question must declare all three — no partial-forms exemption. */
const REQUIRED_FORMS: QuestionForm[] = ['open', 'mcq', 'truefalse']
/** 3 of these are drawn per game, so options vary on replay. Hard minimum since step 5. */
export const DISTRACTOR_TARGET = 5

export const curriculumPackSchema = z
  .object({
    schemaVersion: z.literal(2),
    /** Globally unique, kebab-case: "<subject>-y<year>-<topicId>". */
    id: z.string(),
    subject: subjectSchema,
    keyStage: keyStageSchema,
    year: z.number().int().min(1).max(6),
    /** Topic within the subject's curriculum, kebab-case. */
    topicId: z.string(),
    title: z.string(),
    description: z.string(),
    /** The statutory objectives this pack covers, curriculum wording intact. */
    objectives: z.array(objectiveSchema).min(1),
    questions: z.array(curriculumQuestionSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const objectiveCodes = new Set(pack.objectives.map((o) => o.code))
    const ids = new Set<string>()

    pack.questions.forEach((q, i) => {
      const at = (field: string, message: string) =>
        ctx.addIssue({ code: 'custom', path: ['questions', i, field], message })

      for (const code of q.objectiveCodes) {
        if (!objectiveCodes.has(code)) at('objectiveCodes', `Unknown objective code "${code}"`)
      }
      if (ids.has(q.id)) at('id', `Duplicate question id "${q.id}"`)
      ids.add(q.id)

      // Every question offers all three forms, full stop. A question that
      // genuinely resists one belongs in content-quarantine/form-resistant.json,
      // not here with a shorter `forms` array — no per-question exemption.
      if (q.forms.length !== REQUIRED_FORMS.length || !REQUIRED_FORMS.every((f) => q.forms.includes(f))) {
        at('forms', 'every question must offer all three forms: open, mcq, truefalse')
      }

      if (q.equation === null) {
        if (q.ask === '') at('ask', 'an `ask` is required')
        if (q.answer === '') at('answer', 'an `answer` is required')
        if (q.distractors.length < DISTRACTOR_TARGET) {
          at('distractors', `needs at least ${DISTRACTOR_TARGET} distractors`)
        }
        const slots = q.claim.split('{}').length - 1
        if (q.claim === '') at('claim', 'a `claim` is required')
        else if (slots !== 1) at('claim', '`claim` must contain exactly one "{}" slot')
      } else {
        // Equation-derived forms synthesize ask/claim/answer/distractors at
        // build time (lib/questions/equation-distractors.ts) — never author them.
        if (q.ask !== '') at('ask', 'equations synthesize `ask` at build time — leave it ""')
        if (q.claim !== '') at('claim', 'equations synthesize `claim` at build time — leave it ""')
        if (q.answer !== '') at('answer', 'equations synthesize `answer` at build time — leave it ""')
        if (q.distractors.length !== 0) {
          at('distractors', 'do not author equation distractors — leave []')
        }
      }

      if (q.answer !== '' && q.distractors.includes(q.answer)) {
        at('distractors', '`answer` must not also be a distractor')
      }
      if (new Set(q.distractors).size !== q.distractors.length) {
        at('distractors', 'distractors must be unique')
      }

      if (q.equation) {
        const value = (s: string) => {
          const fraction = /^(-?\d+)\s*\/\s*(\d+)$/.exec(s)
          if (fraction) return Number(fraction[1]) / Number(fraction[2])
          return Number(s)
        }
        const { left, right, operator, result } = q.equation
        const [l, r, res] = [value(left), value(right), value(result)]
        const expected = { '+': l + r, '-': l - r, '×': l * r, '÷': l / r }[operator]
        if (Number.isFinite(expected) && Math.abs(expected - res) > 1e-9) {
          at('equation', `${left} ${operator} ${right} = ${result} is wrong`)
        }
      }
    })
  })

export type CurriculumPack = z.infer<typeof curriculumPackSchema>
