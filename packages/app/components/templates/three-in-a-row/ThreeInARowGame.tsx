'use client'

/**
 * Three in a Row – 4×4 grid of face-down questions. The active team picks a
 * square and answers; correct fills it in their colour, wrong swaps in a spare
 * and passes the turn. Three in a line (row/col/diagonal) wins, else most cells.
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { threeInARowContentSchema } from '@/lib/templates/three-in-a-row'
import { getTeamColorDef } from '@/lib/constants/team-colors'
import { cn } from '@/lib/utils/cn'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const SIZE = 4
const CELLS = SIZE * SIZE

/** All contiguous 3-in-a-line index triples on a 4×4 grid. */
const LINES: number[][] = (() => {
  const lines: number[][] = []
  const at = (r: number, c: number) => r * SIZE + c
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c <= SIZE - 3; c++) lines.push([at(r, c), at(r, c + 1), at(r, c + 2)])
  for (let c = 0; c < SIZE; c++)
    for (let r = 0; r <= SIZE - 3; r++) lines.push([at(r, c), at(r + 1, c), at(r + 2, c)])
  for (let r = 0; r <= SIZE - 3; r++)
    for (let c = 0; c <= SIZE - 3; c++) lines.push([at(r, c), at(r + 1, c + 1), at(r + 2, c + 2)])
  for (let r = 0; r <= SIZE - 3; r++)
    for (let c = 2; c < SIZE; c++) lines.push([at(r, c), at(r + 1, c - 1), at(r + 2, c - 2)])
  return lines
})()

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'teams', title: 'Whose turn?', body: 'The highlighted team picks a square this turn.' },
  { target: 'board', title: 'Pick a square', body: 'The team taps any face-down square to reveal its question.' },
  { target: 'correct', title: 'Right answer', body: 'Press Correct — the square fills with the team’s colour.' },
  { target: 'incorrect', title: 'Wrong answer', body: 'Press Incorrect — the square stays open and the turn passes.' },
  { target: 'hint', title: 'How to win', body: 'Get three of your squares in a line — across, down or diagonally. This strip always tells you the next step.' },
]

interface Cell {
  question: { prompt: string; answer: string }
  owner: number | null
}

function lineWinner(cells: Cell[]): number | null {
  for (const [a, b, c] of LINES) {
    const o = cells[a].owner
    if (o !== null && cells[b].owner === o && cells[c].owner === o) return o
  }
  return null
}

export default function ThreeInARowGame() {
  const rawContent = useGameStore((s) => s.content)
  const teams = useGameStore((s) => s.teams)

  const parsed = threeInARowContentSchema.safeParse(rawContent)

  const [cells, setCells] = useState<Cell[]>(() => {
    const qs = parsed.success ? parsed.data.questions : []
    return Array.from({ length: CELLS }, (_, i) => ({ question: qs[i] ?? { prompt: '', answer: '' }, owner: null }))
  })
  const [spares] = useState(() => (parsed.success ? parsed.data.questions.slice(CELLS) : []))
  const [spareIdx, setSpareIdx] = useState(0)
  const [activeTeam, setActiveTeam] = useState(0)
  const [openCell, setOpenCell] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [winners, setWinners] = useState<number[] | null>(null)

  if (!parsed.success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center" style={{ color: 'var(--color-incorrect)' }}>
        This game&apos;s content could not be loaded.
      </div>
    )
  }
  const content = parsed.data
  const numTeams = teams.length

  const passTurn = () => {
    setOpenCell(null)
    setRevealed(false)
    setActiveTeam((t) => (t + 1) % numTeams)
  }

  const markCorrect = () => {
    if (openCell === null) return
    const updated = cells.map((c, i) => (i === openCell ? { ...c, owner: activeTeam } : c))
    setCells(updated)
    const line = lineWinner(updated)
    if (line !== null) {
      setWinners([line])
      return
    }
    if (updated.every((c) => c.owner !== null)) {
      const counts = teams.map((_, ti) => updated.filter((c) => c.owner === ti).length)
      const max = Math.max(...counts)
      setWinners(counts.flatMap((n, ti) => (n === max ? [ti] : [])))
      return
    }
    passTurn()
  }

  const markIncorrect = () => {
    if (openCell === null) return
    if (spareIdx < spares.length) {
      const spare = spares[spareIdx]
      setCells((prev) => prev.map((c, i) => (i === openCell ? { ...c, question: spare } : c)))
      setSpareIdx((n) => n + 1)
    }
    passTurn()
  }

  if (winners) {
    const owned = (ti: number) => cells.filter((c) => c.owner === ti).length
    return (
      <GameOverPanel
        heading="Three in a Row"
        teams={teams.map((t, i) => ({ name: t.name, colorId: t.color, score: owned(i) }))}
      />
    )
  }

  const activeTeamName = teams[activeTeam]?.name ?? 'The team'
  const answering = openCell !== null
  const openQuestion = openCell !== null ? cells[openCell].question : null
  const ownedCount = cells.filter((c) => c.owner !== null).length

  const actions: ShellAction[] = [
    {
      id: 'reveal',
      label: revealed ? 'Hide answer' : 'Show answer',
      variant: 'neutral',
      onClick: () => setRevealed((v) => !v),
      disabled: !answering,
    },
    { id: 'correct', label: 'Correct', variant: 'correct', onClick: markCorrect, disabled: !answering },
    { id: 'incorrect', label: 'Incorrect', variant: 'incorrect', onClick: markIncorrect, disabled: !answering },
    { id: 'end', label: 'End game', variant: 'danger', onClick: () => setWinners([activeTeam]) },
  ]

  return (
    <GameShell
      title={content.title}
      gameName="Three in a Row"
      progress={`${ownedCount} of ${CELLS} claimed`}
      hint={
        answering
          ? `Did ${activeTeamName} get it right? Mark Correct or Incorrect.`
          : `${activeTeamName}: pick a square from the grid.`
      }
      actions={actions}
      glowTarget={answering ? 'correct' : null}
      teamsPanel={{
        mode: 'display',
        teams: teams.map((t, i) => ({ name: t.name, colorId: t.color, score: cells.filter((c) => c.owner === i).length, active: i === activeTeam })),
      }}
      tutorial={{ id: 'three_in_a_row', steps: TUTORIAL_STEPS }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div
          data-tutorial="board"
          className="grid w-full gap-2"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, maxWidth: 'min(58vh, 100%)' }}
        >
          {cells.map((cell, i) => {
            const owned = cell.owner !== null
            const color = owned ? getTeamColorDef(teams[cell.owner!].color) : null
            const selectable = !answering && !owned
            return (
              <button
                key={i}
                type="button"
                disabled={!selectable}
                onClick={() => selectable && (setOpenCell(i), setRevealed(false))}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-[var(--radius-md)] border-2 font-display text-2xl font-extrabold transition-all',
                  owned ? 'text-white' : 'text-[var(--color-accent)]',
                  selectable && 'next-action--soft cursor-pointer hover:scale-[1.03]',
                  openCell === i && 'ring-4 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]'
                )}
                style={{
                  borderColor: color ? color.hex : 'var(--color-border)',
                  backgroundColor: color ? color.hex : 'var(--color-surface)',
                }}
              >
                {owned ? '✓' : '?'}
              </button>
            )
          })}
        </div>

        {answering && openQuestion && (
          <div className="w-full max-w-[680px]">
            <div className="sbq-question-card sbq-card-enter bg-surface px-6 py-5 text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                {activeTeamName}&apos;s question
              </div>
              <h2 className="break-words font-display font-bold leading-tight text-text-primary" style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.9rem)' }}>
                {openQuestion.prompt}
              </h2>
              {revealed && (
                <div className="mt-4 border-t border-border pt-3">
                  <span className="sbq-answers-chip px-3 py-1 text-sm font-semibold text-text-primary">
                    {openQuestion.answer}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  )
}
