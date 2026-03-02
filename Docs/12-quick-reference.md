# Quick Reference Guide

## For Your AI Code Assistant

This document provides quick patterns for common tasks when building this application.

---

## File Creation Patterns

### New Component

```typescript
// components/shared/ComponentName.tsx
import { cn } from '@/lib/utils'

interface Props {
  // Required props
  data: string
  // Optional props
  className?: string
  onAction?: () => void
}

export function ComponentName({ data, className, onAction }: Props) {
  return (
    <div className={cn("base-classes", className)}>
      {data}
    </div>
  )
}
```

### New Page

```typescript
// app/route-name/page.tsx
export default function RouteName() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <h1>Page Title</h1>
    </div>
  )
}
```

### New API Route

```typescript
// app/api/route-name/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process request
    const result = await processRequest(body)
    
    return NextResponse.json({ success: true, data: result })
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## Zustand Store Patterns

### Adding New State

```typescript
// In game-store.ts
interface GameStore {
  // ... existing state
  newField: string
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // ... existing state
    newField: 'default',
    
    // ... existing actions
  }))
)
```

### Adding New Action

```typescript
setNewField: (value: string) => {
  set(state => {
    state.newField = value
  })
}
```

### Adding New Selector

```typescript
// Outside store definition
export const useNewSelector = () => {
  return useGameStore(state => {
    // Compute derived value
    return state.someField.map(x => x.value)
  })
}
```

---

## Component Usage Patterns

### Using Store in Component

```typescript
'use client'

import { useGameStore } from '@/lib/store/game-store'

export function MyComponent() {
  // Select only needed state
  const phase = useGameStore(state => state.phase)
  const teams = useGameStore(state => state.teams)
  
  // Get actions
  const startGame = useGameStore(state => state.startGame)
  
  return (
    <div>
      <p>Phase: {phase}</p>
      <button onClick={startGame}>Start</button>
    </div>
  )
}
```

### Using Shared Components

```typescript
import { TeamScoreCard } from '@/components/shared/TeamScoreCard'
import { TimerDisplay } from '@/components/shared/TimerDisplay'

<TeamScoreCard team={team} isActive={isActive} />
<TimerDisplay timer={timer} />
```

### Conditional Rendering

```typescript
{phase === 'discussion' && timer && (
  <TimerDisplay timer={timer} />
)}

{teams.map((team, idx) => (
  <TeamScoreCard
    key={team.id}
    team={team}
    isActive={idx === activeTeamIndex}
  />
))}
```

---

## Styling Patterns

### Basic Styles

```typescript
<div className="flex items-center justify-between p-4 rounded-lg">
```

### Conditional Styles

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base classes",
  condition && "conditional classes",
  isActive ? "active classes" : "inactive classes"
)}>
```

### Team Colors

```typescript
<div className={cn(
  `bg-team-${team.color}`,  // Dynamic team color
  "text-white"
)}>
```

### Responsive Sizing

```typescript
<h1 className="text-4xl md:text-5xl lg:text-6xl">
```

---

## Zod Schema Patterns

### Basic Schema

```typescript
import { z } from 'zod'

const MySchema = z.object({
  requiredString: z.string(),
  optionalString: z.string().optional(),
  numberInRange: z.number().min(1).max(10),
  enumValue: z.enum(['option1', 'option2']),
  arrayOfStrings: z.array(z.string()).min(1)
})

export type MyType = z.infer<typeof MySchema>
```

### Refinement (Cross-Field Validation)

```typescript
const MySchema = z.object({
  rows: z.number(),
  cols: z.number(),
  cells: z.array(z.any())
}).refine(
  (data) => data.cells.length === data.rows * data.cols,
  {
    message: "cells.length must equal rows × cols"
  }
)
```

### Using Schema

```typescript
try {
  const validated = MySchema.parse(data)
  // Use validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors)
  }
}
```

---

## API Call Patterns

### Client-Side Fetch

```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Request failed')
    }
    
    const result = await response.json()
    return result
    
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
```

### Server-Side API Call (to AI provider)

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.AI_API_KEY!,
    'anthropic-version': '2023-06-01' // Example for Anthropic; other providers differ
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
})

const data = await response.json()
const text = data.content[0].text
```

---

## Common Tasks

### Add a New Game Phase

1. Update `GamePhase` type:
```typescript
type GamePhase = 
  | 'existing_phase'
  | 'new_phase'  // Add here
```

2. Add transition logic in actions:
```typescript
someAction: () => {
  set(state => {
    // ... do something
    state.phase = 'new_phase'
  })
}
```

3. Update teacher controls:
```typescript
{phase === 'new_phase' && (
  <Button onClick={handleNewPhase}>
    Action for New Phase
  </Button>
)}
```

### Add a New Team Color

1. Update Tailwind config:
```javascript
colors: {
  team: {
    // ... existing colors
    orange: '#EA580C'
  }
}
```

2. Update type definition:
```typescript
type TeamColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'
```

3. Add to initialization:
```typescript
const teamColors: TeamColor[] = [..., 'orange']
```

### Add a New Template

1. Create schema file:
```typescript
// lib/schemas/my-template.ts
export const MyTemplateContentSchema = z.object({
  // Define content structure
})
```

2. Create template definition:
```typescript
// lib/templates/my-template.ts
export const myTemplate: GameTemplate = {
  id: 'my_template',
  name: 'My Template',
  contentSchema: MyTemplateContentSchema,
  generatePrompt: (params) => `...`,
  RuntimeComponent: MyTemplateGame,
  controls: { ... }
}
```

3. Register template:
```typescript
// lib/templates/registry.ts
import myTemplate from './my-template'

export const templateRegistry = {
  // ... existing
  my_template: myTemplate
}
```

4. Create components:
```
components/templates/my-template/
  MyTemplateGame.tsx
  SpecificComponent.tsx
```

---

## Debugging Patterns

### Log Store State

```typescript
// In browser console
window.gameStore = useGameStore.getState()
console.log(gameStore.phase)
console.log(gameStore.teams)
```

### Subscribe to State Changes

```typescript
useEffect(() => {
  const unsubscribe = useGameStore.subscribe(
    (state) => state.phase,
    (phase, prevPhase) => {
      console.log(`Phase: ${prevPhase} → ${phase}`)
    }
  )
  
  return unsubscribe
}, [])
```

### Inspect Generated Content

```typescript
// In API route
console.log('Generated content:', JSON.stringify(content, null, 2))
```

### Test Store Action

```typescript
// In component
<button onClick={() => {
  console.log('Before:', useGameStore.getState().phase)
  useGameStore.getState().someAction()
  console.log('After:', useGameStore.getState().phase)
}}>
  Test Action
</button>
```

---

## Testing Patterns

### Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent data="test" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

### Store Test

```typescript
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from './game-store'

test('action updates state', () => {
  const { result } = renderHook(() => useGameStore())
  
  act(() => {
    result.current.someAction()
  })
  
  expect(result.current.phase).toBe('expected_phase')
})
```

### Schema Test

```typescript
test('validates valid data', () => {
  const validData = { /* ... */ }
  expect(() => MySchema.parse(validData)).not.toThrow()
})

test('rejects invalid data', () => {
  const invalidData = { /* ... */ }
  expect(() => MySchema.parse(invalidData)).toThrow()
})
```

---

## Environment Setup

### Required Files

**.env.local** (create this, never commit):
```bash
AI_PROVIDER=anthropic           # or openai, google, etc.
AI_API_KEY=sk-...               # API key for the chosen provider
AI_MODEL=claude-sonnet-4-20250514  # Optional: override default model
```

**.gitignore** (should include):
```
.env.local
.env*.local
node_modules
.next
```

**package.json** (key dependencies):
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0"
  }
}
```

---

## Common Errors & Fixes

### "Cannot find module"
**Fix:** Check import path, ensure file exists, restart dev server

### "Hydration error"
**Fix:** Ensure client/server rendered content matches, add `'use client'` directive

### "Cannot read property of undefined"
**Fix:** Add optional chaining: `state.field?.subfield` or check: `state.field && ...`

### "Maximum update depth exceeded"
**Fix:** Check for infinite loops in useEffect, ensure dependencies array is correct

### Store not updating component
**Fix:** Ensure selector returns different reference, check subscription

### Tailwind classes not applying
**Fix:** Check class name is valid, restart dev server, verify Tailwind config

---

## Performance Tips

### Optimize Selectors

```typescript
// Bad: Creates new array every render
const items = useGameStore(state => state.items.map(x => x.value))

// Good: Only re-render if array actually changes
const items = useGameStore(
  state => state.items.map(x => x.value),
  shallow
)
```

### Memoize Expensive Computations

```typescript
import { useMemo } from 'react'

const sortedTeams = useMemo(
  () => teams.sort((a, b) => b.score - a.score),
  [teams]
)
```

### Avoid Inline Functions

```typescript
// Bad: Creates new function every render
<button onClick={() => handleClick(id)}>

// Good: Use useCallback or bind
const onClick = useCallback(() => handleClick(id), [id])
<button onClick={onClick}>
```

---

## Git Workflow

### Commit Messages

```bash
# Feature
git commit -m "feat: Add timer display component"

# Bug fix
git commit -m "fix: Correct steal phase transition"

# Refactor
git commit -m "refactor: Extract board logic to separate function"

# Documentation
git commit -m "docs: Update API specification"
```

### Branch Strategy (if using)

```bash
# Create feature branch
git checkout -b feature/timer-component

# Work on feature
git add .
git commit -m "feat: Add timer component"

# Merge back
git checkout main
git merge feature/timer-component
```

---

## Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set in hosting platform
- [ ] Build succeeds: `npm run build`
- [ ] Test production build: `npm run start`
- [ ] API key secured (not in code)
- [ ] README updated

---

## Key File Locations Reference

```
sparkpack/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── generate/page.tsx          # Generation form
│   ├── game/[id]/page.tsx         # Game runtime
│   └── api/generate-game/route.ts # Generation API
│
├── components/
│   ├── shared/                    # Cross-template
│   │   ├── TeamScoreCard.tsx
│   │   ├── TimerDisplay.tsx
│   │   └── TeacherControls.tsx
│   └── templates/                 # Template-specific
│       └── strategy-board-quiz/
│
├── lib/
│   ├── store/game-store.ts        # Zustand store
│   ├── schemas/                   # Zod schemas
│   └── templates/                 # Template definitions
│
└── styles/globals.css             # Global styles
```

---

## When You're Stuck

1. **Read error message carefully** - It usually tells you exactly what's wrong
2. **Check relevant doc file** - Design system, API spec, state management, etc.
3. **Test with simpler version** - Comment out complex parts, test basic functionality
4. **Check browser console** - Look for warnings and errors
5. **Verify data flow** - Log values at each step
6. **Ask for help** - Provide: error message, what you expected, what you tried

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build
npm run lint             # Run ESLint

# Testing
npm test                 # Run tests
npm test -- --watch      # Watch mode

# Package Management
npm install package      # Add dependency
npm install -D package   # Add dev dependency
npm uninstall package    # Remove dependency

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to remote

# Vercel Deployment
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
```

---

## Useful Browser DevTools

### React DevTools
- Install: Chrome/Firefox extension
- Inspect component tree
- View props and state
- Profile performance

### Zustand DevTools
```typescript
// Add to store creation
import { devtools } from 'zustand/middleware'

export const useGameStore = create<GameStore>()(
  devtools(
    immer(/* store */),
    { name: 'GameStore' }
  )
)
```

Then use Redux DevTools extension to inspect store.

---

This quick reference should help your code assistant quickly find the right pattern for common tasks. For deeper understanding, refer to the main documentation files.
