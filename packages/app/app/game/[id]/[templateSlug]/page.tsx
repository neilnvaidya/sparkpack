'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/game-store'
import { getGame } from '@/lib/utils/storage'
import { getTemplate, getTemplateBySlug } from '@/lib/templates/registry'
import type { GameTemplate } from '@/lib/templates/types'
import type { TeamColorId } from '@/lib/constants/team-colors'
import type { StoredGame } from '@/lib/utils/storage'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveNumTeams(template: GameTemplate, content: unknown): number {
  const [minT, maxT] = template.teamRange
  if (template.id === 'math_rush') {
    return Math.min(maxT, Math.max(minT, 4))
  }
  try {
    const c = content as { board?: { cells?: unknown[] } }
    const len = c?.board?.cells?.length ?? 0
    if (len === 0) return Math.min(maxT, Math.max(minT, 4))
    const guessed = Math.ceil(len / 4)
    return Math.min(maxT, Math.max(minT, guessed))
  } catch {
    return Math.min(maxT, Math.max(minT, 4))
  }
}

function sanitizeTeamNames(teamNames: unknown, maxTeams: number): string[] {
  if (!Array.isArray(teamNames)) return []
  return teamNames
    .map((n) => (typeof n === 'string' ? n.trim() : ''))
    .filter((n) => n.length > 0)
    .slice(0, maxTeams)
}

function sanitizeTeamColors(teamColors: unknown, maxTeams: number): TeamColorId[] {
  if (!Array.isArray(teamColors)) return []
  return teamColors
    .map((c) => (typeof c === 'string' ? c.trim() : ''))
    .filter((c) => c.length > 0)
    .slice(0, maxTeams) as TeamColorId[]
}

function resolveNumTeams(stored: StoredGame, template: GameTemplate): number {
  const [minT, maxT] = template.teamRange
  const configuredNumTeams = stored.settings?.numTeams
  const nameCount = sanitizeTeamNames(stored.settings?.teamNames, maxT).length

  if (
    typeof configuredNumTeams === 'number' &&
    configuredNumTeams >= minT &&
    configuredNumTeams <= maxT
  ) {
    return configuredNumTeams
  }
  if (nameCount >= minT && nameCount <= maxT) {
    return nameCount
  }
  return deriveNumTeams(template, stored.content)
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function SparkScreen({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --ink-bg: #101014; --ink-surface: #17171d; --ink-border: #26262e;
          --ink-border-strong: #34343e;
          --ink-text: #ececf1; --ink-dim: #9a9aa3; --ink-faint: #63636e;
          --ink-accent: #e8b64c;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.97) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .sp-pop { animation: popIn 0.4s ease-out both; }

        .sp-primary-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 44px;
          background: var(--ink-accent);
          border: none; border-radius: 10px;
          font-size: 1.05rem; font-weight: 800;
          font-family: inherit;
          color: var(--ink-bg); cursor: pointer; letter-spacing: 0.01em;
          transition: transform 0.1s ease, filter 0.15s ease;
        }
        .sp-primary-btn:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .sp-primary-btn:active { transform: translateY(0); }

        .sp-ghost-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px;
          background: transparent;
          border: 1px solid var(--ink-border-strong);
          border-radius: 8px;
          font-size: 13px; font-weight: 600;
          font-family: inherit;
          color: var(--ink-dim);
          cursor: pointer; text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .sp-ghost-btn:hover { color: var(--ink-text); border-color: var(--ink-faint); }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--ink-bg)', color: 'var(--ink-text)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}>
        {children}
      </div>
    </>
  )
}

function LoadingScreen() {
  return (
    <SparkScreen>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          border: '3px solid var(--ink-border)',
          borderTop: '3px solid var(--ink-accent)',
          margin: '0 auto 24px',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', animation: 'pulse 1.5s ease-in-out infinite' }}>
          Loading game
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>Setting up the board</p>
      </div>
    </SparkScreen>
  )
}

function ErrorScreen({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <SparkScreen>
      <div className="sp-pop" style={{ textAlign: 'center', maxWidth: '420px', padding: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97a8f', marginBottom: '12px' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: '28px', background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', borderRadius: '10px', padding: '12px 16px' }}>
          {message}
        </p>
        <button className="sp-ghost-btn" onClick={onBack} style={{ marginBottom: '12px' }}>
          Back to Library
        </button>
      </div>
    </SparkScreen>
  )
}

function SetupScreen({ onStart }: { onStart: () => void }) {
  const [countdown, setCountdown] = useState<number | null>(null)

  const handleStart = () => setCountdown(3)

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) { onStart(); return }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 900)
    return () => clearTimeout(t)
  }, [countdown, onStart])

  return (
    <SparkScreen>
      <div className="sp-pop" style={{ textAlign: 'center', maxWidth: '560px', padding: '20px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '24px',
        }}>
          SparkPack · Game ready
        </p>

        {countdown === null ? (
          <>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Ready to play?
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-dim)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 32px' }}>
              Make sure your projector is on and all teams are looking at the screen.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
              {['Projector on', 'Teams watching', 'Volume up'].map((text) => (
                <div key={text} style={{
                  background: 'var(--ink-surface)', border: '1px solid var(--ink-border)',
                  borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--ink-dim)', fontWeight: 600,
                }}>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <button className="sp-primary-btn" onClick={handleStart}>
                Start Game
              </button>
              <Link href="/library" className="sp-ghost-btn">Back to Library</Link>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink-faint)', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Starting in</p>
            <div key={countdown} style={{
              fontSize: 'clamp(5rem, 20vw, 8rem)', fontWeight: 800, lineHeight: 1,
              color: 'var(--ink-accent)',
              animation: 'popIn 0.3s ease-out both',
            }}>
              {countdown}
            </div>
          </div>
        )}
      </div>
    </SparkScreen>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GameRunPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = typeof params.id === 'string' ? params.id : ''
  const templateSlug = typeof params.templateSlug === 'string' ? params.templateSlug : ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const initializeGame = useGameStore((s) => s.initializeGame)
  const startGame = useGameStore((s) => s.startGame)
  const phase = useGameStore((s) => s.phase)
  const templateId = useGameStore((s) => s.templateId)

  useEffect(() => {
    if (!gameId || !templateSlug) {
      setError('Invalid game or game type.')
      setLoading(false)
      return
    }
    const template = getTemplateBySlug(templateSlug)
    if (!template) {
      setError(`Unknown game type: "${templateSlug}".`)
      setLoading(false)
      return
    }
    const stored = getGame(gameId)
    if (!stored) {
      setError('Game not found. It may have expired — try creating a new one.')
      setLoading(false)
      return
    }
    if (stored.templateId !== template.id) {
      const expectedTemplate = getTemplate(stored.templateId)
      setError(`This game was created for "${expectedTemplate.name}", not "${template.name}".`)
      setLoading(false)
      return
    }
    try {
      const maxTeams = template.teamRange[1]
      const configuredTeamNames = sanitizeTeamNames(stored.settings?.teamNames, maxTeams)
      const configuredTeamColors = sanitizeTeamColors(stored.settings?.teamColors, maxTeams)
      const numTeams = resolveNumTeams(stored, template)
      initializeGame({
        gameId: stored.gameId,
        templateId: stored.templateId,
        numTeams,
        teamNames: configuredTeamNames.length ? configuredTeamNames : undefined,
        teamColors: configuredTeamColors.length ? configuredTeamColors : undefined,
        content: stored.content,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    }
    setLoading(false)
  }, [gameId, templateSlug, initializeGame])

  useEffect(() => {
    if (phase === 'setup' || phase === 'game_over' || loading) return
    if (phase === 'math_rush_round') return
    const store = useGameStore.getState()
    tickInterval.current = setInterval(() => store.tick(), 100)
    return () => {
      if (tickInterval.current) { clearInterval(tickInterval.current); tickInterval.current = null }
    }
  }, [phase, loading])

  if (loading) return <LoadingScreen />
  if (error) {
    return (
      <ErrorScreen
        message={error}
        onBack={() => router.push('/library')}
      />
    )
  }
  if (phase === 'setup') return <SetupScreen onStart={startGame} />

  const template = getTemplate(templateId)
  const RuntimeComponent = template.RuntimeComponent
  return <RuntimeComponent />
}
