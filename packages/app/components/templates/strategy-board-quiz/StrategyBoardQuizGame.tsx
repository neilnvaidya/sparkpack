'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store/game-store'
import { TIMER_PRE_COUNTDOWN_SECONDS } from '@/lib/store/game-store'
import { useSoundStore } from '@/lib/store/sound-store'
import type { StrategyBoardState } from '@/lib/store/game-store'
import type { Team } from '@/lib/store/game-store'
import { ScoreBoard } from '@/components/shared/ScoreBoard'
import { TimerDisplay } from '@/components/shared/TimerDisplay'
import { GameBoard } from './GameBoard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { getTeamColorDef } from '@/lib/constants/team-colors'

import type { GamePhase } from '@/lib/store/game-store'

function getPhaseLabel(
  phase: GamePhase,
  stealTeam?: Team | null,
  timerSeconds?: number
) {
  switch (phase) {
    case 'team_selecting':
      return 'Select a question'
    case 'question_shown':
      return 'Question revealed'
    case 'discussion':
      return timerSeconds != null
        ? `Discussion — ${timerSeconds}s`
        : 'Discussion'
    case 'answer_waiting':
      return "Waiting for answer"
    case 'steal_phase':
      return stealTeam ? `Steal — ${stealTeam.name}` : 'Steal'
    case 'round_complete':
      return '✓ Team scores!'
    case 'game_over':
      return 'Game over!'
    default:
      return ''
  }
}

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
  const muted = useSoundStore((s) => s.muted)
  const toggleMuted = useSoundStore((s) => s.toggleMuted)

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

  const pre = timer?.preCountdownSeconds ?? TIMER_PRE_COUNTDOWN_SECONDS
  const inPrePhase = Boolean(
    timer && timer.remaining > timer.duration - pre
  )

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

  // Play sounds for correct / incorrect / game end based on phase changes.
  useEffect(() => {
    if (phase === 'game_over') {
      playSound('game_end')
    }
  }, [phase])

  const currentTurnLabel =
    highlightedTeamIndex >= 0 && teams[highlightedTeamIndex]
      ? `${teams[highlightedTeamIndex].name}'s turn`
      : 'Round in progress'
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
  const maxScore = teams.length ? Math.max(...teams.map((t) => t.score)) : 0
  const winners = sortedTeams.filter((t) => t.score === maxScore)
  const rest = sortedTeams.filter((t) => t.score < maxScore)

  const phaseLabel = getPhaseLabel(
    phase,
    stealTeam ?? undefined,
    timer && !inPrePhase ? Math.max(0, timer.remaining - (timer.preCountdownSeconds ?? TIMER_PRE_COUNTDOWN_SECONDS)) : undefined
  )

  return (
    <div className="classroom-display">
      <div className="game-container flex flex-col h-full gap-4">
        {/* Header */}
        <header className="sbq-header flex-shrink-0 px-6 py-4 rounded-[var(--radius-xl)]">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="truncate font-display text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                {gameTitle}
              </h1>
            </div>
            <div className="flex-1 hidden md:flex justify-center">
              <ScoreBoard teams={teams} activeTeamIndex={highlightedTeamIndex} />
            </div>
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <ScoreBoard teams={teams} activeTeamIndex={highlightedTeamIndex} />
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0 border border-border bg-surface-alt text-text-muted hover:bg-surface"
                onClick={toggleMuted}
                aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              >
                <span className="text-lg font-bold">{muted ? '🔇' : '🔈'}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main board + teacher controls */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="sbq-board-shell px-6 py-5 flex flex-col">
            {!isGameOver && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-mono text-text-muted">
                  {currentTurnLabel}
                </div>
                {phaseLabel && (
                  <div className="sbq-phase-pill px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] bg-phase-discussionBg text-phase-discussion">
                    {phaseLabel}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 min-h-0 flex items-center justify-center">
              {/* Board view (selection / between rounds) */}
              {(phase === 'team_selecting' || phase === 'round_complete' || !showQuestionStage || !selectedCell) && !isGameOver && (
                <div className="w-full h-full flex items-center justify-center">
                  <GameBoard />
                </div>
              )}

              {/* Question card in-board (no overlay) */}
              {showQuestionStage && selectedCell && !isGameOver && (
                <div className="w-full max-w-[720px] mx-auto">
                  <div className="sbq-question-card sbq-card-enter bg-surface px-8 py-6 w-full">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="sbq-topic-chip px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted max-w-[200px] truncate">
                          {selectedCell.topic}
                        </div>
                        <div className="sbq-point-badge px-3 py-1 text-sm font-display font-extrabold">
                          {selectedCell.points} pts
                        </div>
                      </div>
                      {phaseLabel && (
                        <div
                          className="sbq-phase-pill px-3 py-1 text-xs font-mono uppercase tracking-[0.14em]"
                          style={{
                            backgroundColor:
                              phase === 'discussion'
                                ? 'var(--color-discussion-bg)'
                                : phase === 'steal_phase'
                                  ? 'var(--color-steal-bg)'
                                  : 'var(--color-accent-light)',
                            color:
                              phase === 'discussion'
                                ? 'var(--color-discussion)'
                                : phase === 'steal_phase'
                                  ? 'var(--color-steal)'
                                  : 'var(--color-accent)',
                          }}
                        >
                          {phaseLabel}
                        </div>
                      )}
                    </div>

                    <div className="text-center max-w-[560px] mx-auto">
                      <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-text-primary">
                        {selectedCell.prompt}
                      </h2>
                    </div>

                    {timer && (
                      <div className="mt-6 flex justify-center">
                        <TimerDisplay timer={timer} inline />
                      </div>
                    )}

                    {!timer && (
                      <div className="mt-4 text-sm text-text-muted text-center">
                        Mark correct or incorrect
                      </div>
                    )}

                    {answersRevealed && (
                      <div className="mt-6 pt-4 border-t border-border text-left">
                        <div className="text-[var(--text-xs)] font-mono uppercase tracking-[0.16em] text-text-muted mb-3">
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
              )}

              {/* Game over view inside board area */}
              {isGameOver && (
                <div className="w-full max-w-3xl mx-auto px-4">
                  <div className="sbq-question-card bg-surface px-8 py-6 w-full text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                      Game complete
                    </h2>
                    <div className="space-y-4">
                      <div className="text-sm font-mono uppercase tracking-[0.16em] text-text-muted">
                        {winners.length === 1 ? 'Winner' : 'Winners'}
                      </div>
                      <div className="flex flex-wrap justify-center gap-4">
                        {winners.map((team) => {
                          const colorDef = getTeamColorDef(team.color)
                          return (
                          <div
                            key={team.id}
                            className="game-over-card sbq-score-card px-5 py-4 min-w-[140px] text-center border-2 text-white"
                            style={{ backgroundColor: colorDef.hex, borderColor: colorDef.hex }}
                          >
                            <div className="text-sm font-semibold opacity-90 mb-1">
                              👑 {team.name}
                            </div>
                            <div className="text-3xl font-extrabold">
                              {team.score}
                            </div>
                          </div>
                          )
                        })}
                      </div>
                      {rest.length > 0 && (
                        <div className="pt-4 border-t border-border flex flex-wrap justify-center gap-2">
                          {rest.map((team) => {
                            const colorDef = getTeamColorDef(team.color)
                            return (
                            <div
                              key={team.id}
                              className="game-over-card px-3 py-2 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: colorDef.hex, borderColor: colorDef.hex }}
                            >
                              {team.name}: {team.score}
                            </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <Button
                        asChild
                        size="sm"
                        className="px-5 bg-[var(--color-accent)] hover:bg-indigo-700 text-white font-semibold rounded-full"
                      >
                        <Link href="/generate">Create new game</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="px-5 rounded-full border border-color-border bg-surface-alt text-text-primary hover:bg-color-border"
                      >
                        <Link href="/">Back to home</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teacher controls bar */}
          {!isGameOver && (
            <div className="sbq-teacher-bar flex-shrink-0 min-h-[64px] flex items-center justify-between px-6 py-3 rounded-[var(--radius-xl)]">
              <div className="flex flex-col gap-1">
                <div className="text-xs font-mono uppercase tracking-[0.16em] text-white/60">
                  Phase
                </div>
                <div className="text-sm font-mono">
                  {phaseLabel || 'Waiting to start'}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {showQuestionStage && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAnswersRevealed((v) => !v)}
                    className="bg-surface-alt border border-color-border text-text-primary hover:bg-color-border"
                  >
                    {answersRevealed ? 'Hide answers' : 'Reveal answers'}
                  </Button>
                )}
                {(phase === 'discussion' || phase === 'answer_waiting' || phase === 'steal_phase') && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        playSound('correct')
                        markCorrect()
                      }}
                      className="bg-[var(--color-correct)] hover:bg-emerald-700 text-white px-4 py-2 text-[var(--text-base)] font-semibold rounded-[var(--radius-md)]"
                    >
                      Correct
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        playSound('incorrect')
                        markIncorrect()
                      }}
                      className="border-2 border-[var(--color-incorrect)] text-[var(--color-incorrect)] bg-transparent hover:bg-[var(--color-incorrect-bg)] px-4 py-2 text-[var(--text-base)] font-semibold rounded-[var(--radius-md)]"
                    >
                      Incorrect
                    </Button>
                  </>
                )}
                {phase === 'steal_phase' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nextStealAttempt}
                    className="bg-surface-alt border border-color-border text-text-primary hover:bg-color-border px-3 py-2 rounded-[var(--radius-md)]"
                  >
                    Next
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={endGame}
                  className="border-2 border-[var(--color-incorrect)] text-[var(--color-incorrect)] bg-transparent hover:bg-[var(--color-incorrect-bg)] px-4 py-2 text-[var(--text-base)] font-semibold rounded-[var(--radius-md)]"
                >
                  End game
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
