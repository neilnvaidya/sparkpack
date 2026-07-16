/**
 * Canonical pack JSON — the half that decides whitespace.
 *
 * **This must agree with Prettier, byte for byte, or the tool is destructive.**
 *
 * The corpus on disk is Prettier-formatted: short arrays inline
 * (`"forms": ["open", "mcq", "truefalse"]`), longer ones expanded, the split
 * decided by Prettier's 80-column print width. This used to be
 * `JSON.stringify(pack, null, 2)`, which always expands every array. The two
 * agreed until the 3b content pass reformatted all 19 packs, and after that the
 * first Write in the authoring tool would reformat a whole pack — roughly 700
 * lines of noise around one real edit.
 *
 * That is not cosmetic. It breaks the tool's actual contract ("a save produces a
 * reviewable `git diff` and nothing else"), and `git diff` is the second review
 * surface for the content pass after the tool itself. A save you cannot read is
 * a save you cannot review.
 *
 * So run the real Prettier rather than approximate it. Approximating it is how
 * this drifts again: the inline-or-expand rule is print-width-sensitive and not
 * worth reimplementing.
 *
 * Server-only, because Prettier is. Key ORDER comes from `serialize.ts`, which
 * is pure and safe to import anywhere — including the client authoring page.
 */

import { format, resolveConfig } from 'prettier'
import type { CurriculumPack } from '@/lib/curriculum/schema'
import { orderPack } from '@/lib/authoring/serialize'

/**
 * Canonical pack JSON: declared key order, then Prettier.
 *
 * The `null, 2` matters and is not just tidiness before a reformat. Prettier
 * preserves an *object's* expansion: it keeps an object multi-line if the source
 * it was handed had a newline after the `{`. Feed it compact JSON and it
 * collapses every question that fits 80 columns onto one line — which is not
 * what the corpus looks like. Indenting first supplies that hint, and Prettier
 * then decides the arrays on width, which is the half we actually want from it.
 *
 * `resolveConfig` so a `.prettierrc` added later is honoured here too — the repo
 * has none today, and the corpus is formatted with Prettier's defaults.
 */
export async function serializePack(pack: CurriculumPack): Promise<string> {
  const config = await resolveConfig('pack.json')
  return format(JSON.stringify(orderPack(pack), null, 2), {
    ...config,
    parser: 'json',
  })
}
