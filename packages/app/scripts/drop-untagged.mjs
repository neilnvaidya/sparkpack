/**
 * One-shot: pull questions that tag no objective out of the packs (step 6).
 *
 * The rule (Neil, 2026-07-16): **a question must be curriculum-tied or it leaves
 * the corpus.** An objective with no question is an acceptable gap — that is a
 * content-gap report, and it is useful. A question with no objective is not the
 * same thing: it is content the library cannot say anything about. It cannot be
 * found by objective, cannot be reported on, and quietly falsifies the
 * objectives-first premise while looking like coverage.
 *
 * They are pulled, not deleted. These six are good questions filed in the wrong
 * pack, and the plan's own rule is that a question with no route home is a
 * deleted question with extra steps — so they keep full provenance and go to
 * content-quarantine/no-objective.json.
 *
 * Writes through serializePack, which now agrees with Prettier byte for byte, so
 * the pack diff is the removal and nothing else.
 *
 * Delete this script once the drop is committed and reviewed.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'prettier'
import { curriculumPackSchema } from '../lib/curriculum/schema.ts'
import { serializePack } from '../lib/authoring/serialize-pack.ts'

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const packsDir = join(appDir, 'lib/curriculum/packs')
const outPath = join(appDir, 'content-quarantine/no-objective.json')

/** Pack ids to sweep. Every other pack is fully tagged. */
const PACKS = ['science-y2-animals-including-humans']

const REASON =
  'Tags no objective this pack declares. The pack is Y2 "animals including humans" ' +
  '(offspring; basic needs; exercise, diet and hygiene); these ask about herbivores, ' +
  'omnivores, carnivores, egg-laying, mammals and gills — that is classification, ' +
  'which is Year 1 "animals including humans" in the national curriculum. Filing them ' +
  'under AIH-1/2/3 would make the count read zero while meaning nothing. Route home: a ' +
  'Y1 pack, or a declared objective they genuinely meet (statutory wording required).'

const pulled = []

for (const packId of PACKS) {
  const file = join(packsDir, `${packId}.json`)
  const pack = curriculumPackSchema.parse(JSON.parse(readFileSync(file, 'utf8')))

  const drop = pack.questions.filter((q) => q.objectiveCodes.length === 0)
  if (drop.length === 0) continue

  for (const question of drop) {
    pulled.push({
      question,
      subject: pack.subject,
      year: pack.year,
      topicId: pack.topicId,
      packId: pack.id,
      reason: REASON,
      pulledAt: new Date().toISOString(),
    })
  }

  const next = { ...pack, questions: pack.questions.filter((q) => q.objectiveCodes.length > 0) }
  // Re-parse before writing: a drop must not be the thing that puts an invalid
  // pack on disk, and the game floors are real (Three in a Row and Summit Climb
  // need 16 text-only questions).
  writeFileSync(file, await serializePack(curriculumPackSchema.parse(next)))
  console.log(`  ${packId}: dropped ${drop.length} (${drop.map((q) => q.id).join(', ')}), ${next.questions.length} remain`)
}

const outFile = {
  note:
    'Questions pulled from packs because they tag no objective the pack declares. ' +
    'Not shipped, not deleted. A question must be curriculum-tied or it leaves the ' +
    'corpus; an objective with no question is an acceptable gap, but the reverse is ' +
    'not. Kept with full provenance so each has a route home. See ' +
    'Docs/CONTENT-PASS-PLAN.md step 6.',
  questions: pulled,
}
writeFileSync(outPath, await format(JSON.stringify(outFile, null, 2), { parser: 'json' }))
console.log(`\n${pulled.length} questions parked in content-quarantine/no-objective.json`)
