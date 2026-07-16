'use client'

/**
 * Subject screen – the curriculum for one subject, laid out the way the
 * National Curriculum does it: by year (grouped under key stage), with
 * topics in programme-of-study order. Ready topics link through to the
 * topic screen; unbuilt topics are shown in place, marked in development.
 */

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import LibraryShell from '@/components/library/LibraryShell'
import { getSubjectEntry } from '@/lib/curriculum/map'
import { getPack } from '@/lib/curriculum'
import { INK, SUBJECT_ACCENTS } from '@/lib/ui/theme'

export default function SubjectPage() {
  const params = useParams()
  const subjectParam = typeof params.subject === 'string' ? params.subject : ''
  const entry = getSubjectEntry(subjectParam)
  if (!entry) notFound()

  const accent = SUBJECT_ACCENTS[entry.subject]

  return (
    <LibraryShell crumbs={[{ label: 'Library', href: '/library' }, { label: entry.label }]}>
      <header style={{ marginBottom: '44px' }}>
        <div style={{ width: '28px', height: '4px', borderRadius: '2px', background: accent, marginBottom: '14px' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          {entry.label}
        </h1>
        <p style={{ color: INK.textDim, fontSize: '15px', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
          {entry.blurb}
        </p>
      </header>

      {entry.years.map((yearEntry) => (
        <section key={yearEntry.year} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Year {yearEntry.year}
            </h2>
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: INK.textFaint,
            }}>
              {yearEntry.keyStage === 'KS1' ? 'Key Stage 1' : 'Key Stage 2'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {yearEntry.topics.map((topic) => {
              const pack = topic.packId ? getPack(topic.packId) : null
              if (!pack) {
                return (
                  <div key={topic.topicId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: `1px dashed ${INK.border}`,
                    borderRadius: '10px',
                    color: INK.textFaint,
                  }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 600 }}>{topic.title}</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      In development
                    </span>
                  </div>
                )
              }
              return (
                <Link key={topic.topicId} href={`/library/${entry.subject}/${pack.id}`} className="lib-link">
                  <div className="lib-card" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    background: INK.surface,
                    border: `1px solid ${INK.border}`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: '10px',
                  }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{topic.title}</div>
                      <div style={{ fontSize: '12.5px', color: INK.textDim, marginTop: '3px' }}>
                        {pack.objectives.length} objectives · {pack.questions.length} questions
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: accent, whiteSpace: 'nowrap' }}>
                      Open
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </LibraryShell>
  )
}
