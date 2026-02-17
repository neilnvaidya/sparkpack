# Master Plan: AI-Powered Classroom Game Generator

## Executive Summary

**Product:** Web application that generates classroom review games using AI, playable on a single projected screen without student devices.

**Core Value Proposition:** Teachers generate custom, content-specific review games in under 30 seconds instead of spending 20-30 minutes creating them manually.

**Target Market:** Primary and secondary teachers (P3-S2 / ages 7-14) who need engaging review activities.

**Business Model:** Freemium SaaS with school licensing option.

---

## Critical Decisions (Non-Negotiable)

### Architecture Decisions

1. **Single-Screen Design** - All content displays on one teacher-controlled screen (projector). No student devices required. This is the core differentiator.

2. **Fixed Mechanics + Variable Content** - Game rules are coded. AI only generates content (questions, answers, prompts). AI never generates game mechanics.

3. **Upfront Generation** - All content generates before game starts. No lazy loading during gameplay. 20-30 second wait is acceptable.

4. **Manual Answer Validation** - Teacher clicks "Correct" or "Incorrect". No automatic answer checking in MVP.

5. **Model-Agnostic AI** - Abstraction layer supports any LLM provider (OpenAI, Anthropic, Google, local models). Provider choice deferred to implementation phase.

### Scope Decisions

**MVP INCLUDES:**
- One perfect template (Strategy Board Quiz)
- AI content generation
- Complete game runtime
- Teacher controls
- Timer system
- Score tracking
- localStorage persistence
- Basic rate limiting

**MVP EXCLUDES:**
- User authentication
- Multiple templates
- Database persistence
- Game sharing
- Content editing
- Mobile optimization
- Analytics dashboard

### Technology Stack (Final)

```
Frontend:     Next.js 14+ (App Router)
Styling:      Tailwind CSS + shadcn/ui
State:        Zustand with Immer
Validation:   Zod
AI:           Provider-agnostic abstraction layer
Deployment:   Vercel
Persistence:  localStorage (MVP), PostgreSQL (post-MVP)
```

### Business Model (Final)

**Phase 1 (Weeks 1-3): Free Beta**
- 10-20 hand-selected teachers
- Free unlimited use
- Track quality and usage metrics
- Goal: Validate product-market fit

**Phase 2 (Month 2): Freemium Launch**
```
Free Tier:
- 5 games/month
- Basic template
- No saving games
- Community support

Premium ($7.99/month):
- Unlimited games
- Save/replay games
- All templates (when available)
- Email support
- Early access to new features

Annual: $79.99/year (17% discount)
```

**Phase 3 (Month 4+): School Licensing**
```
School License ($399/year):
- Unlimited faculty use
- School game library
- Admin dashboard
- Priority support
- Custom branding (optional)
- Professional development session
```

**Revenue Targets:**
- Month 3: 10 paying users = $80/month
- Month 6: 50 paying users = $400/month
- Month 12: 200 paying users + 5 schools = $3,600/month
- Year 1 Total: ~$15,000 revenue

---

## Development Phases

### Phase 0: Setup (4 hours)

**Goal:** Development environment ready

**Deliverables:**
- Next.js project initialized
- Tailwind configured
- shadcn/ui installed
- Environment structure
- Git repository
- Vercel project created

**Success Criteria:**
- `npm run dev` works
- Basic page renders
- Deployment pipeline works

---

### Phase 1: MVP for Beta Testing (3-4 days)

**Goal:** One perfect template, playable end-to-end, ready for teacher testing

#### Day 1: Foundation (6-8 hours)

**Morning: Core Infrastructure**
- Design system implementation (colors, typography, components)
- Shared UI components (Button, Card, Modal)
- Layout structure
- Routing setup

**Afternoon: AI Abstraction Layer**
- AI provider interface definition
- Content generation pipeline structure
- Zod schema for Strategy Board Quiz
- Validation framework

**Deliverables:**
- `/app/layout.tsx` with design system
- `/components/ui/*` components
- `/lib/ai/provider-interface.ts`
- `/lib/schemas/strategy-board-quiz-schema.ts`

**Success Criteria:**
- Design system renders correctly
- Type definitions compile
- Basic navigation works

#### Day 2: Generation Pipeline (6-8 hours)

**Morning: Template System**
- Template registry structure
- Strategy Board Quiz template definition
- Generation prompt engineering
- Template metadata

**Afternoon: Generation Flow**
- Generation form UI
- API route structure
- Provider abstraction implementation
- Response parsing and validation

**Deliverables:**
- `/lib/templates/strategy-board-quiz.ts`
- `/app/generate/page.tsx`
- `/app/api/generate-game/route.ts`
- `/lib/ai/generate.ts`

**Success Criteria:**
- Form collects all required inputs
- API route receives and validates request
- Generation returns valid JSON (mock data acceptable)

#### Day 3: Game Runtime (6-8 hours)

**Morning: State Management**
- Zustand store setup
- Game state machine
- Team management
- Score tracking

**Afternoon: Core Game Components**
- Game board component
- Team score display
- Timer component
- Phase management

**Deliverables:**
- `/lib/store/game-store.ts`
- `/components/templates/strategy-board-quiz/GameBoard.tsx`
- `/components/shared/TeamScoreCard.tsx`
- `/components/shared/TimerDisplay.tsx`

**Success Criteria:**
- Store manages state correctly
- Board displays generated content
- Timer counts down
- Scores update on teacher input

#### Day 4: Polish & Testing (4-6 hours)

**Morning: Teacher Controls**
- Control panel component
- Phase-specific actions
- Keyboard shortcuts
- Error handling

**Afternoon: Integration & Testing**
- localStorage persistence
- Basic rate limiting
- End-to-end testing
- Real projector testing
- Bug fixes

**Deliverables:**
- `/components/shared/TeacherControls.tsx`
- `/lib/utils/storage.ts`
- `/lib/utils/rate-limiting.ts`
- Tested, working MVP

**Success Criteria:**
- Generate → Play → Complete works perfectly
- Game survives browser refresh
- Readable from back of classroom on projector
- Rate limit prevents API abuse
- Teacher can explain game in <60 seconds to students

**Phase 1 Complete When:**
- [ ] Single template generates valid content 95%+ of time
- [ ] Game plays without crashes
- [ ] UI readable from 20+ feet away
- [ ] Teacher controls intuitive (no training needed)
- [ ] localStorage preserves game state
- [ ] Rate limiting prevents API abuse
- [ ] Deployable to Vercel
- [ ] Ready for teacher beta testing

---

### Phase 2: Beta Testing & Iteration (2-3 weeks)

**Goal:** Validate product-market fit with real teachers

**Week 1: Recruitment**
- Identify 10-20 beta teachers
- Onboard via video call
- Provide clear instructions
- Set expectations

**Week 2-3: Testing**
- Teachers use in real classrooms
- Collect feedback daily
- Monitor generation quality
- Track usage patterns
- Fix critical bugs immediately

**Key Metrics to Track:**
```
Generation Quality:
- Success rate (target: >95%)
- Time to generate (target: <30s)
- Regeneration rate (target: <20%)

Usage Patterns:
- Games per teacher per week
- Game completion rate
- Repeat usage rate

User Experience:
- Time from idea to playing
- Student engagement (teacher reported)
- Technical issues count
- Teacher satisfaction (1-10)

Value Assessment:
- Would pay $7.99/month? (target: >70%)
- Would recommend? (target: >80%)
- Would use weekly? (target: >60%)
```

**Decision Point (End of Week 3):**

**If Metrics Hit Targets:**
→ Proceed to Phase 3 (Monetization)

**If Metrics Miss Targets:**
→ Iterate on prompts and UX, extend beta 2 more weeks

**If Fundamental Problems:**
→ Pivot or pause project

---

### Phase 3: Monetization & Launch (1-2 weeks)

**Goal:** Launch freemium model, acquire first paying customers

**Week 1: Build Monetization**
- Email authentication (magic link)
- Stripe integration
- Usage tracking
- Tier enforcement
- Upgrade flow

**Week 2: Public Launch**
- Landing page
- Pricing page
- Documentation
- Onboarding flow
- Email sequences

**Deliverables:**
- `/app/auth/*` - Authentication flow
- `/app/pricing/page.tsx` - Pricing page
- `/lib/stripe/` - Payment integration
- Landing page with clear value prop

**Success Criteria:**
- Free tier: 5 games/month enforced
- Premium tier: Stripe payment works
- Upgrade flow is smooth
- First 10 paying customers

**Phase 3 Complete When:**
- [ ] Authentication works reliably
- [ ] Payment processing successful
- [ ] Tier limits enforced
- [ ] 10 paying customers acquired
- [ ] Monthly recurring revenue > $70

---

### Phase 4: Scale & Expand (Month 3-6)

**Goal:** Add features, grow user base, prove business viability

**Month 3: Second Template**
- Design and build Timed Relay template
- Validate template system scalability
- A/B test which template is preferred

**Month 4: Persistence & Sharing**
- PostgreSQL database
- Save game functionality
- Share game with colleagues
- Game library

**Month 5: School Features**
- School license tier
- Multi-teacher access
- School game library
- Admin dashboard
- Usage reports

**Month 6: Growth**
- Referral program
- Content marketing
- Teacher community
- Third template
- Mobile optimization

**Success Criteria:**
- 200+ active users
- 50+ paying customers
- 3-5 school licenses
- $3,000+ MRR
- <5% monthly churn

---

## AI Provider Abstraction Design

### Provider Interface

All AI providers must implement this interface:

```typescript
interface AIProvider {
  name: string
  generateContent(
    prompt: string,
    options: GenerationOptions
  ): Promise<GenerationResult>
  validateConnection(): Promise<boolean>
  estimateCost(promptTokens: number, outputTokens: number): number
}

interface GenerationOptions {
  model: string
  maxTokens: number
  temperature: number
  systemPrompt?: string
}

interface GenerationResult {
  content: string
  tokensUsed: {
    input: number
    output: number
  }
  model: string
  cost: number
}
```

### Provider Implementation Structure

```
lib/ai/
├── provider-interface.ts       # Interface definition
├── providers/
│   ├── anthropic.ts           # Anthropic Claude implementation
│   ├── openai.ts              # OpenAI GPT implementation
│   ├── google.ts              # Google Gemini implementation
│   └── local.ts               # Local model implementation
├── generate.ts                # Main generation logic
└── config.ts                  # Provider configuration
```

### Provider Selection

Provider chosen via environment variable:

```bash
AI_PROVIDER=anthropic  # or openai, google, local
AI_MODEL=claude-sonnet-4-20250514  # provider-specific model
AI_API_KEY=...
```

### Cost Tracking

Every generation logs:
- Provider used
- Model used
- Tokens consumed
- Estimated cost
- Success/failure

This enables:
- Cost comparison between providers
- Usage-based pricing calculations
- Cost optimization decisions

---

## Risk Mitigation Strategies

### Risk 1: AI Generation Quality <95%

**Mitigation:**
- Extensive prompt engineering before beta
- Test with 100+ generations per template
- A/B test different prompt approaches
- Quick regeneration button
- Manual override capability

**Fallback:**
- Pre-generated example games as backup
- Template library of proven content

### Risk 2: Cost Spiral

**Mitigation:**
- Rate limiting from day 1 (localStorage)
- Email gate before public launch
- Usage monitoring dashboard
- API spend alerts
- Free tier caps

**Trigger Points:**
- Alert at $100/day spend
- Circuit breaker at $500/day spend

### Risk 3: Technical Reliability in Classroom

**Mitigation:**
- Extensive testing on real projectors
- localStorage persistence
- Clear error recovery
- Offline capability (saved games)
- Simple, robust code

**Support Plan:**
- Quick response Slack channel for beta teachers
- Screen share debugging sessions
- Comprehensive error logging

### Risk 4: Low Teacher Adoption

**Mitigation:**
- Laser focus on onboarding UX
- Video tutorials
- Live demo sessions
- Teacher community/feedback loop
- Word-of-mouth incentives

**Pivot Options:**
- B2B2C via curriculum publishers
- District sales model
- Homeschool/tutor market

---

## Success Metrics by Phase

### Phase 1 (MVP Beta)
- [ ] Generation success rate: >95%
- [ ] Generation time: <30 seconds
- [ ] Game completion rate: >90%
- [ ] Zero crashes during testing
- [ ] Teacher satisfaction: >8/10

### Phase 2 (Beta Testing)
- [ ] 15+ teachers actively testing
- [ ] 70%+ would pay $7.99/month
- [ ] 80%+ would recommend
- [ ] 60%+ would use weekly
- [ ] <10% regeneration rate

### Phase 3 (Launch)
- [ ] 10+ paying customers in first month
- [ ] <5% payment failure rate
- [ ] <10% churn rate
- [ ] $80+ MRR

### Phase 4 (Scale)
- [ ] 200+ total users
- [ ] 50+ paying customers
- [ ] 3-5 school licenses
- [ ] $3,000+ MRR
- [ ] Break-even on costs

---

## Quality Standards (Non-Negotiable)

### Code Quality
- TypeScript strict mode
- No `any` types
- Zod validation on all external data
- Error boundaries on all components
- Comprehensive error handling

### UX Quality
- <3 second page loads
- <30 second generation time
- Readable from 20+ feet
- Zero training needed for teachers
- Works on 1920x1080 projectors

### Content Quality
- Age-appropriate 100% of time
- Answerable orally in <10 seconds
- Clear difficulty progression
- No external materials required
- Culturally sensitive

### Business Quality
- Uptime >99.5%
- Support response <24 hours
- Data backup daily
- Cost per generation <$0.05
- Monthly cost per user <$2

---

## Open Questions (To Be Decided During Beta)

1. **Optimal AI Provider?**
   - Test cost vs quality tradeoff
   - Decide in Phase 2 based on data

2. **Ideal Free Tier Limit?**
   - Test 3, 5, or 10 games/month
   - Optimize for conversion

3. **School Pricing?**
   - Test $299, $399, $499/year
   - Based on school feedback

4. **Second Template Priority?**
   - Choose based on teacher requests
   - Validate during beta

---

## Project Timeline Summary

```
Week 0:     Setup (4 hours)
Week 1:     MVP Development (3-4 days)
Week 2:     Beta Recruitment + Fix Critical Bugs
Week 3-4:   Beta Testing + Iteration
Week 5:     Decision Point + Monetization Build
Week 6:     Public Launch
Week 7-12:  Scale to 50 paying customers
Month 4-6:  Expand features, prove viability
```

**Total Time to Validation:** 4-5 weeks
**Total Time to Revenue:** 5-6 weeks
**Total Time to Viability:** 3-6 months

---

## Investment Summary

**Time Investment:**
- MVP: 30-40 hours
- Beta: 20-30 hours
- Launch: 20-30 hours
- Scale: 100+ hours
- **Total to validation: ~80 hours**

**Financial Investment:**
- API costs (beta): $100-200
- Hosting: $20/month
- Domain: $12/year
- Stripe fees: 2.9% + $0.30
- **Total to validation: <$300**

**Risk-Adjusted ROI:**
- Probability of success: 60-70%
- Expected Year 1 revenue: $10,000-20,000
- Investment: ~$1,000 (time + money)
- Expected ROI: 10x-20x

---

## Next Steps

1. **Review this document** - Ensure complete agreement on all decisions
2. **Choose AI provider for MVP** - Test Anthropic vs OpenAI with sample prompts
3. **Begin Phase 0** - Set up development environment
4. **Build MVP** - Follow Phase 1 schedule exactly
5. **Recruit beta teachers** - Start building list during Phase 1

---

## Document Structure

This master plan references these detailed documents:

```
00-MASTER-PLAN.md              ← You are here
01-system-architecture.md      ← Technical architecture details
02-template-system.md          ← Template structure and design
03-design-system.md            ← UI/UX specifications
04-ai-provider-abstraction.md  ← AI integration details
05-state-management.md         ← Zustand store architecture
06-implementation-guide.md     ← Build order and code structure
07-testing-strategy.md         ← Testing and validation approach
```

All ambiguity has been removed. All decisions are final. Implementation begins now.
