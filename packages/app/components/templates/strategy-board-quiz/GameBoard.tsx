'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { useSoundStore } from '@/lib/store/sound-store'
import { cn } from '@/lib/utils/cn'
import type { StrategyBoardState, TeamColor } from '@/lib/store/game-store'
import { getTeamColorDef } from '@/lib/constants/team-colors'

export function GameBoard() {
  const templateState = useGameStore((s) => s.templateState) as StrategyBoardState | null
  const teams = useGameStore((s) => s.teams)
  const phase = useGameStore((s) => s.phase)
  const selectCell = useGameStore((s) => s.selectCell)
  const playSound = useSoundStore((s) => s.play)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cellSize, setCellSize] = useState<number | null>(null)

  if (!templateState?.board?.length) return null

  const board = templateState.board
  const cols = board[0]?.length ?? 0
  const canSelect = phase === 'team_selecting'

  /** Column topics from first row (one topic per column). */
  const columnTopics = board[0]?.map((cell) => cell.topic) ?? []

  useEffect(() => {
    function recompute() {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width) return

      const rows = board.length
      const gap = 8 // gap-2 between cells
      const topicRowAllowance = 48 // column header chips + margin
      const maxCellWidth = (rect.width - gap * (cols - 1)) / cols
      const maxCellHeight =
        (rect.height - topicRowAllowance - gap * (rows - 1)) / rows
      const size = Math.floor(Math.min(maxCellWidth, maxCellHeight))
      const clamped = Math.max(56, Math.min(size, 132))
      setCellSize(clamped)
    }

    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [cols, board.length])

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center">
      {/* Column headers: one topic per column */}
      <div
        className="grid gap-2 mb-2"
        style={
          cellSize
            ? { gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }
            : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
        }
      >
        {columnTopics.map((topic, c) => (
          <div key={c} className="sbq-topic-chip px-2 py-1.5 text-center flex items-center justify-center">
            <span className="text-[11px] md:text-xs font-semibold text-text-primary tracking-[0.06em] uppercase leading-tight line-clamp-2 break-words">
              {topic}
            </span>
          </div>
        ))}
      </div>

      {/* Grid: point values */}
      <div
        className="grid gap-2"
        style={
          cellSize
            ? { gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }
            : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
        }
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isAnswered = cell.state === 'answered' && cell.answeredByTeamIndex != null
            const teamColor = isAnswered ? teams[cell.answeredByTeamIndex!]?.color : null
            const answeredStyle =
              cell.state === 'answered' && teamColor
                ? (() => {
                    const def = getTeamColorDef(teamColor)
                    return {
                      bg: 'var(--color-surface-alt)',
                      border: def.hex,
                      dot: def.hex,
                      text: 'var(--color-text-muted)',
                    }
                  })()
                : null

            const isDisabled = cell.state === 'disabled'
            const isSelected = cell.state === 'selected'
            const isAvailable = cell.state === 'available'

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => {
                  if (!canSelect) return
                  if (!isAvailable) return
                  playSound('cell_select')
                  selectCell(r, c)
                }}
                disabled={!isAvailable || !canSelect}
                className={cn(
                  'sbq-cell rounded-[var(--radius-md)] border-2 min-h-0',
                  'flex items-center justify-center overflow-hidden',
                  isAvailable &&
                    (canSelect
                      ? 'sbq-cell--available bg-surface border-[var(--color-border)] text-[var(--color-accent)] shadow-[var(--shadow-cell)] cursor-pointer'
                      : 'bg-surfaceAlt border-[var(--color-border)] text-text-muted cursor-not-allowed opacity-60'),
                  isSelected &&
                    'sbq-cell--selected bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)] cursor-default',
                  cell.state === 'answered' &&
                    'cursor-default',
                  isDisabled &&
                    'bg-surfaceAlt border-dashed border-[var(--color-border)] text-text-muted opacity-60 cursor-not-allowed'
                )}
                style={{
                  width: cellSize ?? undefined,
                  height: cellSize ?? undefined,
                  ...(answeredStyle
                    ? {
                        backgroundColor: answeredStyle.bg,
                        borderColor: answeredStyle.border,
                      }
                    : {}),
                }}
              >
                {cell.state === 'answered' && answeredStyle ? (
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="sbq-cell-team-dot"
                      style={{ backgroundColor: answeredStyle.dot }}
                    />
                    <span
                      className="font-display text-2xl md:text-3xl font-semibold tabular-nums"
                      style={{ color: answeredStyle.text, opacity: 0.8 }}
                    >
                      {cell.points}
                    </span>
                  </div>
                ) : (
                  <span className="font-display text-3xl md:text-5xl font-extrabold leading-none tabular-nums">
                    {cell.points}
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
