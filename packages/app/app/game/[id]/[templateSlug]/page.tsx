'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/game-store'
import { getGame } from '@/lib/utils/storage'
import { getTemplate, getTemplateBySlug } from '@/lib/templates/registry'
import type { TeamColorId } from '@/lib/constants/team-colors'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveNumTeams(content: unknown): number {
  try {
    const c = content as { board?: { cells?: unknown[] } }
    const len = c?.board?.cells?.length ?? 0
    if (len === 0) return 4
    return Math.min(5, Math.max(3, Math.ceil(len / 4)))
  } catch { return 4 }
}

function sanitizeTeamNames(teamNames: unknown): string[] {
  if (!Array.isArray(teamNames)) return []
  return teamNames.map((n) => (typeof n === 'string' ? n.trim() : '')).filter((n) => n.length > 0).slice(0, 5)
}

function sanitizeTeamColors(teamColors: unknown): TeamColorId[] {
  if (!Array.isArray(teamColors)) return []
  return teamColors.map((c) => (typeof c === 'string' ? c.trim() : '')).filter((c) => c.length > 0).slice(0, 5) as TeamColorId[]
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

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
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 30px rgba(255,226,52,0.3), 0 0 60px rgba(255,122,26,0.15); }
          50%      { box-shadow: 0 0 50px rgba(255,226,52,0.55), 0 0 90px rgba(255,122,26,0.3); }
        }
        @keyframes drift {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }

        .sp-shimmer-logo {
          background: linear-gradient(120deg, var(--yellow) 0%, var(--orange) 30%, #fff 50%, var(--orange) 70%, var(--pink) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .sp-pop    { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .sp-float  { animation: floatY 3s ease-in-out infinite; }

        .sp-primary-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 18px 52px;
          background: linear-gradient(135deg, var(--yellow) 0%, var(--orange) 100%);
          border: none; border-radius: 100px;
          font-size: 1.15rem; font-weight: 700;
          font-family: var(--font-display);
          color: #2a0f4a; cursor: pointer; letter-spacing: 0.03em;
          box-shadow: 0 7px 0 #7a3300, 0 12px 35px rgba(255,122,26,0.45);
          transition: transform 0.08s, box-shadow 0.08s, filter 0.15s;
          animation: glow 2.5s ease-in-out infinite;
        }
        .sp-primary-btn:hover { filter: brightness(1.06); }
        .sp-primary-btn:active {
          transform: translateY(5px);
          box-shadow: 0 2px 0 #7a3300, 0 4px 12px rgba(255,122,26,0.3);
        }

        .sp-ghost-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          font-size: 13px; font-weight: 600;
          font-family: var(--font-body);
          color: rgba(255,251,232,0.65);
          cursor: pointer; text-decoration: none;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .sp-ghost-btn:hover {
          background: rgba(255,255,255,0.13);
          color: #fffbe8; border-color: rgba(255,255,255,0.35);
        }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 20%, #4a1a7a 0%, #2e1252 40%, #160830 100%)',
        fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,26,0.2) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '0%', right: '-10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,61,119,0.18) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        {[...Array(10)].map((_, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute', left: `${(i * 11 + 5) % 100}%`, bottom: '-8px',
            width: `${5 + (i % 3) * 3}px`, height: `${5 + (i % 3) * 3}px`,
            borderRadius: '50%', opacity: 0,
            background: i % 3 === 0 ? 'var(--yellow)' : i % 3 === 1 ? 'var(--pink)' : 'var(--orange)',
            animation: `drift ${9 + (i * 1.4) % 7}s ${(i * 0.7) % 5}s linear infinite`,
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    </>
  )
}

function LoadingScreen() {
  return (
    <SparkScreen>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          borderTop: '4px solid var(--yellow)',
          margin: '0 auto 28px',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: '#fffbe8', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }}>
          Loading game…
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,251,232,0.4)' }}>Setting up the board</p>
      </div>
    </SparkScreen>
  )
}

function ErrorScreen({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <SparkScreen>
      <div className="sp-pop" style={{ textAlign: 'center', maxWidth: '420px', padding: '20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }} className="sp-float">😬</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#ff8db3', marginBottom: '10px' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,251,232,0.5)', lineHeight: 1.6, marginBottom: '32px', background: 'rgba(255,61,119,0.1)', border: '1px solid rgba(255,61,119,0.25)', borderRadius: '10px', padding: '12px 16px' }}>
          {message}
        </p>
        <button className="sp-ghost-btn" onClick={onBack} style={{ marginBottom: '12px' }}>
          ← Back to game selector
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
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            <span className="sp-shimmer-logo">Spark</span>
            <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #c9a0ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pack</span>
          </span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,226,52,0.12)', border: '1px solid rgba(255,226,52,0.3)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
        }}>
          <span style={{ fontSize: '13px' }}>✅</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--yellow)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Game Ready</span>
        </div>

        {countdown === null ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, color: '#fffbe8', lineHeight: 1.1, marginBottom: '14px' }}>
              Ready to light it up? 🔥
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,251,232,0.55)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 36px' }}>
              Make sure your projector is on and all teams are looking at the screen.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[{ icon: '📽️', text: 'Projector on' }, { icon: '👀', text: 'Teams watching' }, { icon: '🔊', text: 'Volume up' }].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '8px 14px', fontSize: '13px', color: 'rgba(255,251,232,0.6)', fontWeight: 500,
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <button className="sp-primary-btn" onClick={handleStart}>
                <span>⚡</span><span>Start Game</span>
              </button>
              <Link href="/" className="sp-ghost-btn">← Back to Home</Link>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,251,232,0.5)', marginBottom: '20px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Starting in…</p>
            <div key={countdown} style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 20vw, 9rem)', fontWeight: 700, lineHeight: 1,
              background: countdown === 1 ? 'linear-gradient(135deg, var(--pink), var(--orange))' : countdown === 2 ? 'linear-gradient(135deg, var(--orange), var(--yellow))' : 'linear-gradient(135deg, var(--yellow), #fff)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
              filter: 'drop-shadow(0 0 40px rgba(255,226,52,0.5))',
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
      const configuredTeamNames = sanitizeTeamNames(stored.settings?.teamNames)
      const configuredTeamColors = sanitizeTeamColors(stored.settings?.teamColors)
      const configuredNumTeams = stored.settings?.numTeams
      const numTeams = configuredNumTeams && configuredNumTeams >= 3 && configuredNumTeams <= 5
        ? configuredNumTeams
        : configuredTeamNames.length >= 3 && configuredTeamNames.length <= 5
          ? configuredTeamNames.length
          : deriveNumTeams(stored.content)
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
        onBack={() => router.push(`/game/${gameId}`)}
      />
    )
  }
  if (phase === 'setup') return <SetupScreen onStart={startGame} />

  const template = getTemplate(templateId)
  const RuntimeComponent = template.RuntimeComponent
  return <RuntimeComponent />
}
