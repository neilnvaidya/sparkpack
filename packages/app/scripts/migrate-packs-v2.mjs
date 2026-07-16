/**
 * One-shot lift of every pack from schemaVersion 1 (items keyed by `kind`) to
 * schemaVersion 2 (questions with `forms`). Run once, commit the output, delete
 * this script and the v1 schema.
 *
 *     node scripts/migrate-packs-v2.mjs [--write]
 *
 * It invents NOTHING. Each item becomes exactly one question declaring only the
 * form its data already supports, so the corpus stays valid and every game
 * builds the same content. Enrichment — adding `ask`/`claim`/distractors so a
 * question offers all three forms, and merging duplicate facts under one
 * factKey — is a separate, human-reviewed pass.
 *
 * Deliberately not done here:
 *  - factKey defaults to the question's own id. Merging facts is a judgement
 *    call; a wrong guess silently stops a game dealing two fair questions.
 *  - Equation distractors. The answer depends on which part the game hides at
 *    build time ("24 + ? = 40" answers 16, not 40), so plausible near-misses
 *    cannot be authored statically — they must be generated at build time.
 *  - Shortening the 33 prose qa answers into option-able `answer` + long-form
 *    `answerDetail`. Reported below as the enrichment worklist.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { curriculumPackV1Schema, curriculumPackSchema } from '../lib/curriculum/schema.ts'

const packsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/curriculum/packs')
const write = process.argv.includes('--write')

/** Fixed key order — the JSON is read by humans and, later, an authoring tool. */
function question(fields) {
  return {
    id: fields.id,
    factKey: fields.factKey,
    difficulty: fields.difficulty,
    strand: fields.strand,
    objectiveCodes: fields.objectiveCodes,
    forms: fields.forms,
    ask: fields.ask,
    claim: fields.claim,
    claimIsTrue: fields.claimIsTrue,
    answer: fields.answer,
    answerDetail: fields.answerDetail,
    acceptableAnswers: fields.acceptableAnswers,
    distractors: fields.distractors,
    equation: fields.equation,
  }
}

function liftItem(item) {
  const base = {
    id: item.id,
    // Its own id: every question is its own fact until a human says otherwise.
    factKey: item.id,
    difficulty: item.difficulty,
    strand: item.strand ?? '',
    objectiveCodes: item.objectiveCodes ?? [],
    ask: '',
    claim: '',
    claimIsTrue: null,
    answer: '',
    answerDetail: '',
    acceptableAnswers: [],
    distractors: [],
    equation: null,
  }

  switch (item.kind) {
    case 'qa':
      return question({
        ...base,
        forms: ['open'],
        ask: item.prompt,
        answer: item.answer,
        acceptableAnswers: item.acceptableAnswers ?? [],
      })
    case 'mcq': {
      const answer = item.options[item.correctIndex]
      return question({
        ...base,
        forms: ['mcq'],
        ask: item.prompt,
        answer,
        acceptableAnswers: [answer],
        distractors: item.options.filter((_, i) => i !== item.correctIndex),
      })
    }
    case 'truefalse':
      // Slotless: the polarity was authored, not derived. Enrichment rewrites
      // this into "<frame> {}" + answer and sets claimIsTrue back to null.
      return question({
        ...base,
        forms: ['truefalse'],
        claim: item.statement,
        claimIsTrue: item.isTrue,
      })
    case 'equation':
      return question({
        ...base,
        forms: ['open'],
        equation: {
          operator: item.operator,
          left: item.left,
          right: item.right,
          result: item.result,
        },
      })
    default:
      throw new Error(`Unknown kind: ${item.kind}`)
  }
}

const files = readdirSync(packsDir).filter((f) => f.endsWith('.json')).sort()
const worklist = { proseAnswers: [], singleForm: 0, total: 0 }
let failed = 0

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(packsDir, file), 'utf8'))
  const parsed = curriculumPackV1Schema.safeParse(raw)
  if (!parsed.success) {
    console.error(`  ERROR ${file}: not a valid v1 pack — ${parsed.error.issues[0]?.message}`)
    failed++
    continue
  }
  const v1 = parsed.data

  const v2 = {
    schemaVersion: 2,
    id: v1.id,
    subject: v1.subject,
    keyStage: v1.keyStage,
    year: v1.year,
    topicId: v1.topicId,
    title: v1.title,
    description: v1.description,
    objectives: v1.objectives,
    questions: v1.items.map(liftItem),
  }

  const check = curriculumPackSchema.safeParse(v2)
  if (!check.success) {
    console.error(`  ERROR ${file}: lifted pack fails v2 schema:`)
    for (const issue of check.error.issues.slice(0, 5)) {
      console.error(`         ${issue.path.join('.')}: ${issue.message}`)
    }
    failed++
    continue
  }

  worklist.total += v2.questions.length
  worklist.singleForm += v2.questions.filter((q) => q.forms.length < 3).length
  for (const q of v2.questions) {
    // Prose answers cannot sit in an option list; a human must split them.
    if (q.answer.split(/\s+/).length > 3) worklist.proseAnswers.push(`${v1.id}/${q.id}`)
  }

  if (write) {
    writeFileSync(join(packsDir, file), JSON.stringify(v2, null, 2) + '\n')
  }
  console.log(`  ok ${basename(file)} — ${v1.items.length} items → ${v2.questions.length} questions`)
}

console.log('')
if (failed > 0) {
  console.error(`${failed} pack(s) failed. Nothing written.`)
  process.exit(1)
}
console.log(`${worklist.total} questions. Enrichment worklist:`)
console.log(`  ${worklist.singleForm} questions offer fewer than 3 forms`)
console.log(`  ${worklist.proseAnswers.length} prose answers need answer/answerDetail split`)
console.log(write ? '\nPacks rewritten.' : '\nDry run — pass --write to rewrite the packs.')
