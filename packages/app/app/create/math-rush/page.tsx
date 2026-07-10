'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveGame } from '@/lib/utils/storage'
import {
  mathRushContentSchema,
  type MathRushContent,
  type MathRushProblemSetId,
  PROBLEM_SET_IDS,
} from '@/lib/math-rush/content'
import { getBuiltInProblemSetLabel } from '@/lib/math-rush/load-problem-sets'
import {
  DEFAULT_TEAM_COLORS,
  TEAM_COLOR_OPTIONS,
  type TeamColorId,
} from '@/lib/constants/team-colors'
import { cn } from '@/lib/utils/cn'

const DEFAULT_TEAM_NAMES = [
  'Team 1',
  'Team 2',
  'Team 3',
  'Team 4',
  'Team 5',
  'Team 6',
]

function generateGameId(): string {
  return `game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

function SparkScreen({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root {
          --yellow: #FFE234; --orange: #FF7A1A;
          --pink:   #FF3D77; --purple: #3B1F5E;
          --cream:  #FFF8E7;
          --font-display: 'Fredoka', sans-serif;
          --font-body:    'Plus Jakarta Sans', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          padding: '32px 16px',
          background:
            'radial-gradient(ellipse at 30% 20%, #4a1a7a 0%, #2e1252 40%, #160830 100%)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {children}
      </div>
    </>
  )
}

export default function CreateMathRushPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Math Rush')
  const [problemSetIds, setProblemSetIds] = useState<MathRushProblemSetId[]>([
    'addition',
    'subtraction',
    'multiplication',
  ])
  const [questionsPerRound, setQuestionsPerRound] = useState(4)
  const [numTeams, setNumTeams] = useState(4)
  const [teamNames, setTeamNames] = useState<string[]>([...DEFAULT_TEAM_NAMES])
  const [teamColors, setTeamColors] = useState<TeamColorId[]>([
    ...DEFAULT_TEAM_COLORS.slice(0, 6),
  ])
  const [openColorPickerFor, setOpenColorPickerFor] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleSet = (id: MathRushProblemSetId) => {
    setProblemSetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const content: MathRushContent = {
      title: title.trim() || 'Math Rush',
      problemSetIds,
      questionsPerRound,
      customQuestions: [],
    }
    const parsed = mathRushContentSchema.safeParse(content)
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(' · '))
      return
    }
    const gameId = generateGameId()
    const preparedNames = teamNames.slice(0, numTeams).map((n) => n.trim())
    const preparedColors = teamColors.slice(0, numTeams)
    saveGame({
      gameId,
      templateId: 'math_rush',
      content: parsed.data,
      createdAt: new Date().toISOString(),
      settings: {
        numTeams,
        teamNames: preparedNames,
        teamColors: preparedColors,
      },
    })
    router.push(`/game/${gameId}/math-rush`)
  }

  return (
    <SparkScreen>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: 'rgba(255,251,232,0.55)',
              textDecoration: 'none',
            }}
          >
            ← Home
          </Link>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            fontWeight: 700,
            color: '#fffbe8',
            marginBottom: '8px',
          }}
        >
          Create Math Rush
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,251,232,0.55)', marginBottom: '28px' }}>
          Choose problem pools, team size, and how many cards show at once (up to 6).
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '22px',
          }}
        >
          <div>
            <Label htmlFor="mr-title" className="text-cream/80 text-xs uppercase tracking-wider">
              Session title
            </Label>
            <Input
              id="mr-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 bg-black/25 border-white/15 text-cream"
            />
          </div>

          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,251,232,0.45)',
              }}
            >
              Problem sets
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {(PROBLEM_SET_IDS as readonly MathRushProblemSetId[]).map((id) => (
                <label
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'rgba(255,251,232,0.9)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={problemSetIds.includes(id)}
                    onChange={() => toggleSet(id)}
                  />
                  {getBuiltInProblemSetLabel(id)}
                </label>
              ))}
            </div>
            {problemSetIds.length === 0 && (
              <p style={{ fontSize: '12px', color: '#ff8db3', marginTop: '8px' }}>
                Select at least one set.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="mr-qpr" className="text-cream/80 text-xs uppercase tracking-wider">
              Questions per round (1–6)
            </Label>
            <Input
              id="mr-qpr"
              type="number"
              min={1}
              max={6}
              value={questionsPerRound}
              onChange={(e) =>
                setQuestionsPerRound(
                  Math.min(6, Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                )
              }
              className="mt-2 w-24 bg-black/25 border-white/15 text-cream"
            />
          </div>

          <div>
            <Label htmlFor="mr-teams" className="text-cream/80 text-xs uppercase tracking-wider">
              Number of teams (2–6)
            </Label>
            <Input
              id="mr-teams"
              type="number"
              min={2}
              max={6}
              value={numTeams}
              onChange={(e) => {
                const n = Math.min(6, Math.max(2, Number.parseInt(e.target.value, 10) || 2))
                setNumTeams(n)
              }}
              className="mt-2 w-24 bg-black/25 border-white/15 text-cream"
            />
          </div>

          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,251,232,0.45)',
              }}
            >
              Team names & colors
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {Array.from({ length: numTeams }, (_, i) => {
                const selectedId = teamColors[i] ?? DEFAULT_TEAM_COLORS[i]
                const selectedDef =
                  TEAM_COLOR_OPTIONS.find((c) => c.id === selectedId) ?? TEAM_COLOR_OPTIONS[0]
                const isOpen = openColorPickerFor === i
                return (
                  <div key={i} style={{ position: 'relative' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        border: `2px solid ${selectedDef.hex}44`,
                        borderLeft: `3px solid ${selectedDef.hex}`,
                        borderRadius: '10px',
                        padding: '6px 8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenColorPickerFor(isOpen ? null : i)}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '7px',
                          background: selectedDef.hex,
                          border: isOpen ? '2px solid white' : '2px solid rgba(255,255,255,0.3)',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        aria-label={`Pick color for team ${i + 1}`}
                      />
                      <input
                        value={teamNames[i] ?? ''}
                        onChange={(e) => {
                          const next = [...teamNames]
                          next[i] = e.target.value
                          setTeamNames(next)
                        }}
                        placeholder={`Team ${i + 1}`}
                        style={{
                          flex: 1,
                          height: '28px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#fffbe8',
                          fontFamily: 'var(--font-body)',
                        }}
                      />
                    </div>
                    {isOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          background: '#1e0e38',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '12px',
                          padding: '10px',
                          zIndex: 1000,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'rgba(255,251,232,0.4)',
                            }}
                          >
                            Colour
                          </span>
                          <button
                            type="button"
                            onClick={() => setOpenColorPickerFor(null)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'rgba(255,251,232,0.5)',
                              fontSize: '14px',
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: '5px',
                          }}
                        >
                          {TEAM_COLOR_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={cn(
                                'w-7 h-7 rounded-md border-2 shrink-0',
                                selectedId === option.id
                                  ? 'border-[#FFE234]'
                                  : 'border-white/20'
                              )}
                              style={{ backgroundColor: option.hex }}
                              onClick={() => {
                                const next = [...teamColors]
                                next[i] = option.id
                                setTeamColors(next)
                                setOpenColorPickerFor(null)
                              }}
                              aria-label={option.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#ff8db3', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <Button
              type="submit"
              disabled={problemSetIds.length === 0}
              className="bg-gradient-to-br from-[#FFE234] to-[#FF7A1A] text-[#2a0f4a] font-bold rounded-full px-8"
            >
              Save & play
            </Button>
            <Button type="button" variant="outline" asChild className="rounded-full border-white/20 text-cream">
              <Link href="/generate">Board quiz instead</Link>
            </Button>
          </div>
        </form>
      </div>
    </SparkScreen>
  )
}
