'use client'

/**
 * Flash Round runtime – rapid-fire whole-class quiz on the shared GameShell.
 * Reads content + teams from the game store; question/score state is local.
 * Awarding is always "tap a team in the sidebar" (glowing once revealed).
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { flashRoundContentSchema } from '@/lib/templates/flash-round'
import { GameShell, type ShellAction } from '@/components/shared/GameShell'
import { GameOverPanel } from '@/components/shared/GameOverPanel'
import type { TutorialStep } from '@/components/shared/TutorialOverlay'

const TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'question', title: 'Read this out', body: 'Read the question to the class. Teams race to answer first.' },
  { title: 'Let them try', body: 'Give the teams a few seconds to call out or write their answer.' },
  { target: 'reveal', title: 'Show the answer', body: 'Press Reveal answer here when they have had a go.' },
  { target: 'teams', title: 'Award the point', body: 'Tap the team that got it right first. Then the next question appears.' },
  { target: 'hint', title: 'Always know what to do', body: 'This strip always tells you the next step. You can reopen this guide any time with “Show me how”.' },
]

export default function FlashRoundGame() {
  const rawContent = useGameStore((s) => s.content)
  const teams = useGameStore((s) => s.teams)

  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<number[]>(() => teams.map(() => 0))
  const [finished, setFinished] = useState(false)

  const parsed = flashRoundContentSchema.safeParse(rawContent)
  if (!parsed.success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center" style={{ color: 'var(--color-incorrect)' }}>
        This game&apos;s content could not be loaded.
      </div>
    )
  }
  const content = parsed.data
  const question = content.questions[idx]
  const total = content.questions.length

  const advance = () => {
    setRevealed(false)
    if (idx + 1 >= total) setFinished(true)
    else setIdx(idx + 1)
  }

  const award = (teamIndex: number | null) => {
    if (teamIndex !== null) {
      setScores((prev) => prev.map((s, i) => (i === teamIndex ? s + 1 : s)))
    }
    advance()
  }

  if (finished) {
    return (
      <GameOverPanel
        heading="Flash Round complete"
        teams={teams.map((t, i) => ({ name: t.name, colorId: t.color, score: scores[i] }))}
      />
    )
  }

  const actions: ShellAction[] = [
    {
      id: 'reveal',
      label: 'Reveal answer',
      variant: 'primary',
      onClick: () => setRevealed(true),
      disabled: revealed,
    },
    { id: 'end', label: 'End game', variant: 'danger', onClick: () => setFinished(true) },
  ]

  return (
    <GameShell
      title={content.title}
      gameName="Flash Round"
      progress={`Question ${idx + 1} of ${total}`}
      hint={
        revealed
          ? 'Tap the team that got it right first — or “No one” to move on.'
          : 'Read the question aloud. Press Reveal answer when they have answered.'
      }
      actions={actions}
      glowTarget={revealed ? 'teams' : 'reveal'}
      teamsPanel={{
        mode: revealed ? 'award' : 'display',
        onTeamClick: (i) => award(i),
        teams: teams.map((t, i) => ({ name: t.name, colorId: t.color, score: scores[i] })),
        footer: revealed ? (
          <button
            type="button"
            onClick={() => award(null)}
            className="w-full rounded-[var(--radius-md)] border py-2.5 text-sm font-bold text-text-muted hover:bg-surface-alt"
            style={{ borderColor: 'var(--color-border-strong)' }}
          >
            No one — next
          </button>
        ) : undefined,
      }}
      tutorial={{ id: 'flash_round', steps: TUTORIAL_STEPS }}
    >
      <div key={idx} className="flex w-full flex-col items-center justify-center gap-8 text-center">
        <div
          data-tutorial="question"
          className="max-h-full overflow-y-auto font-display font-extrabold leading-tight tracking-tight"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', maxWidth: '900px' }}
        >
          {question.prompt}
        </div>

        {revealed && (
          <div>
            <div
              className="font-display font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 3.6rem)', color: 'var(--color-accent)' }}
            >
              {question.answer}
            </div>
            {question.detail && (
              <p className="mt-3 text-base text-text-muted">{question.detail}</p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  )
}
