'use client'

/**
 * Risk It – confidence wagering. Before each question (knowing only the
 * subtopic) every team wagers 1, 3 or 5 from its bank. Right answers add the
 * wager, wrong answers lose it (never below 0). The final question forces 5.
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { riskItContentSchema } from '@/lib/templates/risk-it'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import { QuestionView } from '@/components/shared/QuestionView'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const START_BANK = 10
const WAGER_CYCLE = [1, 3, 5]

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'teams', title: 'Place your wagers', body: 'Knowing only the subtopic, each team taps to wager Risk 1, 3 or 5 from its bank.' },
  { target: 'show', title: 'Show the question', body: 'Once wagers are set, press Show question.' },
  { target: 'reveal', title: 'Reveal the answer', body: 'Read the question, then Reveal the answer.' },
  { target: 'teams', title: 'Mark the winners', body: 'Tap every team that got it right — they gain their wager, the rest lose theirs.' },
  { target: 'hint', title: 'Always know what to do', body: 'This strip always tells you the next step. Reopen this guide any time with “Show me how”.' },
]

type Stage = 'wager' | 'question' | 'reveal'

export default function RiskItGame() {
  const rawContent = useGameStore((s) => s.content)
  const teams = useGameStore((s) => s.teams)

  const parsed = riskItContentSchema.safeParse(rawContent)

  const [banks, setBanks] = useState<number[]>(() => teams.map(() => START_BANK))
  const [idx, setIdx] = useState(0)
  const [stage, setStage] = useState<Stage>('wager')
  const [wagers, setWagers] = useState<number[]>(() => teams.map(() => 1))
  const [marked, setMarked] = useState<boolean[]>(() => teams.map(() => false))
  const [finished, setFinished] = useState(false)

  if (!parsed.success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center" style={{ color: 'var(--color-incorrect)' }}>
        This game&apos;s content could not be loaded.
      </div>
    )
  }
  const content = parsed.data
  const total = content.questions.length
  const question = content.questions[idx]
  const isFinal = idx === total - 1

  const effectiveWager = (i: number) => (isFinal ? 5 : wagers[i])

  const cycleWager = (i: number) => {
    if (isFinal) return
    setWagers((prev) =>
      prev.map((w, j) => {
        if (j !== i) return w
        const pos = WAGER_CYCLE.indexOf(w)
        return WAGER_CYCLE[(pos + 1) % WAGER_CYCLE.length]
      })
    )
  }

  const toggleMark = (i: number) => setMarked((prev) => prev.map((m, j) => (j === i ? !m : m)))

  const applyAndNext = () => {
    const updated = banks.map((b, i) => {
      const delta = marked[i] ? effectiveWager(i) : -effectiveWager(i)
      return Math.max(0, b + delta)
    })
    setBanks(updated)
    if (isFinal) {
      setFinished(true)
      return
    }
    const nextIdx = idx + 1
    setIdx(nextIdx)
    setStage('wager')
    setWagers(teams.map(() => (nextIdx === total - 1 ? 5 : 1)))
    setMarked(teams.map(() => false))
  }

  if (finished) {
    return (
      <GameOverPanel
        heading="Risk It"
        teams={teams.map((t, i) => ({ name: t.name, colorId: t.color, score: banks[i] }))}
      />
    )
  }

  const anyMarked = marked.some(Boolean)

  let hint: string
  let glowTarget: ShellAction['id'] | 'teams' | null
  if (stage === 'wager') {
    hint = isFinal
      ? 'Final question — every team risks 5. Press Show question.'
      : 'Each team taps to set its wager (1 → 3 → 5), then press Show question.'
    glowTarget = 'show'
  } else if (stage === 'question') {
    hint = 'Read the question aloud. Reveal the answer once teams have answered.'
    glowTarget = 'reveal'
  } else {
    hint = 'Tap every team that got it right, then press Next.'
    glowTarget = anyMarked ? 'next' : 'teams'
  }

  const teamsMode = stage === 'reveal' ? 'toggle' : stage === 'wager' && !isFinal ? 'award' : 'display'

  const actions: ShellAction[] = [
    { id: 'show', label: 'Show question', variant: 'primary', onClick: () => setStage('question'), disabled: stage !== 'wager' },
    { id: 'reveal', label: 'Reveal answer', variant: 'primary', onClick: () => setStage('reveal'), disabled: stage !== 'question' },
    { id: 'next', label: isFinal ? 'Finish' : 'Next', variant: 'primary', onClick: applyAndNext, disabled: stage !== 'reveal' },
    { id: 'end', label: 'End game', variant: 'danger', onClick: () => setFinished(true) },
  ]

  return (
    <GameShell
      title={content.title}
      gameName="Risk It"
      progress={`Question ${idx + 1} of ${total}`}
      hint={hint}
      actions={actions}
      glowTarget={glowTarget}
      teamsPanel={{
        mode: teamsMode,
        onTeamClick: stage === 'reveal' ? toggleMark : stage === 'wager' ? cycleWager : undefined,
        teams: teams.map((t, i) => ({
          name: t.name,
          colorId: t.color,
          score: banks[i],
          badge: `Risk ${effectiveWager(i)}`,
          selected: stage === 'reveal' && marked[i],
        })),
      }}
      tutorial={{ id: 'risk_it', steps: TUTORIAL_STEPS }}
    >
      <div data-tutorial="question" className="flex w-full flex-col items-center justify-center gap-6 text-center">
        {stage === 'wager' ? (
          <>
            <div className="text-sm font-bold uppercase tracking-[0.14em] text-text-muted">
              Question {idx + 1} of {total}
            </div>
            <div className="font-display font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>
              {question.hint}
            </div>
            {isFinal && (
              <div
                className="rounded-[var(--radius-md)] border-2 px-5 py-2 font-display text-lg font-extrabold"
                style={{ borderColor: 'var(--color-steal)', color: 'var(--color-steal)', backgroundColor: 'var(--color-steal-bg)' }}
              >
                Final question — everyone risks 5!
              </div>
            )}
          </>
        ) : (
          <>
            <QuestionView question={question} revealed={stage === 'reveal'} variant="hero" />
          </>
        )}
      </div>
    </GameShell>
  )
}
