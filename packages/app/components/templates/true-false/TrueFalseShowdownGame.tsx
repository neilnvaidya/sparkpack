'use client'

/**
 * True or False Showdown on the shared GameShell. Teams commit to TRUE or
 * FALSE out loud, the teacher reveals, then multi-selects every team that
 * called it right in the sidebar (toggle mode) and presses Next.
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { trueFalseContentSchema } from '@/lib/templates/true-false'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const TRUE_GREEN = 'var(--color-correct)'
const FALSE_RED = 'var(--color-incorrect)'

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'question', title: 'Read the statement', body: 'Each team decides together: is this TRUE or FALSE?' },
  { target: 'reveal', title: 'Reveal the answer', body: 'Once every team has committed, press Reveal.' },
  { target: 'teams', title: 'Mark the winners', body: 'Tap every team that called it right — you can select more than one.' },
  { target: 'next', title: 'Next statement', body: 'Press Next to score the marked teams and move on.' },
  { target: 'hint', title: 'Always know what to do', body: 'This strip always tells you the next step. Reopen this guide any time with “Show me how”.' },
]

export default function TrueFalseShowdownGame() {
  const rawContent = useGameStore((s) => s.content)
  const teams = useGameStore((s) => s.teams)

  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<number[]>(() => teams.map(() => 0))
  const [awarded, setAwarded] = useState<boolean[]>(() => teams.map(() => false))
  const [finished, setFinished] = useState(false)

  const parsed = trueFalseContentSchema.safeParse(rawContent)
  if (!parsed.success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center" style={{ color: 'var(--color-incorrect)' }}>
        This game&apos;s content could not be loaded.
      </div>
    )
  }
  const content = parsed.data
  const current = content.statements[idx]
  const total = content.statements.length

  const toggleAward = (teamIndex: number) => {
    setAwarded((prev) => prev.map((a, i) => (i === teamIndex ? !a : a)))
  }

  const next = () => {
    setScores((prev) => prev.map((s, i) => (awarded[i] ? s + 1 : s)))
    setAwarded(teams.map(() => false))
    setRevealed(false)
    if (idx + 1 >= total) setFinished(true)
    else setIdx(idx + 1)
  }

  if (finished) {
    return (
      <GameOverPanel
        heading="Showdown over"
        teams={teams.map((t, i) => ({ name: t.name, colorId: t.color, score: scores[i] }))}
      />
    )
  }

  const anyAwarded = awarded.some(Boolean)
  const glowTarget = !revealed ? 'reveal' : anyAwarded ? 'next' : 'teams'

  const actions: ShellAction[] = [
    { id: 'reveal', label: 'Reveal', variant: 'primary', onClick: () => setRevealed(true), disabled: revealed },
    { id: 'next', label: 'Next', variant: 'primary', onClick: next, disabled: !revealed },
    { id: 'end', label: 'End game', variant: 'danger', onClick: () => setFinished(true) },
  ]

  return (
    <GameShell
      title={content.title}
      gameName="True or False Showdown"
      progress={`Statement ${idx + 1} of ${total}`}
      hint={
        !revealed
          ? 'Teams commit to TRUE or FALSE, then press Reveal.'
          : 'Tap every team that called it right, then press Next.'
      }
      actions={actions}
      glowTarget={glowTarget}
      teamsPanel={{
        mode: revealed ? 'toggle' : 'display',
        onTeamClick: toggleAward,
        teams: teams.map((t, i) => ({
          name: t.name,
          colorId: t.color,
          score: scores[i],
          selected: revealed && awarded[i],
        })),
      }}
      tutorial={{ id: 'true_false_showdown', steps: TUTORIAL_STEPS }}
    >
      <div key={idx} className="flex w-full flex-col items-center justify-center gap-10 text-center">
        <div
          data-tutorial="question"
          className="max-h-full overflow-y-auto font-display font-extrabold leading-tight tracking-tight"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', maxWidth: '900px' }}
        >
          {current.statement}
        </div>

        <div className="flex gap-5">
          {[true, false].map((value) => {
            const label = value ? 'TRUE' : 'FALSE'
            const color = value ? TRUE_GREEN : FALSE_RED
            const isAnswer = revealed && current.isTrue === value
            const dimmed = revealed && !isAnswer
            return (
              <div
                key={label}
                className="rounded-[var(--radius-lg)] border-2 text-center font-display font-extrabold transition-all"
                style={{
                  width: 'clamp(140px, 20vw, 220px)',
                  padding: '26px 0',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                  letterSpacing: '0.04em',
                  borderColor: color,
                  background: isAnswer ? color : 'transparent',
                  color: isAnswer ? '#fff' : color,
                  opacity: dimmed ? 0.25 : 1,
                  transform: isAnswer ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                {label}
              </div>
            )
          })}
        </div>

        {revealed && current.note && (
          <p className="max-w-[640px] text-lg text-text-muted">{current.note}</p>
        )}
      </div>
    </GameShell>
  )
}
