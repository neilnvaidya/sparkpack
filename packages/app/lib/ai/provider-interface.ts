/**
 * AI provider abstraction – interface and types.
 * Real implementations (Anthropic, OpenAI, Google) in later tickets.
 * @see Docs/05-ai-provider-abstraction.md
 */

export interface AIProvider {
  name: string
  generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult>
  validateConnection(): Promise<boolean>
  estimateCost(promptTokens: number, outputTokens: number): number
  getAvailableModels(): string[]
}

export interface GenerationOptions {
  model: string
  maxTokens: number
  temperature: number
  systemPrompt?: string
  structuredOutput?: object
}

export interface GenerationResult {
  content: string
  tokensUsed: {
    input: number
    output: number
    total: number
  }
  model: string
  estimatedCost: number
  provider: string
  metadata: {
    latency: number
    timestamp: string
    success: boolean
  }
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public retryable: boolean = false,
    public cause?: Error
  ) {
    super(message)
    this.name = 'ProviderError'
  }
}
