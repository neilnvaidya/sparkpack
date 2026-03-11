# Visual & Sound Design Specification
## SparkPack — Strategy Board Quiz

**Version:** 1.0  
**Status:** Approved for implementation  
**Applies to:** All files listed in [Where to look in code](#appendix-where-to-look-in-code)

---

## Design Philosophy

**"Confident Classroom Stage"**

Light, clean surfaces with strong typographic hierarchy and vivid team colours as the primary visual language. The game should feel like a well-produced quiz programme — energetic without being exhausting, clear enough to read across a room, and professional enough that a teacher is proud to project it. No gimmicks, no gradients for their own sake. Every choice earns its place by aiding legibility or communicating game state.

**The three rules everything else follows:**
1. **Legibility first.** If it can't be read from the back of a classroom at a glance, it doesn't ship.
2. **Colour communicates state.** Team colours, phase colours, and cell states must be unambiguous.
3. **Motion confirms, it doesn't decorate.** Animations exist to acknowledge user actions and mark phase transitions — not to add visual interest.

---

## 1. Global Design Tokens

### 1.1 Colour Palette

Define all tokens as CSS custom properties in `app/globals.css`.

```css
:root {
  /* === Base surfaces === */
  --color-bg:           #F5F6FA;   /* Off-white page background */
  --color-surface:      #FFFFFF;   /* Cards, board cells, modals */
  --color-surface-alt:  #EEF0F8;   /* Alternating / inset areas */
  --color-border:       #D1D5E8;   /* Default border */
  --color-border-strong:#9EA6C8;   /* Emphasis border */

  /* === Text === */
  --color-text-primary: #1A1D2E;   /* Headings, body — near-black navy */
  --color-text-muted:   #6B7399;   /* Labels, meta, secondary */
  --color-text-inverse: #FFFFFF;   /* Text on dark/coloured surfaces */

  /* === Accent — one primary accent === */
  --color-accent:       #4F46E5;   /* Indigo — active states, links */
  --color-accent-light: #EEF2FF;   /* Tinted backgrounds */

  /* === Phase / semantic colours === */
  --color-discussion:   #2563EB;   /* Blue — discussion timer */
  --color-discussion-bg:#EFF6FF;
  --color-steal:        #D97706;   /* Amber — steal phase */
  --color-steal-bg:     #FFFBEB;
  --color-correct:      #059669;   /* Emerald — correct answer */
  --color-correct-bg:   #ECFDF5;
  --color-incorrect:    #DC2626;   /* Red — incorrect answer */
  --color-incorrect-bg: #FEF2F2;
  --color-warning:      #DC2626;   /* Timer warning (<= 5s) */

  /* === Team colours (5 total) === */
  /* Each team needs: solid, light tint, text-on-solid */
  --team-1:             #E84545;   /* Coral Red */
  --team-1-light:       #FEE8E8;
  --team-1-text:        #FFFFFF;

  --team-2:             #2563EB;   /* Royal Blue */
  --team-2-light:       #EFF6FF;
  --team-2-text:        #FFFFFF;

  --team-3:             #16A34A;   /* Forest Green */
  --team-3-light:       #F0FDF4;
  --team-3-text:        #FFFFFF;

  --team-4:             #7C3AED;   /* Violet */
  --team-4-light:       #F5F3FF;
  --team-4-text:        #FFFFFF;

  --team-5:             #EA8C00;   /* Amber Orange */
  --team-5-light:       #FFFBEB;
  --team-5-text:        #FFFFFF;
}
```

**Tailwind mapping** — add to `tailwind.config.ts`:

```typescript
colors: {
  bg:      'var(--color-bg)',
  surface: 'var(--color-surface)',
  border:  'var(--color-border)',
  accent:  'var(--color-accent)',
  team: {
    1: 'var(--team-1)',
    2: 'var(--team-2)',
    3: 'var(--team-3)',
    4: 'var(--team-4)',
    5: 'var(--team-5)',
  }
  // etc.
}
```

**Contrast requirements** (WCAG AA minimum, AA+ for projected use):
- All body text on white: ≥ 7:1
- Team colour text on its solid background: ≥ 4.5:1
- Phase bar text on phase colour: ≥ 4.5:1
- Point numbers on cell background: ≥ 5:1

---

### 1.2 Typography

Import via `app/layout.tsx` from Google Fonts.

```typescript
import { Barlow_Condensed, Nunito, DM_Mono } from 'next/font/google'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
})

const body = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})
```

**Font roles:**

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Display** | Barlow Condensed | 800 | Point numbers on board, Ready!/Go!, game title, score totals |
| **Heading** | Nunito | 700–800 | Question text, team names, topic headings |
| **Body** | Nunito | 400–600 | Instructions, acceptable answers, phase labels |
| **Mono** | DM Mono | 400–500 | Teacher controls, timer digits, metadata |

**Why this combination:**
- Barlow Condensed 800 is tall and tight — point numbers read at distance without taking up cell space
- Nunito's rounded forms are friendly for kids without being childish
- DM Mono signals "control panel" to the teacher without creating visual noise

**Scale (CSS custom properties):**

```css
:root {
  --text-xs:   0.75rem;    /* 12px — metadata, labels */
  --text-sm:   0.875rem;   /* 14px — acceptable answers, meta */
  --text-base: 1rem;       /* 16px — body, instructions */
  --text-lg:   1.125rem;   /* 18px — topic headings */
  --text-xl:   1.25rem;    /* 20px — team names, phase label */
  --text-2xl:  1.5rem;     /* 24px — question text (min) */
  --text-3xl:  1.875rem;   /* 30px — question text (default) */
  --text-4xl:  2.25rem;    /* 36px — large labels */
  --text-5xl:  3rem;       /* 48px — score totals */
  --text-6xl:  3.75rem;    /* 60px — point numbers on cells */
  --text-7xl:  4.5rem;     /* 72px — Ready! / Go! stamp */
}
```

---

### 1.3 Spacing & Radius

```css
:root {
  --radius-sm:  0.375rem;  /* 6px  — small chips, tags */
  --radius-md:  0.75rem;   /* 12px — cards, cells */
  --radius-lg:  1rem;      /* 16px — modals, large panels */
  --radius-xl:  1.5rem;    /* 24px — game shell, scoreboard */

  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-cell: 0 2px 8px rgba(0,0,0,0.10);
  --shadow-cell-hover: 0 8px 24px rgba(0,0,0,0.15);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.12);
}
```

---

## 2. Game Shell Layout

### 2.1 Full-Screen Structure

The game occupies the full viewport (`100dvh × 100dvw`). No scrolling. Everything visible at once.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (6vh, min 56px)                                       │
│  [Title — left]        [Scoreboard — centre]   [🔇 — right]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                   GAME BOARD (fills remaining)               │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  TEACHER CONTROLS BAR (8vh, min 64px)                        │
│  [Phase label]          [Action buttons]                     │
└──────────────────────────────────────────────────────────────┘
```

**When a cell is selected**, the board dims and a centred card overlays it (see §4).

### 2.2 Header

```
Background: var(--color-surface)
Border-bottom: 1px solid var(--color-border)
Shadow: 0 1px 0 var(--color-border)
Padding: 0 2rem
```

- **Game title** — Barlow Condensed 700, `--text-2xl`, `--color-text-primary`. Left-aligned.
- **Scoreboard** — Centre, inline team score cards (see §5).
- **Mute button** — Icon button, right-aligned. `🔈 / 🔇`. Muted state: icon desaturates, subtle strikethrough ring.

### 2.3 Teacher Controls Bar

```
Background: var(--color-text-primary)   /* #1A1D2E — intentionally dark */
Color: var(--color-text-inverse)
Padding: 0 2rem
```

The dark bar is a deliberate visual signal: "this section is the teacher's panel, not the students' display." It visually separates controls from content without needing a separate device.

- **Phase label** — DM Mono, `--text-sm`, muted inverse colour (`rgba(255,255,255,0.6)`). Left-aligned.
- **Action buttons** — Right-aligned, see §7 for button specs.

---

## 3. Game Board

### 3.1 Grid Layout

The board fills the available space between header and controls bar with equal padding on all sides (2rem min, auto-expanding).

```
CSS Grid:
  grid-template-columns: repeat(N, 1fr)
  grid-template-rows: auto repeat(R, 1fr)  /* first row = topic headers */
  gap: 0.75rem
  padding: 2rem
```

The first row (`row 0`) is the topic header row, not a playable row.

### 3.2 Topic Header Cells

```
Background: var(--color-surface-alt)
Border: 1px solid var(--color-border)
Border-radius: var(--radius-sm)
Padding: 0.5rem 1rem
```

- **Topic text** — Nunito 700, `--text-lg`, `--color-text-primary`, uppercase, letter-spacing: 0.05em
- No hover state (not interactive)

### 3.3 Point Cells — States

Each cell is square (`aspect-ratio: 1 / 1`). All transitions: `all 180ms ease-out`.

#### State: `available`
```
Background:     var(--color-surface)
Border:         2px solid var(--color-border)
Border-radius:  var(--radius-md)
Shadow:         var(--shadow-cell)
Cursor:         pointer
```
- **Point number** — Barlow Condensed 800, `--text-6xl`, `var(--color-accent)` (`#4F46E5`)
- **Hover:** `transform: scale(1.04)`, `shadow: var(--shadow-cell-hover)`, border-color: `var(--color-accent)`

#### State: `selected` (currently being played)
```
Background:     var(--color-accent-light)
Border:         2px solid var(--color-accent)
Shadow:         0 0 0 4px rgba(79,70,229,0.15)
```
- Point number: `var(--color-accent)`, same size
- Pulse ring animation: see §8.1

#### State: `answered` (team won the cell)
```
Background:     var(--team-N-light)    /* winning team's tint */
Border:         2px solid var(--team-N)
Opacity:        1 (fully visible — team identity stays clear)
```
- Point number replaced by:
  - Team colour swatch dot (12px circle, `var(--team-N)`)
  - Point value — Barlow Condensed 600, `--text-3xl`, `var(--team-N)`, opacity 0.7
- No hover, cursor: default

#### State: `disabled` (all steals failed, no one won)
```
Background:     var(--color-surface-alt)
Border:         1px dashed var(--color-border)
Opacity:        0.4
Cursor:         not-allowed
```
- Point number: `--color-text-muted`, same scale

---

## 4. Question Card (Active Phase Overlay)

When a cell is selected, an overlay appears. The board is still visible beneath (dimmed) so students retain spatial context.

### 4.1 Overlay

```
Position:       fixed inset-0
Background:     rgba(26, 29, 46, 0.55)   /* --color-text-primary at 55% */
Backdrop-filter: blur(2px)
Z-index:        50
```

### 4.2 Card

```
Position:       fixed, vertically centred, horizontally centred
Width:          min(720px, 90vw)
Background:     var(--color-surface)
Border-radius:  var(--radius-xl)
Shadow:         var(--shadow-modal)
Padding:        2.5rem
```

**Card anatomy (top to bottom):**

```
┌─────────────────────────────────────────────────┐
│  [TOPIC CHIP]  [POINT BADGE]         [Phase bar] │
│                                                  │
│                                                  │
│           Question text here                     │
│       (Nunito 700, --text-3xl,                   │
│        centred, line-height 1.35)                │
│                                                  │
│                                                  │
│ ─────────────────────────────────────────────── │
│  Acceptable answers (revealed on demand):        │
│  [answer chip] [answer chip] [answer chip]       │
└─────────────────────────────────────────────────┘
```

**Topic chip:** Nunito 700, `--text-sm`, uppercase, letter-spacing 0.08em, `var(--color-surface-alt)` background, `var(--color-border)` border, `--radius-sm`

**Point badge:** Barlow Condensed 800, `--text-2xl`, `var(--color-accent)`, accent-light background, `--radius-sm`. E.g. `300 pts`

**Phase bar** (top-right of card or below question):
  - Strip, full card width, `--radius-sm`
  - Background and label text change per phase (see §6)

**Question text:**
  - Nunito 700, `--text-3xl` (scales down to `--text-2xl` if >120 chars)
  - Colour: `var(--color-text-primary)`
  - Text-align: center
  - Max-width: 560px, auto margins

**Acceptable answers (hidden by default):**
  - Divider: 1px solid `var(--color-border)`
  - Label: DM Mono `--text-xs`, `--color-text-muted`, "Acceptable answers:"
  - Chips: Nunito 600, `--text-sm`, `var(--color-correct-bg)` background, `var(--color-correct)` border, `--radius-sm`, padding `0.25rem 0.75rem`
  - Revealed by teacher "Reveal answers" button (toggle)

### 4.3 Timer Display (inside card)

Displayed prominently. Three sub-states:

**Ready! / Go! stamp:**
- Full-card-width strip
- Barlow Condensed 800, `--text-7xl`
- "READY!" — neutral (`var(--color-text-primary)` on `var(--color-surface-alt)`)
- "GO!" — `var(--color-discussion-bg)` background, `var(--color-discussion)` text
- Entrance animation: scale 1.3 → 1.0, 200ms ease-out (see §8)

**Countdown:**
- Large centred number: Barlow Condensed 800, `--text-7xl`, `var(--color-discussion)` (blue)
- "seconds" label: DM Mono `--text-sm`, muted, beneath
- Phase label above: DM Mono, `--text-sm`, phase colour

**Warning state (≤ 5s):**
- Number colour → `var(--color-warning)` (`#DC2626`)
- Subtle pulse: `animation: pulse 0.8s ease-in-out infinite`
- No other changes (avoid distraction)

**Steal phase:**
- Same layout, number in `var(--color-steal)` (amber)
- Label: "STEAL — [Team Name]" in steal colour

---

## 5. Scoreboard

### 5.1 Position

Centred in the header bar. Inline row of team score cards.

### 5.2 Team Score Card

```
Background:     var(--team-N-light)
Border:         2px solid var(--team-N)
Border-radius:  var(--radius-md)
Padding:        0.5rem 1rem
Min-width:      120px
```

- **Team name** — Nunito 700, `--text-base`, `var(--team-N)` (the team's own colour)
- **Score** — Barlow Condensed 800, `--text-4xl`, `var(--color-text-primary)`
- **Active team indicator:** Border width increases to 3px + `box-shadow: 0 0 0 3px var(--team-N)` (glow ring). A small triangle/arrow beneath the card points down.

### 5.3 Score Update Animation

When a score changes:
1. Number counts up from old value to new value over 600ms (use `requestAnimationFrame` counter)
2. Card briefly scales to 1.05 and returns: `transform: scale(1.05)`, 200ms, ease-out → ease-in
3. Score number briefly renders in `var(--color-correct)` (green), fades back to primary over 800ms

---

## 6. Phase States Reference

Every phase has a distinct colour signature used in: the phase bar, the teacher controls bar, and any status labels.

| Phase | Label | Colour | Background | Notes |
|---|---|---|---|---|
| `team_selecting` | "Select a question" | `--color-text-muted` | transparent | Board fully interactive |
| `question_shown` | "Question revealed" | `--color-accent` | `--color-accent-light` | Card open, no timer yet |
| `discussion` | "Discussion — Ns" | `--color-discussion` | `--color-discussion-bg` | Blue = thinking time |
| `answer_waiting` | "Waiting for answer" | `--color-accent` | `--color-accent-light` | |
| `steal_phase` | "Steal — [Team]" | `--color-steal` | `--color-steal-bg` | Amber = tension |
| `round_complete` | "✓ [Team] scores!" | `--color-correct` | `--color-correct-bg` | Brief (1s), then auto-advance |
| `game_over` | "Game over!" | `--color-accent` | `--color-accent-light` | Winner reveal |

---

## 7. Buttons — Hierarchy & Specs

Three button tiers. All use Nunito 700, border-radius `var(--radius-md)`, transition `all 140ms ease-out`.

### Primary (correct / main action)
```
Background:   var(--color-correct)
Color:        white
Padding:      0.75rem 1.5rem
Font-size:    --text-lg
```
Hover: background darkens 10%. Active: scale(0.97).

### Destructive (incorrect / end game)
```
Background:   transparent
Border:       2px solid var(--color-incorrect)
Color:        var(--color-incorrect)
Padding:      0.75rem 1.5rem
Font-size:    --text-lg
```
Hover: background `var(--color-incorrect-bg)`. Active: scale(0.97).

### Secondary (reveal answers / skip steal / next turn)
```
Background:   var(--color-surface-alt)
Border:       1px solid var(--color-border)
Color:        var(--color-text-primary)
Padding:      0.625rem 1.25rem
Font-size:    --text-base
```
Hover: background `var(--color-border)`. Active: scale(0.97).

### Disabled state (all button types)
```
Opacity: 0.4
Cursor:  not-allowed
Pointer-events: none
```

---

## 8. Motion Specification

All animations follow one rule: **confirm, don't decorate**. If an animation can be removed without losing information, remove it.

### 8.1 Cell Interactions

```css
/* Hover */
.cell:hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-cell-hover);
  transition: all 180ms ease-out;
}

/* Select (on click) */
@keyframes cell-select {
  0%   { transform: scale(1.04); }
  50%  { transform: scale(0.97); }
  100% { transform: scale(1.0); }
}
.cell--selected {
  animation: cell-select 200ms ease-out forwards;
}

/* Active pulse ring (selected state while card is open) */
@keyframes ring-pulse {
  0%, 100% { box-shadow: 0 0 0 0px rgba(79,70,229,0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(79,70,229,0); }
}
.cell--selected {
  animation: ring-pulse 1.8s ease-in-out infinite;
}
```

### 8.2 Question Card

```css
/* Entry */
@keyframes card-enter {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
.question-card {
  animation: card-enter 220ms ease-out;
}

/* Exit */
@keyframes card-exit {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.97); }
}
```

### 8.3 Ready! / Go! Stamps

```css
@keyframes stamp-in {
  0%   { opacity: 0; transform: scale(1.4); }
  60%  { opacity: 1; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1.0); }
}
.stamp {
  animation: stamp-in 220ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
}
```

### 8.4 Timer Warning Pulse

```css
@keyframes timer-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}
.timer--warning {
  animation: timer-pulse 0.7s ease-in-out infinite;
  color: var(--color-warning);
}
```

### 8.5 Score Update

```css
@keyframes score-flash {
  0%   { color: var(--color-text-primary); }
  20%  { color: var(--color-correct); transform: scale(1.05); }
  100% { color: var(--color-text-primary); transform: scale(1); }
}
.score--updated {
  animation: score-flash 800ms ease-out forwards;
}
```

### 8.6 Game Over

```css
/* Winner card scales up sequentially */
@keyframes winner-reveal {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
/* Stagger each team card by 100ms */
.game-over-card:nth-child(1) { animation: winner-reveal 400ms 0ms   ease-out both; }
.game-over-card:nth-child(2) { animation: winner-reveal 400ms 100ms ease-out both; }
.game-over-card:nth-child(3) { animation: winner-reveal 400ms 200ms ease-out both; }
.game-over-card:nth-child(4) { animation: winner-reveal 400ms 300ms ease-out both; }
.game-over-card:nth-child(5) { animation: winner-reveal 400ms 400ms ease-out both; }
```

The winning team's card gets an additional crown icon (`👑`) and its border glows using its team colour.

### 8.7 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Sound Design Specification

### 9.1 Philosophy

**Warm, musical, classroom-appropriate.** Sounds should feel like a well-produced quiz programme, not an arcade. They confirm events clearly without startling or distracting. Real instrument timbres — light piano, marimba, soft bells — not synthesiser bleeps.

All sounds must be:
- Short (≤ 600ms, except game-end fanfare ≤ 2s)
- Audible but not dominating at typical classroom volume (TV/projector speaker)
- Immediately distinguishable from each other

### 9.2 Sound Events & Specifications

All sounds are synthesised via Web Audio API in `lib/store/sound-store.ts`. Use `OscillatorNode` + `GainNode` with shaped envelopes to approximate warm tones.

#### `cell_select` — Cell chosen by a team
- **Character:** Light, bright, a single soft marimba-like tap
- **Pitch:** E5 (659 Hz)
- **Envelope:** Attack 10ms, Decay 80ms, Sustain 0, Release 120ms
- **Oscillator type:** `triangle` (warmer than sine, softer than square)
- **Duration:** ~220ms
- **Purpose:** Confirms selection without fanfare — the question card appearing is the main event

#### `timer_start` — Ready/Go sequence begins
- **Character:** Two ascending notes, like a starting signal
- **Pitches:** C5 (523 Hz) then G5 (784 Hz), 150ms apart
- **Envelope each note:** Attack 5ms, Decay 60ms, Release 80ms
- **Oscillator type:** `triangle`
- **Duration:** ~380ms total
- **Purpose:** Clear "clock is running" signal

#### `timer_warning` — Last 5 seconds of any timer
- **Character:** Soft, regular tick. Not alarming, just present.
- **Pitch:** A4 (440 Hz), one tick per second for the last 5 seconds
- **Envelope:** Attack 5ms, Decay 40ms, Release 30ms
- **Oscillator type:** `sine`
- **Volume:** 60% of main sounds (subordinate, not distracting)
- **Implementation note:** Trigger from timer tick handler when `timeRemaining <= 5`

#### `correct` — Correct answer, points awarded
- **Character:** Bright ascending three-note chord resolve. Piano-like.
- **Pitches:** C5 → E5 → G5 played in rapid arpeggio (50ms apart), then held briefly together
- **Envelope:** Attack 10ms, Decay 200ms, Sustain 0.3, Release 300ms
- **Oscillator type:** `triangle` with slight `sawtooth` mix (use two oscillators, blend at 80/20)
- **Duration:** ~600ms
- **Purpose:** Unambiguously positive. Kids should feel the reward.

#### `incorrect` — Incorrect answer, steal phase triggered
- **Character:** Short descending two-note figure. Wry, not harsh.
- **Pitches:** G4 (392 Hz) → D4 (294 Hz), 100ms apart
- **Envelope:** Attack 5ms, Decay 120ms, Release 150ms
- **Oscillator type:** `triangle`
- **Duration:** ~370ms
- **Purpose:** Communicates "not quite" — not punishing, but clearly distinct from correct

#### `steal_correct` — Steal answer correct (optional distinction)
- **Character:** Same as `correct` but one octave higher and slightly brighter — more exciting
- **Pitches:** C6 → E6 → G6 (arpeggio)
- **Duration:** ~600ms
- **Purpose:** Stealing feels more exciting than a regular correct. Optional — can map to same sound as `correct` if simpler.

#### `game_end` — Game over, winner declared
- **Character:** A 4-note ascending fanfare. Warm and celebratory, not overpowering.
- **Pitches:** C5 → E5 → G5 → C6, each held 300ms with 50ms overlap
- **Envelope:** Attack 20ms, Decay 400ms, Sustain 0.6, Release 600ms
- **Oscillator type:** `triangle` + `sine` blend (70/30). Add slight vibrato on final note.
- **Duration:** ~1.8s
- **Purpose:** Marks the end clearly. Gives the room a moment to register the winner.

### 9.3 Implementation Pattern

```typescript
// lib/store/sound-store.ts

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.4,
  type: OscillatorType = 'triangle'
) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)

  // Shaped envelope
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}
```

### 9.4 Volume & Mute

- **Default volume:** 0.4 (40% of maximum) — enough for a classroom without overwhelming
- **Mute toggle:** Global boolean in sound store, persisted to `localStorage` key `sparkpack_muted`
- **Mute UI:** Single icon button in game header, top-right corner
  - Unmuted: `🔈` icon, `--color-text-muted` 
  - Muted: `🔇` icon, strikethrough ring, `--color-incorrect` tint
- **No per-sound volume controls in v1**

---

## 10. Accessibility

### Contrast Targets (projected display)

| Element | Foreground | Background | Min ratio |
|---|---|---|---|
| Body text | `#1A1D2E` | `#FFFFFF` | 14.7:1 ✓ |
| Team score text | `#FFFFFF` | team colour | ≥ 4.5:1 (verify per team) |
| Point numbers | `#4F46E5` | `#FFFFFF` | 5.1:1 ✓ |
| Phase labels | phase colour | phase-bg | ≥ 4.5:1 |
| Timer warning | `#DC2626` | `#FFFFFF` | 5.9:1 ✓ |
| Answered cell text | team colour | team-light | verify per team |

### Focus States

All interactive elements must have visible focus rings (keyboard navigation for teacher using laptop):

```css
:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

### Motion

All animations respect `prefers-reduced-motion: reduce` (see §8.7). Functional state changes (cell state, phase label) are never animation-only — they always change colour/text as well.

### Font Size Minimum

No text below `--text-sm` (14px) in any game-active view. Teacher controls may use mono at `--text-xs` only for supplementary metadata.

---

## Appendix: Where to Look in Code

| Design area | File(s) |
|---|---|
| CSS tokens (colours, radius, shadow) | `app/globals.css` |
| Font imports | `app/layout.tsx` |
| Tailwind colour mapping | `tailwind.config.ts` |
| Keyframe animations | `app/globals.css` |
| Game shell, header, controls bar | `components/templates/strategy-board-quiz/StrategyBoardQuizGame.tsx` |
| Board grid, cells | `components/templates/strategy-board-quiz/GameBoard.tsx` |
| Question card, timer | `components/shared/TimerDisplay.tsx` |
| Scoreboard | `components/shared/ScoreBoard.tsx` |
| Sound synthesis | `lib/store/sound-store.ts` |

---

## Appendix: Implementation Priority Order

When implementing, apply in this order to avoid visual instability:

1. **Tokens** — CSS variables + Tailwind config
2. **Fonts** — Import and apply to `body`
3. **Game shell** — Header + controls bar (dark) + grid area
4. **Board cells** — All four states + hover
5. **Scoreboard** — Score cards + active indicator
6. **Question card** — Card shell + phase bar colours
7. **Timer states** — Ready/Go stamps + countdown + warning
8. **Buttons** — Three tiers in teacher controls
9. **Motion** — Animations (cell select, card enter, score flash)
10. **Sound** — Instrument-style synthesis in sound store
11. **Game over** — Staggered reveal + winner highlight
