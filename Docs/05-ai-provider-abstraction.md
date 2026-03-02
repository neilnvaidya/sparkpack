# AI Provider Abstraction Layer

## Purpose

Enable switching between AI providers (Anthropic, OpenAI, Google, local models) without changing application code. Provider selection happens via environment variable.

---

## Core Interface

Every AI provider implements this interface:

```typescript
// lib/ai/provider-interface.ts

export interface AIProvider {
  /**
   * Provider name for logging and identification
   */
  name: string

  /**
   * Generate content based on prompt
   */
  generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult>

  /**
   * Test if provider is accessible with current credentials
   */
  validateConnection(): Promise<boolean>

  /**
   * Estimate cost for a generation based on token count
   */
  estimateCost(promptTokens: number, outputTokens: number): number

  /**
   * Get available models for this provider
   */
  getAvailableModels(): string[]
}

export interface GenerationOptions {
  /**
   * Model identifier (provider-specific)
   */
  model: string

  /**
   * Maximum tokens to generate
   */
  maxTokens: number

  /**
   * Temperature for generation (0-2)
   */
  temperature: number

  /**
   * Optional system prompt (if provider supports it)
   */
  systemPrompt?: string

  /**
   * Optional structured output schema (if provider supports it)
   */
  structuredOutput?: object
}

export interface GenerationResult {
  /**
   * Generated text content
   */
  content: string

  /**
   * Tokens consumed by this generation
   */
  tokensUsed: {
    input: number
    output: number
    total: number
  }

  /**
   * Model that was used
   */
  model: string

  /**
   * Estimated cost in USD
   */
  estimatedCost: number

  /**
   * Provider that generated this
   */
  provider: string

  /**
   * Generation metadata
   */
  metadata: {
    latency: number  // milliseconds
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
```

---

## Provider Implementations

### Anthropic (Claude)

```typescript
// lib/ai/providers/anthropic.ts

import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, GenerationOptions, GenerationResult, ProviderError } from '../provider-interface'

export class AnthropicProvider implements AIProvider {
  name = 'anthropic'
  private client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    try {
      const response = await this.client.messages.create({
        model: options.model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        system: options.systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })

      const content = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n')

      return {
        content,
        tokensUsed: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
          total: response.usage.input_tokens + response.usage.output_tokens
        },
        model: response.model,
        estimatedCost: this.estimateCost(
          response.usage.input_tokens,
          response.usage.output_tokens
        ),
        provider: this.name,
        metadata: {
          latency: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          success: true
        }
      }
    } catch (error) {
      if (error.status === 429) {
        throw new ProviderError('Rate limit exceeded', this.name, true, error)
      }
      if (error.status >= 500) {
        throw new ProviderError('Provider service error', this.name, true, error)
      }
      throw new ProviderError('Generation failed', this.name, false, error)
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      })
      return true
    } catch {
      return false
    }
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    // Claude Sonnet 4 pricing (as of Feb 2024)
    const inputCost = (inputTokens / 1_000_000) * 3.0
    const outputCost = (outputTokens / 1_000_000) * 15.0
    return inputCost + outputCost
  }

  getAvailableModels(): string[] {
    return [
      'claude-opus-4-5-20251101',
      'claude-sonnet-4-5-20250929',
      'claude-sonnet-4-20250514',
      'claude-haiku-4-5-20251001'
    ]
  }
}
```

### OpenAI (GPT)

```typescript
// lib/ai/providers/openai.ts

import OpenAI from 'openai'
import { AIProvider, GenerationOptions, GenerationResult, ProviderError } from '../provider-interface'

export class OpenAIProvider implements AIProvider {
  name = 'openai'
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    try {
      const response = await this.client.chat.completions.create({
        model: options.model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
          { role: 'user' as const, content: prompt }
        ]
      })

      const content = response.choices[0]?.message?.content || ''

      return {
        content,
        tokensUsed: {
          input: response.usage?.prompt_tokens || 0,
          output: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        model: response.model,
        estimatedCost: this.estimateCost(
          response.usage?.prompt_tokens || 0,
          response.usage?.completion_tokens || 0
        ),
        provider: this.name,
        metadata: {
          latency: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          success: true
        }
      }
    } catch (error) {
      if (error.status === 429) {
        throw new ProviderError('Rate limit exceeded', this.name, true, error)
      }
      if (error.status >= 500) {
        throw new ProviderError('Provider service error', this.name, true, error)
      }
      throw new ProviderError('Generation failed', this.name, false, error)
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      })
      return true
    } catch {
      return false
    }
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    // GPT-4o pricing (as of Feb 2024)
    const inputCost = (inputTokens / 1_000_000) * 5.0
    const outputCost = (outputTokens / 1_000_000) * 15.0
    return inputCost + outputCost
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-3.5-turbo'
    ]
  }
}
```

### Google (Gemini)

```typescript
// lib/ai/providers/google.ts

import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIProvider, GenerationOptions, GenerationResult, ProviderError } from '../provider-interface'

export class GoogleProvider implements AIProvider {
  name = 'google'
  private client: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey)
  }

  async generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    try {
      const model = this.client.getGenerativeModel({ model: options.model })
      
      const fullPrompt = options.systemPrompt 
        ? `${options.systemPrompt}\n\n${prompt}`
        : prompt

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: options.maxTokens,
          temperature: options.temperature
        }
      })

      const response = result.response
      const content = response.text()

      // Estimate tokens (Gemini doesn't always provide exact counts)
      const estimatedInputTokens = Math.ceil(fullPrompt.length / 4)
      const estimatedOutputTokens = Math.ceil(content.length / 4)

      return {
        content,
        tokensUsed: {
          input: estimatedInputTokens,
          output: estimatedOutputTokens,
          total: estimatedInputTokens + estimatedOutputTokens
        },
        model: options.model,
        estimatedCost: this.estimateCost(estimatedInputTokens, estimatedOutputTokens),
        provider: this.name,
        metadata: {
          latency: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          success: true
        }
      }
    } catch (error) {
      throw new ProviderError('Generation failed', this.name, false, error)
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-pro' })
      await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'test' }] }] })
      return true
    } catch {
      return false
    }
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    // Gemini Pro pricing (as of Feb 2024)
    const inputCost = (inputTokens / 1_000_000) * 0.5
    const outputCost = (outputTokens / 1_000_000) * 1.5
    return inputCost + outputCost
  }

  getAvailableModels(): string[] {
    return [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ]
  }
}
```

---

## Provider Factory

```typescript
// lib/ai/provider-factory.ts

import { AIProvider } from './provider-interface'
import { AnthropicProvider } from './providers/anthropic'
import { OpenAIProvider } from './providers/openai'
import { GoogleProvider } from './providers/google'

export type ProviderType = 'anthropic' | 'openai' | 'google'

export function createProvider(
  type: ProviderType,
  apiKey: string
): AIProvider {
  switch (type) {
    case 'anthropic':
      return new AnthropicProvider(apiKey)
    case 'openai':
      return new OpenAIProvider(apiKey)
    case 'google':
      return new GoogleProvider(apiKey)
    default:
      throw new Error(`Unknown provider type: ${type}`)
  }
}

export function getProviderFromEnv(): AIProvider {
  const providerType = (process.env.AI_PROVIDER || 'anthropic') as ProviderType
  const apiKey = process.env.AI_API_KEY || ''

  if (!apiKey) {
    throw new Error('AI_API_KEY environment variable is required')
  }

  return createProvider(providerType, apiKey)
}
```

---

## Generation Service

```typescript
// lib/ai/generate.ts

import { getProviderFromEnv } from './provider-factory'
import { GenerationResult, ProviderError } from './provider-interface'

export interface GenerateGameContentParams {
  templateId: string
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export async function generateGameContent(
  params: GenerateGameContentParams
): Promise<GenerationResult> {
  const provider = getProviderFromEnv()
  
  const model = getModelForProvider()
  
  return await provider.generateContent(params.prompt, {
    model,
    maxTokens: params.maxTokens || 4000,
    temperature: params.temperature || 1,
    systemPrompt: params.systemPrompt
  })
}

export async function generateWithRetry(
  params: GenerateGameContentParams,
  maxRetries: number = 2
): Promise<GenerationResult> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateGameContent(params)
      
      // Log successful generation
      logGeneration(result, attempt, true)
      
      return result
      
    } catch (error) {
      lastError = error as Error
      
      // Log failed generation
      logGeneration(null, attempt, false, error as Error)
      
      if (error instanceof ProviderError && !error.retryable) {
        throw error
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }
    }
  }

  throw new Error(
    `Failed to generate content after ${maxRetries} attempts: ${lastError?.message}`
  )
}

function getModelForProvider(): string {
  const provider = process.env.AI_PROVIDER || 'anthropic'
  const customModel = process.env.AI_MODEL
  
  if (customModel) return customModel
  
  // Default models per provider
  const defaults = {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    google: 'gemini-1.5-pro'
  }
  
  return defaults[provider as keyof typeof defaults] || defaults.anthropic
}

function logGeneration(
  result: GenerationResult | null,
  attempt: number,
  success: boolean,
  error?: Error
): void {
  const log = {
    timestamp: new Date().toISOString(),
    attempt,
    success,
    provider: result?.provider || process.env.AI_PROVIDER,
    model: result?.model || 'unknown',
    tokensUsed: result?.tokensUsed || null,
    cost: result?.estimatedCost || null,
    latency: result?.metadata?.latency || null,
    error: error?.message || null
  }
  
  console.log(JSON.stringify(log))
}
```

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.local

# AI Provider Selection
AI_PROVIDER=anthropic  # anthropic | openai | google

# API Key for selected provider
AI_API_KEY=sk-ant-api03-...

# Optional: Override default model
AI_MODEL=claude-sonnet-4-20250514

# Optional: Generation settings
AI_MAX_TOKENS=4000
AI_TEMPERATURE=1
```

### Provider-Specific Variables

```bash
# For Anthropic
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-api03-...
AI_MODEL=claude-sonnet-4-20250514

# For OpenAI
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o

# For Google
AI_PROVIDER=google
AI_API_KEY=...
AI_MODEL=gemini-1.5-pro
```

---

## Usage in API Routes

```typescript
// app/api/generate-game/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { generateWithRetry } from '@/lib/ai/generate'
import { getTemplate } from '@/lib/templates/registry'
import { parseAndValidateContent } from '@/lib/ai/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, ageBand, skillFocus, numTeams, timeMinutes, contextText } = body
    
    // Get template
    const template = getTemplate(templateId)
    
    // Build prompt
    const prompt = template.generatePrompt({
      ageBand,
      skillFocus,
      numTeams,
      timeMinutes,
      contextText
    })
    
    // Generate with automatic retry
    const result = await generateWithRetry({
      templateId,
      prompt,
      maxTokens: 4000,
      temperature: 1
    })
    
    // Parse and validate
    const content = parseAndValidateContent(result.content, template.contentSchema)
    
    return NextResponse.json({
      success: true,
      gameId: generateGameId(),
      content,
      metadata: {
        provider: result.provider,
        model: result.model,
        tokensUsed: result.tokensUsed,
        cost: result.estimatedCost,
        latency: result.metadata.latency
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## Cost Tracking

### Per-Generation Cost Log

Every generation writes to logs:

```json
{
  "timestamp": "2024-02-16T10:30:00Z",
  "gameId": "game_123",
  "templateId": "strategy_board_quiz",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": {
    "input": 2145,
    "output": 1423,
    "total": 3568
  },
  "estimatedCost": 0.027,
  "latency": 2341,
  "success": true
}
```

### Daily Cost Summary

Aggregate logs to track:
- Total generations
- Total cost
- Average cost per generation
- Cost by provider
- Cost by template

### Cost Alerts

Trigger alerts when:
- Daily cost exceeds $50
- Single generation exceeds $0.10
- Provider error rate >5%

---

## Testing Strategy

### Provider Testing

Test each provider with identical prompts:

```typescript
// tests/ai-providers.test.ts

import { createProvider } from '@/lib/ai/provider-factory'

describe('AI Provider Comparison', () => {
  const testPrompt = 'Generate a simple math question for grade 5.'
  
  test('Anthropic generates valid content', async () => {
    const provider = createProvider('anthropic', process.env.AI_API_KEY!)
    const result = await provider.generateContent(testPrompt, {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 500,
      temperature: 1
    })
    
    expect(result.content).toBeTruthy()
    expect(result.tokensUsed.total).toBeGreaterThan(0)
    expect(result.estimatedCost).toBeGreaterThan(0)
  })
  
  test('OpenAI generates valid content', async () => {
    const provider = createProvider('openai', process.env.OPENAI_API_KEY!)
    const result = await provider.generateContent(testPrompt, {
      model: 'gpt-4o',
      maxTokens: 500,
      temperature: 1
    })
    
    expect(result.content).toBeTruthy()
    expect(result.tokensUsed.total).toBeGreaterThan(0)
    expect(result.estimatedCost).toBeGreaterThan(0)
  })
})
```

### Cost Comparison Test

```typescript
async function compareProviders(prompt: string) {
  const providers = ['anthropic', 'openai', 'google']
  const results = []
  
  for (const providerType of providers) {
    const provider = createProvider(providerType, getApiKey(providerType))
    const result = await provider.generateContent(prompt, {
      model: getDefaultModel(providerType),
      maxTokens: 4000,
      temperature: 1
    })
    
    results.push({
      provider: providerType,
      cost: result.estimatedCost,
      latency: result.metadata.latency,
      contentLength: result.content.length
    })
  }
  
  console.table(results)
}
```

---

## Provider Selection Criteria

### Anthropic (Claude)
**Pros:**
- Best instruction following
- Strong content generation quality
- Good at structured output
- Reliable JSON formatting

**Cons:**
- Most expensive per token
- Rate limits can be restrictive

**Best For:** High-quality content generation where accuracy matters

### OpenAI (GPT)
**Pros:**
- Fast response times
- Wide model selection
- Good structured output
- Established reliability

**Cons:**
- Mid-range pricing
- Sometimes verbose output

**Best For:** Balanced cost/quality, fast generation

### Google (Gemini)
**Pros:**
- Lowest cost
- Fast inference
- Large context window

**Cons:**
- Less reliable instruction following
- Inconsistent output formatting
- Newer/less mature

**Best For:** Cost optimization, high-volume usage

---

## Migration Path

### Current State (Pre-Beta)
- No provider chosen
- Test all three with sample templates
- Compare cost, quality, latency

### Beta Testing Phase
- Choose one provider for consistency
- All beta teachers use same provider
- Collect quality metrics

### Post-Launch
- Implement A/B testing
- Route some users to different providers
- Optimize based on data

### Long-Term
- Multi-provider load balancing
- Fallback to backup provider on failure
- Cost-optimized routing

---

## Implementation Checklist

**Phase 1: Setup**
- [ ] Install provider SDKs
- [ ] Create provider interface
- [ ] Implement provider classes
- [ ] Create provider factory
- [ ] Test each provider individually

**Phase 2: Integration**
- [ ] Build generation service
- [ ] Add retry logic
- [ ] Implement cost tracking
- [ ] Add logging
- [ ] Test end-to-end

**Phase 3: Validation**
- [ ] Test with real templates
- [ ] Compare provider outputs
- [ ] Measure cost per generation
- [ ] Choose default provider
- [ ] Document provider selection

---

## Provider Selection Decision

**To be made after testing during Phase 1:**

Test each provider with:
1. Strategy Board Quiz template
2. 20 different generation requests
3. Various age bands and content types

Measure:
- Generation success rate
- Content quality (manual review)
- Average cost per generation
- Average latency
- Error rate

**Decision criteria:**
- Must achieve >95% success rate
- Must generate appropriate content 95%+ of time
- Cost must be <$0.05 per generation
- Latency must be <30 seconds

**If multiple providers meet criteria:**
→ Choose lowest cost provider
→ Keep others as backup/failover

This decision will be documented in a separate file after testing.
