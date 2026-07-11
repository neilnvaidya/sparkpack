'use client'

/**
 * Shared pre-game setup screen: how-to-play rules plus team configuration
 * (count, names, colours). Runs the 3-2-1 countdown, then hands the chosen
 * settings back to the game page to persist and start the game.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { GameTemplate } from '@/lib/templates/types'
import {
  TEAM_COLOR_OPTIONS,
  DEFAULT_TEAM_COLORS,
  getTeamColorDef,
  type TeamColorId,
} from '@/lib/constants/team-colors'

export interface GameSetupSettings {
  numTeams: number
  teamNames: string[]
  teamColors: TeamColorId[]
}

interface GameSetupProps {
  template: GameTemplate
  gameTitle?: string
  initialNumTeams: number
  onLaunch: (settings: GameSetupSettings) => void
}

function defaultColorFor(index: number, taken: TeamColorId[]): TeamColorId {
  const preferred = DEFAULT_TEAM_COLORS[index % DEFAULT_TEAM_COLORS.length]
  if (!taken.includes(preferred)) return preferred
  const free = TEAM_COLOR_OPTIONS.find((c) => !taken.includes(c.id))
  return free ? free.id : preferred
}

function nextFreeColor(current: TeamColorId, taken: TeamColorId[]): TeamColorId {
  const ids = TEAM_COLOR_OPTIONS.map((c) => c.id)
  const start = ids.indexOf(current)
  for (let step = 1; step <= ids.length; step++) {
    const candidate = ids[(start + step) % ids.length]
    if (!taken.includes(candidate)) return candidate
  }
  return current
}

export default function GameSetup({ template, gameTitle, initialNumTeams, onLaunch }: GameSetupProps) {
  const [minTeams, maxTeams] = template.teamRange
  const clamp = (n: number) => Math.min(maxTeams, Math.max(minTeams, n))

  const [numTeams, setNumTeams] = useState(clamp(initialNumTeams))
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: maxTeams }, () => '')
  )
  const [colors, setColors] = useState<TeamColorId[]>(() => {
    const out: TeamColorId[] = []
    for (let i = 0; i < maxTeams; i++) out.push(defaultColorFor(i, out))
    return out
  })
  const [countdown, setCountdown] = useState<number | null>(null)

  const handleStart = () => setCountdown(3)

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      onLaunch({
        numTeams,
        teamNames: names.slice(0, numTeams).map((n, i) => n.trim() || `Team ${i + 1}`),
        teamColors: colors.slice(0, numTeams),
      })
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 900)
    return () => clearTimeout(t)
  }, [countdown, onLaunch, numTeams, names, colors])

  if (countdown !== null) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <p style={{ fontSize: '13px', color: 'var(--ink-faint)', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          Starting in
        </p>
        <div key={countdown} style={{
          fontSize: 'clamp(5rem, 20vw, 8rem)', fontWeight: 800, lineHeight: 1,
          color: 'var(--ink-accent)',
          animation: 'popIn 0.3s ease-out both',
        }}>
          {countdown}
        </div>
      </div>
    )
  }

  return (
    <div className="sp-pop" style={{ width: 'min(880px, 94vw)', padding: '28px 20px' }}>
      <p style={{
        fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px', textAlign: 'center',
      }}>
        SparkPack · Game setup
      </p>
      <h1 style={{
        fontSize: 'clamp(1.7rem, 5vw, 2.3rem)', fontWeight: 800, lineHeight: 1.1,
        letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '6px',
      }}>
        {template.name}
      </h1>
      {gameTitle && (
        <p style={{ fontSize: '14px', color: 'var(--ink-dim)', textAlign: 'center', marginBottom: '26px' }}>
          {gameTitle}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
        marginBottom: '26px',
      }}>
        {/* How to play */}
        <section style={{
          background: 'var(--ink-surface)', border: '1px solid var(--ink-border)',
          borderRadius: '12px', padding: '20px 22px',
        }}>
          <h2 style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '14px',
          }}>
            How to play
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {template.howToPlay.map((rule, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={{
                  fontSize: '12.5px', fontWeight: 800, color: 'var(--ink-accent)',
                  minWidth: '16px', textAlign: 'right',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--ink-text)' }}>{rule}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Teams */}
        <section style={{
          background: 'var(--ink-surface)', border: '1px solid var(--ink-border)',
          borderRadius: '12px', padding: '20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0,
            }}>
              Teams
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                aria-label="Fewer teams"
                onClick={() => setNumTeams((n) => clamp(n - 1))}
                disabled={numTeams <= minTeams}
                className="sp-step-btn"
              >
                &minus;
              </button>
              <span style={{ fontSize: '15px', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                {numTeams}
              </span>
              <button
                type="button"
                aria-label="More teams"
                onClick={() => setNumTeams((n) => clamp(n + 1))}
                disabled={numTeams >= maxTeams}
                className="sp-step-btn"
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: numTeams }, (_, i) => {
              const color = getTeamColorDef(colors[i])
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    aria-label={`Change colour for team ${i + 1}`}
                    title="Tap to change colour"
                    onClick={() =>
                      setColors((prev) => {
                        const next = [...prev]
                        const taken = next.filter((_, j) => j !== i && j < numTeams)
                        next[i] = nextFreeColor(next[i], taken)
                        return next
                      })
                    }
                    style={{
                      width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
                      background: color.hex, border: '2px solid var(--ink-border-strong)',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="text"
                    value={names[i]}
                    placeholder={`Team ${i + 1}`}
                    maxLength={18}
                    onChange={(e) =>
                      setNames((prev) => {
                        const next = [...prev]
                        next[i] = e.target.value
                        return next
                      })
                    }
                    style={{
                      flex: 1, minWidth: 0,
                      background: 'var(--ink-bg)', border: '1px solid var(--ink-border)',
                      borderRadius: '8px', padding: '9px 12px',
                      fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                      color: 'var(--ink-text)', outline: 'none',
                    }}
                  />
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--ink-faint)', marginTop: '12px' }}>
            Tap a swatch to change a team&rsquo;s colour. Names are optional.
          </p>
        </section>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <button className="sp-primary-btn" onClick={handleStart}>
          Start Game
        </button>
        <Link href="/library" className="sp-ghost-btn">Back to Library</Link>
      </div>
    </div>
  )
}
