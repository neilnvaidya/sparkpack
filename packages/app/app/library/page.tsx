'use client'

/**
 * Library entry – choose a subject. Each card shows how much of the
 * curriculum map is ready to play.
 */

import Link from 'next/link'
import LibraryShell from '@/components/library/LibraryShell'
import { CURRICULUM_MAP } from '@/lib/curriculum/map'
import { INK, SUBJECT_ACCENTS } from '@/lib/ui/theme'

export default function LibraryPage() {
  return (
    <LibraryShell crumbs={[{ label: 'Library' }]}>
      <header style={{ marginBottom: '40px' }}>
        <p style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: INK.textFaint, margin: '0 0 10px',
        }}>
          Game Library
        </p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Choose a subject
        </h1>
        <p style={{ color: INK.textDim, fontSize: '15px', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
          The library follows the UK National Curriculum. Pick a subject, find
          your year group and topic, then choose how your class plays it.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {CURRICULUM_MAP.map((entry) => {
          const accent = SUBJECT_ACCENTS[entry.subject]
          const topicCount = entry.years.reduce((n, y) => n + y.topics.length, 0)
          const readyCount = entry.years.reduce(
            (n, y) => n + y.topics.filter((t) => t.packId).length, 0
          )
          return (
            <Link key={entry.subject} href={`/library/${entry.subject}`} className="lib-link">
              <div className="lib-card" style={{
                background: INK.surface,
                border: `1px solid ${INK.border}`,
                borderRadius: '12px',
                padding: '26px 26px 22px',
                height: '100%',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                <div style={{ width: '28px', height: '4px', borderRadius: '2px', background: accent }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.01em' }}>
                  {entry.label}
                </h2>
                <p style={{ color: INK.textDim, fontSize: '13.5px', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {entry.blurb}
                </p>
                <p style={{ fontSize: '12.5px', fontWeight: 600, color: INK.textFaint, margin: '8px 0 0' }}>
                  {readyCount} of {topicCount} topics ready to play
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </LibraryShell>
  )
}
