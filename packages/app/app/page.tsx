'use client'

import Link from 'next/link'
import { CURRICULUM_MAP } from '@/lib/curriculum/map'
import { INK, SUBJECT_ACCENTS, FONT_BODY } from '@/lib/ui/theme'

export default function HomePage() {
  const readyTopics = CURRICULUM_MAP.reduce(
    (n, s) => n + s.years.reduce((m, y) => m + y.topics.filter((t) => t.packId).length, 0),
    0
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes homeRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .home-cta { transition: background 0.15s ease, transform 0.1s ease; }
        .home-cta:hover { transform: translateY(-1px); }
        .home-card { transition: border-color 0.15s ease, background 0.15s ease; }
        .home-card:hover { border-color: ${INK.borderStrong}; background: ${INK.surfaceHover}; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: INK.bg,
        color: INK.text,
        fontFamily: FONT_BODY,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: '760px', width: '100%' }}>

          <div style={{ animation: 'homeRise 0.5s both' }}>
            <p style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: INK.textFaint, margin: '0 0 18px',
            }}>
              Classroom games, one projected screen
            </p>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 7vw, 4.2rem)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 18px',
            }}>
              SparkPack
            </h1>
            <p style={{
              fontSize: '17px', color: INK.textDim, lineHeight: 1.65,
              maxWidth: '540px', margin: '0 0 36px',
            }}>
              A library of ready-to-play review games built on the UK National
              Curriculum. Pick your year group and topic, choose how your class
              plays it, and start — no accounts, no student devices, no setup.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
              <Link href="/library" style={{ textDecoration: 'none' }}>
                <span className="home-cta" style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: '#e8b64c',
                  color: INK.bg,
                  fontWeight: 800,
                  fontSize: '15px',
                  borderRadius: '10px',
                  letterSpacing: '0.01em',
                }}>
                  Browse the Library
                </span>
              </Link>
              <span style={{ fontSize: '13px', color: INK.textFaint, fontWeight: 600 }}>
                {readyTopics} curriculum topics ready to play · free for teachers
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
            animation: 'homeRise 0.5s 0.12s both',
          }}>
            {CURRICULUM_MAP.map((subject) => {
              const ready = subject.years.reduce(
                (m, y) => m + y.topics.filter((t) => t.packId).length, 0
              )
              return (
                <Link key={subject.subject} href={`/library/${subject.subject}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="home-card" style={{
                    background: INK.surface,
                    border: `1px solid ${INK.border}`,
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}>
                    <div style={{
                      width: '22px', height: '3px', borderRadius: '2px',
                      background: SUBJECT_ACCENTS[subject.subject], marginBottom: '10px',
                    }} />
                    <div style={{ fontWeight: 800, fontSize: '15.5px' }}>{subject.label}</div>
                    <div style={{ fontSize: '12.5px', color: INK.textFaint, fontWeight: 600, marginTop: '4px' }}>
                      {ready} {ready === 1 ? 'topic' : 'topics'} ready
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </main>
    </>
  )
}
