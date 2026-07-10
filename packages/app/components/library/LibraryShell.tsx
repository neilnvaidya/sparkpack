'use client'

/**
 * Shared frame for library screens: font setup, page background,
 * breadcrumb navigation and a centered column.
 */

import Link from 'next/link'
import { INK, FONT_BODY } from '@/lib/ui/theme'

export interface Crumb {
  label: string
  href?: string
}

export default function LibraryShell({
  crumbs,
  children,
  maxWidth = 880,
}: {
  crumbs: Crumb[]
  children: React.ReactNode
  maxWidth?: number
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lib-card { transition: border-color 0.15s ease, background 0.15s ease; }
        .lib-card:hover { border-color: ${INK.borderStrong}; background: ${INK.surfaceHover}; }
        .lib-link { color: inherit; text-decoration: none; }
      `}</style>
      <main
        style={{
          minHeight: '100vh',
          background: INK.bg,
          color: INK.text,
          fontFamily: FONT_BODY,
          padding: '40px 24px 96px',
        }}
      >
        <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto' }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: INK.textFaint,
              marginBottom: '40px',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/" className="lib-link" style={{ color: INK.textDim }}>
              SparkPack
            </Link>
            {crumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span aria-hidden="true">/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="lib-link" style={{ color: INK.textDim }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: INK.text }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          {children}
        </div>
      </main>
    </>
  )
}
