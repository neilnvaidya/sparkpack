'use client'

/**
 * True or False Showdown runtime – teams commit to TRUE or FALSE out loud
 * (or on whiteboards) before the teacher reveals; right calls score.
 * Self-contained: reads content + teams from the game store.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store/game-store'
import { trueFalseContentSchema } from '@/lib/templates/true-false'
import { getTeamColorDef } from '@/lib/constants/team-colors'
import { INK, FONT_BODY } from '@/lib/ui/theme'

const ACCENT = '#e8b64c'
const TRUE_GREEN = '#5bb361'
const FALSE_RED = '#cb4d68'

const shell: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: INK.bg,
  fontFamily: FONT_BODY,
  color: INK.text,
  padding: '24px 32px',
}

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes tfPop {
    from { opacity: 0; transform: scale(0.96) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`

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
      <div style={shell}>
        <style>{globalCss}</style>
        <p style={{ margin: 'auto', color: '#d97a8f' }}>
          This game&apos;s content could not be loaded.
        </p>
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
    const ranked = teams
      .map((team, i) => ({ team, score: scores[i] }))
      .sort((a, b) => b.score - a.score)
    const top = ranked[0]?.score ?? 0
    return (
      <div style={shell}>
        <style>{globalCss}</style>
        <div style={{ margin: 'auto', textAlign: 'center', animation: 'tfPop 0.4s both', minWidth: 'min(420px, 90vw)' }}>
          <p style={{
            fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: INK.textFaint, marginBottom: '10px',
          }}>
            Final scores
          </p>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '32px', letterSpacing: '-0.02em' }}>
            Showdown over
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ranked.map(({ team, score }) => {
              const color = getTeamColorDef(team.color)
              const winner = score === top && top > 0
              return (
                <div key={team.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: INK.surface,
                  border: `1px solid ${winner ? ACCENT : INK.border}`,
                  borderRadius: '12px', padding: '14px 22px',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: color.hex }} />
                    {team.name}
                    {winner && (
                      <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: ACCENT, textTransform: 'uppercase' }}>
                        Winner
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: ACCENT }}>
                    {score}
                  </span>
                </div>
              )
            })}
          </div>
          <Link href="/library" style={{
            display: 'inline-block', marginTop: '32px', color: INK.textDim,
            fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            border: `1px solid ${INK.borderStrong}`,
            borderRadius: '8px', padding: '10px 24px',
          }}>
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={shell}>
      <style>{globalCss}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
          {content.title}
          <span style={{ color: INK.textFaint, fontWeight: 600, marginLeft: '10px', fontSize: '0.9rem' }}>
            True or False Showdown
          </span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: INK.surface, border: `1px solid ${INK.border}`,
            borderRadius: '8px', padding: '6px 14px', fontWeight: 700, fontSize: '13px',
            color: INK.textDim,
          }}>
            {idx + 1} of {total}
          </span>
          <Link href="/library" style={{
            border: `1px solid ${INK.border}`, borderRadius: '8px',
            padding: '6px 14px', fontWeight: 700, fontSize: '13px',
            color: INK.textDim, textDecoration: 'none',
          }}>
            Exit
          </Link>
        </span>
      </div>

      {/* Statement */}
      <div key={idx} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', gap: '40px',
        animation: 'tfPop 0.3s both', padding: '20px 0',
      }}>
        <div style={{
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          fontWeight: 800, lineHeight: 1.25, maxWidth: '900px', letterSpacing: '-0.02em',
        }}>
          {current.statement}
        </div>

        {/* TRUE / FALSE cards */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {[true, false].map((value) => {
            const label = value ? 'TRUE' : 'FALSE'
            const color = value ? TRUE_GREEN : FALSE_RED
            const isAnswer = revealed && current.isTrue === value
            const dimmed = revealed && !isAnswer
            return (
              <div key={label} style={{
                width: 'clamp(140px, 20vw, 220px)', padding: '26px 0',
                borderRadius: '14px', textAlign: 'center',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                letterSpacing: '0.04em',
                border: `2px solid ${color}`,
                background: isAnswer ? color : 'transparent',
                color: isAnswer ? INK.bg : color,
                opacity: dimmed ? 0.2 : 1,
                transform: isAnswer ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.25s ease',
              }}>
                {label}
              </div>
            )
          })}
        </div>

        {revealed && current.note && (
          <p style={{ fontSize: '1.05rem', color: INK.textDim, maxWidth: '640px', animation: 'tfPop 0.25s both' }}>
            {current.note}
          </p>
        )}

        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            style={{
              padding: '16px 48px', borderRadius: '10px',
              border: `1px solid ${ACCENT}`,
              background: 'transparent',
              fontFamily: 'inherit', fontSize: '1.05rem', fontWeight: 800,
              color: ACCENT, cursor: 'pointer', letterSpacing: '0.01em',
            }}
          >
            Reveal
          </button>
        )}
      </div>

      {/* Award bar */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: INK.textFaint, marginBottom: '12px', fontWeight: 600 }}>
          {revealed
            ? 'Select every team that called it right, then Next'
            : 'Teams: commit to TRUE or FALSE now'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {teams.map((team, i) => {
            const color = getTeamColorDef(team.color)
            const on = awarded[i]
            return (
              <button
                key={team.id}
                onClick={() => toggleAward(i)}
                disabled={!revealed}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '12px 20px', borderRadius: '10px',
                  cursor: revealed ? 'pointer' : 'default',
                  border: `1px solid ${revealed ? color.hex : INK.border}`,
                  background: on ? color.hex : INK.surface,
                  color: on ? INK.bg : INK.text, fontWeight: 700, fontSize: '14.5px',
                  opacity: revealed ? 1 : 0.4,
                  fontFamily: 'inherit',
                }}
              >
                {!on && <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: color.hex }} />}
                {team.name}
                <span style={{ color: on ? INK.bg : ACCENT, fontWeight: 800 }}>{scores[i]}</span>
              </button>
            )
          })}
          <button
            onClick={next}
            disabled={!revealed}
            style={{
              padding: '12px 26px', borderRadius: '10px',
              cursor: revealed ? 'pointer' : 'default',
              border: `1px solid ${revealed ? ACCENT : INK.border}`,
              background: revealed ? ACCENT : 'transparent',
              color: revealed ? INK.bg : INK.textFaint,
              fontWeight: 800, fontSize: '14.5px',
              fontFamily: 'inherit',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
