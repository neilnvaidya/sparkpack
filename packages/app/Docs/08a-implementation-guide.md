# Implementation Guide: Build Order

## Overview

This document specifies the **exact order** in which components must be built. Each section is a discrete unit of work that can be completed in one sitting. Dependencies are explicit.

**Rule:** Do not proceed to next section until current section is 100% complete and tested.

---

## Phase 0: Project Setup

**Duration:** 4 hours
**Dependencies:** None
**Goal:** Working Next.js application, deployable to Vercel

### 0.1 Initialize Project (30 minutes)

```bash
# Create Next.js app at the repo root
npx create-next-app@latest sparkpack --typescript --tailwind --app --no-src-dir

cd sparkpack

# Install core dependencies
npm install zustand immer zod
npm install @anthropic-ai/sdk openai @google/generative-ai
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install shadcn/ui
npx shadcn-ui@latest init

# Install shadcn components we'll need
npx shadcn-ui@latest add button card dialog input label select textarea

# Install dev dependencies
npm install -D @types/node
```

**Verify:**
- [ ] `npm run dev` starts successfully
- [ ] http://localhost:3000 loads
- [ ] TypeScript compiles with no errors

### 0.2 Environment Configuration (15 minutes)

Create `.env.local`:

```bash
# AI Provider Configuration
AI_PROVIDER=anthropic
AI_API_KEY=your-key-here
AI_MODEL=claude-sonnet-4-20250514

# Application Settings
NEXT_PUBLIC_APP_NAME="Classroom Games"
NEXT_PUBLIC_MAX_GAMES_PER_DAY=10
```

Create `.env.example`:

```bash
# Copy this to .env.local and fill in your values
AI_PROVIDER=anthropic
AI_API_KEY=
AI_MODEL=claude-sonnet-4-20250514
NEXT_PUBLIC_APP_NAME="Classroom Games"
NEXT_PUBLIC_MAX_GAMES_PER_DAY=10
```

Update `.gitignore`:

```
.env.local
.env*.local
```

**Verify:**
- [ ] `.env.local` exists and has valid API key
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` is committed to git

### 0.3 Project Structure (30 minutes)

Create directory structure:

```bash
mkdir -p lib/ai/providers
mkdir -p lib/templates
mkdir -p lib/schemas
mkdir -p lib/store
mkdir -p lib/utils
mkdir -p components/shared
mkdir -p components/templates/strategy-board-quiz
mkdir -p app/generate
mkdir -p app/game/[id]
mkdir -p app/api/generate-game
```

Create `lib/utils/cn.ts`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Verify:**
- [ ] All directories exist
- [ ] `cn` utility exports correctly

### 0.4 Tailwind Configuration (45 minutes)

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Team colors for games
        team: {
          red: "#DC2626",
          blue: "#2563EB",
          green: "#16A34A",
          yellow: "#CA8A04",
          purple: "#9333EA",
        },
        // Neutral colors
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Readable from 20+ feet
        "display-xl": ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", fontWeight: "600" }],
        "display-sm": ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Ensure readability from distance */
@layer components {
  .classroom-display {
    @apply min-h-screen bg-neutral-50 p-8;
  }
  
  .game-container {
    @apply max-w-7xl mx-auto;
  }
  
  .team-color-red {
    @apply bg-team-red text-white;
  }
  
  .team-color-blue {
    @apply bg-team-blue text-white;
  }
  
  .team-color-green {
    @apply bg-team-green text-white;
  }
  
  .team-color-yellow {
    @apply bg-team-yellow text-white;
  }
  
  .team-color-purple {
    @apply bg-team-purple text-white;
  }
}
```

**Verify:**
- [ ] Tailwind classes work in components
- [ ] Team colors display correctly
- [ ] Typography scales are readable

### 0.5 Vercel Deployment Setup (30 minutes)

Install Vercel CLI:

```bash
npm i -g vercel
```

Initialize Vercel project:

```bash
vercel
```

Add environment variables to Vercel:

```bash
vercel env add AI_PROVIDER
vercel env add AI_API_KEY
vercel env add AI_MODEL
```

**Verify:**
- [ ] `vercel dev` runs locally
- [ ] `vercel deploy` creates preview deployment
- [ ] Preview deployment loads successfully

### 0.6 Git Setup (30 minutes)

Initialize repository:

```bash
git init
git add .
git commit -m "Initial project setup"
```

Create GitHub repository and push:

```bash
git remote add origin [your-repo-url]
git branch -M main
git push -u origin main
```

**Verify:**
- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] `.env.local` not in repository

---

## Phase 1: AI Provider Abstraction

**Duration:** 4-6 hours
**Dependencies:** Phase 0 complete
**Goal:** Working AI provider abstraction with at least one provider implemented

### 1.1 Provider Interface (1 hour)

Create `lib/ai/provider-interface.ts`:

```typescript
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
```

**Verify:**
- [ ] Types export correctly
- [ ] No compilation errors

### 1.2 Anthropic Provider (2 hours)

Create `lib/ai/providers/anthropic.ts`:

[Use implementation from 04-ai-provider-abstraction.md]

**Verify:**
- [ ] Class implements AIProvider interface
- [ ] Compiles without errors
- [ ] Can instantiate with API key

### 1.3 Provider Factory (1 hour)

Create `lib/ai/provider-factory.ts`:

```typescript
import { AIProvider } from './provider-interface'
import { AnthropicProvider } from './providers/anthropic'

export type ProviderType = 'anthropic' | 'openai' | 'google'

export function createProvider(
  type: ProviderType,
  apiKey: string
): AIProvider {
  switch (type) {
    case 'anthropic':
      return new AnthropicProvider(apiKey)
    default:
      throw new Error(`Provider ${type} not implemented yet`)
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

**Verify:**
- [ ] Factory creates provider correctly
- [ ] Reads from environment variables
- [ ] Throws error if API key missing

### 1.4 Generation Service (1-2 hours)

Create `lib/ai/generate.ts`:

```typescript
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
  
  const model = process.env.AI_MODEL || 'claude-sonnet-4-20250514'
  
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
      
      console.log('[AI] Generation successful', {
        attempt,
        provider: result.provider,
        model: result.model,
        tokens: result.tokensUsed.total,
        cost: result.estimatedCost,
        latency: result.metadata.latency
      })
      
      return result
      
    } catch (error) {
      lastError = error as Error
      
      console.error('[AI] Generation failed', {
        attempt,
        error: error instanceof ProviderError ? error.message : 'Unknown error',
        retryable: error instanceof ProviderError ? error.retryable : false
      })
      
      if (error instanceof ProviderError && !error.retryable) {
        throw error
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }
    }
  }

  throw new Error(
    `Failed to generate content after ${maxRetries} attempts: ${lastError?.message}`
  )
}
```

**Verify:**
- [ ] Can call generateWithRetry
- [ ] Logs appear in console
- [ ] Retry logic works

### 1.5 Test AI Generation (1 hour)

Create `lib/ai/__tests__/generation.test.ts`:

```typescript
import { generateWithRetry } from '../generate'

describe('AI Generation', () => {
  test('generates content successfully', async () => {
    const result = await generateWithRetry({
      templateId: 'test',
      prompt: 'Generate a simple math question for grade 5.',
      maxTokens: 500
    })
    
    expect(result.content).toBeTruthy()
    expect(result.tokensUsed.total).toBeGreaterThan(0)
    expect(result.estimatedCost).toBeGreaterThan(0)
    expect(result.provider).toBe('anthropic')
  }, 30000)
})
```

Run test:

```bash
npm test
```

**Verify:**
- [ ] Test passes
- [ ] Content is generated
- [ ] Cost is calculated
- [ ] Logs show provider info

**Phase 1 Complete When:**
- [ ] AI provider abstraction layer works
- [ ] At least Anthropic provider implemented
- [ ] Generation service works with retry
- [ ] Test passes successfully

---

## Phase 2: Template Schema & Validation

**Duration:** 3-4 hours
**Dependencies:** Phase 1 complete
**Goal:** Strategy Board Quiz schema defined and validated

### 2.1 Strategy Board Quiz Schema (2 hours)

Create `lib/schemas/strategy-board-quiz-schema.ts`:

```typescript
import { z } from 'zod'

export const StrategyBoardQuizContentSchema = z.object({
  title: z.string()
    .min(5, 'Title too short')
    .max(60, 'Title too long'),
  
  learningFocus: z.string()
    .min(10, 'Learning focus too short')
    .max(200, 'Learning focus too long'),
  
  topics: z.array(z.string())
    .min(3, 'Need at least 3 topics')
    .max(6, 'Too many topics'),
  
  board: z.object({
    rows: z.number().int().min(3).max(5),
    cols: z.number().int().min(3).max(5),
    pointsPerRow: z.array(z.number().int().positive()),
    cells: z.array(z.object({
      topic: z.string(),
      points: z.number().int().positive(),
      prompt: z.string().min(10).max(200),
      acceptableAnswers: z.array(z.string()).min(1)
    }))
  }).refine(
    data => data.cells.length === data.rows * data.cols,
    {
      message: 'cells.length must equal rows × cols',
      path: ['cells']
    }
  ).refine(
    data => data.pointsPerRow.length === data.rows,
    {
      message: 'pointsPerRow.length must equal rows',
      path: ['pointsPerRow']
    }
  ),
  
  teacherScript: z.array(z.string()).min(3).max(6),
  
  studentInstructions: z.array(z.string()).min(3).max(6),
  
  fastFinisherExtension: z.string().min(20).max(300)
})

export type StrategyBoardQuizContent = z.infer<typeof StrategyBoardQuizContentSchema>
```

**Verify:**
- [ ] Schema compiles
- [ ] Type exports correctly
- [ ] Refinements work

### 2.2 Content Validation Utility (1 hour)

Create `lib/ai/validation.ts`:

```typescript
import { z } from 'zod'

export interface ValidationResult {
  success: boolean
  data?: any
  errors?: Array<{
    path: string[]
    message: string
  }>
}

export function parseAndValidateContent<T>(
  content: string,
  schema: z.ZodSchema<T>
): T {
  // Remove markdown code blocks if present
  const cleaned = content
    .replace(/```json\n/g, '')
    .replace(/```\n/g, '')
    .replace(/```/g, '')
    .trim()
  
  // Parse JSON
  let parsed: any
  try {
    parsed = JSON.parse(cleaned)
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error.message}`)
  }
  
  // Validate against schema
  const result = schema.safeParse(parsed)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
    
    throw new Error(
      `Validation failed:\n${errors.map(e => `  - ${e.path}: ${e.message}`).join('\n')}`
    )
  }
  
  return result.data
}

export function validateContent<T>(
  data: any,
  schema: z.ZodSchema<T>
): ValidationResult {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(err => ({
        path: err.path.map(String),
        message: err.message
      }))
    }
  }
  
  return {
    success: true,
    data: result.data
  }
}
```

**Verify:**
- [ ] Parses JSON correctly
- [ ] Removes markdown code blocks
- [ ] Validates against schema
- [ ] Returns helpful error messages

### 2.3 Test Schema Validation (1 hour)

Create `lib/schemas/__tests__/strategy-board-quiz.test.ts`:

```typescript
import { StrategyBoardQuizContentSchema } from '../strategy-board-quiz-schema'
import { parseAndValidateContent } from '../../ai/validation'

describe('Strategy Board Quiz Schema', () => {
  const validContent = {
    title: 'Food Groups Challenge',
    learningFocus: 'Understanding food groups and balanced nutrition',
    topics: ['Fruits', 'Vegetables', 'Proteins', 'Grains'],
    board: {
      rows: 3,
      cols: 3,
      pointsPerRow: [100, 200, 300],
      cells: Array(9).fill({
        topic: 'Fruits',
        points: 100,
        prompt: 'Name a citrus fruit',
        acceptableAnswers: ['orange', 'lemon', 'lime']
      })
    },
    teacherScript: [
      'Each team chooses one question.',
      'Discuss for twenty seconds.',
      'One person answers.'
    ],
    studentInstructions: [
      'Choose a question from the board.',
      'Discuss quietly with your team.',
      'One person gives your answer.'
    ],
    fastFinisherExtension: 'Create a balanced meal using all food groups.'
  }
  
  test('accepts valid content', () => {
    const result = StrategyBoardQuizContentSchema.safeParse(validContent)
    expect(result.success).toBe(true)
  })
  
  test('rejects invalid cell count', () => {
    const invalid = {
      ...validContent,
      board: {
        ...validContent.board,
        cells: Array(8).fill(validContent.board.cells[0]) // Wrong count
      }
    }
    const result = StrategyBoardQuizContentSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
  
  test('parses JSON string correctly', () => {
    const json = JSON.stringify(validContent)
    const parsed = parseAndValidateContent(json, StrategyBoardQuizContentSchema)
    expect(parsed).toEqual(validContent)
  })
})
```

**Verify:**
- [ ] All tests pass
- [ ] Valid content accepted
- [ ] Invalid content rejected
- [ ] JSON parsing works

**Phase 2 Complete When:**
- [ ] Schema is fully defined
- [ ] Validation utility works
- [ ] Tests pass
- [ ] Type safety verified

---

## Phase 3: Template System

**Duration:** 3-4 hours
**Dependencies:** Phase 2 complete
**Goal:** Template system with Strategy Board Quiz fully defined

### 3.1 Template Type Definitions (1 hour)

Create `lib/templates/types.ts`:

```typescript
import { z } from 'zod'
import React from 'react'

export interface GenerationParams {
  ageBand: string
  skillFocus: string
  numTeams: number
  timeMinutes: number
  contextText?: string
}

export interface GameTemplate<T = any> {
  id: string
  name: string
  description: string
  category: 'board' | 'relay' | 'discussion'
  durationOptions: number[]
  teamRange: [number, number]
  ageBands: string[]
  contentSchema: z.ZodSchema<T>
  generatePrompt: (params: GenerationParams) => string
  RuntimeComponent: React.ComponentType<any>
}
```

**Verify:**
- [ ] Types export correctly
- [ ] No compilation errors

### 3.2 Strategy Board Quiz Prompt (2 hours)

Create `lib/templates/prompts/strategy-board-quiz-prompt.ts`:

```typescript
import { GenerationParams } from '../types'

export function generateStrategyBoardQuizPrompt(params: GenerationParams): string {
  const { ageBand, skillFocus, timeMinutes, numTeams, contextText } = params
  
  // Calculate board size based on time
  const boardConfig = timeMinutes === 8 
    ? { rows: 3, cols: 3 }
    : timeMinutes === 10 
    ? { rows: 4, cols: 4 }
    : { rows: 4, cols: 5 }
  
  return `You are generating content for a classroom game called "Strategy Board Quiz".

GAME MECHANICS (FIXED - DO NOT MODIFY):
- ${numTeams} teams take turns selecting questions from a ${boardConfig.rows}×${boardConfig.cols} grid
- Questions are organized by topic (columns) and difficulty/points (rows)
- Higher point questions are harder
- Teams get 20 seconds to discuss before answering
- Wrong answers trigger a steal phase: other teams have 5 seconds to steal (no discussion)
- First correct steal wins the points
- Game ends when all questions are answered

YOUR JOB:
Generate questions that match the grid structure.

CONSTRAINTS:
- Age band: ${ageBand}
- Skill focus: ${skillFocus}
- Total game time: ${timeMinutes} minutes
- ${numTeams} teams competing

${contextText ? `CONTENT CONTEXT:
${contextText}

Base ALL questions on this content. Questions must be answerable using only this information.
` : 'Generate age-appropriate educational content for the specified age band.'}

DIFFICULTY PROGRESSION (CRITICAL):
Row 1 (100 points): Simple recall or basic identification
  - One-word or short phrase answers
  - Example: "Name a type of..." or "What color is..."

Row 2 (200 points): Explanation or examples required
  - Requires understanding, not just memorization
  - Example: "Give an example of..." or "Explain why..."

Row 3 (300 points): Reasoning, comparison, or application
  - Requires thinking and connecting ideas
  - Example: "How would you..." or "What's the difference between..."

${boardConfig.rows > 3 ? `Row 4 (400 points): Justification, inference, or complex analysis
  - Requires deep understanding and reasoning
  - Example: "Why do you think..." or "What would happen if..."
` : ''}

QUESTION REQUIREMENTS:
1. Questions must be answerable ORALLY in under 10 seconds
2. No reading, writing, or materials required
3. acceptableAnswers must include ALL reasonable variations
4. Questions must be clearly within ONE topic column
5. Each cell must match its point value and topic

OUTPUT FORMAT:
Return ONLY a JSON object with this EXACT structure:

{
  "title": "Short, engaging game title (5-15 words)",
  "learningFocus": "One sentence learning goal",
  "topics": ["topic1", "topic2", "topic3", "topic4"],
  "board": {
    "rows": ${boardConfig.rows},
    "cols": ${boardConfig.cols},
    "pointsPerRow": [${boardConfig.rows === 3 ? '100, 200, 300' : '100, 200, 300, 400'}],
    "cells": [
      // ${boardConfig.rows * boardConfig.cols} cells total
      {
        "topic": "matches one of the topics above",
        "points": "matches one of the pointsPerRow values",
        "prompt": "Clear question answerable orally",
        "acceptableAnswers": ["answer1", "answer2", "..."]
      }
      // ... more cells
    ]
  },
  "teacherScript": [
    "Brief instruction 1",
    "Brief instruction 2",
    "Brief instruction 3"
  ],
  "studentInstructions": [
    "Brief instruction 1",
    "Brief instruction 2",
    "Brief instruction 3"
  ],
  "fastFinisherExtension": "Challenge extension if board ends early (20-50 words)"
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. cells.length MUST equal ${boardConfig.rows * boardConfig.cols}
3. Each cell must match a topic from the topics array
4. Each cell must match a points value from pointsPerRow
5. Higher point rows MUST be noticeably harder
6. acceptableAnswers must include common variations
7. Questions must be appropriate for ${ageBand}
8. All content must be suitable for a classroom setting`
}
```

**Verify:**
- [ ] Prompt is clear and specific
- [ ] Board size calculation works
- [ ] Context text is handled correctly
- [ ] Difficulty progression is explained

### 3.3 Strategy Board Quiz Template (1 hour)

Create `lib/templates/strategy-board-quiz.ts`:

```typescript
import { GameTemplate } from './types'
import { StrategyBoardQuizContentSchema } from '../schemas/strategy-board-quiz-schema'
import { generateStrategyBoardQuizPrompt } from './prompts/strategy-board-quiz-prompt'
import StrategyBoardQuizGame from '@/components/templates/strategy-board-quiz/StrategyBoardQuizGame'

const strategyBoardQuiz: GameTemplate = {
  id: 'strategy_board_quiz',
  name: 'Strategy Board Quiz',
  description: 'Jeopardy-style quiz where teams choose challenges and can steal points',
  category: 'board',
  durationOptions: [8, 10, 15],
  teamRange: [3, 5],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  contentSchema: StrategyBoardQuizContentSchema,
  generatePrompt: generateStrategyBoardQuizPrompt,
  RuntimeComponent: StrategyBoardQuizGame
}

export default strategyBoardQuiz
```

**Verify:**
- [ ] Template exports correctly
- [ ] All fields are defined
- [ ] Types match interface

### 3.4 Template Registry (30 minutes)

Create `lib/templates/registry.ts`:

```typescript
import { GameTemplate } from './types'
import strategyBoardQuiz from './strategy-board-quiz'

export const templateRegistry: Record<string, GameTemplate> = {
  strategy_board_quiz: strategyBoardQuiz
}

export type TemplateId = keyof typeof templateRegistry

export function getTemplate(id: string): GameTemplate {
  const template = templateRegistry[id]
  if (!template) {
    throw new Error(`Template not found: ${id}`)
  }
  return template
}

export function getAllTemplates(): GameTemplate[] {
  return Object.values(templateRegistry)
}
```

**Verify:**
- [ ] Registry exports correctly
- [ ] getTemplate works
- [ ] getAllTemplates works
- [ ] Error handling works

**Phase 3 Complete When:**
- [ ] Template types defined
- [ ] Strategy Board Quiz template complete
- [ ] Prompt generates valid structure
- [ ] Registry works correctly

---

## Phase 4: State Management

**Duration:** 4-5 hours
**Dependencies:** Phase 3 complete
**Goal:** Zustand store managing all game state

### 4.1 Type Definitions (1 hour)

Create `lib/store/types.ts`:

```typescript
export type TeamColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple'

export interface Team {
  id: string
  name: string
  color: TeamColor
  score: number
}

export type GamePhase = 
  | 'setup'
  | 'team_selecting'
  | 'question_shown'
  | 'discussion'
  | 'answer_waiting'
  | 'steal_attempt'
  | 'game_complete'

export interface Timer {
  duration: number
  remaining: number
  isRunning: boolean
  type: 'discussion' | 'steal'
}

export interface BoardCell {
  id: string
  topic: string
  points: number
  prompt: string
  acceptableAnswers: string[]
  status: 'available' | 'active' | 'completed'
}
```

**Verify:**
- [ ] Types export correctly
- [ ] No compilation errors

### 4.2 Zustand Store (3-4 hours)

Create `lib/store/game-store.ts`:

```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Team, GamePhase, Timer, BoardCell, TeamColor } from './types'

interface GameStore {
  // Game metadata
  gameId: string | null
  templateId: string | null
  
  // Teams
  teams: Team[]
  activeTeamIndex: number
  
  // Board state
  board: {
    rows: number
    cols: number
    pointsPerRow: number[]
    cells: BoardCell[]
  } | null
  
  // Game phase
  phase: GamePhase
  
  // Active cell
  activeCell: BoardCell | null
  
  // Timer
  timer: Timer | null
  
  // History
  lastAnswer: {
    teamId: string
    correct: boolean
  } | null
  
  // Actions
  initializeGame: (params: {
    gameId: string
    templateId: string
    numTeams: number
    content: any
  }) => void
  
  startGame: () => void
  
  selectCell: (cellId: string) => void
  
  startDiscussionTimer: () => void
  
  tickTimer: () => void
  
  markAnswer: (correct: boolean) => void
  
  attemptSteal: (teamIndex: number) => void
  
  markSteal: (correct: boolean) => void
  
  skipSteal: () => void
  
  nextTurn: () => void
  
  resetGame: () => void
}

const teamColors: TeamColor[] = ['red', 'blue', 'green', 'yellow', 'purple']

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    gameId: null,
    templateId: null,
    teams: [],
    activeTeamIndex: 0,
    board: null,
    phase: 'setup',
    activeCell: null,
    timer: null,
    lastAnswer: null,
    
    // Actions
    initializeGame: (params) => {
      set(state => {
        state.gameId = params.gameId
        state.templateId = params.templateId
        
        // Initialize teams
        state.teams = Array.from({ length: params.numTeams }, (_, i) => ({
          id: `team_${i}`,
          name: `Team ${i + 1}`,
          color: teamColors[i],
          score: 0
        }))
        
        // Initialize board
        state.board = {
          rows: params.content.board.rows,
          cols: params.content.board.cols,
          pointsPerRow: params.content.board.pointsPerRow,
          cells: params.content.board.cells.map((cell: any, index: number) => ({
            id: `cell_${index}`,
            ...cell,
            status: 'available'
          }))
        }
        
        state.phase = 'setup'
        state.activeTeamIndex = 0
      })
    },
    
    startGame: () => {
      set(state => {
        state.phase = 'team_selecting'
      })
    },
    
    selectCell: (cellId) => {
      set(state => {
        if (state.phase !== 'team_selecting') return
        if (!state.board) return
        
        const cell = state.board.cells.find(c => c.id === cellId)
        if (!cell || cell.status !== 'available') return
        
        cell.status = 'active'
        state.activeCell = cell
        state.phase = 'question_shown'
      })
    },
    
    startDiscussionTimer: () => {
      set(state => {
        if (state.phase !== 'question_shown') return
        
        state.timer = {
          duration: 20,
          remaining: 20,
          isRunning: true,
          type: 'discussion'
        }
        state.phase = 'discussion'
      })
    },
    
    tickTimer: () => {
      set(state => {
        if (!state.timer || !state.timer.isRunning) return
        
        state.timer.remaining -= 1
        
        if (state.timer.remaining <= 0) {
          state.timer.isRunning = false
          state.phase = 'answer_waiting'
        }
      })
    },
    
    markAnswer: (correct) => {
      set(state => {
        if (state.phase !== 'answer_waiting') return
        if (!state.activeCell) return
        
        const currentTeam = state.teams[state.activeTeamIndex]
        
        state.lastAnswer = {
          teamId: currentTeam.id,
          correct
        }
        
        if (correct) {
          // Award points
          currentTeam.score += state.activeCell.points
          state.activeCell.status = 'completed'
          
          // Move to next turn
          state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
          state.activeCell = null
          state.timer = null
          
          // Check if game is complete
          const allCompleted = state.board?.cells.every(c => c.status === 'completed')
          state.phase = allCompleted ? 'game_complete' : 'team_selecting'
        } else {
          // Wrong answer - start steal phase
          state.timer = {
            duration: 5,
            remaining: 5,
            isRunning: true,
            type: 'steal'
          }
          state.phase = 'steal_attempt'
        }
      })
    },
    
    attemptSteal: (teamIndex) => {
      set(state => {
        if (state.phase !== 'steal_attempt') return
        
        state.timer = null
        state.activeTeamIndex = teamIndex
        state.phase = 'answer_waiting'
      })
    },
    
    markSteal: (correct) => {
      set(state => {
        if (state.phase !== 'answer_waiting') return
        if (!state.activeCell) return
        
        const currentTeam = state.teams[state.activeTeamIndex]
        
        if (correct) {
          currentTeam.score += state.activeCell.points
          state.activeCell.status = 'completed'
        }
        
        // Move to next turn (back to original order)
        state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
        state.activeCell = null
        state.timer = null
        
        const allCompleted = state.board?.cells.every(c => c.status === 'completed')
        state.phase = allCompleted ? 'game_complete' : 'team_selecting'
      })
    },
    
    skipSteal: () => {
      set(state => {
        if (state.phase !== 'steal_attempt') return
        if (!state.activeCell) return
        
        state.activeCell.status = 'completed'
        state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
        state.activeCell = null
        state.timer = null
        
        const allCompleted = state.board?.cells.every(c => c.status === 'completed')
        state.phase = allCompleted ? 'game_complete' : 'team_selecting'
      })
    },
    
    nextTurn: () => {
      set(state => {
        state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
        state.phase = 'team_selecting'
      })
    },
    
    resetGame: () => {
      set(state => {
        state.gameId = null
        state.templateId = null
        state.teams = []
        state.activeTeamIndex = 0
        state.board = null
        state.phase = 'setup'
        state.activeCell = null
        state.timer = null
        state.lastAnswer = null
      })
    }
  }))
)
```

**Verify:**
- [ ] Store compiles without errors
- [ ] Actions update state correctly
- [ ] Immer middleware works
- [ ] State transitions are logical

**Phase 4 Complete When:**
- [ ] Store is fully implemented
- [ ] All actions work correctly
- [ ] Type safety is enforced
- [ ] State machine logic is correct

---

## Phase 5: Storage & Rate Limiting

**Duration:** 2-3 hours
**Dependencies:** Phase 4 complete
**Goal:** localStorage persistence and rate limiting

### 5.1 Storage Utility (1 hour)

Create `lib/utils/storage.ts`:

```typescript
export interface StoredGame {
  gameId: string
  templateId: string
  content: any
  createdAt: string
}

const STORAGE_KEY = 'classroom_games'

export function saveGame(game: StoredGame): void {
  try {
    const games = getAllGames()
    games[game.gameId] = game
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch (error) {
    console.error('Failed to save game:', error)
  }
}

export function getGame(gameId: string): StoredGame | null {
  try {
    const games = getAllGames()
    return games[gameId] || null
  } catch (error) {
    console.error('Failed to get game:', error)
    return null
  }
}

export function getAllGames(): Record<string, StoredGame> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to get all games:', error)
    return {}
  }
}

export function deleteGame(gameId: string): void {
  try {
    const games = getAllGames()
    delete games[gameId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch (error) {
    console.error('Failed to delete game:', error)
  }
}

export function clearAllGames(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear games:', error)
  }
}
```

**Verify:**
- [ ] Functions work in browser
- [ ] localStorage is used correctly
- [ ] Error handling works
- [ ] JSON serialization works

### 5.2 Rate Limiting Utility (1-2 hours)

Create `lib/utils/rate-limiting.ts`:

```typescript
const RATE_LIMIT_KEY = 'game_generation_rate_limit'
const MAX_GAMES_PER_DAY = parseInt(process.env.NEXT_PUBLIC_MAX_GAMES_PER_DAY || '10')

interface RateLimitData {
  date: string
  count: number
}

export function checkRateLimit(): {
  allowed: boolean
  remaining: number
  limit: number
} {
  try {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    
    let data: RateLimitData = stored 
      ? JSON.parse(stored)
      : { date: today, count: 0 }
    
    // Reset if new day
    if (data.date !== today) {
      data = { date: today, count: 0 }
    }
    
    const remaining = MAX_GAMES_PER_DAY - data.count
    
    return {
      allowed: remaining > 0,
      remaining,
      limit: MAX_GAMES_PER_DAY
    }
  } catch (error) {
    console.error('Failed to check rate limit:', error)
    return { allowed: true, remaining: MAX_GAMES_PER_DAY, limit: MAX_GAMES_PER_DAY }
  }
}

export function incrementRateLimit(): void {
  try {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    
    let data: RateLimitData = stored 
      ? JSON.parse(stored)
      : { date: today, count: 0 }
    
    if (data.date !== today) {
      data = { date: today, count: 0 }
    }
    
    data.count += 1
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to increment rate limit:', error)
  }
}

export function getRateLimitInfo(): {
  count: number
  limit: number
  remaining: number
  resetsAt: Date
} {
  try {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    
    let data: RateLimitData = stored 
      ? JSON.parse(stored)
      : { date: today, count: 0 }
    
    if (data.date !== today) {
      data = { date: today, count: 0 }
    }
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    return {
      count: data.count,
      limit: MAX_GAMES_PER_DAY,
      remaining: MAX_GAMES_PER_DAY - data.count,
      resetsAt: tomorrow
    }
  } catch (error) {
    console.error('Failed to get rate limit info:', error)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return {
      count: 0,
      limit: MAX_GAMES_PER_DAY,
      remaining: MAX_GAMES_PER_DAY,
      resetsAt: tomorrow
    }
  }
}
```

**Verify:**
- [ ] Rate limiting works correctly
- [ ] Counter resets daily
- [ ] localStorage is used correctly
- [ ] Edge cases handled

**Phase 5 Complete When:**
- [ ] Storage utility works
- [ ] Rate limiting enforced
- [ ] Both tested in browser
- [ ] Error handling robust

---

## Phase 6: Generation API Route

**Duration:** 2-3 hours
**Dependencies:** Phases 1-5 complete
**Goal:** API endpoint that generates and validates game content

### 6.1 Request Validation (1 hour)

Create `app/api/generate-game/validation.ts`:

```typescript
import { z } from 'zod'

export const GenerateGameRequestSchema = z.object({
  templateId: z.string().min(1),
  ageBand: z.enum(['P3-4', 'P5-6', 'P7-S2']),
  skillFocus: z.enum(['speaking', 'reading', 'vocab', 'reasoning', 'teamwork']),
  numTeams: z.number().int().min(3).max(5),
  timeMinutes: z.number().int().refine(val => [5, 8, 10, 15].includes(val)),
  contextText: z.string().max(2000).optional()
})

export type GenerateGameRequest = z.infer<typeof GenerateGameRequestSchema>
```

**Verify:**
- [ ] Schema validates correctly
- [ ] Type exports correctly

### 6.2 API Route Implementation (1-2 hours)

Create `app/api/generate-game/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateWithRetry } from '@/lib/ai/generate'
import { getTemplate } from '@/lib/templates/registry'
import { parseAndValidateContent } from '@/lib/ai/validation'
import { GenerateGameRequestSchema } from './validation'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json()
    const validation = GenerateGameRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    const params = validation.data
    
    // Get template
    const template = getTemplate(params.templateId)
    
    // Generate prompt
    const prompt = template.generatePrompt({
      ageBand: params.ageBand,
      skillFocus: params.skillFocus,
      numTeams: params.numTeams,
      timeMinutes: params.timeMinutes,
      contextText: params.contextText
    })
    
    // Generate content with retry
    const result = await generateWithRetry({
      templateId: params.templateId,
      prompt,
      maxTokens: 4000,
      temperature: 1
    })
    
    // Parse and validate content
    const content = parseAndValidateContent(
      result.content,
      template.contentSchema
    )
    
    // Generate game ID
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Return success
    return NextResponse.json({
      success: true,
      gameId,
      templateId: params.templateId,
      content,
      metadata: {
        provider: result.provider,
        model: result.model,
        tokensUsed: result.tokensUsed,
        estimatedCost: result.estimatedCost,
        latency: result.metadata.latency,
        generatedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[API] Generation error:', error)
    
    return NextResponse.json(
      {
        error: 'Generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

**Verify:**
- [ ] API route works
- [ ] Request validation works
- [ ] Content generation works
- [ ] Error handling works
- [ ] Response format is correct

**Phase 6 Complete When:**
- [ ] API endpoint works end-to-end
- [ ] Validation catches invalid requests
- [ ] Content is generated and validated
- [ ] Errors are handled gracefully

---

## Phase 7: Shared Components

**Duration:** 4-5 hours
**Dependencies:** Phase 4 complete
**Goal:** Reusable UI components for all templates

### 7.1 Team Score Card (1 hour)

Create `components/shared/TeamScoreCard.tsx`:

```typescript
'use client'

import { Team } from '@/lib/store/types'
import { cn } from '@/lib/utils/cn'

interface Props {
  team: Team
  isActive: boolean
  className?: string
}

export function TeamScoreCard({ team, isActive, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-300',
        `team-color-${team.color}`,
        isActive && 'ring-4 ring-white shadow-2xl scale-105',
        className
      )}
    >
      <div className="text-display-sm font-bold mb-2">
        {team.name}
      </div>
      <div className="text-display-lg font-black">
        {team.score}
      </div>
      <div className="text-sm opacity-90 mt-1">
        points
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Component renders
- [ ] Team colors work
- [ ] Active state shows correctly
- [ ] Animations work

### 7.2 Timer Display (1 hour)

Create `components/shared/TimerDisplay.tsx`:

```typescript
'use client'

import { Timer } from '@/lib/store/types'
import { cn } from '@/lib/utils/cn'
import { Clock } from 'lucide-react'

interface Props {
  timer: Timer
  className?: string
}

export function TimerDisplay({ timer, className }: Props) {
  const isLowTime = timer.remaining <= 5
  const percentage = (timer.remaining / timer.duration) * 100
  
  return (
    <div className={cn('text-center', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-4 px-8 py-4 rounded-2xl text-white text-display-lg font-black transition-all',
          isLowTime ? 'bg-red-600 animate-pulse-slow' : 'bg-blue-600'
        )}
      >
        <Clock className="w-12 h-12" />
        <span>{timer.remaining}s</span>
      </div>
      
      <div className="mt-4 text-xl font-semibold text-neutral-600">
        {timer.type === 'discussion' ? 'Discussion Time' : 'Steal Opportunity'}
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full max-w-md mx-auto h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000',
            isLowTime ? 'bg-red-600' : 'bg-blue-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Timer displays correctly
- [ ] Color changes when low
- [ ] Progress bar animates
- [ ] Labels are correct

### 7.3 Score Board (1 hour)

Create `components/shared/ScoreBoard.tsx`:

```typescript
'use client'

import { Team } from '@/lib/store/types'
import { TeamScoreCard } from './TeamScoreCard'

interface Props {
  teams: Team[]
  activeTeamIndex: number
}

export function ScoreBoard({ teams, activeTeamIndex }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {teams.map((team, index) => (
        <TeamScoreCard
          key={team.id}
          team={team}
          isActive={index === activeTeamIndex}
        />
      ))}
    </div>
  )
}
```

**Verify:**
- [ ] Grid layout works
- [ ] Teams display correctly
- [ ] Active team highlighted
- [ ] Responsive on different screens

### 7.4 Teacher Controls (1-2 hours)

Create `components/shared/TeacherControls.tsx`:

```typescript
'use client'

import { GamePhase } from '@/lib/store/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, X, SkipForward } from 'lucide-react'

interface Props {
  phase: GamePhase
  onStartDiscussion?: () => void
  onMarkCorrect?: () => void
  onMarkIncorrect?: () => void
  onSkipSteal?: () => void
  onNextTurn?: () => void
}

export function TeacherControls({
  phase,
  onStartDiscussion,
  onMarkCorrect,
  onMarkIncorrect,
  onSkipSteal,
  onNextTurn
}: Props) {
  return (
    <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-white shadow-2xl border-2 border-neutral-300 z-50">
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold text-neutral-600 px-4">
          {getPhaseLabel(phase)}
        </div>
        
        <div className="h-8 w-px bg-neutral-300" />
        
        <div className="flex items-center gap-3">
          {phase === 'question_shown' && onStartDiscussion && (
            <Button size="lg" onClick={onStartDiscussion}>
              Start Discussion (20s)
            </Button>
          )}
          
          {phase === 'answer_waiting' && (
            <>
              <Button
                size="lg"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={onMarkCorrect}
              >
                <Check className="w-5 h-5 mr-2" />
                Correct
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={onMarkIncorrect}
              >
                <X className="w-5 h-5 mr-2" />
                Incorrect
              </Button>
            </>
          )}
          
          {phase === 'steal_attempt' && (
            <>
              <Button
                size="lg"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={onMarkCorrect}
              >
                <Check className="w-5 h-5 mr-2" />
                Correct
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={onMarkIncorrect}
              >
                <X className="w-5 h-5 mr-2" />
                Incorrect
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onSkipSteal}
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

function getPhaseLabel(phase: GamePhase): string {
  const labels: Record<GamePhase, string> = {
    setup: 'Setting up...',
    team_selecting: 'Team is selecting...',
    question_shown: 'Question revealed',
    discussion: 'Discussion in progress',
    answer_waiting: 'Waiting for answer',
    steal_attempt: 'Steal phase active',
    game_complete: 'Game complete'
  }
  return labels[phase]
}
```

**Verify:**
- [ ] Controls render correctly
- [ ] Phase-specific actions show
- [ ] Buttons work correctly
- [ ] Fixed positioning works

**Phase 7 Complete When:**
- [ ] All shared components work
- [ ] Components are reusable
- [ ] Styling is consistent
- [ ] Accessibility is good

---

[Due to length, I'll create a separate document for remaining phases]

**Phases 8-11 to follow in next implementation document...**

