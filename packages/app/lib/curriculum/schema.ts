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
 * EVERY KEY IS ALWAYS PRESENT — no .optional(), no .default(). Blanks are "" or
 * [] or null. This uniformity is deliberate: a content authoring tool is meant
 * to be generated from this schema, and a shape that varies per question is not
 * worth building a form against.
 */
export const curriculumQuestionSchema = z.object({
  id: z.string(),
  /** Questions sharing a factKey test the same fact; games avoid dealing both. */
  factKey: z.string(),
  /** INTRINSIC difficulty of the fact, independent of how much the form helps. */
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** Sub-topic grouping, e.g. board-quiz categories. "" only for equations. */
  strand: z.string(),
  objectiveCodes: z.array(z.string()),
  /** Forms this question may be presented in. Target: all three. */
  forms: z.array(questionFormSchema).min(1),
  /** Interrogative surface. Must stand alone — never "which of these". */
  ask: z.string(),
  /** Declarative frame with one "{}" slot. See claimIsTrue for the exception. */
  claim: z.string(),
  /**
   * TRANSITIONAL. Set only when `claim` has no "{}" slot — i.e. a fixed
   * proposition lifted from a v1 truefalse item, whose polarity was authored
   * rather than derived. Such a question cannot vary its true/false answer and
   * cannot reuse distractors as false fills.
   *
   * Enrichment rewrites these into slotted claims and sets this back to null.
   * Once every pack is enriched, delete this field and require the slot.
   */
  claimIsTrue: z.boolean().nullable(),
  /** CANONICAL SHORT answer — must read as an MCQ option and as a slot fill. */
  answer: z.string(),
  /** Fuller model answer the teacher reads on reveal. "" when there is none. */
  answerDetail: z.string(),
  acceptableAnswers: z.array(z.string()),
  /** Plausible wrong answers. Target 5+; 3 are chosen per game. */
  distractors: z.array(z.string()),
  /** Number sentences only; null for everything else. */
  equation: questionEquationSchema.nullable(),
})

export type CurriculumQuestion = z.infer<typeof curriculumQuestionSchema>

/** Fields shared by every item kind. */
const baseItemFields = {
  id: z.string(),
  /** 1 = easy, 2 = core, 3 = stretch. Drives points/ordering in games. */
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  /** Sub-topic grouping, e.g. board-quiz categories. */
  strand: z.string().optional(),
  /** Objective codes (from the pack's objectives) this item assesses. */
  objectiveCodes: z.array(z.string()).default([]),
}

/** A number sentence, e.g. 24 + 16 = 40. Games choose what to hide. */
export const equationItemSchema = z.object({
  ...baseItemFields,
  kind: z.literal('equation'),
  operator: z.enum(['+', '-', '×', '÷']),
  left: z.string(),
  right: z.string(),
  result: z.string(),
})

/** An open question with a model answer (teacher validates). */
export const qaItemSchema = z.object({
  ...baseItemFields,
  kind: z.literal('qa'),
  prompt: z.string(),
  answer: z.string(),
  /** Alternative phrasings the teacher may accept. */
  acceptableAnswers: z.array(z.string()).default([]),
})

/** Multiple choice. */
export const mcqItemSchema = z.object({
  ...baseItemFields,
  kind: z.literal('mcq'),
  prompt: z.string(),
  options: z.array(z.string()).min(2).max(5),
  correctIndex: z.number().int().min(0),
})

/** A statement that is true or false. */
export const trueFalseItemSchema = z.object({
  ...baseItemFields,
  kind: z.literal('truefalse'),
  statement: z.string(),
  isTrue: z.boolean(),
})

export const curriculumItemSchema = z.discriminatedUnion('kind', [
  equationItemSchema,
  qaItemSchema,
  mcqItemSchema,
  trueFalseItemSchema,
])

export type CurriculumItem = z.infer<typeof curriculumItemSchema>
export type CurriculumItemKind = CurriculumItem['kind']
export type EquationItem = z.infer<typeof equationItemSchema>
export type QaItem = z.infer<typeof qaItemSchema>
export type McqItem = z.infer<typeof mcqItemSchema>
export type TrueFalseItem = z.infer<typeof trueFalseItemSchema>

/**
 * v1 packs — items keyed by `kind`. Retained ONLY so scripts/migrate-packs-v2.mjs
 * can read the pre-migration corpus. Delete once the migration is committed.
 */
export const curriculumPackV1Schema = z
  .object({
    schemaVersion: z.literal(1),
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
    items: z.array(curriculumItemSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const objectiveCodes = new Set(pack.objectives.map((o) => o.code))
    const ids = new Set<string>()
    pack.items.forEach((item, i) => {
      for (const code of item.objectiveCodes) {
        if (!objectiveCodes.has(code)) {
          ctx.addIssue({
            code: 'custom',
            path: ['items', i, 'objectiveCodes'],
            message: `Unknown objective code "${code}"`,
          })
        }
      }
      if (ids.has(item.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', i, 'id'],
          message: `Duplicate item id "${item.id}"`,
        })
      }
      ids.add(item.id)
      if (item.kind === 'mcq' && item.correctIndex >= item.options.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', i, 'correctIndex'],
          message: 'correctIndex out of range',
        })
      }
    })
  })

export type CurriculumPackV1 = z.infer<typeof curriculumPackV1Schema>

/**
 * The floor for an MCQ to be a choice at all: the answer plus one wrong option.
 * Real content sits here — the a/an items are genuine two-option questions
 * ("I ate ___ apple"). The authoring target is DISTRACTOR_TARGET; the validator
 * warns below it rather than erroring, so enrichment can proceed pack by pack.
 */
const MIN_DISTRACTORS_STRUCTURAL = 1
/** The authoring target: 3 of these are drawn per game, so options vary on replay. */
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

      // Only what a declared form actually needs is required. A question that
      // offers just 'open' owes no distractors — that is what keeps the corpus
      // valid while enrichment fills the rest in, pack by pack.
      if (q.forms.includes('open') && q.ask === '' && q.equation === null) {
        at('ask', "form 'open' needs an `ask` (or an equation)")
      }
      if (q.forms.includes('mcq')) {
        if (q.ask === '') at('ask', "form 'mcq' needs an `ask`")
        if (q.answer === '') at('answer', "form 'mcq' needs an `answer`")
        if (q.distractors.length < MIN_DISTRACTORS_STRUCTURAL) {
          at('distractors', `form 'mcq' needs at least ${MIN_DISTRACTORS_STRUCTURAL} distractors`)
        }
      }
      if (q.forms.includes('truefalse') && q.claim === '') {
        at('claim', "form 'truefalse' needs a `claim`")
      }

      const slots = q.claim.split('{}').length - 1
      if (slots > 1) at('claim', '`claim` may contain at most one "{}" slot')
      if (slots === 1 && q.claimIsTrue !== null) {
        at('claimIsTrue', 'a slotted `claim` derives its polarity — claimIsTrue must be null')
      }
      if (slots === 1 && q.answer === '') {
        at('answer', 'a slotted `claim` needs an `answer` to fill the slot')
      }
      if (q.claim !== '' && slots === 0 && q.claimIsTrue === null) {
        at('claimIsTrue', 'a `claim` with no "{}" slot must state its polarity via claimIsTrue')
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
