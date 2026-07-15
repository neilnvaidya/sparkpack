# Workplan — current session state and next steps

> **Latest: multi-form questions, steps 1–2 (2026-07-15) — done.** Plan:
> `~/.claude/plans/points-to-address-1-starry-pillow.md`. Steps 1 and 2 of 5 are
> complete and verified in-browser; they ship the two user-visible wins with **no
> schema change and no content migration**.
>
> **Step 1 — rendering spine.** `asQuestionAnswer` flattened every question into a
> `{prompt, answer}` string pair before any component saw it, so an MCQ became
> `"...?   A: x   B: y"` and a true/false became `"True or false: <statement>"`.
> Structure now survives to the component via `lib/questions/render.ts`
> (`RenderedQuestion`) and `components/shared/QuestionView.tsx`, which generalises
> True/False Showdown's data-driven panels to MCQ. **492 `"True or false:"`
> prefixes → 0; 1,993 structured options now reach renderers.** The dead `detail`
> field (declared, schema'd, rendered, never assigned) is resurrected as
> `answerDetail`. Board Quiz's `initializeBoardState` used to cast without parsing
> — stale content produced a *blank board* rather than an error; it now safeParses
> and returns null. `StoredGame` gained `contentVersion` (CONTENT_VERSION = 2);
> mismatches are dropped on read.
>
> **Step 2 — Question Rush** (was Math Rush). Now takes any question kind, so it
> runs on **19/19 packs, up from 4** (only 4 packs have equations). Three cards per
> round, each named by a reserved colour — **Yellow, Pink and Brown are removed
> from `TEAM_COLOR_OPTIONS`** so no team can share a card's colour and "the yellow
> one" means exactly one thing. That reservation is what lets MCQ live in Rush
> without an A/B/C label collision. Equations keep their rotating hidden part and
> render identically. `TeamColorId` lost `c7`/`c9`/`c13`.
>
> **New: a test framework.** The repo had none. `vitest` + `lib/games/slices-dump.test.ts`
> snapshots every pack × every game with a seeded RNG — the regression net for the
> remaining steps. **Step 3a's acceptance test is that this snapshot does not move.**
>
> **Next: steps 3–5** (schema v2 + codemod, two-axis scoring, factKey dedupe) and
> the content pass. See "The content cost" in the plan: ~2,085 distractors and 417
> claim frames, AI-drafted and human-reviewed, pack by pack.
>
> **Earlier: validator + docs sync (2026-07-15) — done.** `scripts/validate-packs.mjs`
> had drifted: it hardcoded a 4-game list and reported every pack as powering at most
> 4 of the 7 built games, so a pack that failed a newer game's requirements passed
> validation and just silently showed no card. Requirements now live in
> `lib/games/slice-requirements.ts` — a dependency-free module (type-only imports, no
> JSON, no React) that both `slices.ts` and the validator import, so tooling can never
> fall behind the app again. **Keep that module import-free** or the validator breaks.
> `01-MASTER-PLAN.md` was refreshed (its Current State predated four games, the
> library and the retheme); a false "pending commit" note here was cleared — Year 3
> Humanities landed as `8c683d4`.
>
> This surfaced one real content gap: **`maths-y3-multiplication-division` offers 5
> games, not 7** — 15 strategy items (needs 16) and only 2 difficulty-1 items (Summit
> Climb needs 8 easy after backfill). Adding ~2 easy qa/mcq/truefalse items fixes both.
>
> **Next up: Neil is play-testing the 7 games**, then deciding the points system and
> depth-vs-breadth (see 01-MASTER-PLAN Phase 5).
>
> **Earlier: Game UX overhaul (2026-07-12) — done.** All 7 games (the 4
> existing ones + the 3 designed-only games from the prior session) now
> share one layout via `components/shared/GameShell.tsx`: a square-ish game
> area, a vertical `TeamsPanel` sidebar (awarding is always "tap a team
> here"), and a bottom action bar with a plain-English hint strip plus
> fixed-order buttons. Exactly one thing glows at a time (`.next-action` /
> `.next-action--soft` in `globals.css`), a spotlight `TutorialOverlay` runs
> on first play of each game (reopenable via "Show me how"), and the
> library topic page shows games above objectives. Three in a Row, Summit
> Climb and Risk It are now built and playable, not just designed — see
> `Docs/designs/*.md` (status flipped to "built") and the new
> `Docs/flows/{three-in-a-row,summit-climb,risk-it}.md`.
>
> Superseded: **[PROTOTYPE_PLAN.md](./PROTOTYPE_PLAN.md)** (2026-07-11) —
> content top-up to ~20/topic, per-game setup phase, light Kahoot-style
> retheme, dead-code cleanup, flow docs, 3 new game designs. Fully done;
> kept for history.
>
> Context: curated-library pivot (no runtime AI), objectives-first curriculum,
> contained navigation (subjects → year/topics → topic → game), light
> Kahoot-style theme (`app/globals.css` design tokens), **no emojis
> anywhere**, Math Rush = exactly one unknown per card.

---

## DONE — Game UX overhaul (2026-07-12)

- **Shared `GameShell`** (`components/shared/GameShell.tsx`): header (title
  · game name · progress · "Show me how" · Exit), game-area slot, always-
  mounted action buttons in a fixed vocabulary order
  (`show, reveal, correct, incorrect, next, end`) so a button never moves
  between games, and a hint strip that always names the next step.
- **`TeamsPanel`** (`components/shared/TeamsPanel.tsx`): `display | award |
  toggle` modes. Awarding a point is *always* "tap a team in the sidebar" —
  removed Flash Round's old award bar and Math Rush's in-card team picker.
- **`TutorialOverlay`** (`components/shared/TutorialOverlay.tsx`):
  spotlights live `data-tutorial` elements, dims the rest, auto-opens on
  first live question per game (`localStorage['sp-tutorial-<id>']`),
  reopenable any time.
- **`GameOverPanel`** (`components/shared/GameOverPanel.tsx`) replaces 4
  duplicated per-game end screens; deleted `ScoreBoard.tsx`.
- Migrated Flash Round, True/False Showdown, Strategy Board Quiz, Math Rush
  onto the shell. Fixed Strategy Board Quiz topic-chip text clipping
  (measured header height instead of a fixed allowance).
- **3 new games built**: Three in a Row (`three_in_a_row`), Summit Climb
  (`summit_climb`), Risk It (`risk_it`) — templates, content schemas,
  `GAME_SLICES` entries in `lib/games/slices.ts` (incl. a
  `minPerDifficulty` extension for Summit's 8-easy/8-hard requirement),
  registered in `lib/templates/registry.ts`. Host tick-loop guard in
  `app/game/[id]/[templateSlug]/page.tsx` inverted to an allowlist
  (`strategy_board_quiz` only needs it) so new local-state games don't
  start the timer loop.
- Library topic page: games grid now sits above learning objectives.
- Verified in-browser: all 7 games played end-to-end (win conditions,
  scoring, sidebar awarding, tutorial auto-open/reopen); typecheck and
  console clean.

---

## DONE this session (Steps 1, 1.5, 2a, 2b, 2c)

Commits (newest first):
- `4679407` Year 3 English (spelling, grammar & punctuation, reading comprehension)
- `5547e9d` Year 3 Science (plants, animals, rocks, light, forces & magnets)
- `74b5729` validate-packs script + content audit
- `8f7dd12` Visual audit: retheme team colours, board sizing, drop legacy routes
- `8b652ca` Retheme run screens to ink; exit affordances; dev-env fixes
- `8c683d4` Year 3 Humanities (history Stone Age→Iron Age, geography UK)

### Step 1 — small fixes ✅
- ErrorScreen back button → `/library`.
- Exit link added to all four game headers; game-over buttons → `/library`.
- `next.config.mjs` sets `outputFileTracingRoot` to the monorepo root.
- Removed nested `packages/app` lockfile + node_modules (fixed SWC WASM fallback).
- Typecheck clean; verified in browser.

### Step 1.5A — visual/UX audit ✅
- ScoreBoard, game-over cards, Math Rush claim chips / award buttons, SBQ answered
  cells: now dark `surface-alt` with a team-colour border + small swatch (was
  white-on-pale-colour, unreadable on the ink theme).
- GameBoard cell sizing now accounts for container height (board no longer
  overflows the shell); topic headers wrap to two lines instead of truncating.
- Fixed no-op Tailwind classes (`surface-alt` alias added to config;
  `border-color-border`/`bg-color-border` corrected).
- Gold accent buttons use dark text + brightness hover.
- Emoji sweep clean (only a README had a “✓” in prose).
- **Deleted** legacy routes `/generate`, `/create/math-rush`, `/game/[id]` (old AI
  flow; held all the remaining Fredoka/purple theme remnants). Navigation has no
  dead ends now.

### Step 1.5B — content audit + validator ✅
- `scripts/validate-packs.mjs` (`npm run validate-packs`): Zod-parses every pack,
  checks equation arithmetic (fractions handled as rationals), MCQ option
  uniqueness, pack id/filename consistency, board strand fit, and which slices
  each pack powers. All packs pass.
  - NOTE: the Bash tool's cwd sometimes resets to the repo root; if `npm run
    validate-packs` reports "Missing script", `cd packages/app` first.
- Manual read-through of all packs: no wrong answers, no ambiguous MCQs, all items
  answerable on a projector without visuals.

### Step 2a — Year 3 Science ✅ (5 packs, wired into map.ts + loader)
plants, animals-including-humans, rocks, light, forces-magnets. 16–21 items each,
no equations (Math Rush correctly unavailable), 3–4 strands, difficulty 1–3.

### Step 2b — Year 3 English ✅ (3 packs)
spelling, grammar-punctuation, reading-comprehension. Lower-KS2 programme of study
→ objectives use `Y34-*` codes, packs filed under year 3. Added the `english`
SubjectEntry to map.ts.

### Step 2c — Year 3 Humanities ✅ (committed as `8c683d4`)
- `history-y3-stone-age-iron-age` (21 items, 4 strands: Stone/Bronze/Iron Age +
  timeline/evidence).
- `geography-y3-uk` (20 items, 4 strands: countries, capitals, seas/coasts,
  physical features). Chose UK over volcanoes so items stand alone without maps.
- Added `history` + `geography` SubjectEntry to map.ts; registered both in the
  loader. validate-packs + tsc pass; history topic page verified in browser.

---

## Parked / known issues (do not lose)

- **Points system is weak** — Neil flagged; game-level concern, revisit later
  (currently difficulty × 100/150/200 in `lib/games/slices.ts`). Worth settling
  before mass-producing content — retuning across 100+ packs is much harder.
- **`maths-y3-multiplication-division` powers only 5 of 7 games** — 15 strategy
  items (needs 16) and 2 difficulty-1 items (Summit needs 8 easy incl. backfill).
  The only pack with this gap; adding ~2 easy items fixes it.
- Y2 packs (`maths-y2-*`, `science-y2-*`) have no per-item `objectiveCodes` — a
  soft gap the validator does not flag. Backfill when convenient.
- Item ids are reused across packs (e.g. every pack has `eq-1`). Harmless — ids
  only need to be unique within a pack — but worth normalising if it ever confuses.
- localStorage games accumulate (`lib-*` ids); no cleanup yet.
- `packages/visuals` renderers still unused by games — future: visual questions.

## Natural next steps (not started)

- Fill in the remaining Year 3 maths topics still `IN DEVELOPMENT` on the map, and
  the Year 2 topics, if breadth-per-year matters more than more subjects.
- Add Year 4 across the subjects now that the pattern is proven for all six.
- Revisit the points system (parked above) before adding much more content.
