#!/usr/bin/env node
/**
 * Emit a 3b drafting skeleton for one pack.
 *
 *   node scripts/make-skeleton.mjs geography-y3-uk
 *   → content-drafts/geography-y3-uk.skeleton.json
 *
 * The skeleton carries the STRUCTURAL fields through untouched (id, strand,
 * objectiveCodes, equation) and blanks the AUTHORED ones (ask,
 * claim, answer, distractors, ...). That split is the whole point: the drafter
 * can only write prose. It cannot invent a strand, drop an objective, or
 * renumber an id, because those values are already sitting in the file it is
 * filling in.
 *
 * The existing pack is the SOURCE the drafter reads. The skeleton is the TARGET
 * it fills. Neither is the pack itself — nothing reaches lib/curriculum/packs/
 * until it has been reviewed in the authoring tool.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packId = process.argv[2]

if (!packId) {
  console.error('Usage: node scripts/make-skeleton.mjs <packId>')
  console.error('e.g.   node scripts/make-skeleton.mjs geography-y3-uk')
  process.exit(1)
}

const packPath = join(appRoot, 'lib', 'curriculum', 'packs', `${packId}.json`)
let pack
try {
  pack = JSON.parse(readFileSync(packPath, 'utf8'))
} catch {
  console.error(`No such pack: ${packPath}`)
  process.exit(1)
}

const skeleton = {
  ...pack,
  questions: pack.questions.map((q) => ({
    // --- carried through: the drafter must not change these ---
    id: q.id,
    factKey: q.id,
    strand: q.strand,
    objectiveCodes: q.objectiveCodes,
    // --- to be written ---
    forms: [],
    ask: '',
    claim: '',
    answer: '',
    answerDetail: '',
    acceptableAnswers: [],
    distractors: [],
    // --- carried through ---
    equation: q.equation,
  })),
}

const outDir = join(appRoot, 'content-drafts')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, `${packId}.skeleton.json`)
writeFileSync(outPath, JSON.stringify(skeleton, null, 2) + '\n', 'utf8')

const equations = pack.questions.filter((q) => q.equation !== null).length
console.log(`Skeleton → content-drafts/${packId}.skeleton.json`)
console.log(`  ${pack.questions.length} questions (${equations} equations — no distractors for those)`)
console.log(`  Source for the drafter: lib/curriculum/packs/${packId}.json`)
console.log(`  Instructions: Docs/DRAFTER-INSTRUCTIONS.md`)
