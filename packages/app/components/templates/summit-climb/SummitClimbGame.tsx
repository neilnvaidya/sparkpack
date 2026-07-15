'use client'

/**
 * Summit Climb – teams climb a shared 7-rung mountain. Each turn the active
 * team chooses Steady (easy: +1 right / stay wrong) or Risky (hard: +2 right /
 * −1 wrong). First to the summit wins; a 20-turn cap ends on highest climber.
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { summitClimbContentSchema } from '@/lib/templates/summit-climb'
import { getTeamColorDef } from '@/lib/constants/team-colors'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import { QuestionView } from '@/components/shared/QuestionView'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const SUMMIT = 7
const QUESTION_CAP = 20

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'teams', title: 'Whose turn?', body: 'The highlighted team climbs this turn.' },
  { target: 'paths', title: 'Choose a path', body: 'Steady is an easy question (climb 1). Risky is a hard one (climb 2, but slip 1 if wrong).' },
  { target: 'correct', title: 'Right answer', body: 'Press Correct — the team’s climber moves up the mountain.' },
  { target: 'incorrect', title: 'Wrong answer', body: 'Press Incorrect — a steady miss stays put, a risky miss slips down one rung.' },
  { target: 'hint', title: 'Reach the top', body: 'First team to the summit wins. This strip always tells you the next step.' },
]

type Stage = 'choose' | 'question'
type Path = 'steady' | 'risky'

export default function SummitClimbGame() {
  const rawContent = useGameStore((s) => s.content)
  const teams = useGameStore((s) => s.teams)

  const parsed = summitClimbContentSchema.safeParse(rawContent)

  const [heights, setHeights] = useState<number[]>(() => teams.map(() => 0))
  const [activeTeam, setActiveTeam] = useState(0)
  const [stage, setStage] = useState<Stage>('choose')
  const [path, setPath] = useState<Path | null>(null)
  const [easyIdx, setEasyIdx] = useState(0)
  const [hardIdx, setHardIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [turns, setTurns] = useState(0)
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

  const currentQ =
    stage === 'question' && path
      ? path === 'steady'
        ? content.easy[easyIdx % content.easy.length]
        : content.hard[hardIdx % content.hard.length]
      : null

  const topTeams = (hs: number[]) => {
    const max = Math.max(...hs)
    return hs.flatMap((h, i) => (h === max ? [i] : []))
  }

  const choosePath = (p: Path) => {
    setPath(p)
    setStage('question')
    setRevealed(false)
  }

  const resolve = (delta: number) => {
    if (path === 'steady') setEasyIdx((i) => i + 1)
    else setHardIdx((i) => i + 1)

    const updated = heights.map((h, i) =>
      i === activeTeam ? Math.max(0, Math.min(SUMMIT, h + delta)) : h
    )
    setHeights(updated)

    if (updated[activeTeam] >= SUMMIT) {
      setWinners([activeTeam])
      return
    }
    const nextTurns = turns + 1
    setTurns(nextTurns)
    if (nextTurns >= QUESTION_CAP) {
      setWinners(topTeams(updated))
      return
    }
    setActiveTeam((t) => (t + 1) % numTeams)
    setStage('choose')
    setPath(null)
    setRevealed(false)
  }

  const markCorrect = () => resolve(path === 'risky' ? 2 : 1)
  const markIncorrect = () => resolve(path === 'risky' ? -1 : 0)

  if (winners) {
    return (
      <GameOverPanel
        heading="Summit Climb"
        teams={teams.map((t, i) => ({ name: t.name, colorId: t.color, score: heights[i] }))}
      />
    )
  }

  const activeTeamName = teams[activeTeam]?.name ?? 'The team'

  const actions: ShellAction[] = [
    {
      id: 'reveal',
      label: revealed ? 'Hide answer' : 'Show answer',
      variant: 'neutral',
      onClick: () => setRevealed((v) => !v),
      disabled: stage !== 'question',
    },
    { id: 'correct', label: 'Correct', variant: 'correct', onClick: markCorrect, disabled: stage !== 'question' },
    { id: 'incorrect', label: 'Incorrect', variant: 'incorrect', onClick: markIncorrect, disabled: stage !== 'question' },
    { id: 'end', label: 'End game', variant: 'danger', onClick: () => setWinners(topTeams(heights)) },
  ]

  return (
    <GameShell
      title={content.title}
      gameName="Summit Climb"
      progress={`Turn ${turns + 1}`}
      hint={
        stage === 'choose'
          ? `${activeTeamName}: choose the Steady or Risky path.`
          : `${path === 'risky' ? 'Risky' : 'Steady'} question for ${activeTeamName}. Did they get it right?`
      }
      actions={actions}
      glowTarget={stage === 'question' ? 'correct' : null}
      teamsPanel={{
        mode: 'display',
        teams: teams.map((t, i) => ({ name: t.name, colorId: t.color, score: heights[i], active: i === activeTeam })),
      }}
      tutorial={{ id: 'summit_climb', steps: TUTORIAL_STEPS }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        {/* Mountain */}
        <div className="flex w-full max-w-[560px] flex-col gap-1">
          {Array.from({ length: SUMMIT + 1 }, (_, k) => SUMMIT - k).map((level) => {
            const here = teams.flatMap((t, i) => (heights[i] === level ? [{ t, i }] : []))
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-right text-xs font-bold text-text-muted">
                  {level === SUMMIT ? '🏁 Summit' : level === 0 ? 'Base' : `Rung ${level}`}
                </span>
                <div
                  className="flex min-h-[34px] flex-1 items-center gap-1.5 rounded-[var(--radius-sm)] border px-2"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: level === SUMMIT ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  }}
                >
                  {here.map(({ t, i }) => {
                    const color = getTeamColorDef(t.color)
                    return (
                      <span
                        key={i}
                        className="flex h-7 items-center rounded-full px-2 text-xs font-bold text-white shadow"
                        style={{ backgroundColor: color.hex }}
                        title={t.name}
                      >
                        {t.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Path choice or question */}
        {stage === 'choose' ? (
          <div data-tutorial="paths" className="flex w-full max-w-[560px] gap-4">
            <button
              type="button"
              onClick={() => choosePath('steady')}
              className="next-action flex-1 rounded-[var(--radius-lg)] border-2 px-5 py-5 text-center transition-transform hover:scale-[1.02]"
              style={{ borderColor: 'var(--color-correct)', backgroundColor: 'var(--color-correct-bg)' }}
            >
              <div className="font-display text-2xl font-extrabold" style={{ color: 'var(--color-correct)' }}>
                Steady
              </div>
              <div className="text-xs font-semibold text-text-muted">Easy · climb 1</div>
            </button>
            <button
              type="button"
              onClick={() => choosePath('risky')}
              className="next-action flex-1 rounded-[var(--radius-lg)] border-2 px-5 py-5 text-center transition-transform hover:scale-[1.02]"
              style={{ borderColor: 'var(--color-steal)', backgroundColor: 'var(--color-steal-bg)' }}
            >
              <div className="font-display text-2xl font-extrabold" style={{ color: 'var(--color-steal)' }}>
                Risky
              </div>
              <div className="text-xs font-semibold text-text-muted">Hard · climb 2, slip 1</div>
            </button>
          </div>
        ) : (
          currentQ && (
            <div className="w-full max-w-[640px]">
              <div className="sbq-question-card sbq-card-enter bg-surface px-6 py-5 text-center">
                <div
                  className="mb-2 text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ color: path === 'risky' ? 'var(--color-steal)' : 'var(--color-correct)' }}
                >
                  {path === 'risky' ? 'Risky path' : 'Steady path'}
                </div>
                <QuestionView question={currentQ} revealed={revealed} variant="compact" showAnswer={false} />
                {revealed && (
                  <div className="mt-4 border-t border-border pt-3">
                    <span className="sbq-answers-chip px-3 py-1 text-sm font-semibold text-text-primary">
                      {currentQ.answer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </GameShell>
  )
}
