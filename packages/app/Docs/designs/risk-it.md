# Risk It — game design (not yet built)

## Concept

Confidence wagering. Before each question is revealed, every team wagers
part of its bank — **Low (10), Medium (25) or High (50)** — knowing only
the subtopic (e.g. "Fossils"). Then the question appears, every team
answers, and the teacher marks each team right or wrong: right adds the
wager, wrong loses it. Ten questions, then the podium.

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
   Every team starts with a bank of 100.
2. **Question loop** (×10):
   - **Wager stage**: the screen shows only "Question 4 of 10 · Fossils".
     Each team commits Low / Medium / High; the teacher taps each team's
     chip to record it (tap cycles L → M → H).
   - **Answer stage**: the question appears; teams write or say answers.
   - **Reveal**: teacher shows the answer, then toggles each team
     right/wrong (reuses the Showdown multi-team marking pattern). Banks
     update with a +/− flash. A team can never go below 0.
3. **End**: after question 10, podium ranked by bank.

## Teacher controls

Per-team wager chips, Reveal answer, per-team right/wrong toggles, Next,
End game.

## Screens

Setup → wager screen (subtopic + 10-question progress + team wager chips)
→ question screen → reveal + marking → bank update → podium.

## Open questions

- Fixed wagers (10/25/50) or percentage of bank (riskier, harder maths)?
- One "All in" allowed per team per game as a comeback mechanic?
- Should the final question force a minimum Medium wager for drama?
