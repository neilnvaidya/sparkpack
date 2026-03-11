'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'
import {
  contentSchema,
  type StrategyBoardQuizContent,
} from '@/lib/templates/strategy-board-quiz'
import {
  DEFAULT_NUM_TEAMS,
  DEFAULT_TEAM_NAMES,
  DEFAULT_STRATEGY_BOARD_QUIZ_CONTENT,
} from '@/lib/constants/default-game-content'
import { saveGame } from '@/lib/utils/storage'
import {
  DEFAULT_TEAM_COLORS,
  TEAM_COLOR_OPTIONS,
  type TeamColorId,
} from '@/lib/constants/team-colors'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_ROWS = 4
const DEFAULT_COLS = 4

type BoardPreset = '3x3' | '4x4' | '4x5'

function pointsForRows(rows: number): number[] {
  return Array.from({ length: rows }, (_, index) => (index + 1) * 100)
}

function defaultCells(rows: number, cols: number): StrategyBoardQuizContent['board']['cells'] {
  const cells: StrategyBoardQuizContent['board']['cells'] = []
  const points = pointsForRows(rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ topic: '', points: points[r] ?? 100, prompt: '', acceptableAnswers: [''] })
    }
  }
  return cells
}

function defaultContent(rows = DEFAULT_ROWS, cols = DEFAULT_COLS): StrategyBoardQuizContent {
  return {
    title: '',
    learningFocus: '',
    topics: [],
    board: { rows, cols, pointsPerRow: pointsForRows(rows), cells: defaultCells(rows, cols) },
    teacherScript: ['Use the questions on the board.'],
    studentInstructions: ['Choose a question and answer as a team.'],
    fastFinisherExtension: '',
  }
}

function generateGameId(): string {
  return `game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

function boardDimensionsFromPreset(preset: BoardPreset): { rows: number; cols: number } {
  if (preset === '3x3') return { rows: 3, cols: 3 }
  if (preset === '4x5') return { rows: 4, cols: 5 }
  return { rows: 4, cols: 4 }
}

function resizeBoard(
  prev: StrategyBoardQuizContent,
  newRows: number,
  newCols: number
): StrategyBoardQuizContent {
  const oldBoard = prev.board
  const oldRows = oldBoard.rows
  const oldCols = oldBoard.cols
  const oldCells = oldBoard.cells

  const newPointsPerRow = pointsForRows(newRows)
  const newCells: StrategyBoardQuizContent['board']['cells'] = []

  for (let r = 0; r < newRows; r++) {
    for (let c = 0; c < newCols; c++) {
      const newIndex = r * newCols + c
      if (r < oldRows && c < oldCols) {
        const oldIndex = r * oldCols + c
        const oldCell = oldCells[oldIndex]
        newCells[newIndex] = {
          ...oldCell,
          points: newPointsPerRow[r] ?? oldCell.points,
        }
      } else {
        newCells[newIndex] = {
          topic: '',
          points: newPointsPerRow[r] ?? 100,
          prompt: '',
          acceptableAnswers: [''],
        }
      }
    }
  }

  const newTopics = Array.from({ length: newCols }, (_, colIndex) =>
    colIndex < oldCols ? (prev.topics?.[colIndex] ?? '') : ''
  )

  return {
    ...prev,
    topics: newTopics,
    board: {
      ...oldBoard,
      rows: newRows,
      cols: newCols,
      pointsPerRow: newPointsPerRow,
      cells: newCells,
    },
  }
}

function getInitialContent(): StrategyBoardQuizContent {
  return JSON.parse(JSON.stringify(DEFAULT_STRATEGY_BOARD_QUIZ_CONTENT))
}
function getInitialTeamNames() { return [...DEFAULT_TEAM_NAMES] }
function getInitialTeamColors() { return [...DEFAULT_TEAM_COLORS] }

type CellData = StrategyBoardQuizContent['board']['cells'][0]

// ─── Point badge colours ───────────────────────────────────────────────────────
const POINT_COLORS = [
  { bg: '#1a6fd4', text: '#fff' },  // 100 – blue
  { bg: '#9333ea', text: '#fff' },  // 200 – purple
  { bg: '#e8750a', text: '#fff' },  // 300 – orange
  { bg: '#cb2d6f', text: '#fff' },  // 400 – pink
]

// ─── EditableCard ─────────────────────────────────────────────────────────────
function EditableCard({
  cell,
  points,
  row,
  col,
  onUpdate,
  isMissing,
}: {
  cell: CellData
  points: number
  row: number
  col: number
  onUpdate: (field: keyof CellData, value: string | string[]) => void
  isMissing?: boolean
}) {
  const answersStr = Array.isArray(cell.acceptableAnswers)
    ? cell.acceptableAnswers.filter(Boolean).join(', ')
    : ''
  const colorIdx = Math.min(row, POINT_COLORS.length - 1)
  const pc = POINT_COLORS[colorIdx]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '10px',
      backdropFilter: 'blur(4px)',
      transition: 'border-color 0.2s, background 0.2s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.22)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
          fontFamily: 'var(--font-body)',
        }}>
          R{row + 1}·C{col + 1}
        </span>
        <span style={{
          fontSize: '12px', fontWeight: 800,
          fontFamily: "'Fredoka', sans-serif",
          background: pc.bg, color: pc.text,
          borderRadius: '6px', padding: '1px 7px',
          letterSpacing: '0.03em',
        }}>
          {points}
        </span>
      </div>

      {/* Question input */}
      <input
        placeholder="Question"
        value={cell.prompt}
        onChange={e => onUpdate('prompt', e.target.value)}
        style={{
          width: '100%',
          height: '34px',
          fontSize: '13px',
          background: 'rgba(0,0,0,0.25)',
          border: `1px solid ${isMissing ? '#FF3D77' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '7px',
          padding: '0 10px',
          color: '#fffbe8',
          fontFamily: 'var(--font-body)',
          outline: 'none',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#FF7A1A'
          e.target.style.background = 'rgba(255,122,26,0.08)'
        }}
        onBlur={e => {
          e.target.style.borderColor = isMissing ? '#FF3D77' : 'rgba(255,255,255,0.12)'
          e.target.style.background = 'rgba(0,0,0,0.25)'
        }}
      />

      {/* Answers textarea (optional) */}
      <textarea
        placeholder="Answers (optional, comma-separated)"
        value={answersStr}
        onChange={e =>
          onUpdate(
            'acceptableAnswers',
            e.target.value.split(',').map(a => a.trim()).filter(Boolean)
          )
        }
        style={{
          width: '100%', minHeight: '60px', fontSize: '12px', lineHeight: '1.5',
          background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '7px', padding: '8px 10px', color: 'rgba(255,251,232,0.8)',
          fontFamily: 'var(--font-body)', resize: 'none',
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = '#c084fc'; e.target.style.background = 'rgba(192,132,252,0.07)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(0,0,0,0.25)' }}
      />
    </div>
  )
}

// ─── Section header helper ────────────────────────────────────────────────────
function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      marginBottom: '12px',
    }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(255,251,232,0.5)',
        fontFamily: 'var(--font-body)',
      }}>{children}</span>
    </div>
  )
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({
  children,
  style,
  className,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '18px',
        backdropFilter: 'blur(8px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<StrategyBoardQuizContent>(getInitialContent)
  const [numTeams, setNumTeams] = useState<number>(DEFAULT_NUM_TEAMS)
  const [teamNames, setTeamNames] = useState<string[]>(getInitialTeamNames)
  const [teamColors, setTeamColors] = useState<TeamColorId[]>(getInitialTeamColors)
  const [preset, setPreset] = useState<BoardPreset>('4x4')
  const [openColorPickerFor, setOpenColorPickerFor] = useState<number | null>(null)
  const [validationAttempted, setValidationAttempted] = useState(false)

  const rows = content.board.rows
  const cols = content.board.cols

  const applyPreset = (nextPreset: BoardPreset) => {
    const { rows, cols } = boardDimensionsFromPreset(nextPreset)
    setPreset(nextPreset)
    setContent(prev => resizeBoard(prev, rows, cols))
  }

  const updateCell = (index: number, field: keyof CellData, value: string | string[]) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as StrategyBoardQuizContent
      const cell = next.board.cells[index]
      if (cell) (cell as Record<string, unknown>)[field] = value
      return next
    })
  }

  const updateTeamName = (index: number, value: string) => {
    setTeamNames(prev => { const next = [...prev]; next[index] = value; return next })
  }
  const updateTeamColor = (index: number, value: TeamColorId) => {
    setTeamColors(prev => { const next = [...prev]; next[index] = value; return next })
  }

  const updateColumnTopic = (index: number, value: string) => {
    setContent(prev => {
      const topics = [...(prev.topics ?? [])]
      topics[index] = value
      return { ...prev, topics }
    })
  }

  const loadDefaults = () => {
    setContent(getInitialContent()); setPreset('4x4')
    setNumTeams(DEFAULT_NUM_TEAMS); setTeamNames(getInitialTeamNames())
    setTeamColors(getInitialTeamColors()); setError(null)
  }

  const quickPlayWithDefaults = () => {
    setError(null)
    setValidationAttempted(false)
    const toSave: StrategyBoardQuizContent = { ...DEFAULT_STRATEGY_BOARD_QUIZ_CONTENT }
    const parsed = contentSchema.safeParse(toSave)
    if (!parsed.success) { setError(parsed.error.issues?.map(e => e.message).join('. ') ?? parsed.error.message); return }
    const gameId = generateGameId()
    saveGame({ gameId, templateId: 'strategy_board_quiz', content: parsed.data, createdAt: new Date().toISOString(), settings: { numTeams: DEFAULT_NUM_TEAMS, teamNames: [...DEFAULT_TEAM_NAMES], teamColors: [...DEFAULT_TEAM_COLORS] } })
    router.push(`/game/${gameId}`)
  }

  const handleSaveAndPlay = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationAttempted(true)
    const totalCells = rows * cols

    const columnTopics = Array.from({ length: cols }, (_, col) =>
      (content.topics?.[col] ?? '').trim()
    )

    const cleanedCells = content.board.cells.slice(0, totalCells).map((cell, index) => {
      const col = index % cols
      return {
        topic: columnTopics[col] ?? '',
        points: cell.points,
        prompt: cell.prompt.trim(),
        acceptableAnswers: cell.acceptableAnswers.map(a => a.trim()).filter(Boolean),
      }
    })

    const hasMissingTopics = columnTopics.some(topic => !topic.trim())
    const hasMissingQuestions = cleanedCells.some(cell => !cell.prompt)
    if (hasMissingTopics || hasMissingQuestions) {
      setError('Please fill in all highlighted topic and question fields.')
      return
    }
    const preparedTeamNames = teamNames.slice(0, numTeams).map((name, index) => name.trim() || `Team ${index + 1}`)
    const preparedTeamColors = teamColors.slice(0, numTeams).map((color, index) => color ?? DEFAULT_TEAM_COLORS[index])
    const topics = columnTopics
    const toSave: StrategyBoardQuizContent = {
      ...content,
      title: content.title.trim() || 'Classroom Quiz Showdown',
      learningFocus: content.learningFocus.trim() || 'Review key lesson concepts.',
      topics: topics.length ? topics : ['General'],
      board: {
        ...content.board,
        cells: cleanedCells,
      },
      teacherScript: content.teacherScript.filter(Boolean).length ? content.teacherScript.filter(Boolean) : ['Use the questions on the board.'],
      studentInstructions: content.studentInstructions.filter(Boolean).length ? content.studentInstructions.filter(Boolean) : ['Choose a question and answer as a team.'],
    }
    const parsed = contentSchema.safeParse(toSave)
    if (!parsed.success) { setError(parsed.error.issues?.map(e => e.message).join('. ') ?? parsed.error.message); return }
    const gameId = generateGameId()
    saveGame({ gameId, templateId: 'strategy_board_quiz', content: parsed.data, createdAt: new Date().toISOString(), settings: { numTeams, teamNames: preparedTeamNames, teamColors: preparedTeamColors } })
    router.push(`/game/${gameId}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root {
          --font-display: 'Fredoka', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --yellow: #FFE234;
          --orange: #FF7A1A;
          --pink:   #FF3D77;
          --purple: #3B1F5E;
          --cream:  #FFF8E7;
        }
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,251,232,0.28) !important; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .sp-header   { animation: fadeDown 0.4s ease both; }
        .sp-meta     { animation: fadeUp 0.4s 0.1s ease both; }
        .sp-setup    { animation: fadeUp 0.4s 0.2s ease both; }
        .sp-board    { animation: fadeUp 0.4s 0.3s ease both; }
        .sp-footer   { animation: fadeUp 0.4s 0.4s ease both; }

        .preset-btn {
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 12px; font-weight: 700;
          font-family: var(--font-body);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          color: rgba(255,251,232,0.7);
          transition: all 0.15s;
          letter-spacing: 0.02em;
        }
        .preset-btn:hover { background: rgba(255,255,255,0.13); color: #fffbe8; border-color: rgba(255,255,255,0.35); }
        .preset-btn.active {
          background: var(--yellow); color: #2a0f4a;
          border-color: var(--yellow);
          box-shadow: 0 3px 12px rgba(255,226,52,0.4);
        }

        .team-count-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          font-size: 15px; font-weight: 800;
          font-family: var(--font-display);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
          color: rgba(255,251,232,0.6);
          transition: all 0.15s;
        }
        .team-count-btn:hover { background: rgba(255,255,255,0.13); color: #fffbe8; }
        .team-count-btn.active {
          background: var(--pink); color: #fff;
          border-color: var(--pink);
          box-shadow: 0 3px 12px rgba(255,61,119,0.4);
        }

        .sp-text-input {
          width: 100%; height: 44px;
          background: rgba(0,0,0,0.3);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0 14px;
          color: #fffbe8;
          font-size: 14px;
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .sp-text-input:focus {
          border-color: var(--yellow);
          background: rgba(255,226,52,0.06);
        }

        .sp-save-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 48px;
          background: linear-gradient(135deg, var(--yellow) 0%, var(--orange) 100%);
          border: none; border-radius: 100px;
          font-size: 1.05rem; font-weight: 700;
          font-family: var(--font-display);
          color: #2a0f4a; cursor: pointer;
          box-shadow: 0 6px 0 #7a3300, 0 10px 30px rgba(255,122,26,0.4);
          transition: transform 0.1s, box-shadow 0.1s;
          letter-spacing: 0.03em;
        }
        .sp-save-btn:hover { filter: brightness(1.05); }
        .sp-save-btn:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 #7a3300, 0 4px 12px rgba(255,122,26,0.3);
        }

        .sp-ghost-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          font-family: var(--font-body);
          color: rgba(255,251,232,0.75);
          cursor: pointer;
          transition: all 0.15s;
        }
        .sp-ghost-btn:hover {
          background: rgba(255,255,255,0.13);
          color: #fffbe8;
          border-color: rgba(255,255,255,0.35);
        }

        .sp-quick-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: rgba(255,61,119,0.18);
          border: 1.5px solid rgba(255,61,119,0.45);
          border-radius: 100px;
          font-size: 12px; font-weight: 700;
          font-family: var(--font-body);
          color: #ff8db3;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sp-quick-btn:hover {
          background: rgba(255,61,119,0.28);
          border-color: rgba(255,61,119,0.7);
          color: #ffb3cd;
        }

        .color-dot {
          width: 24px; height: 24px; border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer; transition: transform 0.1s, border-color 0.1s;
          flex-shrink: 0;
        }
        .color-dot:hover { transform: scale(1.15); }
        .color-dot.selected { border-color: white; transform: scale(1.1); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 10%, #4a1a7a 0%, #2e1252 40%, #160830 100%)',
        fontFamily: 'var(--font-body)',
        paddingBottom: '60px',
      }}>

        {/* Grid texture */}
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Glow accent */}
        <div aria-hidden="true" style={{ position: 'fixed', top: '-5%', right: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,61,119,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="sp-header" style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(22,8,48,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #FFE234 0%, #FF7A1A 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>SparkPack</span>
            </Link>
            <span style={{
              width: '1px', height: '18px',
              background: 'rgba(255,255,255,0.15)',
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: 'rgba(255,251,232,0.45)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              ⚡ New Game
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="sp-quick-btn" onClick={quickPlayWithDefaults}>
              ▶ Quick Play
            </button>
            <button type="button" className="sp-ghost-btn" onClick={loadDefaults}>
              ↺ Reset
            </button>
          </div>
        </header>

        {/* ── Page body ────────────────────────────────────────────────── */}
        <form onSubmit={handleSaveAndPlay}>
          <div style={{
            position: 'relative', zIndex: 1,
            maxWidth: '1300px', margin: '0 auto',
            padding: '28px 20px',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}>

            {/* Page title */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 700, color: '#fffbe8',
                margin: 0, lineHeight: 1,
              }}>
                Build your quiz board
              </h1>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: 'rgba(255,251,232,0.35)',
                letterSpacing: '0.04em',
              }}>Jeopardy-style</span>
            </div>

            {/* ── Meta row: title + learning focus ────────────────── */}
            <Panel className="sp-meta" style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' } as React.CSSProperties}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,251,232,0.4)', marginBottom: '6px' }}>
                  Game Title
                </label>
                <input
                  className="sp-text-input"
                  placeholder="e.g. World War II Showdown"
                  value={content.title}
                  onChange={e => setContent(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,251,232,0.4)', marginBottom: '6px' }}>
                  Learning Focus
                </label>
                <input
                  className="sp-text-input"
                  placeholder="e.g. Causes and key events of WW2"
                  value={content.learningFocus}
                  onChange={e => setContent(p => ({ ...p, learningFocus: e.target.value }))}
                />
              </div>
            </Panel>

            {/* ── Setup row: teams + board size ───────────────────── */}
            <div
              className="sp-setup"
              style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: '280px 1fr',
                position: 'relative',
                zIndex: 10,
              }}
            >

              {/* Teams */}
              <Panel style={{ position: 'relative' }}>
                <SectionLabel icon="🏆">Teams</SectionLabel>

                {/* Team count */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {[3, 4, 5].map(count => (
                    <button
                      key={count} type="button"
                      className={cn('team-count-btn', numTeams === count && 'active')}
                      onClick={() => setNumTeams(count)}
                    >
                      {count}
                    </button>
                  ))}
                  <span style={{ fontSize: '11px', color: 'rgba(255,251,232,0.4)', alignSelf: 'center', marginLeft: '4px' }}>
                    teams
                  </span>
                </div>

                {/* Team rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.from({ length: numTeams }, (_, idx) => {
                    const selectedId = teamColors[idx] ?? DEFAULT_TEAM_COLORS[idx]
                    const selectedDef = TEAM_COLOR_OPTIONS.find(c => c.id === selectedId) ?? TEAM_COLOR_OPTIONS[0]
                    const isOpen = openColorPickerFor === idx

                    return (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(0,0,0,0.2)',
                          border: `2px solid ${selectedDef.hex}44`,
                          borderLeft: `3px solid ${selectedDef.hex}`,
                          borderRadius: '10px',
                          padding: '6px 8px',
                        }}>
                          {/* Color button */}
                          <button
                            type="button"
                            onClick={() => setOpenColorPickerFor(isOpen ? null : idx)}
                            style={{
                              width: '22px', height: '22px', borderRadius: '7px',
                              background: selectedDef.hex,
                              border: isOpen ? '2px solid white' : '2px solid rgba(255,255,255,0.3)',
                              cursor: 'pointer', flexShrink: 0,
                              transition: 'border-color 0.15s',
                            }}
                            aria-label={`Pick color for team ${idx + 1}`}
                          />
                          <input
                            value={teamNames[idx] ?? ''}
                            onChange={e => updateTeamName(idx, e.target.value)}
                            placeholder={`Team ${idx + 1}`}
                            style={{
                              flex: 1, height: '28px', fontSize: '12px', fontWeight: 600,
                              background: 'transparent', border: 'none', outline: 'none',
                              color: '#fffbe8', fontFamily: 'var(--font-body)',
                            }}
                          />
                        </div>

                        {/* Color picker dropdown */}
                        {isOpen && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                            background: '#1e0e38', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px', padding: '10px',
                            zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            display: 'flex', flexDirection: 'column', gap: '6px',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,251,232,0.4)' }}>Colour</span>
                              <button type="button" onClick={() => setOpenColorPickerFor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,251,232,0.5)', fontSize: '14px', lineHeight: 1, padding: '0 2px' }}>×</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                              {TEAM_COLOR_OPTIONS.map(option => (
                                <button
                                  key={option.id} type="button"
                                  className={cn('color-dot', selectedId === option.id && 'selected')}
                                  style={{ backgroundColor: option.hex }}
                                  onClick={() => { updateTeamColor(idx, option.id); setOpenColorPickerFor(null) }}
                                  aria-label={option.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Panel>

              {/* Board size + tips */}
              <Panel>
                <SectionLabel icon="📐">Board Size</SectionLabel>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {(['3x3', '4x4', '4x5'] as const).map(p => (
                    <button
                      key={p} type="button"
                      className={cn('preset-btn', preset === p && 'active')}
                      onClick={() => applyPreset(p)}
                    >
                      {p === '3x3' ? '3×3 Quick' : p === '4x4' ? '4×4 Standard' : '4×5 Extended'}
                    </button>
                  ))}
                </div>

                {/* Mini legend for point colours */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {pointsForRows(content.board.rows).map((pts, i) => {
                    const pc = POINT_COLORS[Math.min(i, POINT_COLORS.length - 1)]
                    return (
                      <div key={pts} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: pc.bg, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(255,251,232,0.5)', fontWeight: 600 }}>{pts} pts</span>
                      </div>
                    )
                  })}
                </div>

                <p style={{ marginTop: '14px', marginBottom: 0, fontSize: '12px', color: 'rgba(255,251,232,0.35)', lineHeight: 1.6 }}>
                  Fill in every card below, or hit <strong style={{ color: 'rgba(255,251,232,0.6)' }}>Quick Play</strong> to launch instantly with sample content.
                </p>
              </Panel>
            </div>

            {/* ── Error ───────────────────────────────────────────── */}
            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(255,61,119,0.15)',
                border: '1px solid rgba(255,61,119,0.4)',
                color: '#ff8db3', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* ── Board grid ──────────────────────────────────────── */}
            <div className="sp-board">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>🎯</span>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,251,232,0.5)' }}>
                  Question Cards — {rows}×{cols}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,251,232,0.3)' }}>
                  {rows * cols} cards total
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '10px',
                  gridTemplateColumns: `80px repeat(${cols}, minmax(0, 1fr))`,
                  alignItems: 'stretch',
                }}
              >
                {/* Top-left empty corner */}
                <div />
                {/* Column topics */}
                {Array.from({ length: cols }, (_, col) => {
                  const topicValue = content.topics?.[col] ?? ''
                  const topicMissing =
                    validationAttempted && !topicValue.trim()
                  return (
                    <input
                      key={`topic-${col}`}
                      value={topicValue}
                      onChange={e => updateColumnTopic(col, e.target.value)}
                      placeholder={`Topic ${col + 1}`}
                      className="sp-text-input"
                      style={{
                        height: '40px',
                        fontSize: '13px',
                        background: 'rgba(0,0,0,0.4)',
                        borderColor: topicMissing
                          ? '#FF3D77'
                          : 'rgba(255,255,255,0.12)',
                      }}
                      aria-invalid={topicMissing || undefined}
                    />
                  )
                })}

                {/* Rows: point labels + cards */}
                {Array.from({ length: rows }, (_, row) => {
                  const points = content.board.pointsPerRow[row] ?? 100
                  return (
                    <>
                      <div
                        key={`row-label-${row}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: "'Fredoka', sans-serif",
                          color: 'rgba(255,251,232,0.8)',
                        }}
                      >
                        {points}
                      </div>
                      {Array.from({ length: cols }, (_, col) => {
                        const index = row * cols + col
                        const cell = content.board.cells[index]
                        const isMissing =
                          validationAttempted &&
                          !cell?.prompt?.trim()
                        return (
                          <EditableCard
                            key={`cell-${row}-${col}`}
                            cell={cell}
                            points={points}
                            row={row}
                            col={col}
                            onUpdate={(field, value) => updateCell(index, field, value)}
                            isMissing={isMissing}
                          />
                        )
                      })}
                    </>
                  )
                })}
              </div>
            </div>

            {/* ── Footer CTA ──────────────────────────────────────── */}
            <div className="sp-footer" style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
              <button type="submit" className="sp-save-btn">
                <span>🚀</span>
                <span>Save &amp; Play</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}