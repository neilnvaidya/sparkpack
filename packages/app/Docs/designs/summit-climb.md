# Summit Climb — game design (not yet built)

## Concept

A difficulty ladder. Every team is a climber on a shared 7-rung mountain
drawn across the screen. On its turn a team chooses its route:

- **Steady path** — an easy question (difficulty 1). Correct: climb 1 rung.
  Wrong: stay put.
- **Risky path** — a hard question (difficulty 3). Correct: climb 2 rungs.
  Wrong: slip **down** 1 rung.

First team to the summit wins.

**Why it's different:** it is the only game that surfaces the per-item
`difficulty` field as a *player choice*. Teams do risk/reward reasoning
("we're one behind — do we gamble?"), and the shared mountain gives a
constant visual of the race that a scoreboard doesn't.

## Content requirements

- Item kinds: `qa`, `mcq`, `truefalse`.
- Minimum: **8 difficulty-1 items and 8 difficulty-3 items** (difficulty-2
  items back-fill either pool if one runs dry). Future `GAME_SLICES` entry
  needs a per-difficulty check, not just a total minimum — a small
  extension to the slice `requires` shape.

## Flow

1. **Setup** (shared GameSetup screen): rules, 2–6 teams, names, colours.
2. **Turn loop**:
   - The active team picks **Steady** or **Risky** (two big buttons).
   - A question of that difficulty appears with the 20-second discussion
     timer; the team answers out loud.
   - Teacher marks Correct / Incorrect; the team's climber animates up (or
     slips down). Play passes to the next team.
3. **Win**: first climber to rung 7 triggers the summit celebration and
   podium (remaining teams ranked by height). Optional cap of ~20 questions
   ends the game at highest-climber-wins if nobody summits.

## Teacher controls

Steady/Risky are chosen by the team but tapped by the teacher; then
Correct / Incorrect, Reveal answer, End game.

## Screens

Setup → mountain view (7 rungs, one coloured climber chip per team, "Team
X's turn — choose your path") → question overlay with a Steady/Risky badge
→ climb/slip animation → summit podium.

## Open questions

- Can a team at rung 0 take the risky path (nothing to lose) — or should
  slipping below 0 cost a skipped turn?
- Show remaining question counts per pool so teachers can pace the game?
- Sudden-death tiebreak if the question cap hits with two leaders level?
