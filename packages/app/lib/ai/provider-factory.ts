/**
 * AI provider factory – create provider from type or env.
 * Real provider implementations (Anthropic, OpenAI, Google) in later tickets.
 * @see Docs/05-ai-provider-abstraction.md
 */

import {
  AIProvider,
  GenerationOptions,
  GenerationResult,
} from './provider-interface'

export type ProviderType = 'anthropic' | 'openai' | 'google'

/** Stub provider for Phase 1; all methods throw or return placeholders. */
class StubProvider implements AIProvider {
  name = 'stub'

  async generateContent(
    _prompt: string,
    _options: GenerationOptions
  ): Promise<GenerationResult> {
    throw new Error('AI provider not implemented – stub only')
  }

  async validateConnection(): Promise<boolean> {
    return false
  }

  estimateCost(_promptTokens: number, _outputTokens: number): number {
    return 0
  }

  getAvailableModels(): string[] {
    return []
  }
}

export function createProvider(
  _type: ProviderType,
  _apiKey: string
): AIProvider {
  return new StubProvider()
}

export function getProviderFromEnv(): AIProvider {
  const _providerType = (process.env.AI_PROVIDER || 'anthropic') as ProviderType
  const _apiKey = process.env.AI_API_KEY || ''
  return new StubProvider()
}
