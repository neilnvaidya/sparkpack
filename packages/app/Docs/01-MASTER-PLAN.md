# Master Plan: SparkPack — Curated Curriculum Game Library

> Supersedes the v1 AI-generator plan (see `archive/01-MASTER-PLAN-v1-ai-generator.md`).
> Last updated: 2026-07-15.
>
> This is the strategy doc. For live task state see [WORKPLAN.md](./WORKPLAN.md);
> for per-game teacher flows see `flows/`, for game designs see `designs/`.

## Executive Summary

**Product:** A library of ready-to-play classroom review games, prepopulated for whole curriculums, playable on a single projected screen with no student devices.

**Core value proposition:** A teacher picks their year group and topic and is playing a polished, curriculum-aligned game in under 30 seconds. No prompting, no authoring, no waiting.

**Target market:** UK primary teachers (KS1–KS2, Years 1–6), multi-subject (maths first, then English, science, and other subjects).

## Non-Negotiable Decisions

1. **Single-screen design** — all content displays on one teacher-controlled screen (projector/smartboard). No student devices. This is the core differentiator.
2. **No AI in the product** — zero runtime AI. No LLM calls, no API keys, no generation latency, no content roulette. All game content is curated JSON shipped with the app.
3. **AI at dev time only** — AI assists *development*: drafting question sets, deriving content from past papers, and scaffolding code. Everything it produces is schema-validated and human-reviewed before being committed.
4. **Fixed mechanics + curated content** — game rules are coded in templates; content is data. Templates and content evolve independently.
5. **Library only (for now)** — no teacher-facing authoring/editing. Every game is prebuilt and quality-controlled. Custom authoring may return later as a separate track.
6. **Manual answer validation** — the teacher judges correct/incorrect. The game never auto-grades a student's spoken answer.

## Current State (2026-07-15)

**The engine is built; the content is one year deep.** Seven games play end-to-end
against any pack that satisfies their requirements, and the library front door
works. The bottleneck is now curriculum breadth, not capability.

**Games (7, all built and playable)** — each is a template + a "slice" that adapts
a pack into that template's content:

| Game | Needs from a pack |
|---|---|
| Question Rush | 6+ items of any kind |
| Strategy Board Quiz | 8+ qa/mcq/truefalse, 2–4 strands |
| Flash Round | 5+ items of any kind |
| True or False Showdown | 5+ truefalse |
| Three in a Row | 16+ qa/mcq/truefalse |
| Summit Climb | 16+ qa/mcq/truefalse, 8 easy + 8 hard (difficulty-2 backfills) |
| Risk It | 10+ qa/mcq/truefalse |

Questions render through one shared path — `lib/questions/render.ts` →
`components/shared/QuestionView.tsx` — so an MCQ shows lettered option panels and
a true/false shows TRUE/FALSE panels in **every** game, not just its own.

All seven share one layout (`components/shared/GameShell.tsx`): game area, a
`TeamsPanel` sidebar where awarding is always "tap a team", a fixed-order action
bar, and a `TutorialOverlay` on first play. Games start with a shared setup phase
(`GameSetup.tsx`: how-to-play + teams).

**Content — 19 packs, 20–28 items each.** Year 3 is the proven reference slice and
is complete across six subjects: maths (7 topics), science (5), English (3),
history (1), geography (1). Year 2 has only 2 packs against ~12 mapped topics;
Years 1, 4, 5, 6 are not in the map yet.

**Library** — `/library` → subject → year/topic (laid out like the NC) → topic page
showing playable games above the statutory objectives. The old `/generate` flow is
deleted.

**Tooling** — `npm run validate-packs` Zod-parses every pack, checks equation
arithmetic and MCQ uniqueness, verifies id/filename consistency and board fit, and
reports which games each pack powers by importing the app's real requirements
(`lib/games/slice-requirements.ts`). `npx vitest run` snapshots every pack × every
game (`lib/games/slices-dump.test.ts`) with a seeded RNG — the regression net for
content and rendering refactors.

- **`@sparkpack/visuals`** — 36 SVG renderers (clock faces, number lines, fraction sets, coins, tally charts, …) with Storybook, plus a derived KS1 2023 SATs question dataset. Still not consumed by game templates.
- Persistence is localStorage; no auth, no database.
- Theme is light and colourful (Kahoot as reference); teacher control bars stay dark. No emojis anywhere.

### Known gaps

- **Points system is weak** (Neil flagged) — currently difficulty × 100/150/200 in
  `lib/games/slices.ts`. Worth resolving before mass-producing content.
- `maths-y3-multiplication-division` has 15 strategy items (needs 16) and only 2
  difficulty-1 items, so it silently offers 5 games instead of 7.
- Y2 packs lack per-item `objectiveCodes`; the validator does not flag this.
- localStorage games accumulate (`lib-*` ids); no cleanup.

## Architecture

```
Frontend:     Next.js (App Router)
Styling:      Tailwind CSS + shadcn/ui
State:        Zustand with Immer
Validation:   Zod (content schemas are the contract)
Visuals:      @sparkpack/visuals SVG renderer library
Content:      Versioned JSON packs committed to the repo
Deployment:   Vercel
Persistence:  localStorage (session state only)
```

### Content model (built)

The shipped model differs from the original sketch in one important way: **packs are
template-agnostic**. One pack per topic holds mixed items (`equation`, `qa`, `mcq`,
`truefalse`, each with a difficulty and a strand), and *game slices* adapt that pack
into each template's content. A pack therefore powers every game whose requirements
it meets, instead of one pack per template.

- **Curriculum taxonomy** (`lib/curriculum/map.ts`): Key Stage → Year → Subject →
  Topic, aligned to the UK National Curriculum. A topic points at a pack or `null`.
- **Content packs** (`lib/curriculum/packs/*.json`): one per subject+year+topic, named
  `<subject>-y<year>-<topicId>`, Zod-validated (`lib/curriculum/schema.ts`). Packs carry
  statutory NC objectives verbatim (objectives-first).
- **Game slices** (`lib/games/slices.ts`): requirements live in
  `slice-requirements.ts` (shared with the validator); builders adapt packs to templates.
- **Library UI** (`app/library/`): browse-and-play. Replaced `/generate`.

Items never reference visuals renderers yet — every item must stand alone on a
projector without a picture.

### Dev-time content pipeline (to build)

1. AI drafts a question set for a taxonomy node against the template's schema.
2. Script validates with Zod (structure) and checks answers programmatically where possible (arithmetic, etc.).
3. Human reviews and edits.
4. JSON is committed. The app never sees anything unvalidated.

Target volume, UK primary maths alone: ~6 years × ~10 topics × 2–3 sets ≈ 150–200 packs. Multi-subject grows this several-fold; the pipeline, not hand-authoring, is what makes it feasible.

## Roadmap

### Phase 1 — Cleanup ✅
Remove runtime AI code and SDK dependencies, fix git hygiene, retire the AI-generator docs, commit Math Rush.

### Phase 2 — Content architecture ✅
Curriculum taxonomy module; template-agnostic pack schema + game slices; content-pack
folder convention; `/generate` replaced by the library browser.

### Phase 3 — Dev-time content pipeline ✅ (partial)
`scripts/validate-packs.mjs` is the validate step: Zod + arithmetic + MCQ + id/board
checks, and it reads the app's real game requirements so it can't drift. The draft
and review steps are still manual (AI drafts, human reviews, commit).

### Phase 4 — Prove one slice ✅ (Year 3, not Year 2)
Year 3 was built out instead of Year 2 — complete across all six subjects (19 packs).
The model is proven: one pack per topic powers up to 7 games. Visuals renderers were
*not* wired in; items stand alone instead. **Still outstanding: real classroom use.**

### Phase 5 — Scale + polish (current)
Open decisions before mass production:
1. **Fix the points system** (parked; Neil flagged it as weak) — retuning after 100+
   packs exist is far more painful than now.
2. **Depth or breadth?** Fill Year 2 (12 mapped topics, empty) vs. start Year 4.
3. Then mass-produce Years 1–6; execute the visual & sound design work in
   `backlog.md` and `09-visual-sound-design.md`.

## Business Model (directional)

Freemium remains plausible but is now gated on **library depth**, not generation quotas: free tier gets a sampler of games per year group; premium/school licence unlocks the full curriculum library. Pricing deferred until Phase 4 proves classroom value.
