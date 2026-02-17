# Template System

## Core Concept

A **template** is a complete game definition that separates **fixed mechanics** (coded) from **variable content** (AI-generated).

---

## Template Structure

Every template must define these five components:

### 1. Metadata
Basic information about the template.

```typescript
{
  id: string              // Unique identifier (e.g., "strategy_board_quiz")
  name: string            // Display name (e.g., "Strategy Board Quiz")
  description: string     // One-sentence explanation
  category: string        // "board", "relay", "discussion"
  durationOptions: number[]  // [5, 8, 10, 15] minutes
  teamRange: [number, number]  // [min, max] teams (e.g., [3, 5])
  ageBands: string[]      // ["P3-4", "P5-6", "P7-S2"]
}
```

### 2. Content Schema (Zod)
Defines what the AI must generate.

```typescript
contentSchema: z.object({
  title: z.string(),
  learningFocus: z.string(),
  topics: z.array(z.string()),
  board: z.object({
    rows: z.number(),
    cols: z.number(),
    pointsPerRow: z.array(z.number()),
    cells: z.array(z.object({
      topic: z.string(),
      points: z.number(),
      prompt: z.string(),
      acceptableAnswers: z.array(z.string())
    }))
  }),
  teacherScript: z.array(z.string()),
  studentInstructions: z.array(z.string()),
  fastFinisherExtension: z.string()
})
```

### 3. Generation Prompt
System prompt for Claude API that explains the template mechanics and content requirements.

```typescript
generatePrompt: (params: GenerationParams) => string
```

This function receives:
- `ageBand`: string
- `skillFocus`: string
- `timeMinutes`: number
- `numTeams`: number
- `contextText`: string (optional, teacher-provided)

And returns a complete system prompt.

### 4. Runtime Component
React component that renders the game.

```typescript
RuntimeComponent: React.FC<{
  content: ContentType
  gameState: GameState
  onAction: (action: GameAction) => void
}>
```

This component:
- Receives generated content
- Receives current game state
- Dispatches actions to game engine
- Renders game-specific UI

### 5. Control Interface
Defines what teacher controls are available during the game.

```typescript
controls: {
  phases: {
    [phase: string]: {
      label: string
      actions: TeacherAction[]
    }
  }
}
```

---

## Template Registry

All templates are registered in `/lib/templates/registry.ts`:

```typescript
import strategyBoardQuiz from './strategy-board-quiz'
import timedRelay from './timed-relay'
import discussionPrompts from './discussion-prompts'

export const templateRegistry = {
  strategy_board_quiz: strategyBoardQuiz,
  timed_relay: timedRelay,
  discussion_prompts: discussionPrompts
}

export type TemplateId = keyof typeof templateRegistry

export function getTemplate(id: TemplateId) {
  return templateRegistry[id]
}

export function getAllTemplates() {
  return Object.values(templateRegistry)
}
```

---

## Example Template: Strategy Board Quiz

File: `/lib/templates/strategy-board-quiz.ts`

```typescript
import { z } from 'zod'
import { GameTemplate } from './types'

const contentSchema = z.object({
  title: z.string(),
  learningFocus: z.string(),
  topics: z.array(z.string()),
  board: z.object({
    rows: z.number(),
    cols: z.number(),
    pointsPerRow: z.array(z.number()),
    cells: z.array(z.object({
      topic: z.string(),
      points: z.number(),
      prompt: z.string(),
      acceptableAnswers: z.array(z.string()).min(1)
    }))
  }),
  teacherScript: z.array(z.string()),
  studentInstructions: z.array(z.string()),
  fastFinisherExtension: z.string()
})

const strategyBoardQuiz: GameTemplate = {
  id: 'strategy_board_quiz',
  name: 'Strategy Board Quiz',
  description: 'Jeopardy-style quiz where teams choose challenges and can steal',
  category: 'board',
  durationOptions: [8, 10, 15],
  teamRange: [3, 5],
  ageBands: ['P3-4', 'P5-6', 'P7-S2'],
  
  contentSchema,
  
  generatePrompt: (params) => {
    const { ageBand, skillFocus, timeMinutes, numTeams, contextText } = params
    
    // Calculate board size based on time
    const boardSize = timeMinutes === 8 ? {rows: 3, cols: 3}
                    : timeMinutes === 10 ? {rows: 4, cols: 4}
                    : {rows: 4, cols: 5}
    
    return `You are generating content for a classroom game called "Strategy Board Quiz".

GAME MECHANICS (FIXED - DO NOT MODIFY):
- Teams take turns selecting questions from a grid
- Higher point questions must be harder
- Teams get 20s discussion before answering
- Wrong answers trigger steal phase (5s, no discussion)
- First correct steal wins the points

YOUR JOB:
Generate questions for a ${boardSize.rows}x${boardSize.cols} grid.

CONSTRAINTS:
- Age band: ${ageBand}
- Skill focus: ${skillFocus}
- ${numTeams} teams competing
- Total game time: ${timeMinutes} minutes

${contextText ? `CONTENT CONTEXT:
${contextText}

Base all questions on this content.` : ''}

DIFFICULTY PROGRESSION (CRITICAL):
- 100 points: Simple recall or basic identification
- 200 points: Explanation or examples required
- 300 points: Reasoning, comparison, or application
- 400 points: Justification, inference, or complex analysis

OUTPUT FORMAT:
Return a JSON object matching this exact schema:
{
  "title": "Short, engaging game title",
  "learningFocus": "One sentence learning goal",
  "topics": ["topic1", "topic2", "topic3", "topic4"],
  "board": {
    "rows": ${boardSize.rows},
    "cols": ${boardSize.cols},
    "pointsPerRow": [100, 200, 300, ${boardSize.rows > 3 ? '400' : ''}],
    "cells": [
      {
        "topic": "topic1",
        "points": 100,
        "prompt": "Question text (answerable orally in <10s)",
        "acceptableAnswers": ["answer1", "answer2"]
      },
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
  "fastFinisherExtension": "Challenge extension if board ends early"
}

CRITICAL RULES:
1. cells.length must equal rows × cols
2. Each cell must match a topic and point value
3. Questions must be answerable orally
4. acceptableAnswers must include all reasonable variations
5. Higher point rows MUST be noticeably harder`
  },
  
  RuntimeComponent: StrategyBoardQuizGame,
  
  controls: {
    phases: {
      team_selecting: {
        label: 'Team is selecting...',
        actions: []
      },
      question_shown: {
        label: 'Question revealed',
        actions: [
          { type: 'start_discussion_timer', label: 'Start Discussion (20s)' }
        ]
      },
      discussion: {
        label: 'Discussion in progress',
        actions: []
      },
      answer_waiting: {
        label: 'Waiting for answer',
        actions: [
          { type: 'mark_correct', label: 'Correct ✓' },
          { type: 'mark_incorrect', label: 'Incorrect ✗' }
        ]
      },
      steal_attempt: {
        label: 'Steal phase active',
        actions: [
          { type: 'mark_correct', label: 'Correct ✓' },
          { type: 'mark_incorrect', label: 'Incorrect ✗' },
          { type: 'skip_steal', label: 'Skip to Next' }
        ]
      }
    }
  }
}

export default strategyBoardQuiz
```

---

## Content Schema Design Principles

### 1. Atomicity
Each piece of content should be independently usable.

**Good:**
```json
{
  "prompt": "Name a food in the protein group",
  "acceptableAnswers": ["chicken", "beef", "fish", "eggs", "beans"]
}
```

**Bad:**
```json
{
  "prompt": "Question 1",
  "context": "This relates to the previous question about proteins"
}
```

### 2. Self-Contained
Content should not reference external materials not provided.

**Good:**
```json
{
  "prompt": "If a serving of pasta is 2 ounces, how many servings in 6 ounces?",
  "acceptableAnswers": ["3", "three"]
}
```

**Bad:**
```json
{
  "prompt": "Using the chart on the board, calculate servings",
}
```

### 3. Oral-Friendly
All prompts must be answerable by speaking.

**Good:**
```json
{
  "prompt": "Name two fruits high in Vitamin C",
  "acceptableAnswers": ["oranges", "kiwi", "strawberries", "lemon"]
}
```

**Bad:**
```json
{
  "prompt": "Write down the chemical formula for Vitamin C"
}
```

### 4. Time-Bounded
Prompts should be answerable in under 10 seconds of speaking.

**Good:**
```json
{
  "prompt": "Which food group do apples belong to?",
  "acceptableAnswers": ["fruits", "fruit group"]
}
```

**Bad:**
```json
{
  "prompt": "Explain the complete process of how fruits are digested in the human body"
}
```

### 5. Answer Flexibility
acceptableAnswers should include all reasonable variations.

**Good:**
```json
{
  "acceptableAnswers": [
    "protein",
    "proteins",
    "protein group",
    "meat group"
  ]
}
```

**Bad:**
```json
{
  "acceptableAnswers": ["protein"]
}
```

---

## Adding a New Template

### Step 1: Create Template File
Create `/lib/templates/your-template.ts`

### Step 2: Define Content Schema
Use Zod to create strict validation.

### Step 3: Write Generation Prompt
Explain mechanics and constraints to Claude.

### Step 4: Build Runtime Component
Create React component in `/components/templates/your-template/`

### Step 5: Define Control Interface
Specify what teacher actions are needed in each phase.

### Step 6: Register Template
Add to `/lib/templates/registry.ts`

### Step 7: Test Generation
Verify AI generates valid content consistently.

### Step 8: Test Runtime
Play the game with real content to verify mechanics.

---

## Template Checklist

Before marking a template complete, verify:

**Content Schema:**
- [ ] All required fields have Zod validation
- [ ] Schema enforces atomic, self-contained content
- [ ] Schema prevents oral-unfriendly prompts
- [ ] Flexible answer validation

**Generation Prompt:**
- [ ] Clearly explains game mechanics (read-only)
- [ ] Specifies difficulty progression
- [ ] Includes age-appropriate examples
- [ ] Handles optional context text
- [ ] Outputs valid JSON matching schema

**Runtime Component:**
- [ ] Renders on single screen (no separate projection)
- [ ] Readable from back of classroom
- [ ] Handles all game phases correctly
- [ ] Integrates with shared components (timer, scores)
- [ ] No device requirement for students

**Control Interface:**
- [ ] Every phase has clear teacher actions
- [ ] Controls are self-explanatory
- [ ] Actions map to state machine transitions
- [ ] Failure states handled gracefully

**Compliance with Global Rules:**
- [ ] Explainable in under 60 seconds
- [ ] Works with existing classroom setup
- [ ] No special props required
- [ ] Mixed ability participation
- [ ] Time-scalable (5-15 minutes)
- [ ] Regeneration-friendly

---

## Template Types

### Board/Grid Games
**Characteristics:**
- Visual grid layout
- Cell selection
- Point-based scoring
- Strategic choice

**Examples:**
- Strategy Board Quiz (Jeopardy)
- Matching grid
- Bingo variants

### Timed Challenges/Relays
**Characteristics:**
- Sequential rounds
- Time pressure
- Turn-based or simultaneous
- Accumulation scoring

**Examples:**
- Rapid-fire relay
- Beat the clock
- Team race

### Discussion/Creative Prompts
**Characteristics:**
- Open-ended responses
- Subjective scoring
- Team collaboration
- Teacher facilitation

**Examples:**
- Would you rather
- Debate topics
- Creative challenges

---

## Schema Validation Flow

```
AI Output (JSON string)
    ↓
JSON.parse()
    ↓
Zod schema.safeParse()
    ↓
Success? → Pass to runtime
    ↓
Failure? → Log errors, retry generation (max 2 retries)
    ↓
Still failing? → Return user-friendly error
```

---

## Error Handling

### Generation Errors
- **Invalid JSON:** Retry with stricter prompt
- **Schema Validation Failure:** Log specific errors, retry
- **API Error:** Show user-friendly message, allow manual retry

### Runtime Errors
- **Missing Content:** Gracefully degrade (skip cell)
- **State Corruption:** Reset to last valid state
- **Timer Failure:** Manual control fallback

---

## Future Template Ideas (Post-v1)

- Word ladder challenge
- Category sorting
- Picture-based prompts
- Movement/kinesthetic games
- Role-play scenarios
- Debate tournaments
- Collaborative building challenges

Each would follow the same template structure and share the design system.
