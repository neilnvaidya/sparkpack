/**
 * Whole-corpus snapshot: every pack x every available game, built and serialised.
 *
 * This is the regression net for content/rendering refactors. `slices.ts` builders
 * still draw from global Math.random (via shuffleDeck), so we stub it with a seeded
 * PRNG and reseed before every build — each entry is then independent of iteration
 * order, and the whole dump is byte-stable across runs.
 *
 * When a refactor is meant to be behaviour-preserving, this snapshot must not move.
 * When it is meant to change rendering, the diff is the review.
 */

import { afterAll, beforeAll, expect, test } from 'vitest'
import { getAllPacks } from '@/lib/curriculum'
import { GAME_SLICES, isSliceAvailable } from '@/lib/games/slices'

/** mulberry32 — small, fast, deterministic. */
function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const realRandom = Math.random
beforeAll(() => {
  Math.random = seeded(1)
})
afterAll(() => {
  Math.random = realRandom
})

test('every pack builds every available game identically', () => {
  const dump: Record<string, unknown> = {}

  for (const pack of getAllPacks()) {
    for (const slice of GAME_SLICES) {
      if (!isSliceAvailable(pack, slice)) continue
      // Reseed per build so entries don't depend on iteration order.
      Math.random = seeded(1)
      dump[`${pack.id} :: ${slice.templateId}`] = slice.build(pack)
    }
  }

  expect(Object.keys(dump).length).toBeGreaterThan(0)
  expect(dump).toMatchSnapshot()
})
