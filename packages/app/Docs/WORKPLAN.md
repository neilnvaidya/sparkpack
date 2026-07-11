# Workplan — current session state and next steps

> **Active plan: see [PROTOTYPE_PLAN.md](./PROTOTYPE_PLAN.md)** (2026-07-11) —
> content top-up to ~20/topic, per-game setup phase, light Kahoot-style retheme,
> dead-code cleanup, flow docs, 3 new game designs.
>
> Updated 2026-07-11 at end of the execution session.
> Context: curated-library pivot (no runtime AI), objectives-first curriculum,
> contained navigation (subjects → year/topics → topic → game), ink theme
> (`lib/ui/theme.ts`), **no emojis anywhere**, Math Rush = exactly one unknown.

---

## DONE this session (Steps 1, 1.5, 2a, 2b, 2c)

Commits (newest first):
- `4679407` Year 3 English (spelling, grammar & punctuation, reading comprehension)
- `5547e9d` Year 3 Science (plants, animals, rocks, light, forces & magnets)
- `74b5729` validate-packs script + content audit
- `8f7dd12` Visual audit: retheme team colours, board sizing, drop legacy routes
- `8b652ca` Retheme run screens to ink; exit affordances; dev-env fixes
- **PENDING COMMIT**: Year 3 Humanities (history Stone Age→Iron Age, geography UK) —
  files are written and staged; the commit was blocked by a transient safety-
  classifier outage. **Re-run the commit** (see below) when picking this up.

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

### Step 2c — Year 3 Humanities ✅ content, ⚠ commit pending
- `history-y3-stone-age-iron-age` (21 items, 4 strands: Stone/Bronze/Iron Age +
  timeline/evidence).
- `geography-y3-uk` (20 items, 4 strands: countries, capitals, seas/coasts,
  physical features). Chose UK over volcanoes so items stand alone without maps.
- Added `history` + `geography` SubjectEntry to map.ts; registered both in the
  loader. validate-packs + tsc pass; history topic page verified in browser.
- **TO FINISH**: run this commit (files already staged):
  ```
  cd /Users/neilvaidya/Documents/sparkpack
  git commit -m "Add Year 3 Humanities: Stone Age to Iron Age (history) and The UK (geography)"
  ```

---

## Parked / known issues (do not lose)

- **Points system is weak** — Neil flagged; game-level concern, revisit later
  (currently difficulty × 100/150/200 in `lib/games/slices.ts`).
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
