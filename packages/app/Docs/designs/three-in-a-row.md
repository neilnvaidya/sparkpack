# Three in a Row — game design (not yet built)

## Concept

Territory strategy. A 4×4 grid of face-down questions; teams claim cells by
answering correctly, colouring the cell in their team colour. First team
with **three of their cells in a row** (across, down or diagonal) wins — or,
if the grid fills first, the team with the most cells.

**Why it's different:** Strategy Board Quiz is about accumulating points;
Three in a Row is about *position* — teams must choose between building
their own line and blocking an opponent's. Even a team that is behind on
answers can win with one clever block, which keeps everyone in the game.

## Content requirements

- Item kinds: `qa`, `mcq`, `truefalse` (same pool as Board Quiz).
- Minimum: **16 items** (one per cell). Future `GAME_SLICES` entry:
  `{ kinds: ['qa','mcq','truefalse'], min: 16 }`.
- Difficulty mixed randomly across the grid — the tension comes from
  position, not points tiers.

## Flow

1. **Setup** (shared GameSetup screen): rules, 2–4 teams, names, colours.
2. **Turn loop**:
   - The active team picks any unclaimed cell. The question opens with a
     20-second discussion timer (reuse Board Quiz timer).
   - Teacher marks **Correct** (cell fills with the team's colour) or
     **Incorrect** (cell flips back face-down and stays claimable — the
     question is swapped for an unused spare when available).
   - Play passes to the next team either way.
3. **Win check** after every claim: three same-colour cells in a line ends
   the game immediately with a winning-line animation. Full grid with no
   line → most cells wins; ties share the win.

## Teacher controls

Correct / Incorrect, Reveal answer, End game. No steals — misses simply
pass the turn, which keeps rounds fast.

## Screens

Setup → grid (16 face-down cards, team chips + "Team X's turn" banner) →
question overlay with timer → grid updates with colour fill → podium.

## Open questions

- 3×3 variant for a quicker game (min 9 items, 2 teams)?
- Should a wrong answer lock the cell for that team only (prevents
  grinding the same cell)?
- Diagonals on or off for younger classes?
