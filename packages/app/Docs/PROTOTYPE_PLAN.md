# Prototype plan — phased

> Created 2026-07-11. Goal: a full working prototype — every topic playable with
> ~20 questions, a proper per-game setup phase (teams + how-to-play), a light and
> colorful theme (Kahoot as the reference, replacing the dark ink theme), no dead
> code, user-facing flow docs, and three new game designs to review before
> building. Replayability (question variants, bigger banks) stays deferred.
>
> Status legend: [ ] pending · [x] done

## Audit findings driving this plan

- Two Humanities packs (`geography-y3-uk.json`, `history-y3-stone-age-iron-age.json`)
  were wired into the app but uncommitted — a fresh checkout would break.
- 5 of 19 packs under the ~20-question bar: maths-y3-statistics (12),
  maths-y3-geometry-shapes (16), science-y3-rocks (16),
  english-y3-reading-comprehension (17), science-y3-light (19).
- Flow issues: Math Rush never ends (deck reshuffles forever); True/False Showdown
  unavailable on 5 packs with <5 truefalse items.
- Team setup is inert: the store and game page support custom team
  count/names/colors (`settings` → `resolveNumTeams`), but no UI ever writes
  `settings` — every game runs with 4 default "Team N" teams.
- Dead code: unreachable built-in Math Rush problem sets
  (`lib/math-rush/load-problem-sets.ts`, `lib/data/math-rush/*.json`),
  orphan `lib/constants/default-game-content.ts` + `.bak`, unused `steal_correct`
  sound cue, unreachable else-branch in `buildTrueFalse`, stray README in the
  strategy-board-quiz component dir, wasted 100ms tick interval for the two
  local-state games.

## Phase 0 — Housekeeping (unblock git)

- [x] Commit the pending Humanities packs + map/loader/WORKPLAN changes.
- [x] Add this plan doc; point WORKPLAN.md at it.

## Phase 1 — Content top-up (~20 per topic + T/F availability)

Author items per `lib/curriculum/schema.ts` (kinds `equation`/`qa`/`mcq`/`truefalse`,
difficulty 1–3, `objectiveCodes`, unique ids). Validate after each pack.

- [x] maths-y3-statistics +8 (include ≥2 truefalse)
- [x] maths-y3-geometry-shapes +4
- [x] science-y3-rocks +4
- [x] english-y3-reading-comprehension +3
- [x] science-y3-light +1
- [x] Truefalse-only top-ups to unlock True/False Showdown (needs 5):
      maths-y3-measurement +2, maths-y3-addition-subtraction +1,
      maths-y3-fractions +1, english-y3-spelling +1

All 19 packs now have ≥20 items and every pack powers True/False Showdown
(validate-packs green, 2026-07-11).

## Phase 2 — Game flow foundation

- [x] **2a. Setup phase for every game.** Replace the bare "Ready to play?" screen
      with a shared `components/shared/GameSetup.tsx`:
      how-to-play panel (3–5 bullets from a new `howToPlay` field in template
      metadata, `lib/templates/*.ts`); team configuration (2–6 teams, editable
      names, colors from `lib/constants/team-colors.ts`) writing the
      already-supported `settings` before `initializeGame`; then the 3-2-1
      countdown. *Later (not now): session-level team reuse — set up once, reuse
      across games.*
- [x] **2b. Math Rush natural ending.** Total rounds = ceil(deck / 4), capped ~5;
      after the final round "Next round" becomes "Finish" → existing `game_over`
      podium; "Round X of Y" shown in the UI; keep "End game" as early exit.
- [x] **2c. Dead-code cleanup.** Delete the built-in Math Rush problem-set path,
      `default-game-content.ts` + `.bak`, stray README, unreachable
      `buildTrueFalse` branch; play `steal_correct` on steal success (or delete
      the cue); don't start the tick interval for Flash Round / True-False.

## Phase 3 — Light, colorful retheme (Kahoot-inspired)

- [x] Replace the dark ink theme app-wide: light background, bold saturated
      accents, chunky rounded cards, high-contrast large type for the projected
      screen. Kahoot's colored answer tiles / confident color blocking is the
      reference.
- [x] Rework the palette (theme config) and `lib/constants/team-colors.ts` so
      team colors pop on light backgrounds (16 named saturated colours;
      defaults red/blue/orange/green/purple/teal).
- [x] Touch every surface: home, library, topic pages, setup screen, all four
      game runtimes, score boards, timers, podium/game-over. The teacher
      controls strip stays deliberately dark so it reads as "teacher-only".

## Phase 4 — Flow docs + end-to-end verification

- [x] `Docs/flows/`: one short teacher-facing doc per game (strategy-board-quiz,
      math-rush, flash-round, true-false-showdown): who it's for, launching from
      the library, the setup step, the round loop, how it ends. Matches actual
      on-screen labels post-retheme.
- [x] Verify (partial — full playthroughs deferred to Neil): validate-packs +
      typecheck green; setup screen configures teams end-to-end (3 teams +
      custom name reached a live T/F game); Math Rush shows Round X of Y and a
      Finish button on the last round; topped-up statistics pack shows the T/F
      card; home, topic, setup, board, and question screens spot-checked on the
      light theme.
- [ ] Neil: play one full round of each of the 4 games from `/library` to the
      end screen, incl. one non-maths pack.

## Phase 5 — Design docs for 3 new games (no code)

- [x] `Docs/designs/three-in-a-row.md` — territory strategy: 4×4 grid of
      face-down questions (qa/mcq/tf); teams claim cells by answering;
      3-in-a-row wins (or most cells). Blocking tactics instead of points.
- [x] `Docs/designs/summit-climb.md` — difficulty ladder: teams climb a shared
      7-rung mountain; safe (difficulty 1, +1 rung) or risky (difficulty 3, +2,
      slip 1 on a miss). Surfaces per-item `difficulty`.
- [x] `Docs/designs/risk-it.md` — confidence wagering: teams wager Low/Med/High
      before the reveal; right adds the wager, wrong loses it; 10 questions then
      podium.

Each doc: concept + differentiation, item kinds + minimums (future `GAME_SLICES`
entry), screen-by-screen flow including the shared setup phase, teacher controls,
scoring, end condition, open questions.

## Out of scope this pass

- Question variants / bank expansion for replayability.
- Session-level team reuse (noted in 2a as the follow-on).
- Building the 3 new games.
- New packs for `packId: null` topics (Y2 remainder, Y4).
