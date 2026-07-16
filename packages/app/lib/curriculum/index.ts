/**
 * Curriculum pack loader – imports, validates and indexes all content packs.
 * Add new packs by importing the JSON and appending to RAW_PACKS.
 */

import mathsY2AdditionSubtraction from './packs/maths-y2-addition-subtraction.json'
import mathsY3NumberPlaceValue from './packs/maths-y3-number-place-value.json'
import mathsY3AdditionSubtraction from './packs/maths-y3-addition-subtraction.json'
import mathsY3MultiplicationDivision from './packs/maths-y3-multiplication-division.json'
import mathsY3Fractions from './packs/maths-y3-fractions.json'
import mathsY3Measurement from './packs/maths-y3-measurement.json'
import mathsY3GeometryShapes from './packs/maths-y3-geometry-shapes.json'
import mathsY3Statistics from './packs/maths-y3-statistics.json'
import scienceY2AnimalsIncludingHumans from './packs/science-y2-animals-including-humans.json'
import scienceY3Plants from './packs/science-y3-plants.json'
import scienceY3AnimalsIncludingHumans from './packs/science-y3-animals-including-humans.json'
import scienceY3Rocks from './packs/science-y3-rocks.json'
import scienceY3Light from './packs/science-y3-light.json'
import scienceY3ForcesMagnets from './packs/science-y3-forces-magnets.json'
import englishY3Spelling from './packs/english-y3-spelling.json'
import englishY3GrammarPunctuation from './packs/english-y3-grammar-punctuation.json'
import englishY3ReadingComprehension from './packs/english-y3-reading-comprehension.json'
import historyY3StoneAgeIronAge from './packs/history-y3-stone-age-iron-age.json'
import geographyY3Uk from './packs/geography-y3-uk.json'
import {
  curriculumPackSchema,
  type CurriculumPack,
  type CurriculumQuestion,
  type QuestionForm,
} from './schema'

const RAW_PACKS: unknown[] = [
  mathsY2AdditionSubtraction,
  mathsY3NumberPlaceValue,
  mathsY3AdditionSubtraction,
  mathsY3MultiplicationDivision,
  mathsY3Fractions,
  mathsY3Measurement,
  mathsY3GeometryShapes,
  mathsY3Statistics,
  scienceY2AnimalsIncludingHumans,
  scienceY3Plants,
  scienceY3AnimalsIncludingHumans,
  scienceY3Rocks,
  scienceY3Light,
  scienceY3ForcesMagnets,
  englishY3Spelling,
  englishY3GrammarPunctuation,
  englishY3ReadingComprehension,
  historyY3StoneAgeIronAge,
  geographyY3Uk,
]

let cache: CurriculumPack[] | null = null

export function getAllPacks(): CurriculumPack[] {
  if (cache) return cache
  cache = RAW_PACKS.map((raw) => {
    const parsed = curriculumPackSchema.safeParse(raw)
    if (!parsed.success) {
      const id = (raw as { id?: string })?.id ?? 'unknown'
      throw new Error(
        `Invalid curriculum pack "${id}": ${parsed.error.message}`
      )
    }
    return parsed.data
  })
  return cache
}

export function getPack(id: string): CurriculumPack | null {
  return getAllPacks().find((p) => p.id === id) ?? null
}

/** Questions presentable in the given form, in pack order. */
export function questionsWithForm(
  pack: CurriculumPack,
  forms: QuestionForm[]
): CurriculumQuestion[] {
  return pack.questions.filter((q) => q.forms.some((f) => forms.includes(f)))
}

/**
 * Questions that are not number sentences.
 *
 * Board-style games want these: an equation has no strand to file under and no
 * prose to read out. This is the v2 equivalent of the old "qa/mcq/truefalse"
 * kind filter — `forms` alone cannot express it, because a lifted qa and a
 * lifted equation both declare `open`.
 */
export function textQuestions(pack: CurriculumPack): CurriculumQuestion[] {
  return pack.questions.filter((q) => q.equation === null)
}

/** Questions grouped by strand (unstranded questions go under fallback). */
export function questionsByStrand(
  questions: CurriculumQuestion[],
  fallback = 'General'
): Map<string, CurriculumQuestion[]> {
  const groups = new Map<string, CurriculumQuestion[]>()
  for (const q of questions) {
    const key = q.strand || fallback
    const list = groups.get(key) ?? []
    list.push(q)
    groups.set(key, list)
  }
  return groups
}
