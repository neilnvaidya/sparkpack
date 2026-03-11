/**
 * Template registry – lookup by id, list all templates.
 * @see Docs/04-template-system.md
 */

import { GameTemplate } from './types'
import strategyBoardQuiz from './strategy-board-quiz'

export const templateRegistry: Record<string, GameTemplate> = {
  strategy_board_quiz: strategyBoardQuiz,
}

export type TemplateId = keyof typeof templateRegistry

export function getTemplate(id: string): GameTemplate {
  const template = templateRegistry[id]
  if (!template) {
    throw new Error(`Template not found: ${id}`)
  }
  return template
}

export function getTemplateBySlug(slug: string): GameTemplate | null {
  return getAllTemplates().find((t) => t.slug === slug) ?? null
}

export function getAllTemplates(): GameTemplate[] {
  return Object.values(templateRegistry)
}
