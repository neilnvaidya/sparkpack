# Master Plan: SparkPack — Curated Curriculum Game Library

> Supersedes the v1 AI-generator plan (see `archive/01-MASTER-PLAN-v1-ai-generator.md`).
> Last updated: 2026-07-10.

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

## Current State

- **Strategy Board Quiz** (Jeopardy-style) — implemented and playable. Suits any subject with question/answer content.
- **Math Rush** — implemented; fill-in-the-blank equation gameplay driven by curated JSON problem sets (`lib/data/math-rush/`), Zod-validated. This is the model for all future content.
- **`@sparkpack/visuals`** — 36 SVG renderers (clock faces, number lines, fraction sets, coins, tally charts, …) with Storybook, plus a derived KS1 2023 SATs question dataset. Not yet consumed by game templates.
- Persistence is localStorage; no auth, no database.

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

### Content model (to build)

- **Curriculum taxonomy:** Key Stage → Year → Subject → Topic (aligned to the UK National Curriculum). Every content pack is tagged into it.
- **Content packs:** one JSON file per template + topic + difficulty band, with a versioned Zod schema per template. Questions may reference visuals renderers by id (e.g. a `clock-face` visual for a time-reading question).
- **Library UI:** the front door is browse-and-play — pick year, subject, topic; see ready games; hit play. Replaces the old `/generate` authoring flow.

### Dev-time content pipeline (to build)

1. AI drafts a question set for a taxonomy node against the template's schema.
2. Script validates with Zod (structure) and checks answers programmatically where possible (arithmetic, etc.).
3. Human reviews and edits.
4. JSON is committed. The app never sees anything unvalidated.

Target volume, UK primary maths alone: ~6 years × ~10 topics × 2–3 sets ≈ 150–200 packs. Multi-subject grows this several-fold; the pipeline, not hand-authoring, is what makes it feasible.

## Roadmap

### Phase 1 — Cleanup ✅
Remove runtime AI code and SDK dependencies, fix git hygiene, retire the AI-generator docs, commit Math Rush.

### Phase 2 — Content architecture
Curriculum taxonomy module; versioned content schemas for both templates; content-pack folder convention; `/generate` replaced by a library browser.

### Phase 3 — Dev-time content pipeline
Generalize `scripts/derive-ks1-2023-questions.mjs` into a draft → validate → review → commit workflow.

### Phase 4 — Prove one slice
Fully populate **Year 2** across both templates: maths via Math Rush (wiring in visuals renderers), English/science via Strategy Board Quiz. Validate the model with real classroom use before mass production.

### Phase 5 — Scale + polish
Mass-produce content for Years 1–6; execute the visual & sound design work already specified in `backlog.md` and `09-visual-sound-design.md`.

## Business Model (directional)

Freemium remains plausible but is now gated on **library depth**, not generation quotas: free tier gets a sampler of games per year group; premium/school licence unlocks the full curriculum library. Pricing deferred until Phase 4 proves classroom value.
