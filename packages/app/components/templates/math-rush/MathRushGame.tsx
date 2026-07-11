'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useGameStore, type MathRushState } from '@/lib/store/game-store'
import type { MathRushQuestion } from '@/lib/math-rush/question'
import { buildAnswerLine } from '@/lib/math-rush/question'
import { ScoreBoard } from '@/components/shared/ScoreBoard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { getTeamColorDef } from '@/lib/constants/team-colors'
import { useSoundStore } from '@/lib/store/sound-store'
import type { MathRushContent } from '@/lib/math-rush/content'

function formatEquation(q: MathRushQuestion): string {
  const L = q.hiddenLeft ? '?' : q.left
  const R = q.hiddenRight ? '?' : q.right
  const Res = q.hiddenResult ? '?' : q.result
  return `${L} ${q.operator} ${R} = ${Res}`
}

function MathRushCard({
  cardIndex,
  question,
  points,
  claimedByTeamIndex,
  answerRevealed,
  teams,
  isPickerOpen,
  onCardClick,
  onRevealToggle,
  playAwardSound,
}: {
  cardIndex: number
  question: MathRushQuestion
  points: number
  claimedByTeamIndex: number | null
  answerRevealed: boolean
  teams: { id: string; name: string; color: string }[]
  isPickerOpen: boolean
  onCardClick: () => void
  onRevealToggle: () => void
  playAwardSound: () => void
}) {
  const claimedTeam =
    claimedByTeamIndex !== null ? teams[claimedByTeamIndex] : null
  const claimColor = claimedTeam ? getTeamColorDef(claimedTeam.color as never) : null

  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-xl)] border-2 bg-surface p-4 md:p-5 transition-all min-h-[140px] flex flex-col',
        isPickerOpen && 'ring-4 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]',
        claimedTeam && claimColor && 'shadow-lg'
      )}
      style={
        claimedTeam && claimColor
          ? { borderColor: claimColor.hex }
          : { borderColor: 'var(--color-border)' }
      }
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="sbq-point-badge px-2.5 py-0.5 text-sm font-display font-extrabold shrink-0">
          {points} pts
        </span>
        {claimedTeam && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white truncate max-w-[55%]"
            style={{ backgroundColor: claimColor!.hex }}
          >
            {claimedTeam.name}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center text-center">
        <p className="font-display text-xl md:text-2xl font-bold text-text-primary leading-snug tracking-tight">
          {formatEquation(question)}
        </p>
      </div>

      {answerRevealed && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">
            Answer
          </div>
          <div className="font-mono text-lg font-bold text-[var(--color-correct)]">
            {buildAnswerLine(question)}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {!claimedTeam && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onCardClick()
            }}
          >
            {isPickerOpen ? 'Close' : 'Claim'}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-xs text-text-muted"
          onClick={(e) => {
            e.stopPropagation()
            onRevealToggle()
          }}
        >
          {answerRevealed ? 'Hide answer' : 'Show answer'}
        </Button>
      </div>

      {isPickerOpen && !claimedTeam && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[calc(var(--radius-xl)-2px)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-sm p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-mono uppercase tracking-widest text-text-muted mb-1">
            Award to
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-w-full">
            {teams.map((team, ti) => {
              const cd = getTeamColorDef(team.color as never)
              return (
                <button
                  key={team.id}
                  type="button"
                  className="px-3 py-2 rounded-lg text-sm font-bold text-white shadow-md hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: cd.hex }}
                  onClick={() => {
                    useGameStore.getState().mathRushAwardCard(cardIndex, ti)
                    playAwardSound()
                  }}
                >
                  {team.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MathRushGame() {
  const phase = useGameStore((s) => s.phase)
  const teams = useGameStore((s) => s.teams)
  const content = useGameStore((s) => s.content) as MathRushContent | null
  const templateState = useGameStore((s) => s.templateState as MathRushState | null)
  const endGame = useGameStore((s) => s.endGame)
  const mathRushOpenCard = useGameStore((s) => s.mathRushOpenCard)
  const mathRushRevealCard = useGameStore((s) => s.mathRushRevealCard)
  const mathRushRevealAllAnswers = useGameStore((s) => s.mathRushRevealAllAnswers)
  const mathRushNextRound = useGameStore((s) => s.mathRushNextRound)
  const mathRushClearLastAward = useGameStore((s) => s.mathRushClearLastAward)
  const playSound = useSoundStore((s) => s.play)
  const muted = useSoundStore((s) => s.muted)
  const toggleMuted = useSoundStore((s) => s.toggleMuted)

  const gameTitle = content?.title ?? 'Math Rush'
  const lastAward = templateState?.lastAward ?? null

  useEffect(() => {
    if (!lastAward) return
    const t = window.setTimeout(() => mathRushClearLastAward(), 2800)
    return () => window.clearTimeout(t)
  }, [lastAward, mathRushClearLastAward])

  const sortedTeams = useMemo(() => [...teams].sort((a, b) => b.score - a.score), [teams])
  const maxScore = teams.length ? Math.max(...teams.map((t) => t.score)) : 0
  const winners = sortedTeams.filter((t) => t.score === maxScore)
  const rest = sortedTeams.filter((t) => t.score < maxScore)
  const isGameOver = phase === 'game_over'

  const allAnswersRevealed =
    (templateState?.activeCards.length ?? 0) > 0 &&
    templateState!.activeCards.every((c) => c.answerRevealed)

  useEffect(() => {
    if (phase === 'game_over') playSound('game_end')
  }, [phase, playSound])

  return (
    <div className="classroom-display">
      <div className="game-container flex flex-col h-full gap-4">
        <header className="sbq-header flex-shrink-0 px-6 py-4 rounded-[var(--radius-xl)]">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="truncate font-display text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                {gameTitle}
              </h1>
            </div>
            <div className="flex-1 hidden md:flex justify-center">
              <ScoreBoard teams={teams} activeTeamIndex={-1} />
            </div>
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <ScoreBoard teams={teams} activeTeamIndex={-1} />
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0 border border-border bg-surface-alt text-text-muted hover:bg-surface"
                onClick={toggleMuted}
                aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              >
                <span className="text-xs font-bold uppercase tracking-wide">{muted ? 'Muted' : 'Sound'}</span>
              </Button>
              <Link
                href="/library"
                className="inline-flex h-9 items-center rounded-md border border-border bg-surface-alt px-3 text-xs font-bold uppercase tracking-wide text-text-muted hover:bg-surface"
              >
                Exit
              </Link>
            </div>
          </div>
        </header>

        {lastAward && (
          <div
            className="mx-6 px-4 py-3 rounded-xl text-center font-display text-lg md:text-xl font-bold animate-pulse border-2 border-[var(--color-correct)] bg-[var(--color-correct-bg)] text-text-primary"
            role="status"
          >
            {lastAward.teamName}{' '}
            <span className="text-[var(--color-correct)]">+{lastAward.points}</span> points
          </div>
        )}

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="sbq-board-shell px-4 md:px-6 py-4 flex flex-col flex-1 min-h-0">
            {!isGameOver && templateState && (
              <div
                className="grid gap-3 md:gap-4 flex-1 min-h-0 overflow-auto content-start"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                }}
              >
                {templateState.activeCards.map((card, i) => (
                  <div
                    key={`${card.question.left}-${card.question.right}-${i}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (card.claimedByTeamIndex !== null) return
                      mathRushOpenCard(templateState.openCardIndex === i ? null : i)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (card.claimedByTeamIndex !== null) return
                        mathRushOpenCard(templateState.openCardIndex === i ? null : i)
                      }
                    }}
                  >
                    <MathRushCard
                      cardIndex={i}
                      question={card.question}
                      points={card.question.points}
                      claimedByTeamIndex={card.claimedByTeamIndex}
                      answerRevealed={card.answerRevealed}
                      teams={teams}
                      isPickerOpen={templateState.openCardIndex === i}
                      onCardClick={() =>
                        mathRushOpenCard(templateState.openCardIndex === i ? null : i)
                      }
                      onRevealToggle={() => mathRushRevealCard(i)}
                      playAwardSound={() => playSound('correct')}
                    />
                  </div>
                ))}
              </div>
            )}

            {isGameOver && (
              <div className="w-full max-w-3xl mx-auto px-2 flex-1 flex items-center justify-center">
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
                            style={{
                              backgroundColor: colorDef.hex,
                              borderColor: colorDef.hex,
                            }}
                          >
                            <div className="text-sm font-semibold opacity-90 mb-1">
                              {team.name}
                            </div>
                            <div className="text-3xl font-extrabold">{team.score}</div>
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
                              style={{
                                backgroundColor: colorDef.hex,
                                borderColor: colorDef.hex,
                              }}
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
                      <Link href="/library">Back to Library</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="px-5 rounded-full border border-color-border bg-surface-alt text-text-primary hover:bg-color-border"
                    >
                      <Link href="/">Home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isGameOver && (
            <div className="sbq-teacher-bar flex-shrink-0 min-h-[64px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-3 rounded-[var(--radius-xl)]">
              <div className="flex flex-col gap-1">
                <div className="text-xs font-mono uppercase tracking-[0.16em] text-white/60">
                  Math Rush
                </div>
                <div className="text-sm font-mono text-white/90">Claim bounties · Next round when ready</div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mathRushRevealAllAnswers()}
                  className="bg-surface-alt border border-color-border text-text-primary hover:bg-color-border"
                >
                  {allAnswersRevealed ? 'Hide all answers' : 'Reveal all answers'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mathRushNextRound()}
                  className="bg-surface-alt border border-color-border text-text-primary hover:bg-color-border"
                >
                  Next round
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={endGame}
                  className="border-2 border-[var(--color-incorrect)] text-[var(--color-incorrect)] bg-transparent hover:bg-[var(--color-incorrect-bg)] px-4 py-2 font-semibold rounded-[var(--radius-md)]"
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
