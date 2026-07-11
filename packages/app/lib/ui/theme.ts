/**
 * Library design tokens – light, colourful, projector-friendly.
 * One accent per subject on a bright near-white canvas.
 * (The INK name is kept so call sites don't churn; values are light now.)
 */

import type { Subject } from '@/lib/curriculum/schema'

export const INK = {
  bg: '#f4f5fb',
  surface: '#ffffff',
  surfaceHover: '#f0f2fa',
  border: '#e1e4f0',
  borderStrong: '#c7cce0',
  text: '#1e2333',
  textDim: '#5a6072',
  textFaint: '#8a90a6',
} as const

export const SUBJECT_ACCENTS: Record<Subject, string> = {
  maths: '#d97706',
  science: '#0d9488',
  english: '#4f46e5',
  history: '#c2410c',
  geography: '#16a34a',
}

export const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif"
