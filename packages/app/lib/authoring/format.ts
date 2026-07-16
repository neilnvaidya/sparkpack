/**
 * The formatting pass — Docs/CONTENT-PASS-PLAN.md, step 3b-0.
 *
 * SCOPE IS THE WHOLE POINT. Two authored sentences get rewritten; the answer set
 * only gets warned about.
 *
 *   ask / claim              → rewrite (capital, terminator, whitespace)
 *   answer / distractors /
 *   acceptableAnswers        → CHECK ONLY, never rewrite
 *
 * Auto-capitalising an option list turns "45 cm" into "45 Cm" and does real
 * damage to "¼", "2/4" and every other answer that is not a sentence. The answer
 * set is where meaning lives, so a machine may flag it but must not touch it.
 *
 * Nothing here mutates: `formatQuestion` returns proposed changes for the UI to
 * show and the human to accept. A silent rewrite while you are mid-thought is a
 * bug, not a feature.
 */

import type { CurriculumQuestion } from '@/lib/curriculum/schema'

/** A proposed rewrite of one field. The UI shows `from` → `to` and asks. */
export interface FormatFix {
  field: 'ask' | 'claim'
  from: string
  to: string
  reason: string
}

/** Something a human should look at. Never auto-applied. */
export interface FormatWarning {
  field: string
  message: string
}

export interface FormatReport {
  fixes: FormatFix[]
  warnings: FormatWarning[]
}

const tidy = (s: string) => s.replace(/\s+/g, ' ').trim()

const capitalise = (s: string) =>
  s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)

/**
 * Sentence-shaped rewrite for the two authored surfaces.
 * `terminator` is "?" for ask, "." for claim.
 */
function formatSentence(raw: string, terminator: '?' | '.'): string {
  let out = capitalise(tidy(raw))
  if (out === '') return out
  // Strip any run of trailing terminators, then apply exactly one. Handles
  // "...?." and "...??" from drafting without special-casing each.
  out = out.replace(/[.?!]+$/, '')
  return out + terminator
}

/** Leading case of a string, ignoring anything that isn't a letter. */
function leadingCase(s: string): 'upper' | 'lower' | 'none' {
  const first = s.trim()[0]
  if (!first || !/[a-zA-Z]/.test(first)) return 'none'
  return first === first.toUpperCase() ? 'upper' : 'lower'
}

/**
 * Register check for the answer set — CONTENT-RULES' "same register and length
 * as `answer`, so the correct option isn't obvious by shape".
 *
 * This is a hint, not a rule: a genuine mix ("Cardiff" vs "45 cm") is possible.
 * Hence a warning a human dismisses, never a fix.
 */
function checkRegister(answer: string, distractors: string[]): FormatWarning[] {
  const warnings: FormatWarning[] = []
  if (answer === '' || distractors.length === 0) return warnings

  const answerCase = leadingCase(answer)
  const oddCase = distractors.filter(
    (d) => leadingCase(d) !== 'none' && answerCase !== 'none' && leadingCase(d) !== answerCase
  )
  if (oddCase.length > 0) {
    warnings.push({
      field: 'distractors',
      message: `Leading case differs from the answer ("${answer}"): ${oddCase
        .map((d) => `"${d}"`)
        .join(', ')}. The correct option should not stand out by shape.`,
    })
  }

  // Length: flag an option more than 2.5× the answer, or under 40% of it, once
  // there is enough text for the ratio to mean anything.
  const outliers = distractors.filter((d) => {
    if (answer.length < 4 || d.length < 4) return false
    const ratio = d.length / answer.length
    return ratio > 2.5 || ratio < 0.4
  })
  if (outliers.length > 0) {
    warnings.push({
      field: 'distractors',
      message: `Length differs sharply from the answer ("${answer}"): ${outliers
        .map((d) => `"${d}"`)
        .join(', ')}.`,
    })
  }
  return warnings
}

/** Phrases that are fine as an MCQ option and garbage inside a claim frame. */
const BANNED_OPTION_PHRASES = [
  'all of the above',
  'none of the above',
  'none of these',
  'all of these',
  'both of the above',
]

/**
 * The full pass over one question. Pure: returns proposals, changes nothing.
 */
export function formatQuestion(q: CurriculumQuestion): FormatReport {
  const fixes: FormatFix[] = []
  const warnings: FormatWarning[] = []

  const askFormatted = formatSentence(q.ask, '?')
  if (q.ask !== '' && askFormatted !== q.ask) {
    fixes.push({
      field: 'ask',
      from: q.ask,
      to: askFormatted,
      reason: 'An `ask` is a question: leading capital, single "?", tidy spacing.',
    })
  }

  // Format the claim around its slot, never through it: "{}" must survive
  // verbatim, and a claim ending "... is {}." must not lose the slot to the
  // terminator logic.
  if (q.claim !== '') {
    const claimFormatted = formatSentence(q.claim, '.')
    if (claimFormatted !== q.claim) {
      fixes.push({
        field: 'claim',
        from: q.claim,
        to: claimFormatted,
        reason: 'A `claim` is a statement: leading capital, single ".", tidy spacing.',
      })
    }
  }

  // --- checks only, no fixes past this point ---

  const slots = q.claim.split('{}').length - 1
  if (q.claim !== '' && slots === 0) {
    warnings.push({
      field: 'claim',
      message:
        'Slotless claim (fixed polarity). Rewrite with a "{}" where the answer goes — the enrichment worklist.',
    })
  }
  if (slots > 1) {
    warnings.push({ field: 'claim', message: 'A claim may hold exactly one "{}" slot.' })
  }

  if (q.ask !== '' && /^which (of these|of the following)/i.test(q.ask)) {
    warnings.push({
      field: 'ask',
      message:
        '`ask` must stand alone with no options on screen. "Which of these..." cannot offer the open form.',
    })
  }

  for (const d of q.distractors) {
    if (BANNED_OPTION_PHRASES.some((p) => d.toLowerCase().includes(p))) {
      warnings.push({
        field: 'distractors',
        message: `"${d}" cannot be a distractor: it reads as an option but is nonsense inside the claim frame.`,
      })
    }
  }

  warnings.push(...checkRegister(q.answer, q.distractors))

  if (q.forms.includes('mcq') && q.distractors.length < 5) {
    warnings.push({
      field: 'distractors',
      message: `${q.distractors.length} distractors; the target is 5 so options vary on replay.`,
    })
  }
  if (q.forms.length < 3) {
    warnings.push({
      field: 'forms',
      message: `Offers ${q.forms.length} of 3 forms. Target is all three, or quarantine it.`,
    })
  }
  if (q.equation !== null && q.distractors.length > 0) {
    warnings.push({
      field: 'distractors',
      message:
        'Equations must not carry authored distractors — the game hides a different part each deal, so near-misses are generated at build time.',
    })
  }

  return { fixes, warnings }
}

/** Apply accepted fixes. The UI calls this only after the human says yes. */
export function applyFixes(q: CurriculumQuestion, fixes: FormatFix[]): CurriculumQuestion {
  const next = { ...q }
  for (const fix of fixes) next[fix.field] = fix.to
  return next
}
