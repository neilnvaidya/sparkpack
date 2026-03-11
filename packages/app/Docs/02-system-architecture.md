# System Architecture

## Overview

This is a web-based classroom game generation platform that uses fixed game templates and AI-generated content.

**Core Principle:** Game mechanics are fixed and coded. AI only generates content to fill those mechanics.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Generation Flow        │        Game Runtime              │
│  - Template selection   │        - Game board display       │
│  - Context input        │        - Team management          │
│  - AI generation        │        - Timer control            │
│                         │        - Teacher controls         │
└─────────────────────────┴───────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Template System                          │
├─────────────────────────────────────────────────────────────┤
│  Template Registry                                           │
│  - Strategy Board Quiz (Jeopardy-style)                     │
│  - Timed Relay Challenge                                     │
│  - Creative Discussion Prompts                               │
│                                                              │
│  Each template defines:                                      │
│  - Content schema (what AI generates)                        │
│  - Runtime component (how it renders)                        │
│  - Control interface (teacher actions)                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Shared Component Library                    │
├─────────────────────────────────────────────────────────────┤
│  - TeamManager (scores, turn order)                         │
│  - TimerDisplay (countdown, discussion, steal)              │
│  - ScoreBoard (live team scores)                            │
│  - TeacherControls (mark correct/wrong, advance)            │
│  - GameContainer (layout wrapper)                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Generation Pipeline                      │
├─────────────────────────────────────────────────────────────┤
│  Input → Template Selection → AI Generation → Validation    │
│                                                              │
│  POST /api/generate-game                                    │
│  - Receives: template_id, context, parameters               │
│  - Calls: Anthropic Claude API                              │
│  - Returns: Validated game content JSON                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Design System                            │
├─────────────────────────────────────────────────────────────┤
│  Consistent across all game templates:                      │
│  - Color palette (5 team colors + neutrals)                 │
│  - Typography scale                                          │
│  - Animation library                                         │
│  - Component patterns                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
**Next.js 14+ (App Router)**
- Server Components for generation UI
- Client Components for game runtime
- Built-in API routes
- File-based routing

### Styling
**Tailwind CSS + shadcn/ui**
- Utility-first CSS
- Pre-built accessible components
- No custom assets required
- Responsive by default

### State Management
**Zustand** (or React Context if simpler)
- Game state (teams, scores, turn order)
- Template-specific state
- Timer state
- UI state (modals, controls)

### AI Generation
**Anthropic Claude API**
- Structured output generation
- Content validation
- Template-specific prompts

### Validation
**Zod**
- Runtime type checking
- Schema validation for AI output
- Type-safe throughout application

---

## Data Flow

### Generation Flow

```
Teacher Input
    ↓
[Select Template] → Strategy Board Quiz
    ↓
[Input Context] → "Food pyramid, serving sizes, food groups"
    ↓
[Configure] → Age: P5-6, Time: 10min, Teams: 4
    ↓
[Generate] → POST /api/generate-game
    ↓
Claude API Call
    ↓
[Validate] → Zod schema check
    ↓
[Store] → In-memory game state
    ↓
[Redirect] → /game/[id]
```

### Runtime Flow

```
Game Launch
    ↓
Initialize State
├── teams: Team[]
├── board: Cell[][]
├── activeTeam: number
├── phase: GamePhase
└── scores: number[]
    ↓
Game Loop
├── Team selects cell
├── Question displayed
├── Discussion timer (20s)
├── Team answers
├── Teacher marks correct/wrong
├── Points awarded OR steal phase
└── Next team's turn
    ↓
Game End
└── Display winner
```

---

## File Structure

```
sparkpack/                          # Repo root = app root (no separate app subfolder)
├── app/
│   ├── layout.tsx                 # Root layout with design system
│   ├── page.tsx                   # Landing/template selection
│   ├── globals.css                # Design system CSS variables
│   ├── generate/
│   │   └── page.tsx               # Generation form
│   ├── game/
│   │   └── [id]/
│   │       └── page.tsx           # Game runtime
│   └── api/
│       └── generate-game/
│           └── route.ts           # AI generation endpoint
│
├── components/
│   ├── shared/                    # Cross-template components
│   │   ├── GameContainer.tsx
│   │   ├── TeamManager.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── ScoreBoard.tsx
│   │   └── TeacherControls.tsx
│   │
│   ├── templates/                 # Template-specific components
│   │   └── strategy-board-quiz/
│   │       ├── GameBoard.tsx
│   │       ├── QuestionModal.tsx
│   │       └── StealPhase.tsx
│   │
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── modal.tsx
│       └── ...
│
├── lib/
│   ├── templates/                 # Template definitions
│   │   ├── registry.ts
│   │   └── strategy-board-quiz.ts
│   │
│   ├── ai/                        # AI provider abstraction and prompts
│   │   ├── provider-interface.ts
│   │   ├── provider-factory.ts
│   │   ├── generate.ts
│   │   └── validation.ts
│   │
│   ├── store/                     # Game state
│   │   └── game-store.ts
│   │
│   └── utils/                     # Shared utilities
│       ├── schemas.ts             # Zod schemas
│       └── game-storage.ts        # In-memory game state
│
├── Docs/                          # All documentation
│
└── public/
    └── (no assets needed for v1)
```

---

## Core Concepts

### Template
A template is a complete game definition including:
- **Mechanics**: How the game is played (fixed, coded)
- **Content Schema**: What AI needs to generate (Zod schema)
- **Runtime Component**: React component that renders the game
- **Control Interface**: What teacher actions are available
- **Timing Rules**: Round structure, duration options

### Content Payload
The JSON output from AI generation that fills a template:
- Questions/prompts
- Acceptable answers
- Instructions
- Extensions

### Game State
Runtime state managed by the game engine:
- Current phase (selecting, answering, stealing, etc.)
- Team data (scores, turn order)
- Board/content state (available, used, disabled)
- Timer state

### Teacher Controls
UI elements that allow teacher to:
- Mark answers correct/incorrect
- Advance game phases
- Control timers
- End game early

---

## Deployment Model

### v1 Target
**Vercel deployment**
- Serverless functions for API routes
- Edge runtime for fast response
- No database required (in-memory state)
- Environment variables for API keys

### State Management Strategy
**In-memory only (v1)**
- Game state stored in Zustand/Context
- No persistence between sessions
- Game ID is just timestamp/random string
- No "save game" feature

### Future Considerations (post-v1)
- Optional state persistence (localStorage)
- Game replay/history
- Teacher accounts
- Saved content library

---

## Key Design Decisions

### Single-Screen Display
- Teacher controls at bottom of screen
- Students see full game state
- No separate projection mode
- Optimized for 1920x1080 projected display

### Upfront Content Generation
- All content generated before game starts
- 20-30 second wait acceptable
- No lazy loading during gameplay
- Simpler state management

### Manual Answer Validation
- Teacher clicks "Correct" or "Incorrect"
- No automatic answer checking
- Teacher has full control
- Simpler implementation

### Template-First Architecture
- Templates define all structure
- AI only fills content slots
- No AI-generated mechanics
- Predictable, testable gameplay

---

## Non-Goals for v1

❌ Student devices
❌ Teacher accounts
❌ Saved games
❌ Content library
❌ Multiplayer networking
❌ Mobile app
❌ Offline mode
❌ Custom template builder
❌ Analytics/reporting

---

## Success Criteria

✅ Teacher can generate a playable game in under 30 seconds
✅ Game runs without technical issues in a real classroom
✅ UI is readable from back of classroom on projector
✅ Teacher controls are intuitive (no training needed)
✅ 2-3 templates work consistently
✅ AI generates appropriate content 95%+ of the time
✅ Game mechanics are clear to students in under 60 seconds
