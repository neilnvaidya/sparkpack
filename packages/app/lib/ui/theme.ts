/**
 * Library design tokens – calm, editorial, projector-friendly.
 * One accent per subject; everything else is a quiet ink palette.
 */

import type { Subject } from '@/lib/curriculum/schema'

export const INK = {
  bg: '#101014',
  surface: '#17171d',
  surfaceHover: '#1e1e26',
  border: '#26262e',
  borderStrong: '#34343e',
  text: '#ececf1',
  textDim: '#9a9aa3',
  textFaint: '#63636e',
} as const

export const SUBJECT_ACCENTS: Record<Subject, string> = {
  maths: '#e8b64c',
  science: '#4cc4b8',
  english: '#7f9df5',
  history: '#d98a68',
  geography: '#8fbf6f',
}

export const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif"
