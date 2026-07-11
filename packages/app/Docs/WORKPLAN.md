# Workplan — current session state and next steps

> Written 2026-07-11 mid-task so work can resume with fresh context.
> Prior context: curated-library pivot (no runtime AI), objectives-first curriculum,
> contained navigation (subjects → year/topics → topic → game), ink theme
> (`lib/ui/theme.ts`), **no emojis anywhere**, Math Rush = exactly one unknown.
> Last commit: `4122978`. Everything below in "Step 1 — done" is **uncommitted**.

---

## Step 1: small fixes (IN PROGRESS)

### Done (uncommitted, needs verification)

- **globals.css rethemed to ink** — shadcn `:root` tokens now dark; game tokens
  (`--color-bg`, `--color-surface`, semantic phase colours) switched from the old
  light palette to ink (`#101014` bg, `#e8b64c` accent). `.sbq-teacher-bar`
  changed from dark-on-light to surface-alt + border.
- **Run page screens rethemed** ([app/game/[id]/[templateSlug]/page.tsx](../app/game/%5Bid%5D/%5BtemplateSlug%5D/page.tsx)) —
  `SparkScreen`/`LoadingScreen`/`ErrorScreen`/`SetupScreen` rewritten in ink
  (purple gradient, Fredoka font, shimmer, particles all removed). Setup screen
  now links "Back to Library" → `/library`.

### Remaining

1. **ErrorScreen onBack still wrong** — button now says "Back to Library" but the
   handler in `GameRunPage` still does `router.push('/game/${gameId}')`. Change to
   `/library`.
2. **Exit affordance during gameplay** (the original complaint — no way back to main):
   - [MathRushGame.tsx](../components/templates/math-rush/MathRushGame.tsx): add a
     quiet "Exit" link (→ `/library`) in the header next to the Sound button; in the
     game-over card, replace the `/create/math-rush` and `/generate` buttons with
     "Back to Library" (keep Home).
   - [StrategyBoardQuizGame.tsx](../components/templates/strategy-board-quiz/StrategyBoardQuizGame.tsx):
     same — header Exit link; game-over "Create new game" (→ `/generate`) becomes
     "Back to Library".
   - [FlashRoundGame.tsx](../components/templates/flash-round/FlashRoundGame.tsx) and
     [TrueFalseShowdownGame.tsx](../components/templates/true-false/TrueFalseShowdownGame.tsx):
     have "Back to Library" only on the finish screen; add a small header "Exit" link too.
3. **Dev-environment warnings from Neil's logs**:
   - Duplicate lockfile: delete `packages/app/package-lock.json` AND
     `packages/app/node_modules` (nested install), reinstall from root. (There is
     also a stray `~/package-lock.json` in Neil's home dir — his to remove, mention it.)
   - Corrupted SWC binary (`@next/swc-darwin-arm64` "load command content extends
     beyond end of file", falls back to WASM): fixed by the reinstall above; verify
     with `node -e "require('.../next-swc.darwin-arm64.node')"`.
   - Workspace-root warning: create `packages/app/next.config.mjs` with
     `outputFileTracingRoot` pointing at the monorepo root.
   - NOTE: Bash was intermittently blocked this session; these commands were
     **not run yet**.
4. **Typecheck + verify in browser** (launch config `.claude/launch.json` name `app`),
   then commit Step 1.

## Step 1.5: REVIEW PASS (new — added at Neil's request)

A deliberate audit step before building more content. Two halves:

### A. Visual/UX consistency audit

Walk every screen in the browser (home → library → subject → topic → each of the
4 games → setup/loading/error screens → game over) and check:

- **Color contrast**: the two old games (Math Rush, Strategy Board Quiz) were built
  for a light theme; the global tokens are now dark. Look specifically for:
  light-on-light or dark-on-dark text (e.g. `text-white` on `--color-surface-alt`,
  team-color chips with white text on pale team colours, `sbq-point-badge`,
  phase pills, modal/question-card backgrounds, shadcn Button variants on dark).
  Check `components/shared/ScoreBoard.tsx`, `TimerDisplay.tsx`, `GameBoard.tsx`,
  and `components/ui/*` under the new tokens.
- **Stray old-theme remnants**: purple/yellow/cream hex values, Fredoka font refs,
  `--yellow`/`--orange`/`--pink` vars, rounded-pill buttons that clash with the
  ink style. `grep -rn "Fredoka\|FFE234\|FF7A1A\|FF3D77\|3B1F5E\|FFF8E7" packages/app`.
- **Emoji sweep**: `grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]'` over
  app/components/lib — must return nothing.
- **Navigation dead ends**: every screen must have a way back; `/generate` and
  `/create/math-rush` are legacy (delinked but still routable) — decide: leave or delete.

### B. Content sanity audit (all 9 packs in `lib/curriculum/packs/`)

- **Questions that don't make sense**: read every item aloud-test — is the prompt
  answerable as worded on a projector without visuals? (e.g. statistics items
  describe charts in words — check they stand alone.)
- **Answer correctness**: arithmetic is already script-verified for `equation`
  items; manually re-check `qa`/`mcq`/`truefalse` answers, and that no MCQ has two
  defensible options.
- **Board-quiz fit**: for each pack, does the strand → column grouping produce a
  sensible board (2–4 columns, difficulty ramps down each column)? Equations have
  no strand — confirm they're excluded from boards as intended.
- **Objective wording**: check pack `objectives[]` against the actual DfE
  programmes of study (Neil can supply documents; NC 2014). Fix any paraphrase drift.
- Consider promoting the arithmetic-check script into `scripts/validate-packs.mjs`
  (`npm run validate-packs`): Zod-parse every pack + equation arithmetic + MCQ
  correctIndex + duplicate-id + contrast of item counts vs. slice minimums.

## Step 2: build wide — Year 3 across subjects (NOT STARTED)

Order per Neil: **science first (finish it), then English, then humanities**.
Same year level (Y3) so he can compare how different subjects play.

### 2a. Year 3 Science (5 packs, NC units)

Topics already stubbed in [lib/curriculum/map.ts](../lib/curriculum/map.ts) with
`packId: null` — build packs and set the ids:

1. `science-y3-plants` — Plants (functions of parts; requirements for life;
   water transport; life cycle: pollination, seed formation, dispersal)
2. `science-y3-animals-including-humans` — nutrition; skeletons and muscles
3. `science-y3-rocks` — rock types/comparison; fossils; soil
4. `science-y3-light` — light/dark; reflection; sun safety; shadows
5. `science-y3-forces-magnets` — contact forces; magnets, poles, attraction/repulsion

Pack pattern (follow `maths-y3-*`): statutory objectives verbatim, ~18–24 items,
mixed `qa`/`mcq`/`truefalse` (science has no equations → Math Rush unavailable,
expected), 3–4 strands per pack so Strategy Board Quiz gets good columns,
difficulty 1–3 spread, `objectiveCodes` on every item.

### 2b. Year 3 English (after science is finished)

NC English is programme-of-study for **Years 3–4 combined** (lower KS2) — mark
objectives accordingly (codes like `Y34-...`), packs still filed under year 3.
Suggested topics (add a `english` years entry to map.ts; subject label/accent
already exist in `lib/ui/theme.ts` + map):
- Spelling (App 1 rules: prefixes un/dis/mis/re, suffixes, homophones)
- Vocabulary, Grammar and Punctuation (App 2: word classes, conjunctions,
  a/an, inverted commas, paragraphs)
- Reading comprehension / word meaning (synonyms, idioms, dictionary skills)

### 2c. Year 3 Humanities

History and Geography are KS2-wide with school-chosen units; pick the common Y3 ones:
- `history-y3-stone-age-iron-age` — Changes in Britain from Stone Age to Iron Age
- `geography-y3-uk` or volcanoes/earthquakes — pick one, confirm with Neil if unsure
Add `history`/`geography` SubjectEntry to map.ts (accents already defined).

### 2d. After content: run the Step 1.5 content audit on the new packs, verify
each new subject in the browser end-to-end, then commit per subject.

## Parked / known issues (do not lose)

- **Points system is weak** — Neil flagged; game-level concern, revisit later
  (currently difficulty × 100/150/200 in `lib/games/slices.ts`).
- Y3 maths objective wording still needs checking against DfE docs (part of 1.5B).
- Old `/generate` editor and `/create/math-rush` still exist, delinked.
- localStorage games accumulate (`lib-*` ids); no cleanup yet.
- `packages/visuals` renderers still unused by games — future: visual questions.
