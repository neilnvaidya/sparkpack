# SparkPack

Generate custom classroom games in under 30 seconds. No student devices required.

---

## What It Does

Teachers paste in lesson content, choose a game type and duration, and SparkPack generates a fully playable review game — questions, answers, scoring, and all. The game runs on a single projected screen. Students need nothing.

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

Edit `.env.local` with your provider and API key:

```bash
AI_PROVIDER=anthropic        # anthropic | openai | google
AI_API_KEY=your-key-here
AI_MODEL=claude-sonnet-4-20250514
```

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Documentation

Read these in order before building.

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

**Included:**
- Strategy Board Quiz template (one template, done perfectly)
- AI content generation with retry logic
- Complete game runtime with timer and scoring
- Teacher controls (mark correct/incorrect, advance phases)
- localStorage persistence
- Basic rate limiting (10 games/day per browser)

**Excluded until post-MVP:**
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

See [docs/05-ai-provider-abstraction.md](docs/05-ai-provider-abstraction.md) for setup and cost comparison.

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
