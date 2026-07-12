'use client'

import { useEffect } from 'react'
import { useGameStore, type MathRushState } from '@/lib/store/game-store'
import type { MathRushQuestion } from '@/lib/math-rush/question'
import { buildAnswerLine } from '@/lib/math-rush/question'
import { cn } from '@/lib/utils/cn'
import { getTeamColorDef } from '@/lib/constants/team-colors'
import { useSoundStore } from '@/lib/store/sound-store'
import type { MathRushContent } from '@/lib/math-rush/content'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'cards', title: 'Solve the cards', body: 'Every team races to solve all the cards at once.' },
  { target: 'cards', title: 'A team calls it', body: 'When a team calls out the answer to a card, tap that card to select it.' },
  { target: 'teams', title: 'Award the card', body: 'Tap the team that got it in the sidebar — the card locks in their colour.' },
  { target: 'next', title: 'Deal the next set', body: 'When the cards are claimed, press Next round for a fresh set.' },
  { target: 'hint', title: 'Always know what to do', body: 'This strip always tells you the next step. Reopen this guide any time with “Show me how”.' },
]

function formatEquation(q: MathRushQuestion): string {
  const L = q.hiddenLeft ? '?' : q.left
  const R = q.hiddenRight ? '?' : q.right
  const Res = q.hiddenResult ? '?' : q.result
  return `${L} ${q.operator} ${R} = ${Res}`
}

function MathRushCard({
  question,
  points,
  claimedByTeamIndex,
  answerRevealed,
  teams,
  isOpen,
  onCardClick,
  onRevealToggle,
}: {
  question: MathRushQuestion
  points: number
  claimedByTeamIndex: number | null
  answerRevealed: boolean
  teams: { id: string; name: string; color: string }[]
  isOpen: boolean
  onCardClick: () => void
  onRevealToggle: () => void
}) {
  const claimedTeam = claimedByTeamIndex !== null ? teams[claimedByTeamIndex] : null
  const claimColor = claimedTeam ? getTeamColorDef(claimedTeam.color as never) : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (claimedTeam) return
        onCardClick()
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !claimedTeam) {
          e.preventDefault()
          onCardClick()
        }
      }}
      className={cn(
        'relative flex min-h-[140px] flex-col rounded-[var(--radius-xl)] border-2 bg-surface p-4 transition-all md:p-5',
        claimedTeam ? 'cursor-default shadow-lg' : 'cursor-pointer',
        isOpen && 'next-action ring-4 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]'
      )}
      style={{ borderColor: claimedTeam && claimColor ? claimColor.hex : 'var(--color-border)' }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="sbq-point-badge shrink-0 px-2.5 py-0.5 font-display text-sm font-extrabold">
          {points} pts
        </span>
        {claimedTeam && claimColor && (
          <span
            className="flex max-w-[55%] items-center gap-1.5 rounded-full border bg-surface-alt px-2 py-0.5 text-xs font-semibold text-text-primary"
            style={{ borderColor: claimColor.hex }}
          >
            <span className="inline-block h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: claimColor.hex }} />
            <span className="truncate">{claimedTeam.name}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center text-center">
        <p className="font-display text-xl font-bold leading-snug tracking-tight text-text-primary md:text-2xl">
          {formatEquation(question)}
        </p>
      </div>

      {answerRevealed && (
        <div className="mt-3 border-t border-border pt-3 text-center">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-text-muted">Answer</div>
          <div className="font-mono text-lg font-bold text-[var(--color-correct)]">{buildAnswerLine(question)}</div>
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          className="text-xs font-semibold text-text-muted underline-offset-2 hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            onRevealToggle()
          }}
        >
          {answerRevealed ? 'Hide answer' : 'Show answer'}
        </button>
      </div>
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
  const mathRushAwardCard = useGameStore((s) => s.mathRushAwardCard)
  const mathRushRevealCard = useGameStore((s) => s.mathRushRevealCard)
  const mathRushRevealAllAnswers = useGameStore((s) => s.mathRushRevealAllAnswers)
  const mathRushNextRound = useGameStore((s) => s.mathRushNextRound)
  const mathRushClearLastAward = useGameStore((s) => s.mathRushClearLastAward)
  const playSound = useSoundStore((s) => s.play)

  const gameTitle = content?.title ?? 'Math Rush'
  const lastAward = templateState?.lastAward ?? null
  const openCardIndex = templateState?.openCardIndex ?? null

  useEffect(() => {
    if (!lastAward) return
    const t = window.setTimeout(() => mathRushClearLastAward(), 2800)
    return () => window.clearTimeout(t)
  }, [lastAward, mathRushClearLastAward])

  // Escape clears the selected card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') mathRushOpenCard(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mathRushOpenCard])

  useEffect(() => {
    if (phase === 'game_over') playSound('game_end')
  }, [phase, playSound])

  if (phase === 'game_over') {
    return <GameOverPanel teams={teams.map((t) => ({ name: t.name, colorId: t.color, score: t.score }))} />
  }

  const allAnswersRevealed =
    (templateState?.activeCards.length ?? 0) > 0 &&
    templateState!.activeCards.every((c) => c.answerRevealed)
  const allClaimed =
    (templateState?.activeCards.length ?? 0) > 0 &&
    templateState!.activeCards.every((c) => c.claimedByTeamIndex !== null)
  const isFinalRound = templateState !== null && templateState.round >= templateState.totalRounds

  const glowTarget: ShellAction['id'] | 'teams' | null =
    openCardIndex !== null ? 'teams' : allClaimed ? 'next' : null

  const hint =
    openCardIndex !== null
      ? 'Tap the team that solved it in the sidebar.'
      : allClaimed
        ? isFinalRound
          ? 'Every card is claimed — press Finish.'
          : 'Every card is claimed — press Next round.'
        : 'When a team calls out an answer, tap that card.'

  const actions: ShellAction[] = [
    {
      id: 'reveal',
      label: allAnswersRevealed ? 'Hide all answers' : 'Reveal all answers',
      variant: 'neutral',
      onClick: () => mathRushRevealAllAnswers(),
    },
    {
      id: 'next',
      label: isFinalRound ? 'Finish' : 'Next round',
      variant: 'primary',
      onClick: () => mathRushNextRound(),
    },
    { id: 'end', label: 'End game', variant: 'danger', onClick: endGame },
  ]

  return (
    <GameShell
      title={gameTitle}
      gameName="Math Rush"
      progress={templateState ? `Round ${Math.max(1, templateState.round)} of ${templateState.totalRounds}` : undefined}
      hint={hint}
      actions={actions}
      glowTarget={glowTarget}
      teamsPanel={{
        mode: openCardIndex !== null ? 'award' : 'display',
        onTeamClick: (ti) => {
          if (openCardIndex === null) return
          mathRushAwardCard(openCardIndex, ti)
          playSound('correct')
        },
        teams: teams.map((t) => ({ name: t.name, colorId: t.color, score: t.score })),
      }}
      tutorial={{ id: 'math_rush', steps: TUTORIAL_STEPS }}
    >
      <div className="flex h-full w-full flex-col gap-3">
        {lastAward && (
          <div
            className="animate-pulse rounded-xl border-2 px-4 py-2 text-center font-display text-lg font-bold"
            role="status"
            style={{
              borderColor: 'var(--color-correct)',
              backgroundColor: 'var(--color-correct-bg)',
              color: 'var(--color-text-primary)',
            }}
          >
            {lastAward.teamName} <span style={{ color: 'var(--color-correct)' }}>+{lastAward.points}</span> points
          </div>
        )}
        {templateState && (
          <div
            data-tutorial="cards"
            className="grid flex-1 content-center gap-3 overflow-auto md:gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}
          >
            {templateState.activeCards.map((card, i) => (
              <MathRushCard
                key={`${card.question.left}-${card.question.right}-${i}`}
                question={card.question}
                points={card.question.points}
                claimedByTeamIndex={card.claimedByTeamIndex}
                answerRevealed={card.answerRevealed}
                teams={teams}
                isOpen={openCardIndex === i}
                onCardClick={() => mathRushOpenCard(openCardIndex === i ? null : i)}
                onRevealToggle={() => mathRushRevealCard(i)}
              />
            ))}
          </div>
        )}
      </div>
    </GameShell>
  )
}
