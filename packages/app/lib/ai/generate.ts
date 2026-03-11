/**
 * Game content generation – calls AI provider with template prompts.
 * Real implementation in later tickets.
 * @see Docs/05-ai-provider-abstraction.md, Docs/07-api-specification.md
 */

import { getProviderFromEnv } from './provider-factory'
import { GenerationResult } from './provider-interface'

export interface GenerateGameContentParams {
  templateId: string
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export async function generateGameContent(
  _params: GenerateGameContentParams
): Promise<GenerationResult> {
  const provider = getProviderFromEnv()
  const model = process.env.AI_MODEL ?? 'claude-sonnet-4-20250514'
  return provider.generateContent(_params.prompt, {
    model,
    maxTokens: _params.maxTokens ?? 4000,
    temperature: _params.temperature ?? 1,
    systemPrompt: _params.systemPrompt,
  })
}

export async function generateWithRetry(
  params: GenerateGameContentParams,
  maxRetries: number = 2
): Promise<GenerationResult> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateGameContent(params)
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        continue
      }
      throw lastError
    }
  }
  throw lastError ?? new Error('generateWithRetry failed')
}
