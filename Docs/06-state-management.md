# State Management & Game Engine

## Overview

The game runtime uses a deterministic state machine to manage game flow, ensuring predictable behavior and testable logic.

---

## State Management Approach

### Tool: Zustand

**Why Zustand:**
- Lightweight (<1KB)
- No boilerplate
- Works with React 18+
- Easy to test
- No context provider needed

**Alternative:** React Context (if you prefer built-in solution)

---

## Core State Structure

### Game Store

```typescript
interface GameStore {
  // Identity
  gameId: string
  templateId: string
  content: GameContent
  
  // Game State
  phase: GamePhase
  activeTeamIndex: number
  teams: Team[]
  
  // Template-specific state
  templateState: any  // Varies by template
  
  // Timer state
  timer: TimerState | null
  
  // UI state
  modal: ModalState | null
  
  // Actions
  actions: GameActions
}
```

### Team Model

```typescript
interface Team {
  id: string
  name: string
  color: TeamColor
  score: number
  order: number  // Turn order position
}

type TeamColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple'
```

### Timer State

```typescript
interface TimerState {
  type: 'discussion' | 'steal'
  duration: number      // Total duration in seconds
  remaining: number     // Remaining seconds
  startedAt: number    // Timestamp
  isActive: boolean
  isWarning: boolean   // true when remaining < 5
}
```

### Modal State

```typescript
interface ModalState {
  type: 'question' | 'result' | 'game_over'
  data: any
  visible: boolean
}
```

---

## State Machine: Strategy Board Quiz

### Game Phases

```typescript
type GamePhase =
  | 'setup'              // Initial state
  | 'team_selecting'     // Active team choosing square
  | 'question_shown'     // Question displayed
  | 'discussion'         // Discussion timer active
  | 'answer_waiting'     // Waiting for team answer
  | 'steal_phase'        // Steal attempts in progress
  | 'round_complete'     // Points awarded, moving to next
  | 'game_over'          // All squares used or manual end
```

### Phase Transitions

```
setup
  ↓ [start game]
team_selecting
  ↓ [select cell]
question_shown
  ↓ [start timer]
discussion
  ↓ [timer expires]
answer_waiting
  ↓ [mark correct] → round_complete
  ↓ [mark incorrect] → steal_phase
steal_phase
  ↓ [steal correct] → round_complete
  ↓ [all steals fail] → round_complete
round_complete
  ↓ [advance turn] → team_selecting
  ↓ [board empty] → game_over
```

### Template-Specific State

```typescript
interface StrategyBoardState {
  board: BoardCell[][]
  selectedCell: {row: number, col: number} | null
  stealQueue: number[]  // Team indices in steal order
  currentStealIndex: number
}

interface BoardCell {
  topic: string
  points: number
  prompt: string
  acceptableAnswers: string[]
  state: 'available' | 'selected' | 'answered' | 'disabled'
}
```

---

## Store Implementation

### Creating the Store (Zustand)

```typescript
// lib/store/game-store.ts

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface GameStore {
  // State
  gameId: string
  templateId: string
  content: GameContent
  phase: GamePhase
  activeTeamIndex: number
  teams: Team[]
  templateState: any
  timer: TimerState | null
  modal: ModalState | null
  
  // Actions
  startGame: () => void
  selectCell: (row: number, col: number) => void
  startDiscussionTimer: () => void
  markCorrect: () => void
  markIncorrect: () => void
  nextStealAttempt: () => void
  endGame: () => void
  tick: () => void  // Timer tick
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    gameId: '',
    templateId: '',
    content: null,
    phase: 'setup',
    activeTeamIndex: 0,
    teams: [],
    templateState: null,
    timer: null,
    modal: null,
    
    // Actions
    startGame: () => {
      set(state => {
        state.phase = 'team_selecting'
        // Initialize template-specific state
        if (state.templateId === 'strategy_board_quiz') {
          state.templateState = initializeBoardState(state.content)
        }
      })
    },
    
    selectCell: (row, col) => {
      set(state => {
        const cell = state.templateState.board[row][col]
        if (cell.state !== 'available') return
        
        state.templateState.selectedCell = {row, col}
        state.phase = 'question_shown'
        state.modal = {
          type: 'question',
          data: cell,
          visible: true
        }
      })
    },
    
    startDiscussionTimer: () => {
      set(state => {
        state.phase = 'discussion'
        state.timer = {
          type: 'discussion',
          duration: 20,
          remaining: 20,
          startedAt: Date.now(),
          isActive: true,
          isWarning: false
        }
      })
    },
    
    markCorrect: () => {
      set(state => {
        const { selectedCell } = state.templateState
        const cell = state.templateState.board[selectedCell.row][selectedCell.col]
        
        // Award points
        state.teams[state.activeTeamIndex].score += cell.points
        
        // Disable cell
        cell.state = 'answered'
        
        // Move to next phase
        state.phase = 'round_complete'
        state.timer = null
        state.modal = null
        
        // Advance turn
        setTimeout(() => {
          set(s => {
            s.activeTeamIndex = (s.activeTeamIndex + 1) % s.teams.length
            s.phase = 'team_selecting'
            s.templateState.selectedCell = null
          })
        }, 1000)
      })
    },
    
    markIncorrect: () => {
      set(state => {
        // Build steal queue
        const stealQueue = []
        for (let i = 1; i < state.teams.length; i++) {
          const idx = (state.activeTeamIndex + i) % state.teams.length
          stealQueue.push(idx)
        }
        
        state.templateState.stealQueue = stealQueue
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
      })
    },
    
    nextStealAttempt: () => {
      set(state => {
        state.templateState.currentStealIndex++
        
        if (state.templateState.currentStealIndex >= state.templateState.stealQueue.length) {
          // No more steals - disable cell
          const { selectedCell } = state.templateState
          const cell = state.templateState.board[selectedCell.row][selectedCell.col]
          cell.state = 'disabled'
          
          state.phase = 'round_complete'
          state.timer = null
          
          // Advance turn
          setTimeout(() => {
            set(s => {
              s.activeTeamIndex = (s.activeTeamIndex + 1) % s.teams.length
              s.phase = 'team_selecting'
              s.templateState.selectedCell = null
            })
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
      })
    },
    
    endGame: () => {
      set(state => {
        state.phase = 'game_over'
        state.timer = null
        state.modal = {
          type: 'game_over',
          data: calculateWinner(state.teams),
          visible: true
        }
      })
    },
    
    tick: () => {
      set(state => {
        if (!state.timer?.isActive) return
        
        const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000)
        const remaining = Math.max(0, state.timer.duration - elapsed)
        
        state.timer.remaining = remaining
        state.timer.isWarning = remaining < 5
        
        // Timer expired
        if (remaining === 0) {
          state.timer.isActive = false
          
          if (state.timer.type === 'discussion') {
            state.phase = 'answer_waiting'
            state.timer = null
          } else if (state.timer.type === 'steal') {
            // Auto-advance to next steal or end
            get().nextStealAttempt()
          }
        }
      })
    }
  }))
)
```

---

## Game Initialization

### Setup Flow

```typescript
// When game page loads
function initializeGame(gameId: string, gameData: GeneratedGame) {
  const store = useGameStore.getState()
  
  // Set basic info
  store.gameId = gameId
  store.templateId = gameData.templateId
  store.content = gameData.content
  
  // Initialize teams
  const teamColors: TeamColor[] = ['red', 'blue', 'green', 'yellow', 'purple']
  const teams: Team[] = []
  
  for (let i = 0; i < gameData.numTeams; i++) {
    teams.push({
      id: `team_${i}`,
      name: `Team ${teamColors[i].toUpperCase()}`,
      color: teamColors[i],
      score: 0,
      order: i
    })
  }
  
  // Randomize first team
  const firstTeam = Math.floor(Math.random() * teams.length)
  
  store.teams = teams
  store.activeTeamIndex = firstTeam
  
  // Start game
  store.startGame()
  
  // Start timer loop
  startTimerLoop()
}

function startTimerLoop() {
  setInterval(() => {
    useGameStore.getState().tick()
  }, 100)  // Check every 100ms for smooth countdown
}
```

---

## Selectors (Derived State)

```typescript
// Get active team
export const useActiveTeam = () => {
  return useGameStore(state => 
    state.teams[state.activeTeamIndex]
  )
}

// Get current stealing team
export const useCurrentStealTeam = () => {
  return useGameStore(state => {
    if (state.phase !== 'steal_phase') return null
    const idx = state.templateState.stealQueue[
      state.templateState.currentStealIndex
    ]
    return state.teams[idx]
  })
}

// Get available cells count
export const useAvailableCells = () => {
  return useGameStore(state => {
    if (!state.templateState?.board) return 0
    return state.templateState.board
      .flat()
      .filter(cell => cell.state === 'available')
      .length
  })
}

// Get sorted teams by score
export const useLeaderboard = () => {
  return useGameStore(state => 
    [...state.teams].sort((a, b) => b.score - a.score)
  )
}

// Check if game is over
export const useIsGameOver = () => {
  return useGameStore(state => {
    if (state.phase === 'game_over') return true
    if (!state.templateState?.board) return false
    
    const availableCells = state.templateState.board
      .flat()
      .filter(cell => cell.state === 'available')
    
    return availableCells.length === 0
  })
}
```

---

## Timer Management

### Timer Hook

```typescript
export function useTimer() {
  const timer = useGameStore(state => state.timer)
  const tick = useGameStore(state => state.tick)
  
  // Update every 100ms while active
  useEffect(() => {
    if (!timer?.isActive) return
    
    const interval = setInterval(tick, 100)
    return () => clearInterval(interval)
  }, [timer?.isActive, tick])
  
  return timer
}
```

### Timer Display Logic

```typescript
function formatTime(seconds: number): string {
  if (seconds <= 0) return 'TIME UP'
  return `${seconds}s`
}

function getTimerColor(timer: TimerState): string {
  if (timer.remaining === 0) return 'text-error'
  if (timer.isWarning) return 'text-warning'
  return 'text-neutral-900'
}

function shouldPulse(timer: TimerState): boolean {
  return timer.isWarning && timer.isActive
}
```

---

## Action Logging (Optional)

For debugging and testing:

```typescript
// Wrap store with devtools
import { devtools } from 'zustand/middleware'

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set, get) => ({
      // ... store implementation
    })),
    { name: 'GameStore' }
  )
)

// Log all actions
const originalSet = set
set = (...args) => {
  console.log('Action:', args)
  return originalSet(...args)
}
```

---

## Persistence (Future)

For saving game state (not in v1):

```typescript
import { persist } from 'zustand/middleware'

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      // ... store implementation
    })),
    {
      name: 'game-storage',
      partialize: (state) => ({
        // Only persist these fields
        gameId: state.gameId,
        teams: state.teams,
        phase: state.phase,
        templateState: state.templateState
      })
    }
  )
)
```

---

## Testing State Machine

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from './game-store'

describe('Strategy Board Quiz State Machine', () => {
  beforeEach(() => {
    // Reset store
    useGameStore.setState({
      phase: 'setup',
      teams: [
        { id: 'team_0', name: 'Team RED', color: 'red', score: 0, order: 0 },
        { id: 'team_1', name: 'Team BLUE', color: 'blue', score: 0, order: 1 }
      ],
      activeTeamIndex: 0
    })
  })
  
  test('starts game in team_selecting phase', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.startGame()
    })
    
    expect(result.current.phase).toBe('team_selecting')
  })
  
  test('correct answer awards points and advances turn', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.startGame()
      result.current.selectCell(0, 0)  // Select 100-point question
      result.current.markCorrect()
    })
    
    expect(result.current.teams[0].score).toBe(100)
    expect(result.current.phase).toBe('round_complete')
  })
  
  test('incorrect answer triggers steal phase', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.startGame()
      result.current.selectCell(0, 0)
      result.current.markIncorrect()
    })
    
    expect(result.current.phase).toBe('steal_phase')
    expect(result.current.templateState.stealQueue).toHaveLength(1)
  })
  
  test('successful steal awards points to stealing team', () => {
    const { result } = renderHook(() => useGameStore())
    
    act(() => {
      result.current.startGame()
      result.current.selectCell(0, 0)
      result.current.markIncorrect()
      result.current.markCorrect()  // Steal succeeds
    })
    
    expect(result.current.teams[1].score).toBe(100)  // Team 1 stole
  })
})
```

---

## Debugging Tips

### View Store State

```typescript
// In React DevTools Console
window.gameStore = useGameStore.getState()

// Then access:
gameStore.phase
gameStore.teams
gameStore.templateState
```

### Log State Changes

```typescript
useGameStore.subscribe(
  (state) => state.phase,
  (phase, prevPhase) => {
    console.log(`Phase: ${prevPhase} → ${phase}`)
  }
)
```

### Reset Game

```typescript
function resetGame() {
  useGameStore.setState({
    phase: 'setup',
    activeTeamIndex: 0,
    teams: useGameStore.getState().teams.map(t => ({...t, score: 0})),
    templateState: null,
    timer: null,
    modal: null
  })
}
```

---

## Performance Considerations

### Avoid Unnecessary Re-renders

```typescript
// Bad: Subscribes to entire store
const store = useGameStore()

// Good: Subscribe only to needed state
const phase = useGameStore(state => state.phase)
const activeTeam = useGameStore(state => state.teams[state.activeTeamIndex])
```

### Batch Updates

```typescript
// Immer automatically batches, but be mindful:
set(state => {
  state.teams[0].score += 100
  state.phase = 'round_complete'
  state.timer = null
  // All updated in one render
})
```

### Memoize Selectors

```typescript
export const useAvailableCells = () => {
  return useGameStore(
    state => {
      if (!state.templateState?.board) return 0
      return state.templateState.board
        .flat()
        .filter(cell => cell.state === 'available')
        .length
    },
    shallow  // Only re-render if value changes
  )
}
```

---

## State Management Checklist

Before finalizing a template's state management:

- [ ] All phases defined in state machine
- [ ] Clear transitions between phases
- [ ] Actions properly update state
- [ ] Timer logic tested
- [ ] Selectors optimize re-renders
- [ ] Edge cases handled (empty board, timer expiry)
- [ ] Game can be reset
- [ ] State is serializable (for future persistence)
- [ ] Unit tests cover critical paths
- [ ] DevTools integration works
