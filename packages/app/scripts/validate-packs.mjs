/**
 * Pack validator – run with `npm run validate-packs`.
 *
 * Zod-parses every pack in lib/curriculum/packs/ against the real schema (which
 * already checks equation arithmetic, distractor uniqueness and per-form data),
 * then applies what the schema cannot express:
 *   - pack id matches "<subject>-y<year>-<topicId>" and the filename
 *   - board-quiz fit: strand grouping produces a 2–4 column board
 *   - which game slices each pack can power (informational)
 *
 * Game availability comes from lib/games/slice-requirements.ts — the same data
 * the app uses — so a new game is covered here the moment it is registered.
 *
 * Warnings are the enrichment worklist: they do not fail the build, because the
 * corpus is migrating to multi-form questions one pack at a time. Once every
 * pack is enriched, promote them to errors.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { curriculumPackSchema, DISTRACTOR_TARGET } from '../lib/curriculum/schema.ts'
import { GAME_SLICE_META, isRequirementMet } from '../lib/games/slice-requirements.ts'

const packsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/curriculum/packs')

let errorCount = 0
const warnings = { partialForms: 0, thinDistractors: 0, slotlessClaims: 0, noFactKey: 0 }

function fail(file, message) {
  errorCount++
  console.error(`  ERROR ${file}: ${message}`)
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

  for (const q of pack.questions) {
    if (q.forms.length < 3) warnings.partialForms++
    if (q.forms.includes('mcq') && q.distractors.length < DISTRACTOR_TARGET) {
      warnings.thinDistractors++
    }
    if (q.claimIsTrue !== null) warnings.slotlessClaims++
    if (q.factKey === q.id) warnings.noFactKey++
  }

  // Board fit: strands among the questions a board can use.
  const boardQuestions = pack.questions.filter((q) => q.equation === null)
  const strandCounts = new Map()
  for (const q of boardQuestions) {
    const strand = q.strand || '(none)'
    strandCounts.set(strand, (strandCounts.get(strand) ?? 0) + 1)
  }
  const strandsWith2Plus = [...strandCounts.values()].filter((n) => n >= 2).length
  if (boardQuestions.length >= 8 && strandsWith2Plus < 2) {
    fail(file, `board-quiz eligible but only ${strandsWith2Plus} strand(s) have 2+ questions (needs 2–4)`)
  }

  const formCounts = pack.questions.reduce((acc, q) => {
    for (const f of q.forms) acc[f] = (acc[f] ?? 0) + 1
    return acc
  }, {})
  const games = GAME_SLICE_META.filter((s) => isRequirementMet(pack, s.requires)).map((s) => s.name)
  console.log(
    `  ok ${file} — ${pack.questions.length} questions (${Object.entries(formCounts)
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
console.log('All packs valid.\n')
console.log('Enrichment worklist (warnings, not failures):')
console.log(`  ${warnings.partialForms} questions offer fewer than 3 forms`)
console.log(`  ${warnings.thinDistractors} MCQ questions have fewer than ${DISTRACTOR_TARGET} distractors`)
console.log(`  ${warnings.slotlessClaims} claims are slotless (fixed polarity — cannot vary true/false)`)
console.log(`  ${warnings.noFactKey} questions have no shared factKey yet (each is its own fact)`)
