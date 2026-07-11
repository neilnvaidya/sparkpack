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
import {
  curriculumPackSchema,
  type CurriculumPack,
  type CurriculumItem,
  type CurriculumItemKind,
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

/** Items of the given kinds, in pack order. */
export function itemsOfKind(
  pack: CurriculumPack,
  kinds: CurriculumItemKind[]
): CurriculumItem[] {
  return pack.items.filter((item) => kinds.includes(item.kind))
}

/** Items grouped by strand (items without a strand go under fallback). */
export function itemsByStrand(
  items: CurriculumItem[],
  fallback = 'General'
): Map<string, CurriculumItem[]> {
  const groups = new Map<string, CurriculumItem[]>()
  for (const item of items) {
    const key = item.strand ?? fallback
    const list = groups.get(key) ?? []
    list.push(item)
    groups.set(key, list)
  }
  return groups
}
