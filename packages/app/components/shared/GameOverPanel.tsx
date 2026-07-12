'use client'

/**
 * Shared end screen: teams ranked by score, winner badge, back to library.
 * Every game renders this once it finishes (replaces per-game end screens).
 */

import Link from 'next/link'
import { getTeamColorDef, type TeamColorId } from '@/lib/constants/team-colors'

export interface GameOverTeam {
  name: string
  colorId: TeamColorId
  score: number
}

interface GameOverPanelProps {
  teams: GameOverTeam[]
  /** e.g. "Flash Round complete". */
  heading?: string
}

export function GameOverPanel({ teams, heading = 'Game complete' }: GameOverPanelProps) {
  const ranked = [...teams].sort((a, b) => b.score - a.score)
  const top = ranked[0]?.score ?? 0

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center p-6"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
          Final scores
        </p>
        <h1 className="mb-8 font-display text-4xl font-extrabold tracking-tight">{heading}</h1>
        <div className="flex flex-col gap-2.5">
          {ranked.map((team, i) => {
            const color = getTeamColorDef(team.colorId)
            const winner = team.score === top && top > 0
            return (
              <div
                key={i}
                className="game-over-card flex items-center justify-between rounded-[var(--radius-md)] border-2 bg-surface px-5 py-3.5"
                style={{ borderColor: winner ? color.hex : 'var(--color-border)' }}
              >
                <span className="flex items-center gap-3 text-lg font-bold">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color.hex }} />
                  {team.name}
                  {winner && (
                    <span
                      className="text-[11px] font-extrabold uppercase tracking-[0.08em]"
                      style={{ color: color.hex }}
                    >
                      Winner
                    </span>
                  )}
                </span>
                <span className="font-display text-3xl font-extrabold tabular-nums">{team.score}</span>
              </div>
            )
          })}
        </div>
        <Link
          href="/library"
          className="mt-8 inline-block rounded-[var(--radius-md)] border px-6 py-2.5 text-sm font-bold text-text-muted hover:bg-surface-alt"
          style={{ borderColor: 'var(--color-border-strong)' }}
        >
          Back to Library
        </Link>
      </div>
    </div>
  )
}
