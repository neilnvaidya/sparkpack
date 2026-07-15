/**
 * Template registry – lookup by id, list all templates.
 * @see Docs/04-template-system.md
 */

import { GameTemplate } from './types'
import strategyBoardQuiz from './strategy-board-quiz'
import questionRush from './question-rush'
import flashRound from './flash-round'
import trueFalseShowdown from './true-false'
import threeInARow from './three-in-a-row'
import summitClimb from './summit-climb'
import riskIt from './risk-it'

export const templateRegistry: Record<string, GameTemplate> = {
  strategy_board_quiz: strategyBoardQuiz,
  question_rush: questionRush,
  flash_round: flashRound,
  true_false_showdown: trueFalseShowdown,
  three_in_a_row: threeInARow,
  summit_climb: summitClimb,
  risk_it: riskIt,
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
