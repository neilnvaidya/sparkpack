# SparkPack Backlog

This backlog describes how to take the current **docs‑only** SparkPack repo to a **simple, working web app**.

- Current reality: Git repo with `README.md` and `Docs/*.md` only. No Node/Next.js app, no `.env`, no deployment.
- App root: the **Next.js app lives at the repo root** (`app/`, `components/`, `lib/` directly under `sparkpack/`).
- AI configuration: treat `AI_PROVIDER`, `AI_API_KEY`, and `AI_MODEL` as the **canonical** environment variables (Anthropic, OpenAI, Google, etc. can be plugged in later).

Each ticket below has:
- **Why** it exists.
- **What to do** (steps).
- **Done when** (acceptance criteria).
- **Docs**: pointers into the existing documentation.

> Note: This file is planning only. It intentionally does **not** imply that any setup or coding has been done yet.

---

## Phase 0 – Environment & Project Setup (from empty repo to “hello world”)

### 0.1 – Confirm local tooling

- **Why**: Ensure the local machine can run the stack described in the docs.
- **What to do**
  - Confirm Node.js version is **18+**.
  - Confirm `npm` is installed.
  - (Optional) Install editor plugins for TypeScript, Tailwind, and React.
- **Done when**
  - `node -v` shows 18+.
  - `npm -v` works.
- **Docs**
  - `README.md` – “Prerequisites”.

- [ ] **0.1 – Local tooling confirmed**

---

### 0.2 – Initialize Next.js app at repo root

- **Why**: Create the actual web app that all the docs describe.
- **What to do**
  - In the `sparkpack` repo root, initialize a new Next.js 14 app (TypeScript, App Router, Tailwind, no `src/` directory).
    - Conceptually: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
  - Verify that `package.json`, `next.config.*`, `app/`, and baseline config files are created at the repo root.
- **Done when**
  - `npm install` completes.
  - `npm run dev` serves the default Next.js starter page at `http://localhost:3000`.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – Phase 0 overview.
  - `Docs/08a-implementation-guide.md` – “0.1 Initialize Project”.

- [ ] **0.2 – Next.js app initialized at repo root**

---

### 0.3 – Install core runtime dependencies

- **Why**: Match the architecture and implementation guides so later tickets don’t have to chase missing packages.
- **What to do**
  - Install runtime libraries:
    - State & validation: `zustand`, `immer`, `zod`.
    - AI SDKs: `@anthropic-ai/sdk`, `openai`, `@google/generative-ai`.
    - UI/tooling: `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.
  - Install dev typings: `@types/node` (and other types as needed by the templates).
- **Done when**
  - All of the above appear in `dependencies`/`devDependencies` in `package.json`.
  - `npm run dev` still compiles and serves the starter page.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – “Quality Standards”.
  - `Docs/05-ai-provider-abstraction.md` – provider SDK expectations.
  - `Docs/12-quick-reference.md` – “Environment Setup” / `package.json` hints.

- [ ] **0.3 – Core runtime dependencies installed**

---

### 0.4 – Initialize shadcn/ui and base UI kit

- **Why**: The design system and implementation guide assume shadcn/ui components are available.
- **What to do**
  - Initialize shadcn/ui in the project.
  - Add at least these components:
    - `button`, `card`, `dialog`, `input`, `label`, `select`, `textarea`.
  - Ensure they live under `components/ui/` and can be imported with `@/components/ui/...`.
- **Done when**
  - A trivial page can render a shadcn `Button` without runtime errors.
  - TypeScript recognizes the component imports.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – “Design system implementation”.
  - `Docs/08a-implementation-guide.md` – Phase 0 and Phase 1 shared component notes.

- [ ] **0.4 – shadcn/ui initialized with base components**

---

### 0.5 – Tailwind & design system wiring

- **Why**: Ensure the visual system (team colours, typography, projector-friendly sizing) matches the docs.
- **What to do**
  - Configure `tailwind.config.*` with:
    - `content` globs for `app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}`, `lib/**/*.{ts,tsx}`.
    - Design tokens (colors, radii, typography) as described in the implementation guide.
    - Team colors (`team.red`, `team.blue`, etc.) and neutral palette.
  - Update `app/globals.css` with:
    - CSS variables for the theme.
    - Utility classes like `.classroom-display`, `.game-container`, and per-team background helpers.
  - Add `lib/utils/cn.ts` helper that wraps `clsx` + `tailwind-merge`.
- **Done when**
  - A sample page using `classroom-display` and team colours renders as expected.
  - Tailwind builds without warnings about missing content paths.
- **Docs**
  - `Docs/02-system-architecture.md` – Design system overview.
  - `Docs/08a-implementation-guide.md` – “0.4 Tailwind Configuration”.

- [ ] **0.5 – Tailwind and design system configured**

---

### 0.6 – Environment variables & git hygiene

- **Why**: Prevent secrets from leaking and align env naming across code and docs.
- **What to do**
  - Create `.env.example` with **no secrets**, including:
    - `AI_PROVIDER=anthropic` (default).
    - `AI_API_KEY=` (blank).
    - `AI_MODEL=claude-sonnet-4-20250514`.
    - `NEXT_PUBLIC_APP_NAME="SparkPack"` (or similar).
    - `NEXT_PUBLIC_MAX_GAMES_PER_DAY=10`.
  - Create a local `.env.local` (not committed) and fill in real values.
  - Ensure `.gitignore` ignores `.env.local` and `.env*.local`.
- **Done when**
  - `git status` never shows `.env.local`.
  - Running the app with `.env.local` set allows future AI calls to work.
- **Docs**
  - `README.md` – “Setup” / `.env.local` examples.
  - `Docs/05-ai-provider-abstraction.md` – “Environment Configuration”.
  - `Docs/07-api-specification.md` – env variables for API access.

- [ ] **0.6 – Env examples created and secrets ignored**

---

### 0.7 – Git & (later) deployment wiring

- **Why**: Lock in a clean baseline commit and prep for hosted deployments.
- **What to do**
  - Ensure `git init` has been run (it has) and `main` is the primary branch.
  - Commit:
    - Initial Next.js app scaffold.
    - Tailwind/shadcn configuration.
    - This `backlog.md`.
    - `Docs/` and `README.md`.
  - (Later) When ready, create a Vercel project and map environment variables.
- **Done when**
  - `git status` is clean after the initial setup commit.
  - Remote (e.g. GitHub) contains the same tree as local.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – Phase 0 “Git repository” and “Deployment pipeline works”.
  - `Docs/08a-implementation-guide.md` – “0.5 Vercel Deployment Setup”, “0.6 Git Setup”.

- [ ] **0.7 – Initial setup committed and pushed**

---

## Phase 1 – Minimal App Shell (simple working webapp)

The goal of this phase is **not** full game functionality; it is a coherent shell where pages and routes exist and match the docs, and later phases can “fill in” logic.

### 1.1 – Root layout & home page

- **Why**: Provide a basic, branded landing page instead of the Next.js starter.
- **What to do**
  - Implement `app/layout.tsx` with global fonts, background, and container consistent with the design system.
  - Implement `app/page.tsx` to show:
    - App name (“SparkPack”).
    - Short value prop (from `README.md`).
    - Simple navigation to the Generate page.
- **Done when**
  - Visiting `/` shows a SparkPack-branded page (no longer the default Next template).
- **Docs**
  - `README.md` – “What It Does”.
  - `Docs/01-MASTER-PLAN.md` – Day 1 “Design system implementation”.
  - `Docs/02-system-architecture.md` – app structure.

- [ ] **1.1 – Root layout and home page implemented**

---

### 1.2 – Stub generation and game routes

- **Why**: Establish the URLs and basic structure before wiring any AI or state logic.
- **What to do**
  - Create `app/generate/page.tsx` with placeholder copy describing the future generation flow.
  - Create `app/game/[id]/page.tsx` with placeholder text explaining that it will host the runtime for a generated game.
  - Add simple nav links between Home and Generate.
- **Done when**
  - `/generate` and `/game/test-id` render without errors using the new layout.
- **Docs**
  - `README.md` – Project structure tree.
  - `Docs/02-system-architecture.md` – file structure / routing.
  - `Docs/08b-implementation-guide-part2.md` – Phases 8–10 route expectations.

- [ ] **1.2 – Generation and game routes stubbed**

---

### 1.3 – TypeScript strict mode & basic scaffolding

- **Why**: Enforce the quality bar from the docs while the codebase is still small.
- **What to do**
  - Enable `strict: true` in `tsconfig.json`.
  - Create **empty but typed stubs** for key modules referenced across the docs:
    - `lib/ai/provider-interface.ts`, `lib/ai/provider-factory.ts`, `lib/ai/generate.ts`.
    - `lib/templates/types.ts`, `lib/templates/registry.ts`, `lib/templates/strategy-board-quiz.ts`.
    - `lib/store/game-store.ts`.
  - Export minimal types/functions so imports compile, but leave real implementations for later tickets.
- **Done when**
  - The app builds under strict TypeScript with these stubs in place.
  - Future implementation tickets can focus purely on behavior, not wiring.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – “Code Quality (Non-Negotiable)”.
  - `Docs/05-ai-provider-abstraction.md` – provider interfaces.
  - `Docs/06-state-management.md` – store skeleton.
  - `Docs/04-template-system.md` – template types/registry.

- [ ] **1.3 – TS strict mode and stubs in place**

---

## Phase 2 – Docs Alignment & Decisions (no code behavior changes)

This phase aligns the documentation with the actual repo structure and clarifies MVP scope. These are documentation tasks, **not** runtime changes.

### 2.1 – Canonical app root & paths

- **Why**: Docs currently mix `classroom-games/` and other roots; the real repo uses `sparkpack/` with the app at the root.
- **What to do**
  - Update documentation to consistently describe the app as living at the repo root.
  - Fix any diagrams or file trees that still show `classroom-games/` as the outer folder.
- **Done when**
  - All file trees and examples match the real `sparkpack` layout.
- **Docs**
  - `README.md` – “Project Structure”.
  - `Docs/01-MASTER-PLAN.md` – “Document Structure”.
  - `Docs/02-system-architecture.md` – file structure section.

- [ ] **2.1 – App root and paths aligned in docs**

---

### 2.2 – Environment variable naming consistency

- **Why**: Some docs use `AI_PROVIDER` / `AI_API_KEY` / `AI_MODEL`, others mention `ANTHROPIC_API_KEY`. MVP should have a single, clear scheme.
- **What to do**
  - Treat `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL` as canonical.
  - Ensure lower-level examples that still need `ANTHROPIC_API_KEY` clearly label it as a provider-specific alias or implementation detail.
  - Update `.env.example` snippet in the docs to match the actual project files.
- **Done when**
  - A new reader can set up `.env.local` using only one documented scheme without confusion.
- **Docs**
  - `README.md` – env configuration block.
  - `Docs/05-ai-provider-abstraction.md` – “Environment Configuration”.
  - `Docs/07-api-specification.md` – env sections.

- [ ] **2.2 – Env var naming aligned across docs**

---

### 2.3 – Document index & filenames normalized

- **Why**: The Master Plan and README reference doc filenames that don’t exactly match the current `Docs/` directory.
- **What to do**
  - Reconcile:
    - README’s docs table (`docs/...`) vs actual `Docs/*.md`.
    - Master Plan’s “Document Structure” list vs real filenames (`01-MASTER-PLAN.md`, `02-system-architecture.md`, `04-template-system.md`, etc.).
  - Decide on a single canonical index (likely the README docs table) and update others to match.
- **Done when**
  - Every intra-doc link resolves without 404s.
  - There is no ambiguity about which file contains which topic.
- **Docs**
  - `README.md` – “Documentation” table.
  - `Docs/01-MASTER-PLAN.md` – “Document Structure”.

- [ ] **2.3 – Docs index and filenames normalized**

---

### 2.4 – MVP scope around templates & teacher adjustment

- **Why**: Some docs mention multiple templates and content editing; your clarified intent is: **MVP = one template (Strategy Board Quiz), adjustment UI is nice-to-have**.
- **What to do**
  - Update Master Plan and System Architecture to:
    - Explicitly state that MVP ships with **one** fully polished template.
    - Clarify that the teacher adjustment/editor phase is desirable but **not required** for the first usable release (game can run directly from validated AI content).
  - Ensure Template System docs label additional templates as post-MVP.
- **Done when**
  - A new contributor reading only the docs can clearly state the MVP scope without guessing.
- **Docs**
  - `Docs/01-MASTER-PLAN.md` – MVP scope and phases.
  - `Docs/02-system-architecture.md` – template registry and non-goals.
  - `Docs/04-template-system.md` – template registry examples.

- [ ] **2.4 – MVP template and adjustment scope clarified in docs**

---

## Phase 3 – Future Work (to be detailed later)

These are **not** to be executed yet; they exist here as placeholders to connect the setup with the rest of the documentation:

- **3.1 – Implement AI provider abstraction (Anthropic/OpenAI/Google) per `Docs/05-ai-provider-abstraction.md`.**
- **3.2 – Implement Strategy Board Quiz template schema & prompt per `Docs/04-template-system.md` and `Docs/08a-implementation-guide.md`.**
- **3.3 – Implement Zustand game store and state machine per `Docs/06-state-management.md`.**
- **3.4 – Implement `/api/generate-game` per `Docs/07-api-specification.md`.**
- **3.5 – Implement Strategy Board Quiz runtime UI per `Docs/08b-implementation-guide-part2.md`.**
- **3.6 – (Post-MVP) Add a simple teacher adjustment/editor step between generation and runtime.**

These will be broken into finer-grained tickets once Phase 0–2 are complete and the setup is stable.

