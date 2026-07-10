# Sounds & Naming: Board Quiz Game

Reference for all audio required for the Jeopardy-style board quiz and naming options that evoke the format without using the trademarked name.

---

## 1. Sounds & music required

All sounds are **event-based** (no background music in the current spec). Implemented in `lib/store/sound-store.ts` via Web Audio API; design details in `Docs/09-visual-sound-design.md` §9.

### 1.1 Sound events (in code order)

| Sound ID         | When it plays                          | Status in app                    |
|-----------------|----------------------------------------|----------------------------------|
| **cell_select** | Team clicks a board cell               | ✅ Used – `GameBoard.tsx` on cell click |
| **timer_start** | Discussion or steal timer starts (Ready/Go) | ✅ Used – `StrategyBoardQuizGame` when timer starts with pre-countdown |
| **timer_warning** | Last 5 seconds of any timer (one tick/sec) | ✅ Used – `StrategyBoardQuizGame` when `remaining ≤ 5` and in countdown |
| **correct**     | Teacher marks answer correct           | ✅ Used – Correct button in teacher bar |
| **incorrect**   | Teacher marks answer incorrect          | ✅ Used – Incorrect button; triggers steal phase |
| **steal_correct** | Correct answer **during steal phase**  | ⚠️ Implemented in store, **not triggered** – UI always plays `correct` |
| **game_end**    | Phase becomes `game_over` (winner declared) | ✅ Used – `StrategyBoardQuizGame` on phase transition to game_over |

### 1.2 Optional / future

- **Theme / sting** – Short “game show” theme (e.g. 3–5 s) on setup or when game loads. Not in current spec; could be added as a single play-once asset.
- **Background ambience** – Very low-level room/audience hum. Not in spec; likely unnecessary for classroom.

### 1.3 Wiring suggestion

- **steal_correct:** When the teacher clicks “Correct” and `phase === 'steal_phase'`, call `playSound('steal_correct')` instead of `playSound('correct')` so steal wins feel distinct.

---

## 1.4 Generation prompts (for AI / sound-design tools)

Copy-paste descriptions for each sound. Target: classroom quiz game, projector/TV playback, warm and clear — not arcade, not harsh.

**Format:** Use as the main prompt; add your tool’s usual length/format constraints (e.g. “Under 1 second”, “WAV 44.1kHz”).

---

**cell_select**  
*Single short confirmation when a team picks a question on the board.*

A single soft, bright tap — like one marimba or xylophone note. Warm and light, not a beep or click. Confirms a choice without fanfare. Duration about 0.2–0.25 seconds. No tail or reverb. Suitable for a family-friendly quiz show.

---

**timer_start**  
*Starter cue when the discussion or steal countdown begins (like “Go!”).*

Two ascending notes, like a gentle starting signal: low then higher, 0.15–0.2 seconds apart. Piano or marimba tone, warm and clear. Feels like “ready, set, go” — the clock is running. Total length under 0.5 seconds. Not alarming, not synthetic.

---

**timer_warning**  
*Repeating tick for the last 5 seconds of a countdown.*

A single soft tick, repeated once per second (you only need one tick; the app plays it every second). Gentle pulse, like a quiet metronome or soft wood block. Subtle and non-jarring so it doesn’t distract. Duration of one tick about 0.1–0.15 seconds. Neutral tone, not scary or urgent.

---

**correct**  
*Teacher marks the team’s answer as correct; points awarded.*

A short, positive resolution — ascending three-note figure (e.g. low–mid–high) that resolves clearly. Piano or marimba, warm and rewarding. Unambiguously “yes, that’s right.” Duration about 0.5–0.6 seconds. Feels like a small win, suitable for a classroom.

---

**incorrect**  
*Teacher marks the answer wrong; steal phase may start.*

A short, gentle “not quite” — two descending notes, slightly wry but not harsh or punishing. No failure sting or buzz. Clear enough that it’s different from the correct sound. Duration about 0.35–0.4 seconds. Piano or soft mallet tone.

---

**steal_correct**  
*A team gets it right during the steal round (other teams had it wrong).*

Same character as the correct sound but a bit more exciting — slightly higher register or brighter tone. Short ascending resolve, maybe one octave higher or with a little extra sparkle. Duration about 0.5–0.6 seconds. Still warm and classroom-appropriate, not a fanfare.

---

**game_end**  
*Game over; winner(s) announced.*

A short celebratory fanfare: four ascending notes (e.g. low → mid → high → highest), warm and positive. Piano, bells, or soft brass — not blaring. Feels like “and the winner is…” — clear end of the game. Duration about 1.5–2 seconds. No vocals. Family-friendly quiz show style.

---

## 2. Game name (Jeopardy-style, no trademark)

The template is currently **“Strategy Board Quiz”** (id: `strategy_board_quiz`, slug: `strategy-board-quiz`). Below are options that read as “board of topics/points, pick a cell, answer, steal” without using “Jeopardy”.

### 2.2 Shortlist

| Name               | Pros                                      | Cons                          |
|--------------------|-------------------------------------------|-------------------------------|
| **Grid Quiz**      | Clear, neutral, describes the grid        | Doesn’t highlight steal      |
| **Quiz Grid**      | Same as above, “quiz” first                | Same                          |
| **Topic Grid**     | Emphasises topics/categories              | Less “quiz” in the name      |
| **Board Quiz**     | Simple, “board” + “quiz”                  | Very generic                  |
| **Point Board**    | Highlights points-per-cell                | “Point” can mean score       |
| **Steal Board**   | Highlights steal mechanic                 | “Steal” might sound negative |
| **Category Quiz**  | Strong category/topic vibe (like the show) | Slightly long                 |
| **Pick a Square**  | Very literal, kid-friendly               | A bit plain                  |
| **Spark Board**    | Ties to SparkPack                         | Brand-heavy                  |

### 2.3 Recommended directions

- **Neutral / descriptive:** **Grid Quiz** or **Quiz Grid** – good default display name.
- **Category/topic emphasis:** **Category Quiz** or **Topic Grid**.
- **Mechanic emphasis:** **Steal Board** if you want to lean on the steal round.
- **Brand tie-in:** **Spark Board** if you want the game name to reference SparkPack.

If you pick one, we can:
- Set the template `name` (and optionally adjust `description`) in `lib/templates/strategy-board-quiz.ts`.
- Keep `id` and `slug` as-is for URLs/storage, or rename them consistently (e.g. `grid_quiz` / `grid-quiz`) and update any references.

---

## 3. Where names appear

- **Template name:** `lib/templates/strategy-board-quiz.ts` → `name`, `description`
- **Game selector:** `app/game/[id]/page.tsx` shows `template.name` and `template.description`
- **In-game title:** `StrategyBoardQuizGame` uses `content?.title ?? 'Strategy Board Quiz'` (game-specific title from content, fallback = template name)
- **Docs/README:** Various; update after renaming if you want consistency
