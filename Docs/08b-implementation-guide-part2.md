# Implementation Guide Part 2: Game Runtime & Testing

## Phase 8: Generation UI

**Duration:** 3-4 hours
**Dependencies:** Phase 6 complete
**Goal:** User interface for generating games

### 8.1 Generation Form (2-3 hours)

Create `app/generate/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllTemplates } from '@/lib/templates/registry'
import { checkRateLimit, incrementRateLimit } from '@/lib/utils/rate-limiting'
import { saveGame } from '@/lib/utils/storage'

export default function GeneratePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [templateId, setTemplateId] = useState('strategy_board_quiz')
  const [ageBand, setAgeBand] = useState('P5-6')
  const [skillFocus, setSkillFocus] = useState('reasoning')
  const [numTeams, setNumTeams] = useState(4)
  const [timeMinutes, setTimeMinutes] = useState(10)
  const [contextText, setContextText] = useState('')
  
  const templates = getAllTemplates()
  
  const handleGenerate = async () => {
    // Check rate limit
    const rateLimit = checkRateLimit()
    if (!rateLimit.allowed) {
      setError(`Daily limit reached. You have ${rateLimit.remaining} generations remaining. Resets tomorrow.`)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          ageBand,
          skillFocus,
          numTeams,
          timeMinutes,
          contextText: contextText.trim() || undefined
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Generation failed')
      }
      
      // Increment rate limit
      incrementRateLimit()
      
      // Save game
      saveGame({
        gameId: data.gameId,
        templateId: data.templateId,
        content: data.content,
        createdAt: new Date().toISOString()
      })
      
      // Navigate to game
      router.push(`/game/${data.gameId}`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate game')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Generate Classroom Game</h1>
        <p className="text-neutral-600 mb-8">
          Create a custom game in under 30 seconds
        </p>
        
        <Card className="p-6">
          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <Label htmlFor="template">Game Template</Label>
              <Select
                id="template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-neutral-600 mt-1">
                {templates.find(t => t.id === templateId)?.description}
              </p>
            </div>
            
            {/* Age Band */}
            <div>
              <Label htmlFor="ageBand">Age Band</Label>
              <Select
                id="ageBand"
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value)}
              >
                <option value="P3-4">P3-4 (Ages 7-8)</option>
                <option value="P5-6">P5-6 (Ages 9-10)</option>
                <option value="P7-S2">P7-S2 (Ages 11-14)</option>
              </Select>
            </div>
            
            {/* Skill Focus */}
            <div>
              <Label htmlFor="skillFocus">Skill Focus</Label>
              <Select
                id="skillFocus"
                value={skillFocus}
                onChange={(e) => setSkillFocus(e.target.value)}
              >
                <option value="speaking">Speaking</option>
                <option value="reading">Reading</option>
                <option value="vocab">Vocabulary</option>
                <option value="reasoning">Reasoning</option>
                <option value="teamwork">Teamwork</option>
              </Select>
            </div>
            
            {/* Number of Teams */}
            <div>
              <Label htmlFor="numTeams">Number of Teams</Label>
              <Select
                id="numTeams"
                value={String(numTeams)}
                onChange={(e) => setNumTeams(parseInt(e.target.value))}
              >
                <option value="3">3 teams</option>
                <option value="4">4 teams</option>
                <option value="5">5 teams</option>
              </Select>
            </div>
            
            {/* Time */}
            <div>
              <Label htmlFor="timeMinutes">Game Duration</Label>
              <Select
                id="timeMinutes"
                value={String(timeMinutes)}
                onChange={(e) => setTimeMinutes(parseInt(e.target.value))}
              >
                <option value="8">8 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
              </Select>
            </div>
            
            {/* Context Text */}
            <div>
              <Label htmlFor="contextText">
                Content Context (Optional)
              </Label>
              <Textarea
                id="contextText"
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Paste lesson content, notes, or specific topics to base questions on..."
                rows={8}
                maxLength={2000}
              />
              <p className="text-sm text-neutral-600 mt-1">
                {contextText.length}/2000 characters
              </p>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}
            
            {/* Generate Button */}
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Game'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Form renders correctly
- [ ] All inputs work
- [ ] Rate limiting works
- [ ] Error handling works
- [ ] Navigation works after generation

### 8.2 Loading State Component (1 hour)

Create `components/shared/GeneratingLoader.tsx`:

```typescript
'use client'

import { Loader2 } from 'lucide-react'

interface Props {
  message?: string
}

export function GeneratingLoader({ message = 'Generating your game...' }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        <p className="text-neutral-600">This usually takes 20-30 seconds</p>
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Loader displays correctly
- [ ] Animation works
- [ ] Overlay blocks interactions

**Phase 8 Complete When:**
- [ ] Generation form works end-to-end
- [ ] Rate limiting is enforced
- [ ] Loading states are clear
- [ ] Errors are handled gracefully

---

## Phase 9: Strategy Board Quiz Runtime

**Duration:** 6-8 hours
**Dependencies:** Phases 7-8 complete
**Goal:** Fully playable Strategy Board Quiz game

### 9.1 Game Board Component (3-4 hours)

Create `components/templates/strategy-board-quiz/GameBoard.tsx`:

```typescript
'use client'

import { useGameStore } from '@/lib/store/game-store'
import { cn } from '@/lib/utils/cn'

export function GameBoard() {
  const board = useGameStore(state => state.board)
  const phase = useGameStore(state => state.phase)
  const selectCell = useGameStore(state => state.selectCell)
  
  if (!board) return null
  
  const canSelect = phase === 'team_selecting'
  
  return (
    <div className="mb-8">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${board.cols}, 1fr)`
        }}
      >
        {board.cells.map((cell) => (
          <button
            key={cell.id}
            onClick={() => canSelect && cell.status === 'available' && selectCell(cell.id)}
            disabled={cell.status !== 'available' || !canSelect}
            className={cn(
              'aspect-square rounded-xl font-bold text-white transition-all',
              'flex flex-col items-center justify-center p-4',
              cell.status === 'available' && canSelect && 'hover:scale-105 hover:shadow-xl cursor-pointer',
              cell.status === 'available' && !canSelect && 'cursor-not-allowed',
              cell.status === 'available' && 'bg-blue-600',
              cell.status === 'active' && 'bg-yellow-500 ring-4 ring-yellow-300',
              cell.status === 'completed' && 'bg-neutral-300 opacity-50'
            )}
          >
            <div className="text-sm opacity-90 mb-1">{cell.topic}</div>
            <div className="text-4xl font-black">{cell.points}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Grid renders correctly
- [ ] Cells are clickable when appropriate
- [ ] Cell states display correctly
- [ ] Hover effects work

### 9.2 Question Modal Component (1-2 hours)

Create `components/templates/strategy-board-quiz/QuestionModal.tsx`:

```typescript
'use client'

import { useGameStore } from '@/lib/store/game-store'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function QuestionModal() {
  const activeCell = useGameStore(state => state.activeCell)
  const phase = useGameStore(state => state.phase)
  
  const isOpen = phase === 'question_shown' || 
                 phase === 'discussion' || 
                 phase === 'answer_waiting'
  
  if (!activeCell) return null
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl">
        <div className="text-center">
          <div className="text-sm text-neutral-600 mb-2">
            {activeCell.topic}
          </div>
          <div className="text-6xl font-black text-blue-600 mb-6">
            {activeCell.points} points
          </div>
          <div className="text-3xl font-bold leading-relaxed">
            {activeCell.prompt}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Verify:**
- [ ] Modal opens when question shown
- [ ] Question displays clearly
- [ ] Large enough to read from distance
- [ ] Modal closes appropriately

### 9.3 Main Game Component (2-3 hours)

Create `components/templates/strategy-board-quiz/StrategyBoardQuizGame.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store/game-store'
import { ScoreBoard } from '@/components/shared/ScoreBoard'
import { TimerDisplay } from '@/components/shared/TimerDisplay'
import { TeacherControls } from '@/components/shared/TeacherControls'
import { GameBoard } from './GameBoard'
import { QuestionModal } from './QuestionModal'

export default function StrategyBoardQuizGame() {
  const phase = useGameStore(state => state.phase)
  const teams = useGameStore(state => state.teams)
  const activeTeamIndex = useGameStore(state => state.activeTeamIndex)
  const timer = useGameStore(state => state.timer)
  
  const startDiscussionTimer = useGameStore(state => state.startDiscussionTimer)
  const tickTimer = useGameStore(state => state.tickTimer)
  const markAnswer = useGameStore(state => state.markAnswer)
  const skipSteal = useGameStore(state => state.skipSteal)
  
  // Timer effect
  useEffect(() => {
    if (!timer?.isRunning) return
    
    const interval = setInterval(() => {
      tickTimer()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [timer?.isRunning, tickTimer])
  
  if (phase === 'game_complete') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0]
    
    return (
      <div className="classroom-display">
        <div className="game-container text-center">
          <h1 className="text-display-xl mb-8">Game Complete!</h1>
          <div className={cn('p-12 rounded-3xl', `team-color-${winner.color}`)}>
            <div className="text-display-lg mb-4">Winner:</div>
            <div className="text-display-xl">{winner.name}</div>
            <div className="text-display-md mt-4">{winner.score} points</div>
          </div>
          <ScoreBoard teams={teams} activeTeamIndex={-1} className="mt-12" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="classroom-display">
      <div className="game-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display-lg font-bold mb-4">Strategy Board Quiz</h1>
          <ScoreBoard teams={teams} activeTeamIndex={activeTeamIndex} />
        </div>
        
        {/* Timer */}
        {timer && phase === 'discussion' && (
          <div className="mb-8">
            <TimerDisplay timer={timer} />
          </div>
        )}
        
        {/* Game Board */}
        <GameBoard />
        
        {/* Question Modal */}
        <QuestionModal />
        
        {/* Teacher Controls */}
        <TeacherControls
          phase={phase}
          onStartDiscussion={startDiscussionTimer}
          onMarkCorrect={() => markAnswer(true)}
          onMarkIncorrect={() => markAnswer(false)}
          onSkipSteal={skipSteal}
        />
      </div>
    </div>
  )
}
```

**Verify:**
- [ ] Game loads correctly
- [ ] All components integrate
- [ ] Timer works
- [ ] Teacher controls work
- [ ] Game complete screen shows

**Phase 9 Complete When:**
- [ ] Full game playable end-to-end
- [ ] All game phases work correctly
- [ ] UI is readable from distance
- [ ] No crashes or errors

---

## Phase 10: Game Page & Integration

**Duration:** 2-3 hours
**Dependencies:** Phase 9 complete
**Goal:** Complete game page that loads stored games

### 10.1 Game Page (2-3 hours)

Create `app/game/[id]/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/game-store'
import { getGame } from '@/lib/utils/storage'
import { getTemplate } from '@/lib/templates/registry'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const initializeGame = useGameStore(state => state.initializeGame)
  const startGame = useGameStore(state => state.startGame)
  const phase = useGameStore(state => state.phase)
  
  useEffect(() => {
    const loadGame = () => {
      try {
        // Load game from storage
        const storedGame = getGame(gameId)
        
        if (!storedGame) {
          setError('Game not found')
          return
        }
        
        // Get template
        const template = getTemplate(storedGame.templateId)
        
        // Get number of teams from content
        const numTeams = storedGame.content.board?.cells ? 
          Math.min(5, Math.max(3, Math.ceil(storedGame.content.board.cells.length / 4))) : 4
        
        // Initialize game state
        initializeGame({
          gameId: storedGame.gameId,
          templateId: storedGame.templateId,
          numTeams,
          content: storedGame.content
        })
        
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game')
        setLoading(false)
      }
    }
    
    loadGame()
  }, [gameId, initializeGame])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading game...</div>
          <div className="text-neutral-600">Please wait</div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold mb-2 text-red-600">Error</div>
          <div className="text-neutral-600 mb-6">{error}</div>
          <Button onClick={() => router.push('/generate')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generate
          </Button>
        </div>
      </div>
    )
  }
  
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Ready to Start?</h1>
          <p className="text-neutral-600 mb-8">
            Make sure your projector is set up and all teams are ready.
          </p>
          <Button size="lg" onClick={startGame}>
            Start Game
          </Button>
        </div>
      </div>
    )
  }
  
  // Render game based on template
  const template = useGameStore(state => state.templateId)
  
  if (template === 'strategy_board_quiz') {
    const StrategyBoardQuizGame = require('@/components/templates/strategy-board-quiz/StrategyBoardQuizGame').default
    return <StrategyBoardQuizGame />
  }
  
  return <div>Unknown template</div>
}
```

**Verify:**
- [ ] Game page loads
- [ ] Stored game is retrieved
- [ ] Game initializes correctly
- [ ] Start button works
- [ ] Error states handled
- [ ] Loading states shown

**Phase 10 Complete When:**
- [ ] Game page fully functional
- [ ] Integration with storage works
- [ ] Game initializes and plays
- [ ] Error handling robust

---

## Phase 11: Testing & Polish

**Duration:** 4-6 hours
**Dependencies:** Phases 1-10 complete
**Goal:** Bug-free, polished MVP ready for beta

### 11.1 End-to-End Testing (2-3 hours)

**Test Flow 1: Happy Path**
1. Visit `/generate`
2. Fill in all fields
3. Click "Generate Game"
4. Wait for generation
5. Redirected to `/game/[id]`
6. Click "Start Game"
7. Play through entire game
8. Verify game complete screen

**Test Flow 2: Rate Limiting**
1. Generate games until limit reached
2. Verify error message
3. Check localStorage for rate limit data
4. Clear data, verify reset

**Test Flow 3: Error Handling**
1. Submit invalid generation request
2. Verify error message
3. Try to load non-existent game
4. Verify error handling

**Test Flow 4: Game Mechanics**
1. Start game
2. Select cell
3. Start discussion timer
4. Mark answer correct
5. Verify points awarded
6. Verify turn switches
7. Mark answer incorrect
8. Verify steal phase
9. Mark steal correct
10. Verify game completes correctly

**Verify:**
- [ ] All flows work without errors
- [ ] State persists correctly
- [ ] Timers work accurately
- [ ] Scoring is correct

### 11.2 Projector Testing (1-2 hours)

**Test on actual projector (1920x1080):**
1. Text readability from 20+ feet
2. Colors display correctly
3. Contrast is sufficient
4. No text cutoff
5. Buttons are visible
6. Timer is clear

**Verify:**
- [ ] All text readable from back of room
- [ ] Colors are distinguishable
- [ ] UI elements are large enough
- [ ] No overflow issues

### 11.3 Bug Fixes (1-2 hours)

Document and fix any bugs found during testing.

**Common Issues to Check:**
- [ ] Timer doesn't stop properly
- [ ] Score updates incorrectly
- [ ] Cell selection doesn't work
- [ ] Modal doesn't close
- [ ] Game doesn't end
- [ ] localStorage issues
- [ ] Rate limiting bugs

### 11.4 Performance Check (30 minutes)

**Verify:**
- [ ] Page load < 3 seconds
- [ ] Generation < 30 seconds
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Responsive interactions

### 11.5 Final Polish (30 minutes)

**Check:**
- [ ] All text is clear and correct
- [ ] Spacing is consistent
- [ ] Colors follow design system
- [ ] Loading states everywhere
- [ ] Error messages are helpful
- [ ] Success messages where appropriate

**Phase 11 Complete When:**
- [ ] All test flows pass
- [ ] Projector testing successful
- [ ] All bugs fixed
- [ ] Performance acceptable
- [ ] UI is polished

---

## MVP Completion Checklist

### Technical Completeness
- [ ] AI provider abstraction works
- [ ] Content generation works reliably (>95% success)
- [ ] Validation catches all errors
- [ ] Storage persists games
- [ ] Rate limiting prevents abuse
- [ ] All components render correctly
- [ ] State management works
- [ ] Timer accuracy verified
- [ ] Scoring logic correct
- [ ] No console errors
- [ ] TypeScript compiles with no errors

### User Experience
- [ ] Generation form is clear
- [ ] Loading states are informative
- [ ] Errors are helpful
- [ ] Game is intuitive
- [ ] Readable from 20+ feet
- [ ] Teacher controls are obvious
- [ ] Game phases are clear
- [ ] Victory screen is satisfying

### Deployment
- [ ] Environment variables configured
- [ ] Vercel deployment works
- [ ] API routes function in production
- [ ] localStorage works in browser
- [ ] No CORS issues
- [ ] HTTPS works correctly

### Documentation
- [ ] README has setup instructions
- [ ] Environment variables documented
- [ ] API documented
- [ ] Component usage explained
- [ ] Known issues documented

---

## Post-MVP: Beta Testing Prep

### Before First Beta Teacher

**Prepare:**
1. Write simple user guide (1 page)
2. Create demo video (3 minutes)
3. Set up feedback form
4. Create issue tracking system
5. Prepare bug reporting instructions

**User Guide Contents:**
- How to generate a game (3 steps)
- How to play the game (teacher role)
- Troubleshooting common issues
- Contact information

**Demo Video Contents:**
- Quick overview (30 seconds)
- Generating a game (1 minute)
- Playing a game (1.5 minutes)

### Beta Testing Protocol

**Week 1: First 3 Teachers**
- Personal onboarding call
- Watch them generate first game
- Answer all questions live
- Daily check-ins

**Week 2: Add 7 More Teachers**
- Send user guide + video
- Group onboarding call
- Weekly check-ins
- Active Slack/email support

**Week 3: Feedback Collection**
- Survey all beta teachers
- Schedule individual feedback calls
- Compile issues list
- Prioritize improvements

**Week 4: Iteration**
- Fix critical bugs
- Improve prompts based on feedback
- Update documentation
- Prepare for wider launch

---

## Time Tracking

Total MVP Build Time:
- Phase 0: 4 hours
- Phase 1: 6 hours
- Phase 2: 4 hours
- Phase 3: 4 hours
- Phase 4: 5 hours
- Phase 5: 3 hours
- Phase 6: 3 hours
- Phase 7: 5 hours
- Phase 8: 4 hours
- Phase 9: 8 hours
- Phase 10: 3 hours
- Phase 11: 6 hours

**Total: 55 hours**

Spread over:
- Day 1: 8 hours (Phases 0-2)
- Day 2: 8 hours (Phases 3-5)
- Day 3: 8 hours (Phases 6-7)
- Day 4: 8 hours (Phase 8-9)
- Day 5: 8 hours (Phases 9-10)
- Day 6: 8 hours (Phase 11)
- Day 7: 7 hours (Buffer/Polish)

**Total: 7 days at ~8 hours/day**

With AI assistance: Could reduce to 4-5 intensive days.

---

## Success Criteria

**MVP is ready for beta when:**
- [ ] Generation works >95% of time
- [ ] Game plays without crashes
- [ ] UI readable from projector
- [ ] Rate limiting prevents abuse
- [ ] Storage persists games
- [ ] 10+ successful test plays
- [ ] Teacher can use without training
- [ ] Game explainable in <60 seconds
- [ ] Fun to play (tested with real students)

**Ready to proceed to next phase (monetization) when:**
- [ ] 10+ beta teachers tested
- [ ] 70%+ would pay $7.99/month
- [ ] 95%+ generation success rate
- [ ] <5 critical bugs reported
- [ ] Positive student feedback
- [ ] Teachers use it weekly

---

This completes the implementation guide. All phases are clearly defined with concrete deliverables and verification criteria.
