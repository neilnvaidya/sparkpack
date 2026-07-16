/**
 * Pack validator – run with `npm run validate-packs`.
 *
 * Zod-parses every pack in lib/curriculum/packs/ against the real schema (which
 * already requires all three forms, 5+ distractors, a slotted claim, and
 * checks equation arithmetic, distractor uniqueness and per-form data — see
 * step 5, Docs/CONTENT-PASS-PLAN.md), then applies what the schema cannot
 * express:
 *   - pack id matches "<subject>-y<year>-<topicId>" and the filename
 *   - board-quiz fit: strand grouping produces a 2–4 column board
 *   - which game slices each pack can power (informational)
 *
 * Game availability comes from lib/games/slice-requirements.ts — the same data
 * the app uses — so a new game is covered here the moment it is registered.
 *
 * factKey reuse is reported, not enforced here: `factKey === id` is the correct
 * default for a question that is its own fact (CONTENT-RULES.md), so most of
 * the corpus is expected to stay there permanently — merging is a human call
 * made per shared fact, not a count that should trend to zero.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { curriculumPackSchema } from '../lib/curriculum/schema.ts'
import { GAME_SLICE_META, isRequirementMet } from '../lib/games/slice-requirements.ts'
import { enumeratedAskIssues } from '../lib/curriculum/checks.ts'

const packsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/curriculum/packs')

let errorCount = 0
let noFactKeyCount = 0
const enumeratedAsks = []

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
    if (q.factKey === q.id) noFactKeyCount++
  }

  for (const issue of enumeratedAskIssues(pack.questions)) {
    enumeratedAsks.push({ pack: pack.id, ...issue })
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
console.log(
  `${noFactKeyCount} questions are their own fact (factKey === id) — the correct default; ` +
    'merge only where you are sure two questions share a fact (CONTENT-RULES.md).'
)

if (enumeratedAsks.length > 0) {
  console.log(
    `\n${enumeratedAsks.length} questions name their own candidates in \`ask\` but have ` +
      'distractors outside that set — the MCQ puts options on screen the question never ' +
      'offered, and can mark a right answer wrong. Rewrite so every distractor is one of ' +
      'the named candidates, or so the ask names none of them (CONTENT-RULES.md).\n'
  )
  for (const issue of enumeratedAsks) {
    console.log(`  ${issue.pack} / ${issue.questionId}`)
    console.log(`    ask:      ${issue.ask}`)
    console.log(`    offered:  ${issue.inSet.join(', ')}`)
    console.log(`    escapes:  ${issue.escapes.join(', ')}`)
  }
}
