/**
 * Pack validator – run with `npm run validate-packs`.
 *
 * Zod-parses every pack in lib/curriculum/packs/ against the real schema,
 * then applies content checks the schema can't express:
 *   - equation arithmetic is correct
 *   - MCQ options are unique (no two defensible answers by duplication)
 *   - pack id matches "<subject>-y<year>-<topicId>" and the filename
 *   - board-quiz fit: strand grouping produces a 2–4 column board
 *   - which game slices each pack can power (informational)
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { curriculumPackSchema } from '../lib/curriculum/schema.ts'

const packsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/curriculum/packs')

const SLICE_MINIMUMS = [
  { name: 'Math Rush', kinds: ['equation'], min: 6 },
  { name: 'Strategy Board Quiz', kinds: ['qa', 'mcq', 'truefalse'], min: 8 },
  { name: 'Flash Round', kinds: ['equation', 'qa', 'mcq', 'truefalse'], min: 5 },
  { name: 'True or False Showdown', kinds: ['truefalse'], min: 5 },
]

let errorCount = 0

function fail(file, message) {
  errorCount++
  console.error(`  ERROR ${file}: ${message}`)
}

/** Parse "3" or "3/5" into [numerator, denominator]. */
function toRational(value) {
  const fraction = /^(-?\d+)\s*\/\s*(\d+)$/.exec(value)
  if (fraction) return [Number(fraction[1]), Number(fraction[2])]
  const n = Number(value)
  return Number.isNaN(n) ? null : [n, 1]
}

function checkEquation(file, item) {
  const l = toRational(item.left)
  const r = toRational(item.right)
  const res = toRational(item.result)
  if (!l || !r || !res) {
    fail(file, `${item.id}: unparseable equation part`)
    return
  }
  // expected = l op r, as a rational [num, den]
  const [ln, ld] = l
  const [rn, rd] = r
  const expected = {
    '+': [ln * rd + rn * ld, ld * rd],
    '-': [ln * rd - rn * ld, ld * rd],
    '×': [ln * rn, ld * rd],
    '÷': [ln * rd, ld * rn],
  }[item.operator]
  const [en, ed] = expected
  const [an, ad] = res
  if (en * ad !== an * ed) {
    fail(file, `${item.id}: ${item.left} ${item.operator} ${item.right} = ${item.result} (wrong)`)
  }
}

const files = readdirSync(packsDir).filter((f) => f.endsWith('.json')).sort()
console.log(`Validating ${files.length} packs in lib/curriculum/packs/\n`)

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(packsDir, file), 'utf8'))
  const parsed = curriculumPackSchema.safeParse(raw)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fail(file, `${issue.path.join('.')}: ${issue.message}`)
    }
    continue
  }
  const pack = parsed.data

  const expectedId = basename(file, '.json')
  if (pack.id !== expectedId) fail(file, `pack id "${pack.id}" does not match filename`)
  if (pack.id !== `${pack.subject}-y${pack.year}-${pack.topicId}`) {
    fail(file, `pack id "${pack.id}" != "${pack.subject}-y${pack.year}-${pack.topicId}"`)
  }

  // Note: item ids only need to be unique within a pack; the schema enforces that.
  for (const item of pack.items) {
    if (item.kind === 'equation') checkEquation(file, item)
    if (item.kind === 'mcq') {
      const unique = new Set(item.options.map((o) => o.trim().toLowerCase()))
      if (unique.size !== item.options.length) {
        fail(file, `${item.id}: duplicate MCQ options`)
      }
    }
  }

  // Board fit: strands among board-usable items.
  const boardItems = pack.items.filter((i) => ['qa', 'mcq', 'truefalse'].includes(i.kind))
  const strandCounts = new Map()
  for (const item of boardItems) {
    const strand = item.strand ?? '(none)'
    strandCounts.set(strand, (strandCounts.get(strand) ?? 0) + 1)
  }
  const strandsWith2Plus = [...strandCounts.values()].filter((n) => n >= 2).length
  if (boardItems.length >= 8 && strandsWith2Plus < 2) {
    fail(file, `board-quiz eligible but only ${strandsWith2Plus} strand(s) have 2+ items (needs 2–4 for a good board)`)
  }

  const kindCounts = pack.items.reduce((acc, i) => ((acc[i.kind] = (acc[i.kind] ?? 0) + 1), acc), {})
  const games = SLICE_MINIMUMS.filter(
    (s) => pack.items.filter((i) => s.kinds.includes(i.kind)).length >= s.min
  ).map((s) => s.name)
  console.log(
    `  ok ${file} — ${pack.items.length} items (${Object.entries(kindCounts)
      .map(([k, n]) => `${n} ${k}`)
      .join(', ')}) → ${games.length ? games.join(', ') : 'NO GAMES AVAILABLE'}`
  )
  if (games.length === 0) fail(file, 'pack powers no games')
}

console.log('')
if (errorCount > 0) {
  console.error(`${errorCount} error(s) found.`)
  process.exit(1)
}
console.log('All packs valid.')
