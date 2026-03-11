'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getGame } from '@/lib/utils/storage'
import { getAllTemplates } from '@/lib/templates/registry'
import type { GameTemplate } from '@/lib/templates/types'

// ─── Shared shell for game-area screens ──────────────────────────────────────

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

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes drift {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }

        .sp-pop { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

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
        {[...Array(8)].map((_, i) => (
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

// ─── Loading ───────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <SparkScreen>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          borderTop: '4px solid var(--yellow)',
          margin: '0 auto 24px',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#fffbe8' }}>
          Loading…
        </div>
      </div>
    </SparkScreen>
  )
}

// ─── Error ─────────────────────────────────────────────────────────────────────

function ErrorScreen({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <SparkScreen>
      <div className="sp-pop" style={{ textAlign: 'center', maxWidth: '420px', padding: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😬</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#ff8db3', marginBottom: '10px' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,251,232,0.5)', lineHeight: 1.6, marginBottom: '28px' }}>
          {message}
        </p>
        <button className="sp-ghost-btn" onClick={onBack}>
          ← Back to Create Game
        </button>
      </div>
    </SparkScreen>
  )
}

// ─── Game selector ─────────────────────────────────────────────────────────────

function GameCard({
  template,
  gameId,
  isThisGame,
}: {
  template: GameTemplate
  gameId: string
  isThisGame: boolean
}) {
  return (
    <Link
      href={`/game/${gameId}/${template.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: 'rgba(255,255,255,0.06)',
        border: '2px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        padding: '20px 24px',
        transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.borderColor = 'rgba(255,226,52,0.35)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fffbe8', margin: 0 }}>
          {template.name}
        </h2>
        {isThisGame && (
          <span style={{
            flexShrink: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--yellow)',
            background: 'rgba(255,226,52,0.15)',
            border: '1px solid rgba(255,226,52,0.4)',
            borderRadius: '100px',
            padding: '4px 10px',
          }}>
            This game
          </span>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,251,232,0.6)', lineHeight: 1.5, margin: 0 }}>
        {template.description}
      </p>
      <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--yellow)', fontWeight: 600 }}>
        Play →
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GameSelectorPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = typeof params.id === 'string' ? params.id : ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templateId, setTemplateId] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      setError('Invalid game ID')
      setLoading(false)
      return
    }
    const stored = getGame(gameId)
    if (!stored) {
      setError('Game not found. It may have expired — try creating a new one.')
      setLoading(false)
      return
    }
    setTemplateId(stored.templateId)
    setLoading(false)
  }, [gameId])

  if (loading) return <LoadingScreen />
  if (error) {
    return (
      <ErrorScreen
        message={error}
        onBack={() => router.push('/generate')}
      />
    )
  }

  const templates = getAllTemplates()

  return (
    <SparkScreen>
      <div className="sp-pop" style={{ maxWidth: '520px', padding: '24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            fontWeight: 700,
            color: '#fffbe8',
            marginBottom: '8px',
          }}>
            Choose a game
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,251,232,0.55)' }}>
            Pick the game type to run for this session.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {templates.map((template, i) => (
            <div key={template.id} style={{ animationDelay: `${i * 0.06}s` }} className="sp-pop">
              <GameCard
                template={template}
                gameId={gameId}
                isThisGame={template.id === templateId}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/generate" className="sp-ghost-btn">
            ← Back to Create Game
          </Link>
        </div>
      </div>
    </SparkScreen>
  )
}
