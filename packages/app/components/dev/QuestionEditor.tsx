'use client'

/**
 * One question, three forms, side by side — the core of the authoring tool.
 *
 * The layout IS the argument the schema makes: one fact wears three faces, so
 * you should see all three at once and notice when one of them is wrong.
 *
 *   [ Open ]            [ MCQ ]                   [ True / False ]
 *   ask, answer,        the same ask, then the    the claim frame, plus a live
 *   answerDetail,       answer pinned on top      preview of the TRUE fill and
 *   acceptableAnswers   of the distractors        one FALSE fill
 *
 * `ask` and `answer` are SHARED fields rendered in two panels — editing either
 * updates both, because `ask` feeds open and mcq. They are tinted so that reads
 * as the model rather than a bug.
 */

import { useMemo } from 'react'
import type { CurriculumPack, CurriculumQuestion, QuestionForm } from '@/lib/curriculum/schema'
import { formatQuestion, applyFixes } from '@/lib/authoring/format'
import { INK } from '@/lib/ui/theme'
import { Label, Panel, StringListField, TextField, inputStyle } from './fields'

const FORM_ACCENT: Record<QuestionForm, string> = {
  open: '#4f46e5',
  mcq: '#0d9488',
  truefalse: '#d97706',
}

/**
 * Why a form cannot be declared yet, or null if it can. Mirrors the schema's
 * per-form data rules — stating the reason on a disabled checkbox teaches the
 * contract better than any doc does.
 */
function formBlocker(q: CurriculumQuestion, form: QuestionForm): string | null {
  if (form === 'open') {
    return q.ask === '' && q.equation === null ? 'needs an `ask` (or an equation)' : null
  }
  if (form === 'mcq') {
    if (q.ask === '') return 'needs an `ask`'
    if (q.answer === '') return 'needs an `answer`'
    if (q.distractors.length < 1) return 'needs at least one distractor'
    return null
  }
  return q.claim === '' ? 'needs a `claim`' : null
}

export default function QuestionEditor({
  pack,
  question,
  onChange,
  onDelete,
  onQuarantine,
}: {
  pack: CurriculumPack
  question: CurriculumQuestion
  onChange: (q: CurriculumQuestion) => void
  onDelete: () => void
  onQuarantine: (reason: string) => void
}) {
  const q = question
  const set = <K extends keyof CurriculumQuestion>(key: K, value: CurriculumQuestion[K]) =>
    onChange({ ...q, [key]: value })

  const report = useMemo(() => formatQuestion(q), [q])

  const slots = q.claim.split('{}').length - 1
  const fillClaim = (fill: string) => (slots === 1 ? q.claim.replace('{}', fill) : q.claim)

  const toggleForm = (form: QuestionForm) => {
    const has = q.forms.includes(form)
    if (has) {
      if (q.forms.length === 1) return // a question must offer at least one form
      set('forms', q.forms.filter((f) => f !== form))
    } else {
      const order: QuestionForm[] = ['open', 'mcq', 'truefalse']
      set('forms', order.filter((f) => f === form || q.forms.includes(f)))
    }
  }

  return (
    <div style={{ padding: '16px', background: INK.bg, borderTop: `1px solid ${INK.border}` }}>
      {/* --- shared metadata --- */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div style={{ minWidth: '150px' }}>
          <Label>id</Label>
          <input value={q.id} style={inputStyle} onChange={(e) => set('id', e.target.value)} />
        </div>
        <div style={{ minWidth: '150px' }}>
          <Label hint="same fact = same key">factKey</Label>
          <input value={q.factKey} style={inputStyle} onChange={(e) => set('factKey', e.target.value)} />
        </div>
        <div style={{ minWidth: '150px' }}>
          <Label>strand</Label>
          <input value={q.strand} style={inputStyle} onChange={(e) => set('strand', e.target.value)} />
        </div>
      </div>


      {/* --- forms --- */}
      <div style={{ marginBottom: '14px' }}>
        <Label hint="target: all three">forms</Label>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {(['open', 'mcq', 'truefalse'] as QuestionForm[]).map((form) => {
            const blocker = formBlocker(q, form)
            const checked = q.forms.includes(form)
            return (
              <label
                key={form}
                title={blocker ?? ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: blocker && !checked ? INK.textFaint : INK.text,
                  cursor: blocker && !checked ? 'not-allowed' : 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!!blocker && !checked}
                  onChange={() => toggleForm(form)}
                />
                {form}
                {blocker && !checked && (
                  <span style={{ fontSize: '11px', color: INK.textFaint }}>— {blocker}</span>
                )}
              </label>
            )
          })}
        </div>
      </div>

      {/* --- objectives --- */}
      <div style={{ marginBottom: '16px' }}>
        <Label hint="from this pack's declared objectives">objectiveCodes</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {pack.objectives.map((o) => (
            <label key={o.code} style={{ display: 'flex', gap: '8px', fontSize: '12px', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={q.objectiveCodes.includes(o.code)}
                onChange={(e) =>
                  set(
                    'objectiveCodes',
                    e.target.checked
                      ? [...q.objectiveCodes, o.code]
                      : q.objectiveCodes.filter((c) => c !== o.code)
                  )
                }
              />
              <span style={{ color: INK.textDim, lineHeight: 1.4 }}>
                <strong style={{ color: INK.text }}>{o.code}</strong> — {o.statement}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* --- the three panels --- */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', flexWrap: 'wrap' }}>
        <Panel
          title="Open"
          subtitle="Must stand alone — read it aloud to a class with no board."
          accent={FORM_ACCENT.open}
          disabled={!q.forms.includes('open')}
        >
          <TextField
            label="ask"
            hint="shared with MCQ"
            shared
            multiline
            value={q.ask}
            placeholder="What is the capital city of Wales?"
            onChange={(v) => set('ask', v)}
          />
          <TextField
            label="answer"
            hint="shared with MCQ · short, canonical"
            shared
            value={q.answer}
            placeholder="Cardiff"
            onChange={(v) => set('answer', v)}
          />
          <TextField
            label="answerDetail"
            hint="prose the teacher reads on reveal"
            multiline
            value={q.answerDetail}
            onChange={(v) => set('answerDetail', v)}
          />
          <StringListField
            label="acceptableAnswers"
            hint="lowercase; don't repeat the answer"
            values={q.acceptableAnswers}
            addLabel="Add acceptable answer"
            onChange={(v) => set('acceptableAnswers', v)}
          />
        </Panel>

        <Panel
          title="Multiple choice"
          subtitle="Authoring order — the game draws 3 distractors and shuffles, so a pupil never sees this arrangement."
          accent={FORM_ACCENT.mcq}
          disabled={!q.forms.includes('mcq')}
        >
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              background: '#f7f8fc',
              border: `1px dashed ${INK.border}`,
              fontSize: '13px',
              color: INK.textDim,
              marginBottom: '12px',
              lineHeight: 1.4,
            }}
          >
            {q.ask || <em style={{ color: INK.textFaint }}>the ask, shared from the Open panel</em>}
          </div>

          <Label>options</Label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              marginBottom: '8px',
              borderRadius: '6px',
              background: '#e2f3dc',
              border: '1px solid #26890c',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#26890c', letterSpacing: '0.06em' }}>
              CORRECT
            </span>
            <span style={{ fontSize: '14px', color: INK.text }}>
              {q.answer || <em style={{ color: INK.textFaint }}>set the answer</em>}
            </span>
          </div>
          <StringListField
            label="distractors"
            hint={`${q.distractors.length} of 5 · each independently wrong, each grammatical in the claim frame`}
            values={q.distractors}
            addLabel="Add distractor"
            markFirstCorrect
            onChange={(v) => set('distractors', v)}
          />
        </Panel>

        <Panel
          title="True / False"
          subtitle="One {} slot. Answer fills it TRUE; any distractor fills it FALSE."
          accent={FORM_ACCENT.truefalse}
          disabled={!q.forms.includes('truefalse')}
        >
          <TextField
            label="claim"
            hint="exactly one {}"
            multiline
            value={q.claim}
            placeholder="The capital city of Wales is {}."
            onChange={(v) => set('claim', v)}
          />

          {slots === 1 ? (
            <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
              <Label>preview</Label>
              <p style={{ margin: '0 0 6px', color: INK.text }}>
                <strong style={{ color: '#26890c' }}>TRUE</strong> — {fillClaim(q.answer || '…')}
              </p>
              <p style={{ margin: 0, color: INK.text }}>
                <strong style={{ color: '#d81b43' }}>FALSE</strong> — {fillClaim(q.distractors[0] || '…')}
              </p>
            </div>
          ) : (
            <div>
              <Label hint="transitional — rewrite with a slot">claimIsTrue</Label>
              <select
                value={q.claimIsTrue === null ? '' : String(q.claimIsTrue)}
                style={inputStyle}
                onChange={(e) =>
                  set('claimIsTrue', e.target.value === '' ? null : e.target.value === 'true')
                }
              >
                <option value="">null (needs a slot)</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
              <p style={{ fontSize: '11px', color: INK.textFaint, lineHeight: 1.4, marginTop: '8px' }}>
                A slotless claim has fixed polarity and cannot vary. Rewrite it with a {'{}'} slot — this
                field disappears once every pack is enriched.
              </p>
            </div>
          )}
        </Panel>
      </div>

      {/* --- formatting pass --- */}
      {(report.fixes.length > 0 || report.warnings.length > 0) && (
        <div
          style={{
            marginTop: '14px',
            border: `1px solid ${INK.border}`,
            borderRadius: '8px',
            background: INK.surface,
            padding: '12px',
          }}
        >
          {report.fixes.length > 0 && (
            <div style={{ marginBottom: report.warnings.length ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <Label>formatting — proposed, not applied</Label>
                <button
                  type="button"
                  onClick={() => onChange(applyFixes(q, report.fixes))}
                  style={{
                    border: 'none',
                    background: '#7c3aed',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Apply {report.fixes.length}
                </button>
              </div>
              {report.fixes.map((f, i) => (
                <p key={i} style={{ margin: '0 0 4px', fontSize: '12px', color: INK.textDim, lineHeight: 1.5 }}>
                  <strong style={{ color: INK.text }}>{f.field}</strong>{' '}
                  <span style={{ textDecoration: 'line-through' }}>{f.from}</span> → <strong>{f.to}</strong>
                  <br />
                  <span style={{ color: INK.textFaint }}>{f.reason}</span>
                </p>
              ))}
            </div>
          )}
          {report.warnings.length > 0 && (
            <div>
              <Label>review — human judgement, never auto-fixed</Label>
              {report.warnings.map((w, i) => (
                <p key={i} style={{ margin: '0 0 4px', fontSize: '12px', color: INK.textDim, lineHeight: 1.5 }}>
                  <strong style={{ color: '#d97706' }}>{w.field}</strong> — {w.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- destructive actions --- */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <button
          type="button"
          onClick={() => {
            const reason = window.prompt(
              'Quarantine: which forms does this resist, and why?\n\nThis is the design input for the future "pick all that are correct" form — be specific.'
            )
            if (reason && reason.trim()) onQuarantine(reason.trim())
          }}
          style={{
            border: `1px solid ${INK.borderStrong}`,
            background: INK.surface,
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            color: INK.textDim,
          }}
        >
          Quarantine (form-resistant)
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete question "${q.id}"? Quarantine keeps it; delete does not.`)) onDelete()
          }}
          style={{
            border: '1px solid #d81b43',
            background: INK.surface,
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#d81b43',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
