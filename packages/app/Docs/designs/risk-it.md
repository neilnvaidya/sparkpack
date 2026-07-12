# Risk It — game design (built)

## Concept

Confidence wagering. Before each question is revealed, every team wagers
from its bank — **1, 3 or 5** — knowing only the subtopic (e.g. "Fossils").
Then the question appears, every team answers, and the teacher marks each
team right or wrong: right adds the wager, wrong loses it. Every team starts
with a bank of **10**; a bank can never go below 0. Ten questions, then the
podium. The **final question always forces a wager of 5**.

**Why it's different:** every team plays every question (like True/False
Showdown), but the scoring rewards *knowing what you know*. The wager
moment adds metacognition — "how sure are we about fractions?" — and big
swings keep the game alive to the final question.

## Content requirements

- Item kinds: `qa`, `mcq`, `truefalse` (any mix).
- Minimum: **10 items**. Future `GAME_SLICES` entry:
  `{ kinds: ['qa','mcq','truefalse'], min: 10 }`.
- Uses the item's `strand` as the pre-wager hint, so packs with named
  strands play best (all current packs qualify).

## Flow

1. **Setup** (shared GameSetup screen): rules, 2–6 teams, names, colours.
   Every team starts with a bank of 10.
2. **Question loop** (×10):
   - **Wager stage**: the screen shows only "Question 4 of 10 · Fossils".
     Each team commits 1 / 3 / 5; the teacher taps each team's row in the
     sidebar to record it (tap cycles 1 → 3 → 5). The final question locks
     every wager to 5.
   - **Answer stage**: the question appears; teams write or say answers.
   - **Reveal**: teacher shows the answer, then toggles each team
     right/wrong in the sidebar (reuses the Showdown multi-team marking
     pattern). Banks update on Next. A team can never go below 0.
3. **End**: after question 10, podium ranked by bank.

## Teacher controls

Per-team wager chips, Reveal answer, per-team right/wrong toggles, Next,
End game.

## Screens

Setup → wager screen (subtopic + 10-question progress + team wager chips)
→ question screen → reveal + marking → bank update → podium.

## Resolved decisions

- **Wager values:** point-based **1 / 3 / 5** (not a percentage of bank).
- **Starting bank:** 10, floor 0. No "all in" mechanic — the 5 wager is the
  riskier play.
- **Final question:** always forces a wager of 5 ("everyone risks 5").
