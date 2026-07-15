'use client'

/**
 * The one place a question is drawn, for every game and every form.
 *
 * The reveal treatment is shared across forms on purpose: the right answer fills
 * and pops, the wrong ones fade to 25%. That was already how True or False
 * Showdown behaved; MCQ now behaves the same way instead of printing its options
 * into the prompt string.
 *
 * `variant` exists because games disagree about scale, not about structure: the
 * one-question-on-screen games (Flash Round, True/False, Risk It) go hero, the
 * ones with a board or a mountain beside the question go compact.
 */

import type { RenderedQuestion } from '@/lib/questions/render'

const TRUE_GREEN = 'var(--color-correct)'
const FALSE_RED = 'var(--color-incorrect)'

export type QuestionViewVariant = 'hero' | 'compact' | 'card'

const SIZES = {
  hero: {
    prompt: 'clamp(1.8rem, 4.5vw, 3.2rem)',
    answer: 'clamp(2rem, 5.5vw, 3.6rem)',
    option: 'clamp(1rem, 1.8vw, 1.5rem)',
    panel: 'clamp(1.5rem, 3.5vw, 2.2rem)',
    gap: 'gap-8',
  },
  compact: {
    prompt: 'clamp(1.2rem, 2.4vw, 1.9rem)',
    answer: 'clamp(1.4rem, 2.8vw, 2.1rem)',
    option: 'clamp(0.85rem, 1.3vw, 1.05rem)',
    panel: 'clamp(1rem, 2vw, 1.4rem)',
    gap: 'gap-5',
  },
  // Three cards share the width, so everything shrinks and the prompt has to
  // survive both "24 + 16 = ?" and a fifteen-word question.
  card: {
    prompt: 'clamp(0.95rem, 1.35vw, 1.35rem)',
    answer: 'clamp(1rem, 1.5vw, 1.4rem)',
    option: 'clamp(0.7rem, 0.9vw, 0.9rem)',
    panel: 'clamp(0.8rem, 1.1vw, 1.05rem)',
    gap: 'gap-3',
  },
} as const

export interface QuestionViewProps {
  question: RenderedQuestion
  revealed: boolean
  variant?: QuestionViewVariant
  /** Hide the answer line for games that show the answer in their own chrome. */
  showAnswer?: boolean
  /**
   * Value for `data-tutorial` on the prompt. Pass null when several questions are
   * on screen at once — the overlay targets the first match, so duplicate hooks
   * would spotlight an arbitrary card.
   */
  tutorialTarget?: string | null
}

export function QuestionView({
  question,
  revealed,
  variant = 'hero',
  showAnswer = true,
  tutorialTarget = 'question',
}: QuestionViewProps) {
  const size = SIZES[variant]

  return (
    <div className={`flex w-full flex-col items-center justify-center ${size.gap} text-center`}>
      <div
        data-tutorial={tutorialTarget ?? undefined}
        className="max-h-full overflow-y-auto break-words font-display font-extrabold leading-tight tracking-tight"
        style={{ fontSize: size.prompt, maxWidth: '900px' }}
      >
        {question.prompt}
      </div>

      {question.form === 'mcq' && question.options && (
        <div
          className={variant === 'card' ? 'grid w-full gap-1.5' : 'grid w-full gap-3'}
          style={{
            maxWidth: '900px',
            gridTemplateColumns:
              variant === 'card'
                ? '1fr'
                : 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          }}
        >
          {question.options.map((opt) => {
            const isAnswer = revealed && opt.correct
            const dimmed = revealed && !opt.correct
            return (
              <div
                key={opt.label}
                className={
                  variant === 'card'
                    ? 'flex items-center gap-2 rounded-[var(--radius-md)] border-2 px-2 py-1.5 text-left font-display font-bold transition-all'
                    : 'flex items-center gap-3 rounded-[var(--radius-lg)] border-2 px-4 py-3 text-left font-display font-bold transition-all'
                }
                style={{
                  fontSize: size.option,
                  borderColor: isAnswer ? TRUE_GREEN : 'var(--color-border-strong)',
                  background: isAnswer ? TRUE_GREEN : 'transparent',
                  color: isAnswer ? '#fff' : 'var(--color-text-primary)',
                  opacity: dimmed ? 0.25 : 1,
                  transform: isAnswer ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <span
                  className={
                    variant === 'card'
                      ? 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-extrabold'
                      : 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-extrabold'
                  }
                  style={{
                    background: isAnswer ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-alt)',
                    color: isAnswer ? '#fff' : 'var(--color-text-muted)',
                  }}
                >
                  {opt.label}
                </span>
                <span className="min-w-0 break-words">{opt.text}</span>
              </div>
            )
          })}
        </div>
      )}

      {question.form === 'truefalse' && (
        <div className={variant === 'card' ? 'flex gap-2' : 'flex gap-5'}>
          {[true, false].map((value) => {
            const label = value ? 'TRUE' : 'FALSE'
            const color = value ? TRUE_GREEN : FALSE_RED
            const isAnswer = revealed && question.isTrue === value
            const dimmed = revealed && !isAnswer
            return (
              <div
                key={label}
                className="rounded-[var(--radius-lg)] border-2 text-center font-display font-extrabold transition-all"
                style={{
                  width:
                    variant === 'hero'
                      ? 'clamp(140px, 20vw, 220px)'
                      : variant === 'card'
                        ? 'clamp(58px, 6vw, 80px)'
                        : 'clamp(100px, 12vw, 150px)',
                  padding: variant === 'hero' ? '26px 0' : variant === 'card' ? '6px 0' : '16px 0',
                  fontSize: size.panel,
                  letterSpacing: '0.04em',
                  borderColor: color,
                  background: isAnswer ? color : 'transparent',
                  color: isAnswer ? '#fff' : color,
                  opacity: dimmed ? 0.25 : 1,
                  transform: isAnswer ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                {label}
              </div>
            )
          })}
        </div>
      )}

      {revealed && showAnswer && question.form === 'open' && (
        <div>
          <div
            className="font-display font-extrabold tracking-tight"
            style={{ fontSize: size.answer, color: 'var(--color-accent)' }}
          >
            {question.answer}
          </div>
          {question.answerDetail && (
            <p className="mt-3 text-base text-text-muted">{question.answerDetail}</p>
          )}
        </div>
      )}

      {revealed && question.answerDetail && question.form !== 'open' && (
        <p className="max-w-[640px] text-lg text-text-muted">{question.answerDetail}</p>
      )}
    </div>
  )
}
