/**
 * Template system types – metadata, content schema, generation params.
 * @see Docs/04-template-system.md, Docs/08a-implementation-guide.md
 */

import { z } from 'zod'
import React from 'react'

export interface GenerationParams {
  ageBand: string
  skillFocus: string
  numTeams: number
  timeMinutes: number
  contextText?: string
}

export interface GameTemplate<T = unknown> {
  id: string
  /** URL-friendly identifier for routes, e.g. "strategy-board-quiz" */
  slug: string
  name: string
  description: string
  category: 'board' | 'relay' | 'discussion'
  durationOptions: number[]
  teamRange: [number, number]
  ageBands: string[]
  contentSchema: z.ZodSchema<T>
  generatePrompt: (params: GenerationParams) => string
  RuntimeComponent: React.ComponentType<unknown>
  controls?: {
    phases: {
      [phase: string]: {
        label: string
        actions: { type: string; label: string }[]
      }
    }
  }
}
