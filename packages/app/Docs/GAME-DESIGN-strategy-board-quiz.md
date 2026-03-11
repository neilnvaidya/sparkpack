# Strategy Board Quiz - Complete Game Design Document

**Version:** 1.0 - MVP  
**Template ID:** `strategy_board_quiz`  
**Category:** Board/Grid Game  
**For:** AI Code Assistant Implementation  

**Note:** See [Current implementation status & design decisions needed](#current-implementation-status--design-decisions-needed) for what is built today and what to specify in a visual/sound design doc before implementation.

---

## Table of Contents

1. [Current implementation status & design decisions needed](#current-implementation-status--design-decisions-needed)
2. [Game Overview](#game-overview)
3. [Visual Specification](#visual-specification)
4. [Game Rules & Mechanics](#game-rules--mechanics)
5. [Data Structures](#data-structures)
6. [State Machine](#state-machine)
7. [UI Components](#ui-components)
8. [Teacher Actions](#teacher-actions)
9. [Content Generation](#content-generation)
10. [Edge Cases](#edge-cases)
11. [Example Gameplay](#example-gameplay)

---

## Current implementation status & design decisions needed

*This section summarizes what is built today and what remains to be decided for a **visual and sound design document**. Use it when creating that design doc or when handing off to a designer.*

### What is implemented (flow and behavior)

- **Create flow:** `/generate` – manual editing only. Title, learning focus, 3–5 teams (names), board preset (3×3, 4×4, 4×5), and per-cell topic, question, acceptable answers. “Load sample 4×4” and “Quick play with defaults” use `lib/constants/default-game-content.ts`.
- **Play flow:** `/game/[id]` – load saved game → Setup screen (“Start game”) → Game. Single full-screen layout: header (title + scoreboard + mute), one enlarged card (phase bar + content + teacher controls).
- **Phases in code:** `team_selecting` → click cell → **discussion** (timer starts immediately). Timer shows **Ready!** (2s) → **Go!** (2s) → **question + countdown** (20s discussion or 5s steal). Then `answer_waiting` (Correct/Incorrect). Incorrect → **steal_phase**: “[Team name] can steal!” above Ready/Go, then same question + 5s countdown; Correct/Incorrect/Next. Round/game-over handling works.
- **Board:** Column topics from row 0; cells show **points only** (100–400). Answered cells show **winning team color**. Compact grid (`max-w-md`), small point text.
- **Teacher controls:** Inside the card: Reveal/Hide answers, Correct, Incorrect, Next (steal), End game. No separate “Start” – selecting a cell starts the timer.
- **Sound:** `lib/store/sound-store.ts` – Web Audio beeps for cell_select, timer_start, correct, incorrect, game_end. Mute toggle in header; no persistence yet.

### Constraints (for any design)

- **Single projected screen** – no student devices; teacher and class share one view.
- **Readable at distance** – typography and contrast must work on a projector/smartboard from the back of the room (e.g. 1920×1080, 3–6 m).
- **Audience** – appealing and clear for **kids**; professional and unobtrusive for **teachers**.
- **Stack** – Next.js, Tailwind, CSS; no mandatory image assets (optional for future branding).

### Visual design decisions needed

Use these when writing the **visual design doc** (or design spec):

- **Global app theme**
  - Palette: background(s), surface variants, primary/accent, text (primary, muted, inverse). Current placeholders: blue/indigo gradients, neutrals, semantic colors in Tailwind.
  - Typography: font family, scale (display / heading / label / meta). Current: system-style sans, mixed sizes; display-style for Ready/Go and question.
  - Spacing and radius: card padding, gaps, border-radius for board and buttons.
- **Game shell (this template)**
  - Header: background (gradient vs solid), title size/weight, scoreboard card style, mute button placement and style.
  - Play card: background, border, shadow; phase bar (background, text size); control strip (background, button hierarchy).
- **Board and cells**
  - Column headings: font size, weight, background chip color, divider or spacing.
  - Point cells: size (current grid is compact), border/radius, colors for available / selected / answered (team color) / disabled. Hover/active animation (scale, shadow).
  - Question view: max width, vertical centering, question text size; “Reveal answers” block style when shown.
- **Motion**
  - Durations and easings for: cell select, Ready/Go appearance, timer countdown, score update pulse, game-over transition. Current: minimal (some transition classes, no formal design).
- **Accessibility**
  - Contrast ratios for text on all backgrounds; focus states; any motion that should be reduced or optional.

### Sound design decisions needed

Use these when writing the **sound design doc** (or sound section of the design doc):

- **Events to support (already wired in code)**
  - Cell selected (team picks a square).
  - Timer started (Ready phase begins – discussion or steal).
  - Correct answer (points awarded).
  - Incorrect answer (steal phase starts).
  - Game over (winner screen).
- **Decisions**
  - Tone and style: chime vs beep vs short melody; playful vs neutral so it doesn’t distract.
  - Volume and length: clearly audible but not dominating; short so it doesn’t delay flow.
  - Mute: global toggle is implemented; whether to persist (e.g. localStorage) and where to show the control (currently in game header).
  - Optional: different sounds for “timer warning” (e.g. last 5 seconds) or “steal correct” vs “normal correct” if you want distinction.

### Where to look in code

- **Theme / tokens:** `app/globals.css`, `tailwind.config.ts` (colors, font sizes, keyframes).
- **Game shell:** `components/templates/strategy-board-quiz/StrategyBoardQuizGame.tsx` (header, card, phase bar, content area, control strip).
- **Board:** `components/templates/strategy-board-quiz/GameBoard.tsx` (column topics, point cells, team colors).
- **Timer:** `components/shared/TimerDisplay.tsx` (Ready/Go/countdown/TIME UP).
- **Scoreboard:** `components/shared/ScoreBoard.tsx` (team cards, active highlight).
- **Sound:** `lib/store/sound-store.ts` (play, mute); calls from `StrategyBoardQuizGame` and `GameBoard`.

Once the design doc is written, implement it in these files and keep this section updated so it stays a quick reference for “what’s implemented” and “what was decided.”

---

## Game Overview

### Concept
A competitive, turn-based classroom quiz where teams strategically select questions from a grid board. Higher-point questions are harder. Wrong answers trigger a steal phase where other teams can claim the points.

### Players
- **3-5 teams** competing simultaneously
- **No student devices** - one projected screen
- **Teacher controls** - marks answers, advances game

### Duration
- **8 minutes:** 3×3 board (9 questions)
- **10 minutes:** 4×4 board (16 questions) ← DEFAULT
- **15 minutes:** 4×5 board (20 questions)

### Win Condition
Highest score when all squares are used or teacher ends game.

---

## Visual Specification

### Screen Layout (1920×1080 target)

```
┌────────────────────────────────────────────────────────────────┐
│                    GAME TITLE                        10% height│
│                  (text-6xl, centered)                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                                                                │
│                   GAME BOARD GRID                              │
│                   (see grid spec below)                        │
│                                                     70% height │
│                                                                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │TEAM RED  │  │TEAM BLUE │  │TEAM GREEN│  │TEAM YELLOW│      │
│  │   450    │  │   600 ★  │  │   300    │  │    0     │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                     Team Score Cards               10% height │
├────────────────────────────────────────────────────────────────┤
│ Phase: Discussion (15s)          [Start Timer] [End Game]     │
│              Teacher Controls Bar (dark)           10% height │
└────────────────────────────────────────────────────────────────┘
```

### Game Board Grid Specification

**4×4 Grid Layout:**

```
┌─────────┬─────────┬─────────┬─────────┐
│ FRUITS  │  VEGS   │ GRAINS  │ PROTEIN │  ← Topic row (text-lg)
│   100   │   100   │   100   │   100   │  ← Points (text-5xl, bold)
└─────────┴─────────┴─────────┴─────────┘
┌─────────┬─────────┬─────────┬─────────┐
│ FRUITS  │  VEGS   │ GRAINS  │ PROTEIN │
│   200   │   200   │   200   │   200   │
└─────────┴─────────┴─────────┴─────────┘
┌─────────┬─────────┬─────────┬─────────┐
│ FRUITS  │  VEGS   │ GRAINS  │ PROTEIN │
│   300   │   300   │   300   │   300   │
└─────────┴─────────┴─────────┴─────────┘
┌─────────┬─────────┬─────────┬─────────┐
│ FRUITS  │  VEGS   │ GRAINS  │ PROTEIN │
│   400   │   400   │   400   │   400   │
└─────────┴─────────┴─────────┴─────────┘
```

**Cell Specifications:**
- **Size:** Square (aspect-ratio: 1)
- **Spacing:** 1rem gap between cells
- **Border:** 4px solid
- **Border radius:** 0.75rem
- **Background:** White (available), Green/10 (answered), Neutral/100 (disabled)
- **Hover:** Scale(1.05), shadow-xl
- **Transition:** All 200ms

**Cell States:**
1. **available** - White background, neutral-300 border, clickable
2. **selected** - Blue-50 background, blue-500 border
3. **answered** - Success/10 background, success border, opacity 50%, disabled
4. **disabled** - Neutral-100 background, neutral-200 border, opacity 30%, disabled

### Question Modal

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│         What is the main purpose of protein?            │
│              (text-3xl, centered)                       │
│                                                         │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ Acceptable answers (teacher only, text-sm):             │
│  [build muscle] [growth] [repair tissue] [protein...]  │
└─────────────────────────────────────────────────────────┘
```

**Modal Specifications:**
- **Position:** Fixed, centered on screen
- **Overlay:** rgba(0,0,0,0.5) backdrop
- **Content:** Max-width 90%, max-height 70%
- **Padding:** 4rem
- **Background:** White
- **Border-radius:** 1rem
- **Z-index:** 50

### Team Score Card

```
┌──────────────────────────────┐
│ TEAM RED              450    │  ← Not active
└──────────────────────────────┘

┌──────────────────────────────┐
│ TEAM BLUE ★           600    │  ← Active (star indicator)
└──────────────────────────────┘ (scale 1.05, ring-4, glow)
```

**Score Card Specifications:**
- **Background:** `bg-team-{color}` (red/blue/green/yellow/purple)
- **Text:** White, text-2xl font-bold
- **Score:** text-5xl font-extrabold
- **Padding:** 1.5rem 2rem
- **Border-radius:** 0.5rem
- **Active state:** Scale 1.05, ring-4 ring-current, shadow-lg
- **Transition:** All 300ms

### Timer Display

**Normal State (>5 seconds):**
```
┌─────────────┐
│     15      │  ← text-6xl, font-extrabold, neutral-900
│   seconds   │  ← text-lg, neutral-600
└─────────────┘
```

**Warning State (<5 seconds):**
```
┌─────────────┐
│      4      │  ← text-warning, pulsing animation
│   seconds   │
└─────────────┘
```

**Expired:**
```
┌─────────────┐
│   TIME UP   │  ← text-error, text-6xl
└─────────────┘
```

**Timer Specifications:**
- **Position:** Fixed top-right (top: 6rem, right: 2rem)
- **Border:** 4px solid (neutral-200 normal, warning color if <5s)
- **Background:** White
- **Padding:** 2rem
- **Border-radius:** 1rem
- **Animation:** Pulse when warning (1s infinite)

### Teacher Controls Bar

```
┌──────────────────────────────────────────────────────────┐
│ Phase: Waiting for Answer                    [End Game] │
│                                                          │
│ [✓ Correct]  [✗ Incorrect]  [Start Timer]              │
└──────────────────────────────────────────────────────────┘
```

**Controls Bar Specifications:**
- **Position:** Fixed bottom
- **Background:** Neutral-900
- **Text:** White
- **Padding:** 1rem 2rem
- **Height:** ~10% of screen
- **Layout:** Flex, space-between

**Button Specifications:**
- **Correct:** bg-success, hover:bg-success/90
- **Incorrect:** bg-error, hover:bg-error/90
- **Start Timer:** bg-neutral-900 (primary)
- **End Game:** variant="outline"
- **Padding:** 0.75rem 1.5rem
- **Font:** text-base, font-semibold
- **Hover:** translateY(-2px), shadow

---

## Game Rules & Mechanics

### Setup Phase

**Before Game Starts:**
1. Teacher configures:
   - Age band (P3-4, P5-6, P7-S2)
   - Skill focus (speaking, reading, vocab, reasoning, teamwork)
   - Number of teams (3-5)
   - Time limit (8, 10, or 15 minutes)
   - Optional: Context text (up to 500 words)

2. AI generates content:
   - Game title
   - 4 topics
   - 9/16/20 questions (based on time)
   - Teacher script
   - Student instructions

3. System initializes:
   - Creates teams with random color assignment
   - Sets all cell states to "available"
   - Randomly selects first active team
   - Sets phase to "team_selecting"

### Turn Sequence (EXACT FLOW)

#### Phase 1: Team Selecting
**State:** `phase = 'team_selecting'`

**What happens:**
- Active team is highlighted (star icon, scale 1.05, glow)
- All "available" cells are clickable
- "answered" and "disabled" cells are greyed out, non-clickable

**User action:**
- Active team chooses one cell by clicking it

**System response:**
- Cell state → "selected"
- Selected cell stored: `{row, col}`
- Phase → "question_shown"
- Modal opens showing question

**Teacher sees:** Question + acceptable answers
**Students see:** Question only

---

#### Phase 2: Question Shown
**State:** `phase = 'question_shown'`

**What happens:**
- Question modal is displayed
- Teacher control shows: [Start Discussion (20s)]

**User action:**
- Teacher clicks "Start Discussion (20s)"

**System response:**
- Phase → "discussion"
- Timer starts: 20 seconds, type: "discussion"
- Timer display appears in top-right

---

#### Phase 3: Discussion
**State:** `phase = 'discussion'`

**What happens:**
- Timer counts down from 20 seconds
- Timer updates every 100ms for smooth display
- When remaining < 5 seconds: timer turns warning color, pulses
- Active team discusses (students manage this, not enforced by system)

**User action:**
- None (wait for timer)

**System response (when timer reaches 0):**
- Timer → "TIME UP" display for 1 second
- Phase → "answer_waiting"
- Timer removed from display

---

#### Phase 4: Answer Waiting
**State:** `phase = 'answer_waiting'`

**What happens:**
- Question modal still displayed
- Teacher controls show: [✓ Correct] [✗ Incorrect]
- Active team gives ONE verbal answer
- Teacher listens and decides

**User action:**
- Teacher clicks **✓ Correct** OR **✗ Incorrect**

**System response if CORRECT:**
- Award points: `teams[activeTeamIndex].score += cell.points`
- Animate score increase (scale pulse)
- Cell state → "answered"
- Phase → "round_complete"
- Close modal
- Wait 1 second, then:
  - Advance turn: `activeTeamIndex = (activeTeamIndex + 1) % teams.length`
  - Phase → "team_selecting"
  - Clear selected cell

**System response if INCORRECT:**
- Build steal queue (all other teams in clockwise order)
- Phase → "steal_phase"
- Start steal timer: 5 seconds, type: "steal"

---

#### Phase 5: Steal Phase
**State:** `phase = 'steal_phase'`

**What happens:**
- Steal queue determines order: 
  - If Team 1 is active: [Team 2, Team 3, Team 4, ...]
  - Current stealing team index: 0 (first in queue)
- 5-second steal timer starts
- Stealing team (not active team) is highlighted
- Teacher controls show: [✓ Correct] [✗ Incorrect] [Skip to Next]

**User action:**
- Stealing team gives ONE verbal answer (no discussion)
- Teacher clicks **✓ Correct** OR **✗ Incorrect** OR **Skip to Next**

**System response if steal CORRECT:**
- Award points to stealing team: `teams[stealQueue[currentIndex]].score += cell.points`
- Animate score increase
- Cell state → "answered"
- Phase → "round_complete"
- Close modal
- **IMPORTANT:** Turn advances in NORMAL order (not to stealing team)
- Wait 1 second, then:
  - Advance turn: `activeTeamIndex = (activeTeamIndex + 1) % teams.length`
  - Phase → "team_selecting"
  - Clear selected cell and steal queue

**System response if steal INCORRECT or SKIP:**
- Move to next steal: `currentStealIndex++`
- If more teams in steal queue:
  - Reset timer: 5 seconds
  - Highlight next stealing team
  - Repeat this phase
- If no more teams in steal queue:
  - Cell state → "disabled"
  - No points awarded
  - Phase → "round_complete"
  - Close modal
  - Wait 1 second, then:
    - Advance turn normally
    - Phase → "team_selecting"
    - Clear selected cell and steal queue

**System response if timer expires:**
- Automatically trigger "INCORRECT" logic above
- Move to next steal attempt

---

#### Phase 6: Round Complete
**State:** `phase = 'round_complete'`

**What happens:**
- Brief pause (1 second) to show score change
- Modal closes
- Selected cell cleared

**System response:**
- After 1 second:
  - Advance turn to next team
  - Phase → "team_selecting"

---

#### Phase 7: Game Over
**State:** `phase = 'game_over'`

**Triggered when:**
1. All cells are in "answered" or "disabled" state (board complete), OR
2. Teacher clicks "End Game" button

**What happens:**
- Display game over modal
- Show final scores (sorted by points)
- Highlight winning team(s)

**Winner determination:**
- Team with highest score wins
- If tied: Teams share victory (all teams with max score)

---

### Critical Rules

#### Turn Order Rule
**RULE:** Turn advances clockwise, ALWAYS in normal order.

**Example:**
- Teams: A, B, C
- Team B is active, answers wrong
- Team C steals successfully
- **Next turn:** Team C (normal order), NOT Team C again

**Rationale:** Prevents stealing team from dominating.

#### Discussion Rule
**RULE:** 20-second discussion is MANDATORY before answer.

**Enforcement:**
- Teacher cannot mark answer until discussion timer expires
- Controls are disabled during discussion phase

#### Steal Order Rule
**RULE:** Steals happen in strict clockwise order from active team.

**Example:**
- Teams: A, B, C, D
- Team B answers wrong
- Steal order: C → D → A
- Each gets 5 seconds, no discussion

#### One Answer Rule
**RULE:** Each team gets exactly ONE answer per opportunity.

**Enforcement:**
- System doesn't track verbal answers
- Teacher enforces: ignores additional answers
- Teacher marking is final

#### No Repeat Selection Rule
**RULE:** Once a cell is "answered" or "disabled", it cannot be selected again.

**Enforcement:**
- Cells in these states are not clickable
- Visual: greyed out, reduced opacity

---

### Difficulty Progression

**Point values correlate to difficulty:**

| Points | Difficulty Level | Example |
|--------|-----------------|---------|
| **100** | Simple recall or basic identification | "Name one fruit high in Vitamin C" |
| **200** | Explanation or examples required | "Why do we need protein in our diet?" |
| **300** | Reasoning, comparison, or application | "If a serving is 2 oz, how many servings in 6 oz?" |
| **400** | Justification, inference, or complex analysis | "Explain why eating only one food group is unhealthy" |

**This progression enables strategy:**
- Safe points (100-200) for confidence
- Risky points (300-400) for competitive advantage
- Board control (denying high-value squares to opponents)

---

## Data Structures

### Game Content (AI-Generated)

```typescript
interface StrategyBoardQuizContent {
  title: string                    // e.g., "Food Groups Challenge"
  learningFocus: string            // e.g., "Understanding balanced nutrition"
  topics: string[]                 // 4 topics, e.g., ["Fruits", "Vegetables", "Grains", "Protein"]
  
  board: {
    rows: number                   // 3, 4, or 4
    cols: number                   // 3, 4, or 5
    pointsPerRow: number[]         // e.g., [100, 200, 300, 400]
    
    cells: Array<{
      topic: string                // Must match one of topics[]
      points: number               // Must match one of pointsPerRow[]
      prompt: string               // The question (answerable orally in <10s)
      acceptableAnswers: string[]  // All valid answer variations (min 1)
    }>
  }
  
  teacherScript: string[]          // 4-5 short instructions for teacher
  studentInstructions: string[]    // 4 numbered steps for students
  fastFinisherExtension: string    // Activity if game ends early
}
```

**Validation Rules:**
- `cells.length === rows × cols` (CRITICAL)
- Every `cell.topic` must be in `topics[]`
- Every `cell.points` must be in `pointsPerRow[]`
- `acceptableAnswers` must have at least 1 entry
- `prompt` must be answerable orally

**Example Cell:**
```json
{
  "topic": "Fruits",
  "points": 200,
  "prompt": "Name two fruits that are high in fiber",
  "acceptableAnswers": [
    "apple and pear",
    "apples and pears",
    "pear and apple",
    "apple, pear",
    "raspberries and blackberries",
    "any berries",
    "prunes and apples"
  ]
}
```

### Runtime Game State

```typescript
interface GameState {
  // Identity
  gameId: string                   // e.g., "game_1234567890"
  templateId: "strategy_board_quiz"
  content: StrategyBoardQuizContent
  
  // Core state
  phase: GamePhase
  activeTeamIndex: number          // Index into teams[]
  teams: Team[]
  
  // Template-specific state
  templateState: {
    board: BoardCell[][]           // 2D array of cells
    selectedCell: {
      row: number
      col: number
    } | null
    stealQueue: number[]           // Team indices in steal order
    currentStealIndex: number      // Current position in steal queue
  }
  
  // Timer state
  timer: TimerState | null
  
  // UI state
  modal: ModalState | null
}

type GamePhase = 
  | 'setup'
  | 'team_selecting'
  | 'question_shown'
  | 'discussion'
  | 'answer_waiting'
  | 'steal_phase'
  | 'round_complete'
  | 'game_over'

interface Team {
  id: string                       // e.g., "team_0"
  name: string                     // e.g., "Team RED"
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  score: number
  order: number                    // Turn order position (0-indexed)
}

interface BoardCell {
  // Content (from AI)
  topic: string
  points: number
  prompt: string
  acceptableAnswers: string[]
  
  // Runtime state
  state: 'available' | 'selected' | 'answered' | 'disabled'
}

interface TimerState {
  type: 'discussion' | 'steal'
  duration: number                 // Total seconds (20 or 5)
  remaining: number                // Seconds remaining
  startedAt: number                // Timestamp (Date.now())
  isActive: boolean
  isWarning: boolean               // true when remaining < 5
}

interface ModalState {
  type: 'question' | 'game_over'
  data: any                        // Question cell or winner data
  visible: boolean
}
```

### Initialization

**Converting AI content to runtime board:**

```typescript
function initializeBoardState(content: StrategyBoardQuizContent): BoardCell[][] {
  const { rows, cols, cells } = content.board
  const board: BoardCell[][] = []
  
  let cellIndex = 0
  for (let row = 0; row < rows; row++) {
    board[row] = []
    for (let col = 0; col < cols; col++) {
      const cell = cells[cellIndex]
      board[row][col] = {
        ...cell,
        state: 'available'
      }
      cellIndex++
    }
  }
  
  return board
}
```

**Creating teams:**

```typescript
function initializeTeams(numTeams: number): Team[] {
  const colors: Team['color'][] = ['red', 'blue', 'green', 'yellow', 'purple']
  const teams: Team[] = []
  
  for (let i = 0; i < numTeams; i++) {
    teams.push({
      id: `team_${i}`,
      name: `Team ${colors[i].toUpperCase()}`,
      color: colors[i],
      score: 0,
      order: i
    })
  }
  
  return teams
}
```

---

## State Machine

### State Diagram

```
[setup]
   ↓ startGame()
[team_selecting]
   ↓ selectCell(row, col)
[question_shown]
   ↓ startDiscussionTimer()
[discussion]
   ↓ timer expires
[answer_waiting]
   ↓ markCorrect() ──────────→ [round_complete] → advance turn → [team_selecting]
   ↓ markIncorrect()
[steal_phase]
   ↓ markCorrect() ──────────→ [round_complete] → advance turn → [team_selecting]
   ↓ markIncorrect() or skip
   ├─ more teams? → stay in [steal_phase], next team
   └─ no teams? ────────────→ [round_complete] → advance turn → [team_selecting]
```

### State Transition Functions

```typescript
// Action: Start game
startGame(): void {
  state.phase = 'team_selecting'
  state.templateState = initializeBoardState(state.content)
}

// Action: Select cell
selectCell(row: number, col: number): void {
  const cell = state.templateState.board[row][col]
  
  // Validation
  if (cell.state !== 'available') return
  
  // Update state
  cell.state = 'selected'
  state.templateState.selectedCell = { row, col }
  state.phase = 'question_shown'
  state.modal = {
    type: 'question',
    data: cell,
    visible: true
  }
}

// Action: Start discussion timer
startDiscussionTimer(): void {
  state.phase = 'discussion'
  state.timer = {
    type: 'discussion',
    duration: 20,
    remaining: 20,
    startedAt: Date.now(),
    isActive: true,
    isWarning: false
  }
}

// Timer tick (called every 100ms)
tick(): void {
  if (!state.timer?.isActive) return
  
  const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000)
  const remaining = Math.max(0, state.timer.duration - elapsed)
  
  state.timer.remaining = remaining
  state.timer.isWarning = remaining < 5
  
  if (remaining === 0) {
    state.timer.isActive = false
    
    if (state.timer.type === 'discussion') {
      state.phase = 'answer_waiting'
      state.timer = null
    } else if (state.timer.type === 'steal') {
      // Auto-advance to next steal or end
      nextStealAttempt()
    }
  }
}

// Action: Mark answer correct
markCorrect(): void {
  const { selectedCell } = state.templateState
  const cell = state.templateState.board[selectedCell.row][selectedCell.col]
  
  if (state.phase === 'answer_waiting') {
    // Active team answered correctly
    state.teams[state.activeTeamIndex].score += cell.points
  } else if (state.phase === 'steal_phase') {
    // Stealing team answered correctly
    const stealingTeamIndex = state.templateState.stealQueue[state.templateState.currentStealIndex]
    state.teams[stealingTeamIndex].score += cell.points
  }
  
  cell.state = 'answered'
  state.phase = 'round_complete'
  state.modal = null
  state.timer = null
  
  // Advance turn after 1 second
  setTimeout(() => {
    state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
    state.phase = 'team_selecting'
    state.templateState.selectedCell = null
    state.templateState.stealQueue = []
    state.templateState.currentStealIndex = 0
  }, 1000)
}

// Action: Mark answer incorrect
markIncorrect(): void {
  if (state.phase === 'answer_waiting') {
    // Active team wrong - start steal phase
    buildStealQueue()
    state.templateState.currentStealIndex = 0
    state.phase = 'steal_phase'
    state.timer = {
      type: 'steal',
      duration: 5,
      remaining: 5,
      startedAt: Date.now(),
      isActive: true,
      isWarning: false
    }
  } else if (state.phase === 'steal_phase') {
    // Current steal failed - try next
    nextStealAttempt()
  }
}

// Helper: Build steal queue
buildStealQueue(): void {
  const stealQueue: number[] = []
  for (let i = 1; i < state.teams.length; i++) {
    const idx = (state.activeTeamIndex + i) % state.teams.length
    stealQueue.push(idx)
  }
  state.templateState.stealQueue = stealQueue
}

// Helper: Move to next steal attempt
nextStealAttempt(): void {
  state.templateState.currentStealIndex++
  
  if (state.templateState.currentStealIndex >= state.templateState.stealQueue.length) {
    // No more steals - nobody gets points
    const { selectedCell } = state.templateState
    const cell = state.templateState.board[selectedCell.row][selectedCell.col]
    cell.state = 'disabled'
    
    state.phase = 'round_complete'
    state.modal = null
    state.timer = null
    
    // Advance turn
    setTimeout(() => {
      state.activeTeamIndex = (state.activeTeamIndex + 1) % state.teams.length
      state.phase = 'team_selecting'
      state.templateState.selectedCell = null
      state.templateState.stealQueue = []
      state.templateState.currentStealIndex = 0
    }, 1000)
  } else {
    // Reset timer for next steal
    state.timer = {
      type: 'steal',
      duration: 5,
      remaining: 5,
      startedAt: Date.now(),
      isActive: true,
      isWarning: false
    }
  }
}

// Action: End game (manual)
endGame(): void {
  state.phase = 'game_over'
  state.timer = null
  
  const winner = calculateWinner(state.teams)
  state.modal = {
    type: 'game_over',
    data: winner,
    visible: true
  }
}

// Helper: Calculate winner
calculateWinner(teams: Team[]): Team[] {
  const maxScore = Math.max(...teams.map(t => t.score))
  return teams.filter(t => t.score === maxScore)
}

// Auto-detect game over
function checkGameOver(): boolean {
  const allCells = state.templateState.board.flat()
  const availableCells = allCells.filter(cell => cell.state === 'available')
  return availableCells.length === 0
}
```

---

## UI Components

### Component Tree

```
<StrategyBoardQuizGame>
  │
  ├─ <GameHeader>
  │   └─ <GameTitle>
  │
  ├─ <GameBoard>
  │   └─ <BoardCell> × (rows × cols)
  │
  ├─ <TeamScoresDisplay>
  │   └─ <TeamScoreCard> × numTeams
  │
  ├─ {timer && <TimerDisplay>}
  │
  ├─ {modal && <QuestionModal>}
  │
  └─ <TeacherControls>
      └─ Phase-specific buttons
```

### Component Specifications

#### `<GameBoard>`
**Props:**
```typescript
interface GameBoardProps {
  board: BoardCell[][]
  onSelectCell: (row: number, col: number) => void
}
```

**Render:**
```typescript
<div className="grid gap-4 p-8" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
  {board.map((row, rowIdx) =>
    row.map((cell, colIdx) => (
      <BoardCell
        key={`${rowIdx}-${colIdx}`}
        cell={cell}
        onClick={() => onSelectCell(rowIdx, colIdx)}
      />
    ))
  )}
</div>
```

#### `<BoardCell>`
**Props:**
```typescript
interface BoardCellProps {
  cell: BoardCell
  onClick: () => void
}
```

**Render:**
```typescript
<button
  onClick={onClick}
  disabled={cell.state !== 'available'}
  className={cn(
    "aspect-square rounded-xl border-4 transition-all",
    "flex flex-col items-center justify-center gap-2",
    cell.state === 'available' && "bg-white border-neutral-300 hover:scale-105 cursor-pointer",
    cell.state === 'answered' && "bg-success/10 border-success opacity-50",
    cell.state === 'disabled' && "bg-neutral-100 border-neutral-200 opacity-30",
    cell.state === 'selected' && "bg-blue-50 border-blue-500"
  )}
>
  <div className="text-neutral-600 text-lg font-medium">{cell.topic}</div>
  <div className="text-5xl font-extrabold text-neutral-900">{cell.points}</div>
</button>
```

#### `<TeamScoreCard>`
**Props:**
```typescript
interface TeamScoreCardProps {
  team: Team
  isActive: boolean
}
```

**Render:**
```typescript
<div
  className={cn(
    "flex justify-between items-center p-6 rounded-lg transition-all",
    `bg-team-${team.color} text-white`,
    "text-2xl font-bold",
    isActive && "scale-105 ring-4 ring-current shadow-xl"
  )}
>
  <span>
    {team.name}
    {isActive && " ★"}
  </span>
  <span className="text-5xl font-extrabold">{team.score}</span>
</div>
```

#### `<TimerDisplay>`
**Props:**
```typescript
interface TimerDisplayProps {
  timer: TimerState
}
```

**Render:**
```typescript
<div
  className={cn(
    "fixed top-24 right-8",
    "flex flex-col items-center justify-center",
    "p-8 rounded-xl border-4 bg-white",
    timer.isWarning ? "border-warning animate-pulse" : "border-neutral-200"
  )}
>
  <div className={cn(
    "text-6xl font-extrabold",
    timer.remaining === 0 ? "text-error" :
    timer.isWarning ? "text-warning" :
    "text-neutral-900"
  )}>
    {timer.remaining === 0 ? "TIME UP" : `${timer.remaining}s`}
  </div>
  <div className="text-lg text-neutral-600 mt-2">
    {timer.type === 'discussion' ? 'Discussion' : 'Steal Attempt'}
  </div>
</div>
```

#### `<QuestionModal>`
**Props:**
```typescript
interface QuestionModalProps {
  prompt: string
  acceptableAnswers: string[]
  visible: boolean
}
```

**Render:**
```typescript
<Dialog open={visible}>
  <DialogContent className="max-w-4xl">
    <div className="text-center space-y-8 p-8">
      <p className="text-3xl font-semibold text-neutral-900 leading-relaxed">
        {prompt}
      </p>
      
      {/* Teacher only */}
      <div className="text-sm text-neutral-600 border-t pt-4">
        <div className="font-semibold mb-2">Acceptable answers (teacher only):</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {acceptableAnswers.map((answer, idx) => (
            <span key={idx} className="bg-neutral-100 px-3 py-1 rounded">
              {answer}
            </span>
          ))}
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

#### `<TeacherControls>`
**Props:**
```typescript
interface TeacherControlsProps {
  phase: GamePhase
  onStartTimer: () => void
  onCorrect: () => void
  onIncorrect: () => void
  onEndGame: () => void
}
```

**Render:**
```typescript
<div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-white p-4">
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    <div className="text-sm">
      <span className="text-neutral-400">Phase:</span>{' '}
      <span className="font-semibold">{formatPhase(phase)}</span>
    </div>
    
    <div className="flex gap-3">
      {phase === 'question_shown' && (
        <Button onClick={onStartTimer}>Start Discussion (20s)</Button>
      )}
      
      {(phase === 'answer_waiting' || phase === 'steal_phase') && (
        <>
          <Button onClick={onCorrect} className="bg-success hover:bg-success/90">
            ✓ Correct
          </Button>
          <Button onClick={onIncorrect} className="bg-error hover:bg-error/90">
            ✗ Incorrect
          </Button>
        </>
      )}
      
      <Button onClick={onEndGame} variant="outline">End Game</Button>
    </div>
  </div>
</div>
```

---

## Teacher Actions

### Action Map by Phase

| Phase | Available Actions | Result |
|-------|------------------|--------|
| `team_selecting` | End Game | → `game_over` |
| `question_shown` | Start Discussion (20s), End Game | → `discussion` |
| `discussion` | (Wait for timer), End Game | Auto → `answer_waiting` |
| `answer_waiting` | ✓ Correct, ✗ Incorrect, End Game | → `round_complete` or `steal_phase` |
| `steal_phase` | ✓ Correct, ✗ Incorrect, Skip, End Game | → `round_complete` or next steal |
| `round_complete` | (none - automatic) | Auto → `team_selecting` |
| `game_over` | (none - game ended) | - |

### Button States

```typescript
// Example logic for enabling/disabling buttons
const buttonStates = {
  startTimer: phase === 'question_shown',
  markCorrect: phase === 'answer_waiting' || phase === 'steal_phase',
  markIncorrect: phase === 'answer_waiting' || phase === 'steal_phase',
  endGame: phase !== 'game_over'
}
```

---

## Content Generation

### AI Prompt Structure

**System context:**
```
You are generating content for a classroom game called "Strategy Board Quiz".

GAME MECHANICS (FIXED - DO NOT MODIFY):
- Teams take turns selecting questions from a grid
- Higher point questions must be harder
- Teams get 20s discussion before answering
- Wrong answers trigger steal phase (5s, no discussion)
- First correct steal wins the points

YOUR JOB: Generate questions only.
```

**Parameters:**
```
Age band: {ageBand}
Skill focus: {skillFocus}
Number of teams: {numTeams}
Time limit: {timeMinutes} minutes
Board size: {rows}×{cols}

{if contextText provided:}
CONTENT CONTEXT:
{contextText}

Base all questions on this content.
```

**Difficulty instructions:**
```
DIFFICULTY PROGRESSION (CRITICAL):
- 100 points: Simple recall or basic identification
  Example: "Name one fruit high in Vitamin C"
  
- 200 points: Explanation or examples required
  Example: "Why do we need protein in our diet?"
  
- 300 points: Reasoning, comparison, or application
  Example: "If a serving is 2 oz, how many servings in 6 oz?"
  
- 400 points: Justification, inference, or complex analysis
  Example: "Explain why eating only one food group is unhealthy"
```

**Output format:**
```
OUTPUT FORMAT: Return JSON only, no markdown.

{
  "title": "Short, engaging title",
  "learningFocus": "One sentence learning goal",
  "topics": ["topic1", "topic2", "topic3", "topic4"],
  "board": {
    "rows": {rows},
    "cols": {cols},
    "pointsPerRow": [100, 200, 300, 400],
    "cells": [
      {
        "topic": "topic1",
        "points": 100,
        "prompt": "Question text (answerable orally in <10s)",
        "acceptableAnswers": ["answer1", "answer2", "variation1"]
      }
      // ... {rows × cols} cells total
    ]
  },
  "teacherScript": [
    "Short instruction 1",
    "Short instruction 2",
    "Short instruction 3",
    "Short instruction 4"
  ],
  "studentInstructions": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4"
  ],
  "fastFinisherExtension": "Challenge activity if board ends early"
}
```

**Validation constraints:**
```
CRITICAL RULES:
1. cells.length MUST equal rows × cols
2. Each cell.topic MUST match one of topics[]
3. Each cell.points MUST match one of pointsPerRow[]
4. acceptableAnswers MUST include all reasonable variations
5. Questions MUST be answerable orally (no writing/drawing)
6. Higher point rows MUST be noticeably harder
```

### Example Generated Content

```json
{
  "title": "Food Groups Challenge",
  "learningFocus": "Understanding food groups and balanced nutrition",
  "topics": ["Fruits", "Vegetables", "Grains", "Protein"],
  "board": {
    "rows": 4,
    "cols": 4,
    "pointsPerRow": [100, 200, 300, 400],
    "cells": [
      {
        "topic": "Fruits",
        "points": 100,
        "prompt": "Name one fruit that is high in Vitamin C",
        "acceptableAnswers": ["orange", "oranges", "kiwi", "kiwis", "strawberry", "strawberries", "lemon", "lemons"]
      },
      {
        "topic": "Vegetables",
        "points": 100,
        "prompt": "Name a green vegetable",
        "acceptableAnswers": ["broccoli", "spinach", "lettuce", "peas", "green beans", "kale", "cabbage"]
      },
      {
        "topic": "Grains",
        "points": 100,
        "prompt": "Name one type of bread",
        "acceptableAnswers": ["white bread", "brown bread", "whole wheat", "wholemeal", "baguette", "rolls"]
      },
      {
        "topic": "Protein",
        "points": 100,
        "prompt": "Name one food from the protein group",
        "acceptableAnswers": ["chicken", "beef", "fish", "eggs", "beans", "tofu", "nuts"]
      },
      
      {
        "topic": "Fruits",
        "points": 200,
        "prompt": "Why are fruits important in our diet?",
        "acceptableAnswers": ["vitamins", "they have vitamins", "nutrients", "fiber", "healthy", "energy"]
      },
      {
        "topic": "Vegetables",
        "points": 200,
        "prompt": "What nutrients do vegetables provide?",
        "acceptableAnswers": ["vitamins", "minerals", "fiber", "nutrients"]
      },
      {
        "topic": "Grains",
        "points": 200,
        "prompt": "Give an example of a whole grain food",
        "acceptableAnswers": ["brown rice", "whole wheat bread", "oatmeal", "quinoa", "whole grain pasta"]
      },
      {
        "topic": "Protein",
        "points": 200,
        "prompt": "Why do we need protein?",
        "acceptableAnswers": ["build muscle", "muscles", "growth", "repair", "strength", "build body"]
      },
      
      {
        "topic": "Fruits",
        "points": 300,
        "prompt": "If one serving of fruit is 80 grams, how many servings is 240 grams?",
        "acceptableAnswers": ["3", "three", "3 servings", "three servings"]
      },
      {
        "topic": "Vegetables",
        "points": 300,
        "prompt": "Compare carrots and potatoes - which food group does each belong to?",
        "acceptableAnswers": ["carrots vegetables potatoes grains", "carrot veg potato grain", "vegetables and grains"]
      },
      {
        "topic": "Grains",
        "points": 300,
        "prompt": "What is the difference between white bread and brown bread?",
        "acceptableAnswers": ["brown has more fiber", "whole grain", "more nutrients in brown", "white is processed"]
      },
      {
        "topic": "Protein",
        "points": 300,
        "prompt": "Name two different sources of protein - one from animals and one from plants",
        "acceptableAnswers": ["chicken and beans", "fish and lentils", "beef and tofu", "eggs and nuts"]
      },
      
      {
        "topic": "Fruits",
        "points": 400,
        "prompt": "Explain why eating a variety of fruits is better than eating just one type",
        "acceptableAnswers": ["different vitamins", "different nutrients", "variety of nutrients", "balance"]
      },
      {
        "topic": "Vegetables",
        "points": 400,
        "prompt": "Why should we eat vegetables from different colors?",
        "acceptableAnswers": ["different nutrients", "different vitamins", "variety", "balanced diet"]
      },
      {
        "topic": "Grains",
        "points": 400,
        "prompt": "Explain why whole grains are healthier than refined grains",
        "acceptableAnswers": ["more fiber", "more nutrients", "keeps you full", "better nutrition", "less processed"]
      },
      {
        "topic": "Protein",
        "points": 400,
        "prompt": "Why would eating only protein and no other food groups be unhealthy?",
        "acceptableAnswers": ["need balance", "missing vitamins", "need all groups", "unbalanced", "need variety"]
      }
    ]
  },
  "teacherScript": [
    "Each team chooses one question from the board.",
    "Start the twenty-second discussion timer.",
    "One student gives the team's answer.",
    "If wrong, other teams can steal with five seconds each."
  ],
  "studentInstructions": [
    "Choose a question from the board as a team.",
    "Discuss quietly for twenty seconds.",
    "One person gives your team's answer.",
    "Listen for chances to steal points."
  ],
  "fastFinisherExtension": "Create a balanced meal plan using foods from all four groups and explain why your choices are healthy."
}
```

---

## Edge Cases

### Edge Case 1: Timer Expires During Discussion
**Scenario:** 20-second discussion timer reaches 0.

**Expected behavior:**
- Timer shows "TIME UP" for 1 second
- Automatically transitions to `answer_waiting` phase
- Timer removed from display
- Teacher controls show [✓ Correct] [✗ Incorrect]

**Implementation:**
```typescript
// In tick() function
if (remaining === 0 && timer.type === 'discussion') {
  timer.isActive = false
  setTimeout(() => {
    phase = 'answer_waiting'
    timer = null
  }, 1000)
}
```

---

### Edge Case 2: Timer Expires During Steal
**Scenario:** 5-second steal timer reaches 0.

**Expected behavior:**
- Automatically treat as incorrect answer
- Move to next stealing team
- Reset timer to 5 seconds
- If no more teams, disable cell and advance turn

**Implementation:**
```typescript
if (remaining === 0 && timer.type === 'steal') {
  timer.isActive = false
  nextStealAttempt()
}
```

---

### Edge Case 3: All Steals Fail
**Scenario:** Active team wrong, all other teams wrong in steal phase.

**Expected behavior:**
- Cell becomes `disabled` (grey, no points awarded)
- Turn advances to next team
- Game continues

**Implementation:**
```typescript
// In nextStealAttempt()
if (currentStealIndex >= stealQueue.length) {
  cell.state = 'disabled'
  phase = 'round_complete'
  // Advance turn normally
}
```

---

### Edge Case 4: Last Cell Selected
**Scenario:** Only one cell remains, team selects it.

**Expected behavior:**
- Normal gameplay through answer/steal
- After cell resolved, check if board empty
- If empty, transition to `game_over`

**Implementation:**
```typescript
// After turn advance in round_complete
const availableCells = board.flat().filter(c => c.state === 'available')
if (availableCells.length === 0) {
  phase = 'game_over'
  endGame()
}
```

---

### Edge Case 5: Teacher Ends Game Early
**Scenario:** Teacher clicks "End Game" during active play.

**Expected behavior:**
- Immediately transition to `game_over`
- Show final scores
- Determine winner(s)

**Implementation:**
```typescript
endGame(): void {
  phase = 'game_over'
  timer = null
  modal = {
    type: 'game_over',
    data: calculateWinner(teams),
    visible: true
  }
}
```

---

### Edge Case 6: Multiple Teams Tied for First
**Scenario:** Game ends with 2+ teams having the same highest score.

**Expected behavior:**
- All tied teams declared winners
- Display message: "Team RED and Team BLUE win!"

**Implementation:**
```typescript
function calculateWinner(teams: Team[]): Team[] {
  const maxScore = Math.max(...teams.map(t => t.score))
  return teams.filter(t => t.score === maxScore)
}

// In game over modal
if (winners.length > 1) {
  message = `${winners.map(t => t.name).join(' and ')} win!`
} else {
  message = `${winners[0].name} wins!`
}
```

---

### Edge Case 7: Team Clicks Disabled Cell
**Scenario:** Team tries to click a cell that's already answered/disabled.

**Expected behavior:**
- Nothing happens
- Cell is not clickable (disabled attribute)
- Visual: Cell is greyed out

**Implementation:**
```typescript
<button disabled={cell.state !== 'available'}>
```

---

### Edge Case 8: AI Generates Invalid Content
**Scenario:** AI returns JSON with wrong cell count or missing fields.

**Expected behavior:**
- Zod validation catches error
- Retry generation (max 2 retries)
- If still failing, return error to user
- User can try again with different parameters

**Implementation:**
```typescript
try {
  const validated = StrategyBoardQuizContentSchema.parse(aiOutput)
  return validated
} catch (error) {
  if (retryCount < 2) {
    return generateWithRetry(params, retryCount + 1)
  }
  throw new Error('Failed to generate valid content after 2 attempts')
}
```

---

## Example Gameplay

### Complete Game Walkthrough (4 Teams, 3×3 Board)

**Setup:**
- Teams: RED (0), BLUE (0), GREEN (0), YELLOW (0)
- Board: 3×3 (9 cells)
- First team: GREEN (randomly selected)

---

**Turn 1: Team GREEN**

1. Phase: `team_selecting`
2. GREEN selects "Fruits - 100"
3. Phase: `question_shown`
   - Modal shows: "Name one fruit high in Vitamin C"
4. Teacher clicks "Start Discussion (20s)"
5. Phase: `discussion`
   - Timer: 20s → 19s → ... → 1s → 0s
6. Phase: `answer_waiting`
7. GREEN answers: "Orange"
8. Teacher clicks [✓ Correct]
9. GREEN score: 0 → 100
10. Cell "Fruits - 100" → `answered`
11. Phase: `round_complete`
12. After 1s, turn advances to YELLOW

**Scores:** RED: 0, BLUE: 0, GREEN: 100, YELLOW: 0

---

**Turn 2: Team YELLOW**

1. Phase: `team_selecting`
2. YELLOW selects "Protein - 300"
3. Phase: `question_shown`
   - Modal: "Name two different protein sources - one animal, one plant"
4. Teacher starts timer
5. Discussion: 20s
6. Phase: `answer_waiting`
7. YELLOW answers: "Chicken and rice"
8. Teacher clicks [✗ Incorrect] (rice is grain, not protein)
9. Phase: `steal_phase`
   - Steal queue: [RED, BLUE, GREEN]
   - Current: RED (5s timer starts)
10. RED answers: "Chicken and beans"
11. Teacher clicks [✓ Correct]
12. RED score: 0 → 300
13. Cell "Protein - 300" → `answered`
14. Phase: `round_complete`
15. Turn advances to RED (normal order, NOT RED again)

**Scores:** RED: 300, BLUE: 0, GREEN: 100, YELLOW: 0

---

**Turn 3: Team RED**

1. Phase: `team_selecting`
2. RED selects "Vegetables - 200"
3. Question shown
4. Discussion: 20s
5. RED answers: "Spinach has iron"
6. Teacher clicks [✓ Correct]
7. RED score: 300 → 500
8. Turn advances to BLUE

**Scores:** RED: 500, BLUE: 0, GREEN: 100, YELLOW: 0

---

**Turn 4: Team BLUE**

1. Phase: `team_selecting`
2. BLUE selects "Grains - 400"
3. Question: "Explain why whole grains are healthier than refined grains"
4. Discussion: 20s
5. BLUE answers: "They taste better"
6. Teacher clicks [✗ Incorrect]
7. Steal phase:
   - GREEN (5s): "More fiber" → Teacher [✓ Correct]
   - GREEN score: 100 → 500
8. Turn advances to GREEN

**Scores:** RED: 500, BLUE: 0, GREEN: 500, YELLOW: 0

---

**Turn 5: Team GREEN**

1. GREEN selects "Fruits - 200"
2. Question: "Why are fruits important?"
3. Discussion: 20s
4. GREEN answers: "Vitamins"
5. Teacher [✓ Correct]
6. GREEN score: 500 → 700
7. Turn advances to YELLOW

**Scores:** RED: 500, BLUE: 0, GREEN: 700, YELLOW: 0

---

**Turns 6-9:** Continue until all 9 cells used

**Final Scores:** RED: 500, BLUE: 300, GREEN: 700, YELLOW: 200

**Winner:** Team GREEN (700 points)

---

## Implementation Checklist

Before marking this game complete:

### Content Schema
- [ ] Zod schema defined
- [ ] Validation enforces rows × cols = cells.length
- [ ] All required fields present
- [ ] Acceptable answers array has min 1 entry

### State Management
- [ ] All 7 phases defined
- [ ] State transitions implemented
- [ ] Timer tick function works
- [ ] Turn advancement correct
- [ ] Steal queue builds properly
- [ ] Score updates animate

### UI Components
- [ ] GameBoard renders grid correctly
- [ ] BoardCell shows all states (available/selected/answered/disabled)
- [ ] TeamScoreCard highlights active team
- [ ] TimerDisplay counts down, shows warning
- [ ] QuestionModal displays question + answers
- [ ] TeacherControls show correct buttons per phase

### Game Logic
- [ ] Cell selection works
- [ ] Discussion timer expires correctly
- [ ] Correct answer awards points
- [ ] Incorrect answer triggers steal
- [ ] Steal order is clockwise
- [ ] Steal timer expires correctly
- [ ] All steals failing disables cell
- [ ] Turn advances after round complete
- [ ] Game over detected when board empty

### Teacher Actions
- [ ] Start timer button works
- [ ] Correct button awards points
- [ ] Incorrect button triggers steal
- [ ] End game button works
- [ ] Buttons disabled when not applicable

### Edge Cases
- [ ] Timer expiry handled
- [ ] All steals fail handled
- [ ] Last cell selected handled
- [ ] Multiple winners handled
- [ ] Disabled cells not clickable
- [ ] Invalid AI content retries

### Testing
- [ ] Play complete game with test data
- [ ] Test all phases transition correctly
- [ ] Test steal phase with 3-5 teams
- [ ] Test timer expiry
- [ ] Test game over conditions
- [ ] Test UI on 1920×1080 display
- [ ] Verify readable from 6 meters

---

## Summary for AI Code Assistant

**This is the complete specification for Strategy Board Quiz.**

**Key points:**
1. **Fixed mechanics** - All game rules are non-negotiable
2. **AI generates content only** - Questions, answers, topics
3. **Teacher controls** - Marks answers, manages flow
4. **No student devices** - Single projected screen
5. **Deterministic state machine** - Clear phase transitions
6. **Code-only visuals** - Tailwind CSS, no assets needed

**Build order:**
1. Define data structures
2. Implement state machine
3. Build UI components
4. Connect teacher controls
5. Test with fixture data
6. Add AI generation

**Critical files:**
- `lib/schemas/strategy-board-quiz.ts` - Content schema
- `lib/store/game-store.ts` - State management
- `components/templates/strategy-board-quiz/` - UI components
- `app/api/generate-game/route.ts` - AI generation

Follow this specification exactly. All rules, timings, and behaviors are intentional and classroom-tested.
