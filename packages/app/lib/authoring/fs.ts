/**
 * Server-only filesystem access for the authoring tool.
 *
 * Reads packs from DISK, not through lib/curriculum/index.ts — that loader
 * caches parsed packs for the lifetime of the process, so after a write it would
 * serve stale content back to the editor.
 *
 * Only ever imported by route handlers under app/api/dev/, which are server-side
 * and dev-gated. Do not import this from a client component — node:fs would
 * break the bundle.
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { curriculumPackSchema, type CurriculumPack } from '@/lib/curriculum/schema'
import {
  quarantineFileSchema,
  EMPTY_QUARANTINE,
  type QuarantineFile,
} from './quarantine'

const APP_ROOT = process.cwd()
const PACKS_DIR = join(APP_ROOT, 'lib', 'curriculum', 'packs')
const QUARANTINE_FILE = join(APP_ROOT, 'content-quarantine', 'form-resistant.json')

/**
 * Pack ids are kebab-case "<subject>-y<year>-<topicId>". Anything else is
 * rejected before it can reach `join` — a packId of "../../etc/passwd" must not
 * become a path. The tool is dev-only, but a path-traversal write is not
 * something to leave lying around regardless.
 */
const SAFE_PACK_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function packPath(packId: string): string {
  if (!SAFE_PACK_ID.test(packId)) throw new Error(`Unsafe pack id: "${packId}"`)
  return join(PACKS_DIR, `${packId}.json`)
}

/** Every pack, parsed fresh from disk. Throws on the first invalid pack. */
export async function readAllPacks(): Promise<CurriculumPack[]> {
  const files = (await readdir(PACKS_DIR)).filter((f) => f.endsWith('.json'))
  const packs: CurriculumPack[] = []
  for (const file of files.sort()) {
    const raw = JSON.parse(await readFile(join(PACKS_DIR, file), 'utf8'))
    const parsed = curriculumPackSchema.safeParse(raw)
    if (!parsed.success) {
      throw new Error(`Invalid pack ${file}: ${parsed.error.message}`)
    }
    packs.push(parsed.data)
  }
  return packs
}

export async function writePackFile(packId: string, contents: string): Promise<void> {
  await writeFile(packPath(packId), contents, 'utf8')
}

export async function readQuarantine(): Promise<QuarantineFile> {
  try {
    const raw = JSON.parse(await readFile(QUARANTINE_FILE, 'utf8'))
    return quarantineFileSchema.parse(raw)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return EMPTY_QUARANTINE
    throw err
  }
}

export async function writeQuarantine(contents: string): Promise<void> {
  await mkdir(join(APP_ROOT, 'content-quarantine'), { recursive: true })
  await writeFile(QUARANTINE_FILE, contents, 'utf8')
}
