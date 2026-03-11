# SparkPack


Create and run custom classroom games on a single projected screen. No student devices required.

---

## MVP: Jeopardy-Style Classroom Game

The first playable game is **Strategy Board Quiz** (Jeopardy-style grid). The current MVP is **manual-editing first**: no AI is required to create or play. From the **Create game** page you can:

- **Load sample 4×4 game** — one click loads a full Food Groups quiz; edit if you like, then **Save & Play**.
- **Edit from scratch** — set title, class teams, board size, and each cell’s category/question/acceptable answers.

Game flow follows [Docs/GAME-DESIGN-strategy-board-quiz.md](Docs/GAME-DESIGN-strategy-board-quiz.md): team selects a cell → discussion timer (20s) → teacher marks Correct/Incorrect → wrong answers trigger steal phase (5s per team). All state and UI match the design doc.

---

## What It Does

Teachers create a playable review game with custom classroom content and run it live with teams, scoring, timer control, and steal rounds. The game runs on a single projected screen. Students need nothing.

---

## Getting Started

### Prerequisites
- Node.js 18+
- An API key from one of: Anthropic, OpenAI, or Google

### Setup

```bash
git clone https://github.com/your-username/sparkpack
cd sparkpack
npm install
cp .env.example .env.local
```

Copy `.env.example` to `.env.local`, then set your provider and API key (canonical variables only):

```bash
AI_PROVIDER=anthropic        # anthropic | openai | google
AI_API_KEY=your-key-here
AI_MODEL=claude-sonnet-4-20250514
NEXT_PUBLIC_APP_NAME="SparkPack"
NEXT_PUBLIC_MAX_GAMES_PER_DAY=10
```

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Documentation

**Canonical document index:** This table is the single source of truth for docs. All links use the `Docs/` folder and exact filenames; intra-doc links elsewhere should match these. Read in order before building.

| # | Document | What It Covers |
|---|----------|----------------|
| 01 | [Master Plan](Docs/01-MASTER-PLAN.md) | Vision, decisions, business model, phases, risk |
| 02 | [System Architecture](Docs/02-system-architecture.md) | Tech stack, data flow, file structure |
| 04 | [Template System](Docs/04-template-system.md) | Template structure, schemas, adding new templates |
| 05 | [AI Provider Abstraction](Docs/05-ai-provider-abstraction.md) | Provider interface, implementations, cost tracking |
| 06 | [State Management](Docs/06-state-management.md) | Zustand store, game state machine, types |
| 07 | [API Specification](Docs/07-api-specification.md) | Endpoints, request/response formats, error handling |
| 08a | [Implementation Guide (Part 1)](Docs/08a-implementation-guide.md) | Build order, phases, backend and core logic |
| 08b | [Implementation Guide (Part 2)](Docs/08b-implementation-guide-part2.md) | Generation UI, runtime, testing |
| 12 | [Quick Reference](Docs/12-quick-reference.md) | Patterns, snippets, debugging, common tasks |

---

## Build Order

Follow the implementation guide exactly. Do not skip phases.

```
Phase 0   Project setup                  4 hours
Phase 1   AI provider abstraction        6 hours
Phase 2   Template schema & validation   4 hours
Phase 3   Template system                4 hours
Phase 4   State management               5 hours
Phase 5   Storage & rate limiting        3 hours
Phase 6   Generation API route           3 hours
Phase 7   Shared components              5 hours
Phase 8   Generation UI                  4 hours
Phase 9   Game runtime                   8 hours
Phase 10  Integration                    3 hours
Phase 11  Testing & polish               6 hours
```

Total: ~55 hours. With AI coding assistance: ~40 hours.

Full detail in [Docs/08a-implementation-guide.md](Docs/08a-implementation-guide.md) and [Docs/08b-implementation-guide-part2.md](Docs/08b-implementation-guide-part2.md).

---

## MVP Scope

**Included (current focus):**
- Strategy Board Quiz template (one template, done perfectly)
- Manual game authoring UI (team setup + question editing)
- Complete game runtime with timer and scoring
- Teacher controls (mark correct/incorrect, advance phases)
- localStorage persistence
- Basic rate limiting (10 games/day per browser)

**Excluded until next layer:**
- AI content generation flow
- User authentication
- Additional templates
- Database persistence
- Game sharing
- Mobile optimisation
- Analytics

---

## AI Provider

SparkPack is provider-agnostic. Set your preferred provider in `.env.local`:

| Provider | Env value | Default model |
|----------|-----------|---------------|
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` |
| OpenAI | `openai` | `gpt-4o` |
| Google | `google` | `gemini-1.5-pro` |

See [Docs/05-ai-provider-abstraction.md](Docs/05-ai-provider-abstraction.md) for setup and cost comparison.

---

## Project Structure

```
sparkpack/
├── app/
│   ├── page.tsx                       # Home / template selection
│   ├── generate/page.tsx              # Generation form
│   ├── game/[id]/page.tsx             # Game runtime
│   └── api/generate-game/route.ts    # Generation endpoint
├── components/
│   ├── shared/                        # Cross-template components
│   └── templates/
│       └── strategy-board-quiz/
├── lib/
│   ├── ai/                            # Provider abstraction layer
│   ├── store/                         # Zustand game state
│   ├── templates/                     # Template definitions & registry
│   ├── schemas/                       # Zod validation schemas
│   └── utils/                         # Storage, rate limiting
├── Docs/                              # All documentation
└── public/
```

---

## Build Status

- [ ] Phase 0: Setup
- [ ] Phase 1: AI abstraction
- [ ] Phase 2–3: Templates & schemas
- [ ] Phase 4–6: State, storage, API
- [ ] Phase 7–9: Components, UI, runtime
- [ ] Phase 10–11: Integration & testing
- [ ] MVP complete — ready for beta
