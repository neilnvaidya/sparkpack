'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/game-store'
import { getGame, saveGame } from '@/lib/utils/storage'
import { getTemplate, getTemplateBySlug } from '@/lib/templates/registry'
import GameSetup, { type GameSetupSettings } from '@/components/shared/GameSetup'
import type { GameTemplate } from '@/lib/templates/types'
import type { TeamColorId } from '@/lib/constants/team-colors'
import type { StoredGame } from '@/lib/utils/storage'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveNumTeams(template: GameTemplate, content: unknown): number {
  const [minT, maxT] = template.teamRange
  if (template.id === 'question_rush') {
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
          --ink-bg: #f4f5fb; --ink-surface: #ffffff; --ink-border: #e1e4f0;
          --ink-border-strong: #c7cce0;
          --ink-text: #1e2333; --ink-dim: #5a6072; --ink-faint: #8a90a6;
          --ink-accent: #7c3aed;
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
          color: #ffffff; cursor: pointer; letter-spacing: 0.01em;
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

        .sp-step-btn {
          width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--ink-bg);
          border: 1px solid var(--ink-border-strong);
          border-radius: 8px;
          font-size: 16px; font-weight: 800; font-family: inherit;
          color: var(--ink-text); cursor: pointer;
          transition: border-color 0.15s;
        }
        .sp-step-btn:hover:not(:disabled) { border-color: var(--ink-faint); }
        .sp-step-btn:disabled { opacity: 0.35; cursor: default; }
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
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d81b43', marginBottom: '12px' }}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GameRunPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = typeof params.id === 'string' ? params.id : ''
  const templateSlug = typeof params.templateSlug === 'string' ? params.templateSlug : ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storedGame, setStoredGame] = useState<StoredGame | null>(null)
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
      setStoredGame(stored)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game')
    }
    setLoading(false)
  }, [gameId, templateSlug, initializeGame])

  useEffect(() => {
    if (phase === 'setup' || phase === 'game_over' || loading) return
    if (phase === 'question_rush_round') return
    // Only the store-driven, timer-based games need the tick loop. Every other
    // template (Flash Round, True/False, and the local-state games) runs on
    // local component state with no store timers.
    if (templateId !== 'strategy_board_quiz') return
    const store = useGameStore.getState()
    tickInterval.current = setInterval(() => store.tick(), 100)
    return () => {
      if (tickInterval.current) { clearInterval(tickInterval.current); tickInterval.current = null }
    }
  }, [phase, loading, templateId])

  if (loading) return <LoadingScreen />
  if (error) {
    return (
      <ErrorScreen
        message={error}
        onBack={() => router.push('/library')}
      />
    )
  }
  if (phase === 'setup') {
    const setupTemplate = getTemplate(templateId)
    const contentTitle = (storedGame?.content as { title?: string } | null)?.title
    const handleLaunch = (settings: GameSetupSettings) => {
      if (!storedGame) return
      const updated: StoredGame = { ...storedGame, settings }
      saveGame(updated)
      setStoredGame(updated)
      initializeGame({
        gameId: updated.gameId,
        templateId: updated.templateId,
        numTeams: settings.numTeams,
        teamNames: settings.teamNames,
        teamColors: settings.teamColors,
        content: updated.content,
      })
      startGame()
    }
    return (
      <SparkScreen>
        <GameSetup
          template={setupTemplate}
          gameTitle={contentTitle}
          initialNumTeams={storedGame ? resolveNumTeams(storedGame, setupTemplate) : 4}
          onLaunch={handleLaunch}
        />
      </SparkScreen>
    )
  }

  const template = getTemplate(templateId)
  const RuntimeComponent = template.RuntimeComponent
  return <RuntimeComponent />
}
