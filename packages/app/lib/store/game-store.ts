/**
 * Game state store – Zustand + Immer, phase machine, template state.
 * @see Docs/06-state-management.md
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { StrategyBoardQuizContent } from '@/lib/templates/strategy-board-quiz'
import type { TeamColorId } from '@/lib/constants/team-colors'
import { DEFAULT_TEAM_COLORS } from '@/lib/constants/team-colors'

/** Template-validated content; shape depends on template. */
export type GameContent = unknown

export type GamePhase =
  | 'setup'
  | 'team_selecting'
  | 'question_shown'
  | 'discussion'
  | 'answer_waiting'
  | 'steal_phase'
  | 'round_complete'
  | 'game_over'

export type TeamColor = TeamColorId

export interface Team {
  id: string
  name: string
  color: TeamColor
  score: number
  order: number
}

/** Seconds shown as "Ready!" then "Go!" before the numeric countdown (2s each). */
export const TIMER_PRE_COUNTDOWN_SECONDS = 4

export interface TimerState {
  type: 'discussion' | 'steal'
  /** Total seconds (pre-countdown + countdown), e.g. 24 = 4s Ready/Go + 20s discussion. */
  duration: number
  remaining: number
  startedAt: number
  isActive: boolean
  isWarning: boolean
  preCountdownSeconds: number
}

export interface ModalState {
  type: 'question' | 'result' | 'game_over'
  data: unknown
  visible: boolean
}

/** Strategy Board Quiz template state */
export interface BoardCell {
  topic: string
  points: number
  prompt: string
  acceptableAnswers: string[]
  state: 'available' | 'selected' | 'answered' | 'disabled'
  /** When state is 'answered', which team index won this cell (for showing team color on grid). */
  answeredByTeamIndex?: number
}

export interface StrategyBoardState {
  board: BoardCell[][]
  selectedCell: { row: number; col: number } | null
  stealQueue: number[]
  currentStealIndex: number
}

function defaultBoardCell(): BoardCell {
  return {
    topic: '',
    points: 0,
    prompt: '',
    acceptableAnswers: [],
    state: 'disabled',
  }
}

function initializeBoardState(content: unknown): StrategyBoardState {
  const c = content as StrategyBoardQuizContent
  const { rows, cols, cells } = c.board
  const board: BoardCell[][] = []
  for (let r = 0; r < rows; r++) {
    const row: BoardCell[] = []
    for (let col = 0; col < cols; col++) {
      const raw = cells[r * cols + col]
      const cell = raw
        ? {
            topic: raw.topic,
            points: raw.points,
            prompt: raw.prompt,
            acceptableAnswers: [...raw.acceptableAnswers],
            state: 'available' as const,
          }
        : { ...defaultBoardCell(), state: 'disabled' as const }
      row.push(cell)
    }
    board.push(row)
  }
  return {
    board,
    selectedCell: null,
    stealQueue: [],
    currentStealIndex: 0,
  }
}

function countAvailableCells(state: StrategyBoardState): number {
  return state.board.flat().filter((cell) => cell.state === 'available').length
}

export interface InitializeGameParams {
  gameId: string
  templateId: string
  numTeams: number
  teamNames?: string[]
  teamColors?: TeamColor[]
  content: GameContent
}

const TEAM_COLORS: TeamColor[] = DEFAULT_TEAM_COLORS

export interface GameStore {
  gameId: string
  templateId: string
  content: GameContent | null
  phase: GamePhase
  activeTeamIndex: number
  teams: Team[]
  templateState: unknown
  timer: TimerState | null
  modal: ModalState | null
  initializeGame: (params: InitializeGameParams) => void
  startGame: () => void
  selectCell: (row: number, col: number) => void
  startDiscussionTimer: () => void
  markCorrect: () => void
  markIncorrect: () => void
  nextStealAttempt: () => void
  endGame: () => void
  tick: () => void
  closeModal: () => void
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    gameId: '',
    templateId: '',
    content: null,
    phase: 'setup',
    activeTeamIndex: 0,
    teams: [],
    templateState: null,
    timer: null,
    modal: null,

    initializeGame: (params) => {
      set((state) => {
        state.gameId = params.gameId
        state.templateId = params.templateId
        state.content = params.content
        state.phase = 'setup'
        state.modal = null
        state.timer = null

        const teams: Team[] = []
        for (let i = 0; i < params.numTeams; i++) {
          const configuredName = params.teamNames?.[i]?.trim()
          const configuredColor = params.teamColors?.[i]
          const fallbackColor = TEAM_COLORS[i] ?? DEFAULT_TEAM_COLORS[i % DEFAULT_TEAM_COLORS.length]

          teams.push({
            id: `team_${i}`,
            name:
              configuredName && configuredName.length > 0
                ? configuredName
                : `Team ${i + 1}`,
            color: configuredColor ?? fallbackColor,
            score: 0,
            order: i,
          })
        }
        state.teams = teams
        state.activeTeamIndex = Math.floor(Math.random() * teams.length)

        if (params.templateId === 'strategy_board_quiz') {
          state.templateState = initializeBoardState(params.content)
        }
      })
    },

    startGame: () => {
      set((state) => {
        state.phase = 'team_selecting'
        if (state.templateId === 'strategy_board_quiz' && state.content) {
          state.templateState = initializeBoardState(state.content)
        }
      })
    },

    selectCell: (row, col) => {
      set((state) => {
        const ts = state.templateState as StrategyBoardState
        if (!ts?.board?.[row]?.[col]) return
        const cell = ts.board[row][col]
        if (cell.state !== 'available') return

        cell.state = 'selected'
        ts.selectedCell = { row, col }
        state.phase = 'discussion'
        state.modal = null
        const duration = 20 + TIMER_PRE_COUNTDOWN_SECONDS
        state.timer = {
          type: 'discussion',
          duration,
          remaining: duration,
          startedAt: Date.now(),
          isActive: true,
          isWarning: false,
          preCountdownSeconds: TIMER_PRE_COUNTDOWN_SECONDS,
        }
      })
    },

    startDiscussionTimer: () => {
      set((state) => {
        state.phase = 'discussion'
        const duration = 20 + TIMER_PRE_COUNTDOWN_SECONDS
        state.timer = {
          type: 'discussion',
          duration,
          remaining: duration,
          startedAt: Date.now(),
          isActive: true,
          isWarning: false,
          preCountdownSeconds: TIMER_PRE_COUNTDOWN_SECONDS,
        }
      })
    },

    markCorrect: () => {
      set((state) => {
        const ts = state.templateState as StrategyBoardState
        if (!ts?.selectedCell) return
        const { row, col } = ts.selectedCell
        const cell = ts.board[row][col]

        const winningTeamIndex =
          state.phase === 'steal_phase'
            ? ts.stealQueue[ts.currentStealIndex]
            : state.activeTeamIndex
        if (winningTeamIndex !== undefined) {
          state.teams[winningTeamIndex].score += cell.points
          cell.answeredByTeamIndex = winningTeamIndex
        }
        cell.state = 'answered'
        state.phase = 'round_complete'
        state.timer = null
        state.modal = null
        ts.selectedCell = null
        ts.stealQueue = []
        ts.currentStealIndex = 0
      })
      // Advance turn after short delay (normal order)
      setTimeout(() => {
        set((s) => {
          const ts = s.templateState as StrategyBoardState
          const available = ts ? countAvailableCells(ts) : 0
          if (available === 0) {
            s.phase = 'game_over'
            s.modal = null
          } else {
            s.activeTeamIndex = (s.activeTeamIndex + 1) % s.teams.length
            s.phase = 'team_selecting'
          }
        })
      }, 800)
    },

    markIncorrect: () => {
      const phase = get().phase
      if (phase === 'steal_phase') {
        get().nextStealAttempt()
        return
      }
      set((state) => {
        const ts = state.templateState as StrategyBoardState
        if (!ts?.selectedCell) return

        const stealQueue: number[] = []
        for (let i = 1; i < state.teams.length; i++) {
          stealQueue.push((state.activeTeamIndex + i) % state.teams.length)
        }
        ts.stealQueue = stealQueue
        ts.currentStealIndex = 0
        state.phase = 'steal_phase'
        const duration = 5 + TIMER_PRE_COUNTDOWN_SECONDS
        state.timer = {
          type: 'steal',
          duration,
          remaining: duration,
          startedAt: Date.now(),
          isActive: true,
          isWarning: false,
          preCountdownSeconds: TIMER_PRE_COUNTDOWN_SECONDS,
        }
      })
    },

    nextStealAttempt: () => {
      set((state) => {
        const ts = state.templateState as StrategyBoardState
        if (!ts?.selectedCell) return

        ts.currentStealIndex++

        if (ts.currentStealIndex >= ts.stealQueue.length) {
          const { row, col } = ts.selectedCell
          ts.board[row][col].state = 'disabled'
          state.phase = 'round_complete'
          state.timer = null
          state.modal = null
          ts.selectedCell = null

          setTimeout(() => {
            set((s) => {
              const t = s.templateState as StrategyBoardState
              const available = t ? countAvailableCells(t) : 0
              if (available === 0) {
                s.phase = 'game_over'
                s.modal = null
              } else {
                s.activeTeamIndex = (s.activeTeamIndex + 1) % s.teams.length
                s.phase = 'team_selecting'
              }
            })
          }, 800)
        } else {
          const duration = 5 + TIMER_PRE_COUNTDOWN_SECONDS
          state.timer = {
            type: 'steal',
            duration,
            remaining: duration,
            startedAt: Date.now(),
            isActive: true,
            isWarning: false,
            preCountdownSeconds: TIMER_PRE_COUNTDOWN_SECONDS,
          }
        }
      })
    },

    endGame: () => {
      set((state) => {
        state.phase = 'game_over'
        state.timer = null
        state.modal = null
      })
    },

    tick: () => {
      set((state) => {
        if (!state.timer?.isActive) return

        const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000)
        const remaining = Math.max(0, state.timer.duration - elapsed)
        state.timer.remaining = remaining
        const pre = state.timer.preCountdownSeconds ?? 0
        const countdownPart = Math.max(0, remaining - pre)
        state.timer.isWarning = state.timer.type === 'discussion' ? countdownPart <= 5 && countdownPart > 0 : countdownPart <= 2 && countdownPart > 0

        if (remaining === 0) {
          state.timer.isActive = false
          if (state.timer.type === 'discussion') {
            state.phase = 'answer_waiting'
            state.timer = null
          } else if (state.timer.type === 'steal') {
            get().nextStealAttempt()
          }
        }
      })
    },

    closeModal: () => {
      set((state) => {
        state.modal = null
        const ts = state.templateState as StrategyBoardState
        if (ts?.selectedCell && (state.phase === 'question_shown' || state.phase === 'discussion' || state.phase === 'answer_waiting')) {
          const cell = ts.board[ts.selectedCell.row]?.[ts.selectedCell.col]
          if (cell) cell.state = 'available'
          ts.selectedCell = null
          state.phase = 'team_selecting'
          state.timer = null
        }
      })
    },
  }))
)
