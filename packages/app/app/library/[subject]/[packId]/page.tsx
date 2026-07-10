'use client'

/**
 * Topic screen – the learning objectives for this topic (curriculum
 * wording, in full) and the games that can deliver its content.
 * Choosing a game builds content via the slice adapter and launches it.
 */

import { useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import LibraryShell from '@/components/library/LibraryShell'
import { getSubjectEntry } from '@/lib/curriculum/map'
import { getPack } from '@/lib/curriculum'
import {
  GAME_SLICES,
  isSliceAvailable,
  usableItemCount,
  type GameSlice,
} from '@/lib/games/slices'
import { saveGame } from '@/lib/utils/storage'
import { INK, SUBJECT_ACCENTS } from '@/lib/ui/theme'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const [launching, setLaunching] = useState<string | null>(null)

  const subjectParam = typeof params.subject === 'string' ? params.subject : ''
  const packId = typeof params.packId === 'string' ? params.packId : ''
  const entry = getSubjectEntry(subjectParam)
  const pack = getPack(packId)
  if (!entry || !pack || pack.subject !== entry.subject) notFound()

  const accent = SUBJECT_ACCENTS[entry.subject]
  const games = GAME_SLICES.filter((slice) => isSliceAvailable(pack, slice))

  const play = (slice: GameSlice) => {
    if (launching) return
    setLaunching(slice.slug)
    try {
      const content = slice.build(pack)
      const gameId = `lib-${pack.id}-${slice.slug}-${Date.now().toString(36)}`
      saveGame({
        gameId,
        templateId: slice.templateId,
        content,
        createdAt: new Date().toISOString(),
      })
      router.push(`/game/${gameId}/${slice.slug}`)
    } catch (err) {
      console.error('Failed to launch game:', err)
      setLaunching(null)
    }
  }

  return (
    <LibraryShell
      crumbs={[
        { label: 'Library', href: '/library' },
        { label: entry.label, href: `/library/${entry.subject}` },
        { label: pack.title },
      ]}
    >
      <header style={{ marginBottom: '36px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: INK.textFaint, margin: '0 0 10px',
        }}>
          {entry.label} · Year {pack.year} · {pack.keyStage === 'KS1' ? 'Key Stage 1' : 'Key Stage 2'}
        </p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          {pack.title}
        </h1>
        <p style={{ color: INK.textDim, fontSize: '15px', lineHeight: 1.6, maxWidth: '620px', margin: 0 }}>
          {pack.description}
        </p>
      </header>

      {/* Learning objectives */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: INK.textFaint, margin: '0 0 14px',
        }}>
          Learning objectives
        </h2>
        <ol style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {pack.objectives.map((objective, i) => (
            <li key={objective.code} style={{
              display: 'flex', gap: '14px', alignItems: 'baseline',
              background: INK.surface,
              border: `1px solid ${INK.border}`,
              borderRadius: '10px',
              padding: '13px 18px',
            }}>
              <span style={{
                fontSize: '12.5px', fontWeight: 800, color: accent,
                minWidth: '20px', textAlign: 'right',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: '14px', lineHeight: 1.55, color: INK.text }}>
                {objective.statement}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Games */}
      <section>
        <h2 style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: INK.textFaint, margin: '0 0 14px',
        }}>
          Play this topic
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {games.map((slice) => {
            const isLaunching = launching === slice.slug
            return (
              <button
                key={slice.slug}
                className="lib-card"
                onClick={() => play(slice)}
                disabled={launching !== null}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px',
                  padding: '20px 22px',
                  background: INK.surface,
                  border: `1px solid ${INK.border}`,
                  borderRadius: '12px',
                  color: INK.text,
                  cursor: launching ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  opacity: launching && !isLaunching ? 0.45 : 1,
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {slice.name}
                </span>
                <span style={{ fontSize: '13px', color: INK.textDim, lineHeight: 1.5 }}>
                  {slice.tagline}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: accent, marginTop: '6px' }}>
                  {isLaunching ? 'Starting…' : `Play · ${usableItemCount(pack, slice)} questions`}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </LibraryShell>
  )
}
