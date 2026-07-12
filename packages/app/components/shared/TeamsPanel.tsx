'use client'

/**
 * Shared vertical teams sidebar used by every game via GameShell.
 * Awarding points is ALWAYS "tap a team here" — the rows glow when a tap
 * is the next step. Three modes:
 *   - display: read-only scoreboard (e.g. Strategy Board Quiz)
 *   - award:   one tap awards a point / claims a card, then the game advances
 *   - toggle:  multi-select (mark every team that got it right), applied on Next
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { getTeamColorDef, type TeamColorId } from '@/lib/constants/team-colors'

export interface TeamRow {
  name: string
  colorId: TeamColorId
  score: number
  /** Small pill after the name, e.g. Risk It wager. */
  badge?: string
  /** Current-turn highlight (e.g. SBQ active team). */
  active?: boolean
  /** Toggle-mode selection state. */
  selected?: boolean
}

export interface TeamsPanelProps {
  teams: TeamRow[]
  mode: 'display' | 'award' | 'toggle'
  /** Apply .next-action to clickable rows (the next step is here). */
  glow?: boolean
  onTeamClick?: (i: number) => void
  /** Slot under the rows, e.g. "No one — next" / "Next". */
  footer?: ReactNode
}

export function TeamsPanel({ teams, mode, glow, onTeamClick, footer }: TeamsPanelProps) {
  const clickable = mode !== 'display'

  return (
    <div
      data-tutorial="teams"
      className="flex h-full flex-col gap-2"
    >
      <div className="px-1 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
        Teams
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {teams.map((team, i) => {
          const color = getTeamColorDef(team.colorId)
          const on = team.selected
          return (
            <button
              key={i}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onTeamClick?.(i)}
              className={cn(
                'flex min-h-[56px] items-center gap-3 rounded-[var(--radius-md)] border-2 px-3 py-2 text-left transition-all',
                clickable ? 'cursor-pointer' : 'cursor-default',
                team.active && 'shadow-md',
                glow && clickable && 'next-action'
              )}
              style={{
                borderColor: team.active || on ? color.hex : 'var(--color-border)',
                backgroundColor: on ? color.hex : 'var(--color-surface-alt)',
              }}
            >
              <span
                className="h-8 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: on ? 'rgba(255,255,255,0.9)' : color.hex }}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className="truncate text-sm font-bold"
                  style={{ color: on ? '#fff' : 'var(--color-text-primary)' }}
                >
                  {team.name}
                </span>
                {team.badge && (
                  <span
                    className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: on ? 'rgba(255,255,255,0.85)' : 'var(--color-text-muted)' }}
                  >
                    {team.badge}
                  </span>
                )}
              </span>
              <span
                className="font-display text-2xl font-extrabold tabular-nums"
                style={{ color: on ? '#fff' : 'var(--color-text-primary)' }}
              >
                {team.score}
              </span>
            </button>
          )
        })}
      </div>
      {footer && <div className="pt-1">{footer}</div>}
    </div>
  )
}
