## Strategy Board Quiz Runtime Overview

This document explains how the **Strategy Board Quiz** game is structured in code, which components are involved, and the key bits of teacher-facing language and gameplay flow. It is intended for developers working on this template and for anyone updating visuals, motion, or sound.

### 1. High-level gameplay structure

The Strategy Board Quiz is a **Jeopardy-style, team-based quiz**:

- Teams take turns **selecting a cell** from a board of topics and point values.
- Selecting a cell reveals a **question card** in the main board area.
- A **discussion timer** runs, then the active team answers.
- If correct, the team scores the points. If incorrect, a **steal phase** lets other teams answer in order.
- When all cells are taken (or the teacher ends the game), a **winner summary** is shown.

Core phases (from `GamePhase` in `lib/store/game-store.ts`):

- `setup` – game created but not yet started.
- `team_selecting` – active team is choosing a question.
- `question_shown` – (reserved) question visible before timers; generally we move directly into discussion.
- `discussion` – Ready/Go pre-countdown, then main countdown for team discussion.
- `answer_waiting` – timer has expired; teacher is waiting for the team’s spoken answer.
- `steal_phase` – other teams in a queue can attempt to answer, each with their own short timer.
- `round_complete` – brief state between questions after scoring/disable.
- `game_over` – all questions exhausted or teacher ends the game; results are shown.

### 2. Main runtime component: `StrategyBoardQuizGame.tsx`

This is the **projector-facing game shell** and the main React runtime for the template.

Responsibilities:

- Lays out the **full-screen shell**: header, central board/card area, and bottom teacher controls bar.
- Connects to the **game store** (`useGameStore`) to read:
  - `phase`, `teams`, `activeTeamIndex`
  - `templateState` (board, selected cell, steal queue)
  - `timer` (discussion/steal timers)
  - `content` (game title and board definition)
- Connects to the **sound store** (`useSoundStore`) for sound effects and mute state.
- Renders:
  - `ScoreBoard` centred in the header with a mute toggle on the right.
  - `GameBoard` in the main area when selecting cells or between rounds.
  - A **question card** _in the same main board space_ during discussion/answer/steal phases.
  - A **game over summary card** once the game ends.
  - The **teacher controls bar** at the bottom with phase label and action buttons.

Key UI behaviours:

- When `phase === 'team_selecting'` or `phase === 'round_complete'`, the central area shows the `GameBoard`.
- When `phase` is one of `discussion`, `answer_waiting`, or `steal_phase` and there is a `selectedCell`, the central area swaps to a **larger question card**:
  - Top row: topic chip, point badge, and a phase strip (“Discussion — Ns”, “Steal — Team”, etc.).
  - Centre: question text.
  - Below: `TimerDisplay` (Ready/Go/countdown) and, optionally, acceptable answers chips.
- On `game_over`, the central area swaps to a **results card** that highlights the winner(s) and shows other team scores.

Teacher-facing language is centralised around:

- The **phase label** (derived from `phase` and `stealTeam`) shown in the teacher bar and phase pill.
- Button labels: “Reveal answers”, “Correct”, “Incorrect”, “Next”, “End game”.
- Short explanatory copy like “Mark correct or incorrect” when no timer is running.

### 3. Supporting components

#### `GameBoard.tsx`

The board of selectable cells.

- Renders **topic headers** and **point cells** using `templateState.board` from the game store.
- Uses `phase` and `cell.state` to determine if cells are selectable:
  - Only **available** cells are clickable, and only during `team_selecting`.
- On click:
  - Plays the `cell_select` sound via `useSoundStore`.
  - Calls `selectCell(row, col)` in the game store, which:
    - Marks the cell `selected`.
    - Enters `discussion` phase and starts the discussion timer.

Visual states that the board is responsible for:

- `available` – default, interactive state.
- `selected` – currently active question.
- `answered` – won by a team (tinted with that team’s colour).
- `disabled` – dead cell (no one scored).

#### `ScoreBoard.tsx`

The team row shown in the header.

- Displays one **team card** per team with:
  - Team name.
  - Score.
- Highlights the **active team** via `activeTeamIndex` from `StrategyBoardQuizGame`.
- In visual spec terms, this is the “team score card” with:
  - Light team tint background.
  - Solid team-colour border.
  - Barlow Condensed for scores; Nunito for names.

#### `TimerDisplay.tsx`

The countdown and Ready/Go stamp used on the question card.

- Accepts a `TimerState` from the store and renders:
  - `Ready!` / `Go!` pre-countdown states.
  - Main numeric countdown.
  - “TIME UP” expired label.
- Knows whether it is in the **pre-countdown window** or main countdown.
- Applies a **warning state** (colour + pulse) when the remaining countdown is low (e.g. ≤ 5 seconds for discussion).

### 4. State & sound stores

#### `lib/store/game-store.ts`

The **authoritative game state machine**.

Key responsibilities:

- Holds all game state:
  - `phase`, `teams`, `activeTeamIndex`, `templateState`, `timer`, `modal`.
- Handles phase transitions:
  - `selectCell` → sets the cell `selected`, enters `discussion`, starts discussion timer.
  - `markCorrect` → awards points to either the active team or the current steal team, marks the cell `answered`, then advances the turn or ends the game.
  - `markIncorrect` → either moves to the next steal team (if already in `steal_phase`) or builds a steal queue and starts the steal timer.
  - `nextStealAttempt` → moves along the steal queue, disables the cell if no one scores, and advances turn or ends the game.
  - `endGame` → sets `phase` to `game_over` and clears timers and modals.
- Drives timers via `tick()`:
  - Updates `remaining`.
  - Computes warning status.
  - Transitions from `discussion` → `answer_waiting` and through steal attempts.

#### `lib/store/sound-store.ts`

The **central sound engine**.

- Stores a `muted` flag and exposes:
  - `toggleMuted()` – toggles global mute (with UI bound to the header icon).
  - `play(id: SoundId)` – plays a sound for game events.
- `SoundId` values map to game events:
  - `cell_select` – board cell chosen.
  - `timer_start` – Ready/Go sequence begins.
  - `correct` – correct answer / points awarded.
  - `incorrect` – incorrect answer / steal phase begins or continues.
  - `game_end` – game over / winner announced.
  - (Optional) `timer_warning`, `steal_correct` can be added to mirror the spec in more detail.

### 5. Teacher-facing language & UX summary

When adjusting copy, keep the following tone and constraints:

- **Audience**: classroom teachers and pupils viewing from the back of the room.
- **Tone**: direct, confident, non-punitive, no jargon.
- **Examples of key phrases**:
  - Phase labels: “Select a question”, “Discussion — Ns”, “Waiting for answer”, “Steal — Team”, “✓ Team scores!”, “Game over!”.
  - Buttons: “Reveal answers” / “Hide answers”, “Correct”, “Incorrect”, “Next”, “End game”.
  - Helper text: “Mark correct or incorrect” when no timer is running.

Language is primarily surfaced in:

- The **phase pill** in the board area.
- The **teacher controls bar** (phase label and buttons).
- The **question card** helper lines.

When in doubt, prioritise:

1. Clarity over cleverness.
2. Brevity over detailed instructions.
3. Consistent wording across states and components.

