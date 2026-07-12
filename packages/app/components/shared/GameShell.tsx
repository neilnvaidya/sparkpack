'use client'

/**
 * The one layout every game shares: header, a square-ish game area, a
 * vertical TeamsPanel sidebar, and a bottom action bar with a plain-English
 * hint strip on the left and the teacher's buttons on the right.
 *
 * Invariants that make the UI teachable:
 *   - Action buttons are ALWAYS mounted (disabled, never unmounted) so their
 *     positions are stable and the tutorial can target them from question 1.
 *   - Buttons render in a fixed vocabulary order, so "Correct" is always in
 *     the same place across every game.
 *   - Exactly one thing glows at a time, matching the hint strip.
 */

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { TeamsPanel, type TeamsPanelProps } from './TeamsPanel'
import { TutorialOverlay, type TutorialStep } from './TutorialOverlay'

export type ShellActionId = 'show' | 'reveal' | 'correct' | 'incorrect' | 'next' | 'end'

export interface ShellAction {
  id: ShellActionId
  label: string
  variant: 'primary' | 'correct' | 'incorrect' | 'neutral' | 'danger'
  onClick: () => void
  disabled?: boolean
}

export interface GameShellProps {
  title: string
  gameName: string
  progress?: string
  hint: string
  actions: ShellAction[]
  /** action id | 'teams' | null. Game-area glows are the child's job. */
  glowTarget?: ShellActionId | 'teams' | null
  teamsPanel: TeamsPanelProps
  tutorial?: { id: string; steps: TutorialStep[] }
  children: ReactNode
}

/** Fixed left-to-right order so buttons never move between games. */
const ACTION_ORDER: ShellActionId[] = ['show', 'reveal', 'correct', 'incorrect', 'next', 'end']

function actionClasses(variant: ShellAction['variant']): { className: string; style: React.CSSProperties } {
  switch (variant) {
    case 'primary':
      return { className: 'text-white', style: { backgroundColor: 'var(--color-accent)' } }
    case 'correct':
      return { className: 'text-white', style: { backgroundColor: 'var(--color-correct)' } }
    case 'incorrect':
      return {
        className: 'text-white border-2 bg-transparent',
        style: { borderColor: 'var(--color-incorrect)' },
      }
    case 'danger':
      return {
        className: 'border-2 bg-transparent',
        style: { borderColor: 'rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.8)' },
      }
    case 'neutral':
    default:
      return {
        className: 'border text-white',
        style: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' },
      }
  }
}

export function GameShell({
  title,
  gameName,
  progress,
  hint,
  actions,
  glowTarget,
  teamsPanel,
  tutorial,
  children,
}: GameShellProps) {
  const [tutorialOpen, setTutorialOpen] = useState(false)

  // Auto-open on first live play if the flag is unset.
  useEffect(() => {
    if (!tutorial) return
    const key = `sp-tutorial-${tutorial.id}`
    try {
      if (!localStorage.getItem(key)) setTutorialOpen(true)
    } catch {
      /* localStorage unavailable — skip auto-open */
    }
  }, [tutorial])

  const closeTutorial = () => {
    setTutorialOpen(false)
    if (tutorial) {
      try {
        localStorage.setItem(`sp-tutorial-${tutorial.id}`, '1')
      } catch {
        /* ignore */
      }
    }
  }

  // Which action ids glow. A 'correct' target also glows its paired 'incorrect'.
  const glowIds = new Set<ShellActionId>()
  if (glowTarget && glowTarget !== 'teams') {
    glowIds.add(glowTarget)
    if (glowTarget === 'correct' && actions.some((a) => a.id === 'incorrect')) {
      glowIds.add('incorrect')
    }
  }

  const orderedActions = ACTION_ORDER.map((id) => actions.find((a) => a.id === id)).filter(
    (a): a is ShellAction => Boolean(a)
  )

  const teamsGlow = teamsPanel.glow || glowTarget === 'teams'

  return (
    <div className="shell-root font-sans">
      {/* Header */}
      <header className="shell-header">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h1 className="truncate font-display text-xl font-extrabold tracking-tight text-text-primary md:text-2xl">
            {title}
          </h1>
          <span className="shrink-0 text-sm font-semibold text-text-muted">{gameName}</span>
        </div>
        {progress && (
          <span className="shrink-0 rounded-[var(--radius-sm)] border border-border bg-surface-alt px-3 py-1 text-xs font-bold text-text-muted">
            {progress}
          </span>
        )}
        {tutorial && (
          <button
            type="button"
            onClick={() => setTutorialOpen(true)}
            className="shrink-0 rounded-[var(--radius-sm)] border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-surface"
          >
            Show me how
          </button>
        )}
        <Link
          href="/library"
          className="shrink-0 rounded-[var(--radius-sm)] border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-text-muted hover:bg-surface"
        >
          Exit
        </Link>
      </header>

      {/* Game area */}
      <main className="shell-game">{children}</main>

      {/* Teams sidebar */}
      <aside className="shell-teams">
        <TeamsPanel {...teamsPanel} glow={teamsGlow} />
      </aside>

      {/* Action bar: hint strip + fixed-order buttons */}
      <footer className="shell-actions">
        <div className="flex min-w-0 flex-1 items-center" data-tutorial="hint">
          <p className="min-w-0 text-sm font-semibold leading-snug text-white/90">{hint}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {orderedActions.map((action) => {
            const { className, style } = actionClasses(action.variant)
            return (
              <button
                key={action.id}
                type="button"
                data-tutorial={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-bold transition-all',
                  'disabled:cursor-default disabled:opacity-35',
                  className,
                  !action.disabled && glowIds.has(action.id) && 'next-action'
                )}
                style={style}
              >
                {action.label}
              </button>
            )
          })}
        </div>
      </footer>

      {tutorial && tutorialOpen && (
        <TutorialOverlay steps={tutorial.steps} onClose={closeTutorial} />
      )}
    </div>
  )
}
