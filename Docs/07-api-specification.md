# API Specification

## Overview

The platform has one primary API endpoint for content generation, plus helper endpoints for template information.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

**v1:** No authentication required (serverless function with API key in environment)

API key for Anthropic stored in `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Endpoints

### 1. GET /api/templates

Get list of available game templates.

**Request:**
```
GET /api/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "strategy_board_quiz",
      "name": "Strategy Board Quiz",
      "description": "Jeopardy-style quiz where teams choose challenges",
      "category": "board",
      "durationOptions": [8, 10, 15],
      "teamRange": [3, 5],
      "ageBands": ["P3-4", "P5-6", "P7-S2"]
    },
    {
      "id": "timed_relay",
      "name": "Timed Relay",
      "description": "Fast-paced team relay with rapid-fire questions",
      "category": "relay",
      "durationOptions": [5, 8, 10],
      "teamRange": [3, 5],
      "ageBands": ["P3-4", "P5-6", "P7-S2"]
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Internal server error",
  "message": "Failed to load templates"
}
```

---

### 2. GET /api/templates/[id]

Get detailed information about a specific template.

**Request:**
```
GET /api/templates/strategy_board_quiz
```

**Response:**
```json
{
  "id": "strategy_board_quiz",
  "name": "Strategy Board Quiz",
  "description": "Jeopardy-style quiz where teams choose challenges",
  "category": "board",
  "durationOptions": [8, 10, 15],
  "teamRange": [3, 5],
  "ageBands": ["P3-4", "P5-6", "P7-S2"],
  "mechanics": {
    "explanation": "Teams take turns selecting questions from a grid. Higher point questions are harder. Wrong answers can be stolen by other teams.",
    "roundStructure": "Turn-based with discussion and steal phases",
    "winCondition": "Highest score when board is complete"
  },
  "requiredInputs": [
    "ageBand",
    "skillFocus",
    "numTeams",
    "timeMinutes"
  ],
  "optionalInputs": [
    "contextText"
  ]
}
```

---

### 3. POST /api/generate-game

Generate game content using AI.

**Request:**
```json
{
  "templateId": "strategy_board_quiz",
  "ageBand": "P5-6",
  "skillFocus": "reasoning",
  "numTeams": 4,
  "timeMinutes": 10,
  "contextText": "Food pyramid, serving sizes, food groups: fruits, vegetables, grains, protein, dairy. Balanced diet requires foods from all groups."
}
```

**Request Schema:**
```typescript
interface GenerateGameRequest {
  templateId: string         // Required: template identifier
  ageBand: string           // Required: "P3-4" | "P5-6" | "P7-S2"
  skillFocus: string        // Required: "speaking" | "reading" | "vocab" | "reasoning" | "teamwork"
  numTeams: number          // Required: 3-5
  timeMinutes: number       // Required: 5 | 8 | 10 | 15
  contextText?: string      // Optional: 0-500 words of context
}
```

**Response (Success):**
```json
{
  "gameId": "game_1234567890",
  "templateId": "strategy_board_quiz",
  "content": {
    "title": "Food Groups Challenge",
    "learningFocus": "Understanding food groups and balanced nutrition",
    "topics": ["Fruits", "Vegetables", "Proteins", "Grains"],
    "board": {
      "rows": 4,
      "cols": 4,
      "pointsPerRow": [100, 200, 300, 400],
      "cells": [
        {
          "topic": "Fruits",
          "points": 100,
          "prompt": "Name one fruit high in Vitamin C",
          "acceptableAnswers": ["orange", "kiwi", "strawberry", "lemon"]
        }
        // ... more cells
      ]
    },
    "teacherScript": [
      "Each team chooses one question.",
      "Discuss for twenty seconds.",
      "One person answers.",
      "Wrong answers can be stolen."
    ],
    "studentInstructions": [
      "Choose a question from the board.",
      "Discuss quietly with your team.",
      "One person gives your answer.",
      "Listen for steal chances."
    ],
    "fastFinisherExtension": "Create a balanced meal plan using foods from all groups."
  },
  "metadata": {
    "generatedAt": "2024-02-16T10:30:00Z",
    "model": "claude-sonnet-4-20250514",
    "generationTime": 2.3
  }
}
```

**Response (Validation Error):**
```json
{
  "error": "Validation failed",
  "message": "Generated content does not match template schema",
  "details": [
    "board.cells.length (12) does not equal rows × cols (16)",
    "cell at index 3 missing required field: acceptableAnswers"
  ],
  "retryAttempt": 1
}
```

**Response (Generation Error):**
```json
{
  "error": "Generation failed",
  "message": "Failed to generate valid content after 2 attempts",
  "lastError": "API timeout"
}
```

**Response (Invalid Request):**
```json
{
  "error": "Invalid request",
  "message": "Validation errors in request",
  "errors": [
    {
      "field": "numTeams",
      "message": "Must be between 3 and 5"
    },
    {
      "field": "timeMinutes",
      "message": "Must be one of: 5, 8, 10, 15"
    }
  ]
}
```

---

## Generation Process Flow

```
1. Receive Request
    ↓
2. Validate Request
   - Check template exists
   - Validate parameters
   - Check context length
    ↓
3. Load Template
   - Get content schema
   - Get generation prompt
    ↓
4. Build AI Prompt
   - Insert template mechanics
   - Add parameters
   - Include context
    ↓
5. Call Claude API
   POST https://api.anthropic.com/v1/messages
   {
     "model": "claude-sonnet-4-20250514",
     "max_tokens": 4000,
     "messages": [{
       "role": "user",
       "content": generationPrompt
     }]
   }
    ↓
6. Parse Response
   - Extract JSON from response
   - Handle markdown code blocks
    ↓
7. Validate Content
   - Schema validation (Zod)
   - Cross-field validation
    ↓
8. Success?
   Yes → Return game content
   No → Retry (max 2 attempts)
    ↓
9. Store Game State
   - Generate game ID
   - Store in memory (v1)
    ↓
10. Return Response
```

---

## Error Handling Strategy

### Retry Logic

```typescript
async function generateWithRetry(
  templateId: string,
  params: GenerationParams,
  maxRetries: number = 2
): Promise<GameContent> {
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await callClaudeAPI(templateId, params)
      const content = parseResponse(response)
      const validation = validateContent(templateId, content)
      
      if (validation.success) {
        return content
      }
      
      // Log validation errors
      console.error(`Validation failed (attempt ${attempt}):`, validation.errors)
      
      if (attempt < maxRetries) {
        // Modify prompt to emphasize failed validation
        params = enhancePromptWithErrors(params, validation.errors)
        continue
      }
      
      throw new ValidationError(validation.errors)
      
    } catch (error) {
      if (attempt < maxRetries && isRetryableError(error)) {
        await delay(1000 * attempt) // Exponential backoff
        continue
      }
      throw error
    }
  }
}
```

### Error Types

```typescript
class ValidationError extends Error {
  constructor(public errors: ValidationIssue[]) {
    super('Content validation failed')
  }
}

class GenerationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
  }
}

class TemplateNotFoundError extends Error {
  constructor(templateId: string) {
    super(`Template not found: ${templateId}`)
  }
}

class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retryable: boolean
  ) {
    super(message)
  }
}
```

### HTTP Status Codes

```
200 OK                  - Successful generation
400 Bad Request         - Invalid request parameters
404 Not Found          - Template not found
422 Unprocessable      - Validation failed after retries
429 Too Many Requests  - Rate limit (if implemented)
500 Internal Error     - Server error
503 Service Unavailable - Claude API unavailable
```

---

## Request Validation

### Input Constraints

```typescript
const GenerationRequestSchema = z.object({
  templateId: z.string().min(1),
  
  ageBand: z.enum(['P3-4', 'P5-6', 'P7-S2']),
  
  skillFocus: z.enum([
    'speaking',
    'reading',
    'vocab',
    'reasoning',
    'teamwork'
  ]),
  
  numTeams: z.number().int().min(3).max(5),
  
  timeMinutes: z.enum([5, 8, 10, 15]),
  
  contextText: z.string()
    .max(2000, 'Context text too long')
    .optional()
    .transform(val => val?.trim())
})
```

### Cross-Validation Rules

```typescript
function validateTemplateParams(
  templateId: string,
  params: GenerationParams
): ValidationResult {
  
  const template = getTemplate(templateId)
  
  const errors: string[] = []
  
  // Check template supports requested duration
  if (!template.durationOptions.includes(params.timeMinutes)) {
    errors.push(
      `Template does not support ${params.timeMinutes} minutes. ` +
      `Available: ${template.durationOptions.join(', ')}`
    )
  }
  
  // Check team count in range
  const [minTeams, maxTeams] = template.teamRange
  if (params.numTeams < minTeams || params.numTeams > maxTeams) {
    errors.push(
      `Template requires ${minTeams}-${maxTeams} teams`
    )
  }
  
  // Check age band supported
  if (!template.ageBands.includes(params.ageBand)) {
    errors.push(
      `Template does not support age band ${params.ageBand}`
    )
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## Response Caching

**v1:** No caching (each generation is unique)

**Future consideration:** Cache generated content by hash of input parameters

---

## Rate Limiting

**v1:** No rate limiting (single teacher usage)

**Future consideration:**
- Per-IP rate limit: 10 requests per minute
- Per-session rate limit: 50 requests per hour

---

## Monitoring & Logging

### Log Structure

```typescript
interface GenerationLog {
  timestamp: string
  gameId: string
  templateId: string
  params: GenerationParams
  duration: number
  success: boolean
  error?: string
  validationAttempts: number
  model: string
}
```

### Key Metrics to Track

1. **Generation success rate**
   - Target: >95%
   - Alert if <90%

2. **Generation time**
   - Target: <5 seconds
   - Alert if >10 seconds

3. **Validation failures**
   - Track which templates fail most
   - Track which fields fail most

4. **API errors**
   - Track Claude API availability
   - Track timeout frequency

---

## Claude API Integration

### API Call Structure

```typescript
async function callClaudeAPI(
  prompt: string
): Promise<ClaudeResponse> {
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 1,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  })
  
  if (!response.ok) {
    throw new APIError(
      `Claude API error: ${response.statusText}`,
      response.status,
      response.status >= 500 || response.status === 429
    )
  }
  
  return await response.json()
}
```

### Response Parsing

```typescript
function parseClaudeResponse(response: ClaudeResponse): any {
  // Extract text content
  const text = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n')
  
  // Remove markdown code blocks if present
  const cleaned = text
    .replace(/```json\n/g, '')
    .replace(/```\n/g, '')
    .replace(/```/g, '')
    .trim()
  
  try {
    return JSON.parse(cleaned)
  } catch (error) {
    throw new Error('Failed to parse JSON from Claude response')
  }
}
```

---

## Environment Variables

Required in `.env.local`:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional: Logging
LOG_LEVEL=info

# Optional: Development
ENABLE_DEBUG_LOGGING=true
SKIP_VALIDATION=false  # Never true in production
```

---

## Testing the API

### Using curl

```bash
# Get templates
curl http://localhost:3000/api/templates

# Generate game
curl -X POST http://localhost:3000/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "strategy_board_quiz",
    "ageBand": "P5-6",
    "skillFocus": "reasoning",
    "numTeams": 4,
    "timeMinutes": 10,
    "contextText": "Food pyramid: fruits, vegetables, grains, protein, dairy"
  }'
```

### Using JavaScript

```typescript
const response = await fetch('/api/generate-game', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'strategy_board_quiz',
    ageBand: 'P5-6',
    skillFocus: 'reasoning',
    numTeams: 4,
    timeMinutes: 10,
    contextText: 'Food pyramid content...'
  })
})

const data = await response.json()

if (response.ok) {
  console.log('Game generated:', data.gameId)
} else {
  console.error('Generation failed:', data.error)
}
```

---

## Security Considerations

### API Key Protection
- Never expose `ANTHROPIC_API_KEY` to client
- API calls only from server-side routes
- Environment variables in `.env.local` (not committed)

### Input Sanitization
- Validate all user inputs
- Limit context text length (2000 chars)
- Escape special characters in generated content

### Rate Limiting (Future)
- Prevent abuse
- Protect Claude API quota

### Content Moderation
- Claude's built-in safety features
- No additional filtering needed for classroom content

---

## Cost Estimation

### Claude API Pricing (as of Feb 2024)
- Claude Sonnet 4: ~$3 per million input tokens, ~$15 per million output tokens

### Per-Generation Cost
- Average prompt: ~2,000 tokens
- Average response: ~1,500 tokens
- Cost per generation: ~$0.03

### Expected Usage
- 30 generations per teacher per day
- Cost per teacher per month: ~$27

**Optimization strategies:**
- Use Sonnet (not Opus) for most templates
- Cache template prompts
- Compress prompts where possible
