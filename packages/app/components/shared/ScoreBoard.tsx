'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Team } from '@/lib/store/game-store'
import { getTeamColorDef } from '@/lib/constants/team-colors'

interface ScoreBoardProps {
  teams: Team[]
  /** Index of active team to highlight; use -1 for game over (no highlight). */
  activeTeamIndex: number
  className?: string
}

export function ScoreBoard({
  teams,
  activeTeamIndex,
  className,
}: ScoreBoardProps) {
  const [updatedTeamId, setUpdatedTeamId] = useState<string | null>(null)
  const prevScoresRef = useRef<Record<string, number>>({})

  useEffect(() => {
    teams.forEach((team) => {
      const prev = prevScoresRef.current[team.id]
      if (prev !== undefined && prev !== team.score) {
        setUpdatedTeamId(team.id)
        window.setTimeout(() => {
          setUpdatedTeamId((current) => (current === team.id ? null : current))
        }, 800)
      }
      prevScoresRef.current[team.id] = team.score
    })
  }, [teams])

  return (
    <div
      className={cn(
        'flex flex-wrap gap-3 justify-center items-stretch',
        className
      )}
      role="region"
      aria-label="Team scores"
    >
      {teams.map((team, index) => {
        const isActive = activeTeamIndex >= 0 && index === activeTeamIndex
        const isUpdated = updatedTeamId === team.id
        const colorDef = getTeamColorDef(team.color)

        return (
          <div
            key={team.id}
            className={cn(
              'sbq-score-card px-4 py-3 min-w-[120px] max-w-[180px] text-center transition-all duration-300 flex flex-col justify-center border-2',
              isActive && 'scale-105 shadow-lg ring-4 ring-white/80 ring-offset-2 ring-offset-[var(--color-text-primary)]'
            )}
            style={{
              backgroundColor: colorDef.lightHex,
              borderColor: colorDef.hex,
            }}
          >
            <span
              className="block text-sm font-semibold leading-tight truncate"
              style={{ color: colorDef.hex }}
            >
              {team.name}
              {isActive && ' ★'}
            </span>
            <span
              className={cn(
                'block font-display text-3xl md:text-4xl font-extrabold mt-1',
                isUpdated && 'score--updated'
              )}
              style={{ color: 'var(--color-text-primary)' }}
            >
              {team.score}
            </span>
          </div>
        )
      })}
    </div>
  )
}
