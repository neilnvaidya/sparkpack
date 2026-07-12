'use client'

/**
 * Spotlight tutorial. Dims the screen and cuts a hole over a live element
 * (matched by its data-tutorial attribute), with a card explaining the step.
 * The click-catcher pauses the real game underneath — no game state changes.
 * Steps whose target element is missing are skipped automatically.
 */

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

export interface TutorialStep {
  /** data-tutorial value to spotlight; omit for a centered, full-dim card. */
  target?: string
  title: string
  body: string
}

interface TutorialOverlayProps {
  steps: TutorialStep[]
  onClose: () => void
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const PAD = 8

export function TutorialOverlay({ steps, onClose }: TutorialOverlayProps) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)

  const step = steps[index]

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null)
      return
    }
    const el = document.querySelector<HTMLElement>(`[data-tutorial="${step.target}"]`)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 })
  }, [step])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [measure])

  const isLast = index >= steps.length - 1
  const next = () => (isLast ? onClose() : setIndex((i) => i + 1))
  const back = () => setIndex((i) => Math.max(0, i - 1))

  // Position the card: below the spotlight if there's room, else above; centered when no target.
  const cardStyle: React.CSSProperties = (() => {
    if (!rect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
    const belowSpace = window.innerHeight - (rect.top + rect.height)
    const putBelow = belowSpace > 220
    const left = Math.min(Math.max(rect.left, 16), window.innerWidth - 360)
    return putBelow
      ? { top: rect.top + rect.height + 14, left }
      : { top: Math.max(16, rect.top - 200), left }
  })()

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Click-catcher: pauses the live game beneath. */}
      <div className="absolute inset-0" onClick={next} />

      {/* Spotlight cutout via a huge box-shadow. */}
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-[14px] transition-all duration-200"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: '0 0 0 9999px rgba(20, 23, 40, 0.62)',
            outline: '3px solid #7c3aed',
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0" style={{ background: 'rgba(20, 23, 40, 0.62)' }} />
      )}

      {/* Step card */}
      <div
        className="absolute w-[340px] max-w-[calc(100vw-32px)] rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-modal)]"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
          Step {index + 1} of {steps.length}
        </div>
        <h3 className="mb-1.5 font-display text-xl font-extrabold text-text-primary">{step.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-text-muted">{step.body}</p>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-text-muted underline-offset-2 hover:underline"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="rounded-[var(--radius-sm)] border border-border px-3 py-1.5 text-sm font-bold text-text-primary hover:bg-surface-alt"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-sm font-bold text-white hover:brightness-110"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
