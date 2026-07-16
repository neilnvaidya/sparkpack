/**
 * One-shot backfill: objectiveCodes for the two Y2 packs (step 6).
 *
 * The two Y2 packs were lifted from v1 with no objective tags at all, so their
 * declared objectives were unreachable — you could not ask "which questions
 * assess Y2-AS-5" and get an answer. Every other pack was tagged during 3b.
 *
 * The mapping below is the authored artefact; it is AI-drafted and awaiting
 * Neil's review, same loop as the content pass (CONTENT-RULES: "AI drafts → Zod
 * validates → human reviews → commit"). It is deliberately a script rather than
 * a hand-edit so the reasoning is reviewable next to the result.
 *
 * Writes through PRETTIER, not serializePack — deliberately. The corpus on disk
 * is Prettier-formatted (short arrays inline), and serializePack is raw
 * JSON.stringify(x, null, 2), which always expands them. Going through
 * serializePack here would reformat both packs entirely and bury 45 real tags in
 * ~700 lines of noise. That mismatch is a live bug in the authoring tool, not a
 * quirk of this script: see "the serializer fights Prettier" in
 * Docs/CONTENT-PASS-PLAN.md. Key ORDER still comes from serialize.ts, which is
 * the part that is not in dispute.
 *
 * Delete this file once the backfill is committed and reviewed.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { curriculumPackSchema } from '../lib/curriculum/schema.ts'
import { orderQuestion } from '../lib/authoring/serialize.ts'

const packsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/curriculum/packs')

const MAPPING = {
  'maths-y2-addition-subtraction': {
    // Y2-AS-2 — "recall and use addition and subtraction facts to 20 fluently":
    // every one of these is within 20.
    'eq-1': ['Y2-AS-2'], // 7 + 8 = 15
    'eq-2': ['Y2-AS-2'], // 6 + 9 = 15
    'eq-3': ['Y2-AS-2'], // 13 - 5 = 8
    'eq-4': ['Y2-AS-2'], // 16 - 9 = 7
    'tf-1': ['Y2-AS-2'], // 9 + 5
    'tf-2': ['Y2-AS-2'], // 18 - 9

    // Y2-AS-3 — "two two-digit numbers" / "a two-digit number and tens".
    'eq-5': ['Y2-AS-3'], // 24 + 16
    'eq-6': ['Y2-AS-3'], // 35 + 27
    'eq-7': ['Y2-AS-3'], // 52 - 17
    'eq-8': ['Y2-AS-3'], // 70 - 42
    'eq-9': ['Y2-AS-3'], // 38 + 38
    'eq-12': ['Y2-AS-3'], // 27 + 46
    'tf-4': ['Y2-AS-3'], // 62 - 20 — two-digit and tens
    'tf-5': ['Y2-AS-3'], // 36 + 25

    // Both: two two-digit numbers, and the "related facts up to 100" of AS-2.
    'eq-10': ['Y2-AS-2', 'Y2-AS-3'], // 45 + 55 = 100
    'eq-11': ['Y2-AS-2', 'Y2-AS-3'], // 100 - 64
    'tf-3': ['Y2-AS-2', 'Y2-AS-3'], // 30 + 40 — derived from 3 + 4
    'tf-6': ['Y2-AS-2', 'Y2-AS-3'], // 100 - 55

    // Y2-AS-1 is the "solve problems" objective — the word problems, which are
    // also AS-3 arithmetic underneath.
    'wp-1': ['Y2-AS-1', 'Y2-AS-3'], // 14 + 8
    'wp-2': ['Y2-AS-1', 'Y2-AS-3'], // 25 - 9
    'wp-3': ['Y2-AS-1', 'Y2-AS-3'], // 17 + 15
    'wp-4': ['Y2-AS-1', 'Y2-AS-3'], // 40p - 23p — AS-1 names measures explicitly
    'wp-5': ['Y2-AS-1', 'Y2-AS-3'], // 90 - 47
    'wp-6': ['Y2-AS-1', 'Y2-AS-3'], // 36 + 48

    // Y2-AS-5 — "use the inverse relationship ... to solve missing number
    // problems". This is that objective, near-verbatim.
    'mn-1': ['Y2-AS-5'],
    'mn-2': ['Y2-AS-5'],
    'mn-3': ['Y2-AS-5'],
    'mn-4': ['Y2-AS-5'],

    // Y2-AS-4 (commutativity) has no question. Reported as a gap, not invented.
  },

  'science-y2-animals-including-humans': {
    // The strands map cleanly onto the three objectives.
    // Y2-AIH-1 — "animals have offspring which grow into adults".
    'gu-1': ['Y2-AIH-1'],
    'gu-2': ['Y2-AIH-1'],
    'gu-4': ['Y2-AIH-1'],
    'gu-5': ['Y2-AIH-1'],
    'gu-6': ['Y2-AIH-1'],

    // Y2-AIH-2 — "basic needs ... for survival (water, food and air)".
    'bn-1': ['Y2-AIH-2'],
    'bn-2': ['Y2-AIH-2'],
    'bn-3': ['Y2-AIH-2'],
    'bn-4': ['Y2-AIH-2'],
    'bn-5': ['Y2-AIH-2'],
    'bn-6': ['Y2-AIH-2'],

    // Y2-AIH-3 — "exercise, eating the right amounts ... and hygiene".
    'hl-1': ['Y2-AIH-3'],
    'hl-2': ['Y2-AIH-3'],
    'hl-3': ['Y2-AIH-3'],
    'hl-4': ['Y2-AIH-3'],
    'hl-5': ['Y2-AIH-3'],
    'hl-6': ['Y2-AIH-3'],

    // aa-1..aa-6 are left UNTAGGED on purpose. They ask about herbivores /
    // omnivores / carnivores, egg-laying, mammals and gills — classification,
    // which is Year 1 "animals including humans" in the NC, not any of the three
    // objectives this pack declares. Tagging them to AIH-1/2/3 would be filing,
    // not assessing, and the whole value of objectiveCodes is that it means
    // something. The fix is a declared objective they genuinely meet, and its
    // statutory wording is Neil's to add — see Docs/CONTENT-PASS-PLAN.md step 6.
  },
}

let changed = 0
for (const [packId, tags] of Object.entries(MAPPING)) {
  const file = join(packsDir, `${packId}.json`)
  const pack = curriculumPackSchema.parse(JSON.parse(readFileSync(file, 'utf8')))
  const declared = new Set(pack.objectives.map((o) => o.code))

  for (const q of pack.questions) {
    const codes = tags[q.id]
    if (!codes) continue
    for (const code of codes) {
      if (!declared.has(code)) throw new Error(`${packId}/${q.id}: undeclared code "${code}"`)
    }
    if (q.objectiveCodes.length > 0) throw new Error(`${packId}/${q.id}: already tagged`)
    q.objectiveCodes = codes
    changed++
  }

  // Re-parse what we are about to write: a backfill must not be the thing that
  // puts an invalid pack on disk.
  const validated = curriculumPackSchema.parse(pack)
  validated.questions = validated.questions.map(orderQuestion)
  writeFileSync(file, JSON.stringify(validated, null, 2) + '\n')
  // Prettier is not a dependency of this package, so shell out to the same npx
  // prettier that already reports the corpus as clean. This restores the exact
  // on-disk formatting, leaving the tags as the only diff.
  execFileSync('npx', ['prettier', '--write', '--log-level', 'warn', file], {
    stdio: 'inherit',
  })
  const untagged = pack.questions.filter((q) => q.objectiveCodes.length === 0)
  console.log(`  ${packId}: tagged ${Object.keys(tags).length}, left ${untagged.length} untagged`)
}
console.log(`\n${changed} questions tagged.`)
