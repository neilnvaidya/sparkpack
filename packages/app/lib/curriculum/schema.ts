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

export const curriculumPackSchema = z
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

export type CurriculumPack = z.infer<typeof curriculumPackSchema>
