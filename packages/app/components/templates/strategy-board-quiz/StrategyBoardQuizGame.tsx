'use client'

import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { TIMER_PRE_COUNTDOWN_SECONDS } from '@/lib/store/game-store'
import { useSoundStore } from '@/lib/store/sound-store'
import type { StrategyBoardState } from '@/lib/store/game-store'
import { TimerDisplay } from '@/components/shared/TimerDisplay'
import { GameBoard } from './GameBoard'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'teams', title: 'Whose turn?', body: 'The highlighted team picks first. The sidebar always shows the scores.' },
  { target: 'question', title: 'Pick a square', body: 'The team taps a square on the board. Higher points mean harder questions.' },
  { target: 'correct', title: 'Right answer', body: 'If the team answers correctly, press Correct to award the points.' },
  { target: 'incorrect', title: 'Wrong answer', body: 'If they miss, press Incorrect — the other teams then get a chance to steal.' },
  { target: 'hint', title: 'Always know what to do', body: 'This strip always tells you the next step. Reopen this guide any time with “Show me how”.' },
]

export default function StrategyBoardQuizGame() {
  const phase = useGameStore((s) => s.phase)
  const teams = useGameStore((s) => s.teams)
  const activeTeamIndex = useGameStore((s) => s.activeTeamIndex)
  const templateState = useGameStore((s) => s.templateState) as StrategyBoardState | null
  const timer = useGameStore((s) => s.timer)
  const content = useGameStore((s) => s.content) as { title?: string } | null

  const markCorrect = useGameStore((s) => s.markCorrect)
  const markIncorrect = useGameStore((s) => s.markIncorrect)
  const nextStealAttempt = useGameStore((s) => s.nextStealAttempt)
  const endGame = useGameStore((s) => s.endGame)
  const playSound = useSoundStore((s) => s.play)

  const gameTitle = content?.title ?? 'Strategy Board Quiz'
  const selectedCell = templateState?.selectedCell
    ? templateState.board[templateState.selectedCell.row]?.[templateState.selectedCell.col] ?? null
    : null

  const stealTeamIndex =
    phase === 'steal_phase' && templateState?.stealQueue?.length
      ? templateState.stealQueue[templateState.currentStealIndex]
      : undefined
  const stealTeam = stealTeamIndex !== undefined ? teams[stealTeamIndex] : null

  const highlightedTeamIndex =
    phase === 'game_over'
      ? -1
      : phase === 'steal_phase' && stealTeamIndex !== undefined
        ? stealTeamIndex
        : activeTeamIndex

  const isGameOver = phase === 'game_over'
  const showQuestionStage =
    phase === 'discussion' || phase === 'answer_waiting' || phase === 'steal_phase'
  const canMark = showQuestionStage

  const [answersRevealed, setAnswersRevealed] = useState(false)
  useEffect(() => {
    if (!showQuestionStage) setAnswersRevealed(false)
  }, [showQuestionStage])

  // Timer warning ticks: soft ticks in the last few seconds of any timer.
  const lastWarningSecondRef = useRef<number | null>(null)
  useEffect(() => {
    if (!timer || !timer.isWarning || !timer.isActive) return
    const preSeconds = timer.preCountdownSeconds ?? TIMER_PRE_COUNTDOWN_SECONDS
    const countdownRemaining = Math.max(0, timer.remaining - preSeconds)
    if (countdownRemaining <= 0 || countdownRemaining > 5) return
    if (lastWarningSecondRef.current === countdownRemaining) return
    lastWarningSecondRef.current = countdownRemaining
    playSound('timer_warning')
  }, [timer?.remaining, timer?.isWarning, timer?.isActive])

  // Play a soft cue when a new timer (discussion or steal) starts.
  useEffect(() => {
    if (!timer) return
    const pre = timer.preCountdownSeconds ?? TIMER_PRE_COUNTDOWN_SECONDS
    if (timer.remaining === timer.duration && pre > 0) {
      playSound('timer_start')
    }
  }, [timer?.startedAt])

  useEffect(() => {
    if (phase === 'game_over') playSound('game_end')
  }, [phase])

  if (isGameOver) {
    return (
      <GameOverPanel
        teams={teams.map((t) => ({ name: t.name, colorId: t.color, score: t.score }))}
      />
    )
  }

  const activeTeamName = teams[highlightedTeamIndex]?.name ?? 'The team'
  const totalCells = templateState?.board.flat().length ?? 0
  const answeredCells =
    templateState?.board.flat().filter((c) => c.state === 'answered' || c.state === 'disabled').length ?? 0

  let hint: string
  let glowTarget: ShellAction['id'] | 'teams' | null
  switch (phase) {
    case 'team_selecting':
      hint = `${activeTeamName}: pick a square from the board.`
      glowTarget = null // board cells glow (GameBoard)
      break
    case 'discussion':
      hint = `${activeTeamName} is discussing — mark Correct or Incorrect when they answer.`
      glowTarget = null
      break
    case 'answer_waiting':
      hint = `Did ${activeTeamName} get it right? Mark Correct or Incorrect.`
      glowTarget = 'correct'
      break
    case 'steal_phase':
      hint = `Steal! ${stealTeam?.name ?? 'Next team'} can answer — Correct, Incorrect, or Next to pass.`
      glowTarget = 'correct'
      break
    case 'round_complete':
      hint = 'Points awarded! Next team is up in a moment.'
      glowTarget = null
      break
    default:
      hint = ''
      glowTarget = null
  }

  const actions: ShellAction[] = [
    {
      id: 'reveal',
      label: answersRevealed ? 'Hide answers' : 'Reveal answers',
      variant: 'neutral',
      onClick: () => setAnswersRevealed((v) => !v),
      disabled: !showQuestionStage,
    },
    {
      id: 'correct',
      label: 'Correct',
      variant: 'correct',
      onClick: () => {
        playSound(phase === 'steal_phase' ? 'steal_correct' : 'correct')
        markCorrect()
      },
      disabled: !canMark,
    },
    {
      id: 'incorrect',
      label: 'Incorrect',
      variant: 'incorrect',
      onClick: () => {
        playSound('incorrect')
        markIncorrect()
      },
      disabled: !canMark,
    },
    {
      id: 'next',
      label: 'Next',
      variant: 'neutral',
      onClick: nextStealAttempt,
      disabled: phase !== 'steal_phase',
    },
    { id: 'end', label: 'End game', variant: 'danger', onClick: endGame },
  ]

  return (
    <GameShell
      title={gameTitle}
      gameName="Strategy Board Quiz"
      progress={`${answeredCells} of ${totalCells} claimed`}
      hint={hint}
      actions={actions}
      glowTarget={glowTarget}
      teamsPanel={{
        mode: 'display',
        teams: teams.map((t, i) => ({
          name: t.name,
          colorId: t.color,
          score: t.score,
          active: i === highlightedTeamIndex,
        })),
      }}
      tutorial={{ id: 'strategy_board_quiz', steps: TUTORIAL_STEPS }}
    >
      <div data-tutorial="question" className="flex h-full w-full items-center justify-center">
        {showQuestionStage && selectedCell ? (
          <div className="w-full max-w-[720px]">
            <div className="sbq-question-card sbq-card-enter bg-surface px-8 py-6">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <div className="sbq-topic-chip break-words px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                  {selectedCell.topic}
                </div>
                <div className="sbq-point-badge px-3 py-1 font-display text-sm font-extrabold">
                  {selectedCell.points} pts
                </div>
              </div>

              <div className="mx-auto max-w-[600px] text-center">
                <h2
                  className="break-words font-display font-bold leading-tight text-text-primary"
                  style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2rem)' }}
                >
                  {selectedCell.prompt}
                </h2>
              </div>

              {timer && (
                <div className="mt-6 flex justify-center">
                  <TimerDisplay timer={timer} inline />
                </div>
              )}

              {answersRevealed && (
                <div className="mt-6 border-t border-border pt-4 text-left">
                  <div className="mb-3 text-xs font-mono uppercase tracking-[0.16em] text-text-muted">
                    Acceptable answers:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCell.acceptableAnswers.map((answer, index) => (
                      <span
                        key={`${answer}-${index}`}
                        className="sbq-answers-chip px-3 py-1 text-sm font-semibold text-text-primary"
                      >
                        {answer}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <GameBoard />
        )}
      </div>
    </GameShell>
  )
}
