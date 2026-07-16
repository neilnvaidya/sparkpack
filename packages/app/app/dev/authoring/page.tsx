'use client'

/**
 * The authoring tool — Docs/CONTENT-PASS-PLAN.md, step 3b-0.
 *
 * Dev-only. Three jobs, and it must serve all three:
 *   1. review surface for the AI-drafted content of 3b
 *   2. repair surface — edit and delete without hand-editing JSON
 *   3. manual authoring surface — write a question from scratch
 *
 * The tree is driven by lib/curriculum/map.ts, so the tool cannot drift from the
 * app's own idea of the curriculum. Packs are read from disk through
 * /api/dev/packs rather than the loader, which caches and would go stale after a
 * write.
 *
 * No autosave. Writing is one explicit button — autosave plus a formatting pass
 * means the file changes under you while you are still thinking.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CurriculumPack, CurriculumQuestion, QuestionForm } from '@/lib/curriculum/schema'
import { CURRICULUM_MAP } from '@/lib/curriculum/map'
import { blankQuestion } from '@/lib/authoring/serialize'
import { formatQuestion } from '@/lib/authoring/format'
import { INK, SUBJECT_ACCENTS } from '@/lib/ui/theme'
import QuestionEditor from '@/components/dev/QuestionEditor'

/** Three in a Row and Summit Climb both need this many text-only questions. */
const GAME_FLOOR = 16

interface SaveState {
  status: 'idle' | 'saving' | 'saved' | 'error'
  message?: string
  issues?: { path: string; message: string }[]
}

export default function AuthoringPage() {
  const [packs, setPacks] = useState<CurriculumPack[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<CurriculumPack | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [save, setSave] = useState<SaveState>({ status: 'idle' })

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch('/api/dev/packs')
      if (!res.ok) throw new Error(`${res.status} — the authoring API is dev-only`)
      const data = await res.json()
      setPacks(data.packs)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const selectPack = (packId: string) => {
    if (draft && dirty && !window.confirm('Discard unsaved changes?')) return
    const pack = packs?.find((p) => p.id === packId) ?? null
    setSelectedId(packId)
    setDraft(pack ? structuredClone(pack) : null)
    setExpanded(null)
    setSave({ status: 'idle' })
  }

  const original = useMemo(
    () => packs?.find((p) => p.id === selectedId) ?? null,
    [packs, selectedId]
  )
  const dirty = useMemo(
    () => !!draft && !!original && JSON.stringify(draft) !== JSON.stringify(original),
    [draft, original]
  )

  const updateQuestion = (id: string, next: CurriculumQuestion) => {
    if (!draft) return
    setDraft({ ...draft, questions: draft.questions.map((q) => (q.id === id ? next : q)) })
  }

  const deleteQuestion = (id: string) => {
    if (!draft) return
    setDraft({ ...draft, questions: draft.questions.filter((q) => q.id !== id) })
    setExpanded(null)
  }

  const addQuestion = () => {
    if (!draft) return
    let n = draft.questions.length + 1
    let id = `q-${n}`
    while (draft.questions.some((q) => q.id === id)) id = `q-${++n}`
    setDraft({ ...draft, questions: [...draft.questions, blankQuestion(id)] })
    setExpanded(id)
  }

  const writePack = async () => {
    if (!draft) return
    setSave({ status: 'saving' })
    const res = await fetch(`/api/dev/packs/${draft.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const data = await res.json()
    if (!res.ok) {
      setSave({ status: 'error', message: data.error, issues: data.issues })
      return
    }
    setSave({ status: 'saved', message: `Wrote ${data.questions} questions` })
    await load()
    setDraft(structuredClone(draft))
  }

  const quarantine = async (questionId: string, reason: string) => {
    if (!draft) return
    if (dirty) {
      window.alert('Write your changes first — quarantine reads the pack from disk.')
      return
    }
    const res = await fetch('/api/dev/quarantine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: draft.id, questionId, reason }),
    })
    const data = await res.json()
    if (!res.ok) {
      setSave({ status: 'error', message: data.error })
      return
    }
    setSave({ status: 'saved', message: `Quarantined ${questionId} — ${data.remaining} left` })
    await load()
    const fresh = await fetch('/api/dev/packs').then((r) => r.json())
    setDraft(fresh.packs.find((p: CurriculumPack) => p.id === draft.id) ?? null)
    setExpanded(null)
  }

  const textCount = draft?.questions.filter((q) => q.equation === null).length ?? 0

  return (
    <div style={{ display: 'flex', height: '100vh', background: INK.bg, color: INK.text, fontSize: '14px' }}>
      {/* ---------------- tree ---------------- */}
      <aside
        style={{
          width: '280px',
          flexShrink: 0,
          borderRight: `1px solid ${INK.border}`,
          background: INK.surface,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        <h1 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 2px' }}>Authoring</h1>
        <p style={{ fontSize: '11px', color: INK.textFaint, margin: '0 0 16px' }}>
          Dev only. Writes to lib/curriculum/packs.
        </p>

        {CURRICULUM_MAP.map((subject) => {
          const accent = SUBJECT_ACCENTS[subject.subject]
          return (
            <div key={subject.subject} style={{ marginBottom: '14px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: '6px',
                }}
              >
                {subject.label}
              </div>
              {subject.years.map((year) => (
                <div key={year.year} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: INK.textFaint, margin: '0 0 3px 4px' }}>
                    Year {year.year} · {year.keyStage}
                  </div>
                  {year.topics.map((topic) => {
                    const pack = topic.packId ? packs?.find((p) => p.id === topic.packId) : null
                    const selected = topic.packId === selectedId
                    return (
                      <button
                        key={topic.topicId}
                        type="button"
                        disabled={!topic.packId}
                        onClick={() => topic.packId && selectPack(topic.packId)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '5px 8px',
                          marginBottom: '1px',
                          fontSize: '12px',
                          cursor: topic.packId ? 'pointer' : 'default',
                          background: selected ? '#ede7fd' : 'transparent',
                          color: topic.packId ? (selected ? '#7c3aed' : INK.textDim) : INK.textFaint,
                          fontWeight: selected ? 700 : 400,
                        }}
                      >
                        {topic.title}
                        {pack && (
                          <span style={{ color: INK.textFaint, fontWeight: 400 }}> · {pack.questions.length}</span>
                        )}
                        {!topic.packId && <span style={{ fontStyle: 'italic' }}> · none</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </aside>

      {/* ---------------- editor ---------------- */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {loadError && (
          <div style={{ padding: '24px', color: '#d81b43' }}>
            <strong>Could not load packs.</strong>
            <p style={{ fontSize: '13px' }}>{loadError}</p>
          </div>
        )}

        {!loadError && !draft && (
          <div style={{ padding: '40px', color: INK.textDim, maxWidth: '520px', lineHeight: 1.6 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: INK.text }}>Pick a topic</h2>
            <p>
              Each question shows its three forms side by side. <code>ask</code> and <code>answer</code>{' '}
              are shared between the Open and MCQ panels — edit either.
            </p>
            <p>
              Formatting is proposed, never applied silently, and only ever to <code>ask</code> and{' '}
              <code>claim</code>. The answer set is only ever warned about.
            </p>
          </div>
        )}

        {draft && (
          <>
            <header
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                background: INK.surface,
                borderBottom: `1px solid ${INK.border}`,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{draft.title}</h2>
                <p style={{ fontSize: '11px', color: INK.textFaint, margin: '2px 0 0' }}>
                  {draft.id} · {draft.questions.length} questions · {textCount} text-only
                  {textCount < GAME_FLOOR && (
                    <strong style={{ color: '#d81b43' }}>
                      {' '}
                      · below the {GAME_FLOOR} floor — Three in a Row and Summit Climb will not offer
                    </strong>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  border: `1px dashed ${INK.borderStrong}`,
                  background: 'transparent',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: INK.textDim,
                }}
              >
                Add question
              </button>
              <button
                type="button"
                onClick={writePack}
                disabled={!dirty || save.status === 'saving'}
                style={{
                  border: 'none',
                  background: dirty ? '#7c3aed' : INK.border,
                  color: dirty ? '#fff' : INK.textFaint,
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: dirty ? 'pointer' : 'default',
                }}
              >
                {save.status === 'saving' ? 'Writing…' : dirty ? 'Write' : 'Saved'}
              </button>
            </header>

            {save.status === 'error' && (
              <div style={{ margin: '12px 20px', padding: '12px', borderRadius: '8px', background: '#fbe0e6', border: '1px solid #d81b43' }}>
                <strong style={{ color: '#d81b43', fontSize: '13px' }}>{save.message}</strong>
                {save.issues?.map((i, n) => (
                  <p key={n} style={{ margin: '4px 0 0', fontSize: '12px', color: INK.textDim }}>
                    <code>{i.path}</code> — {i.message}
                  </p>
                ))}
              </div>
            )}
            {save.status === 'saved' && !dirty && (
              <div style={{ margin: '12px 20px', padding: '8px 12px', borderRadius: '8px', background: '#e2f3dc', color: '#26890c', fontSize: '12px', fontWeight: 700 }}>
                {save.message}
              </div>
            )}

            <div style={{ padding: '16px 20px 60px' }}>
              {draft.questions.map((q) => {
                const isOpen = expanded === q.id
                const report = formatQuestion(q)
                return (
                  <div
                    key={q.id}
                    style={{
                      border: `1px solid ${INK.border}`,
                      borderRadius: '8px',
                      marginBottom: '8px',
                      background: INK.surface,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        gap: '10px',
                        border: 'none',
                        background: 'transparent',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: INK.textFaint, width: '70px', flexShrink: 0 }}>
                        {q.id}
                      </span>
                      <span style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                        {(['open', 'mcq', 'truefalse'] as QuestionForm[]).map((f) => (
                          <span
                            key={f}
                            title={f}
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              background: q.forms.includes(f) ? '#7c3aed' : INK.border,
                            }}
                          />
                        ))}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: q.ask ? INK.text : INK.textFaint,
                          fontSize: '13px',
                        }}
                      >
                        {q.ask || q.claim || <em>blank</em>}
                      </span>
                      {report.warnings.length > 0 && (
                        <span style={{ fontSize: '11px', color: '#d97706', flexShrink: 0 }}>
                          {report.warnings.length} to review
                        </span>
                      )}
                    </button>
                    {isOpen && (
                      <QuestionEditor
                        pack={draft}
                        question={q}
                        onChange={(next) => updateQuestion(q.id, next)}
                        onDelete={() => deleteQuestion(q.id)}
                        onQuarantine={(reason) => void quarantine(q.id, reason)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
