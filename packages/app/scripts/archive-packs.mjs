#!/usr/bin/env node
/**
 * Archive the current corpus before the 3b content pass.
 *
 * Copies lib/curriculum/packs/*.json to Docs/packs-archive/<ISO-date>/.
 * git is the real safety net; this is an explicit, obvious restore point that
 * does not require unpicking commits. Run once before enrichment starts.
 */

import { cpSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packsDir = join(appRoot, 'lib', 'curriculum', 'packs')
const stamp = new Date().toISOString().slice(0, 10)
const destDir = join(appRoot, 'Docs', 'packs-archive', stamp)

if (existsSync(destDir)) {
  console.error(`Archive for ${stamp} already exists: ${destDir}`)
  console.error('Refusing to overwrite. Delete it first if you meant to re-archive.')
  process.exit(1)
}

mkdirSync(destDir, { recursive: true })

const files = readdirSync(packsDir).filter((f) => f.endsWith('.json'))
for (const file of files) {
  cpSync(join(packsDir, file), join(destDir, file))
}

console.log(`Archived ${files.length} packs → Docs/packs-archive/${stamp}/`)
console.log('Commit this directory. It is the pre-3b corpus.')
