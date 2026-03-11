'use client'

import { cn } from '@/lib/utils/cn'
import { TIMER_PRE_COUNTDOWN_SECONDS } from '@/lib/store/game-store'
import type { TimerState } from '@/lib/store/game-store'

interface TimerDisplayProps {
  timer: TimerState
  /** When true, no border/box — timer looks part of the card. */
  inline?: boolean
  className?: string
}

export function TimerDisplay({ timer, inline = true, className }: TimerDisplayProps) {
  const pre = timer.preCountdownSeconds ?? TIMER_PRE_COUNTDOWN_SECONDS
  const inPrePhase = timer.remaining > timer.duration - pre
  const readySeconds = Math.floor(pre / 2)
  const prePhaseStep =
    inPrePhase && timer.remaining > timer.duration - readySeconds
      ? 'ready'
      : inPrePhase
        ? 'go'
        : null

  const countdownTotal = Math.max(0, timer.duration - pre)
  const countdownRemaining = Math.max(0, timer.remaining - pre)
  const showCountdown = !inPrePhase
  const isExpired = timer.remaining === 0 && !timer.isActive

  const label = timer.type === 'discussion' ? 'Discussion' : 'Steal'
  const isWarning = timer.isWarning && !isExpired && countdownRemaining > 0

  const countdownNumber = showCountdown ? countdownRemaining : null

  const content = (
    <>
      {isExpired ? (
        <div className="font-display text-5xl sm:text-6xl font-extrabold leading-none text-[var(--color-incorrect)]">
          TIME UP
        </div>
      ) : prePhaseStep === 'ready' ? (
        <div className="sbq-stamp font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none text-text-primary tracking-tight bg-surfaceAlt px-6 py-3 rounded-[var(--radius-md)]">
          READY!
        </div>
      ) : prePhaseStep === 'go' ? (
        <div className="sbq-stamp font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight bg-phase-discussionBg text-phase-discussion px-6 py-3 rounded-[var(--radius-md)]">
          GO!
        </div>
      ) : (
        <>
          <div
            className={cn(
              'font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tabular-nums',
              timer.type === 'discussion' ? 'text-phase-discussion' : 'text-phase-steal',
              isWarning && 'timer--warning'
            )}
          >
            {countdownNumber}
          </div>
          <div className="text-sm text-text-muted mt-1">seconds</div>
        </>
      )}
    </>
  )

  if (inline) {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        {content}
        {!isExpired && !inPrePhase && (
          <div className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.16em]">
            {label}
            {countdownTotal > 0 ? ` (${countdownTotal}s)` : ''}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'px-6 py-4 rounded-[var(--radius-md)] border-2 bg-surface shadow-lg min-w-[140px]',
        isWarning && !isExpired && 'border-phase-warning',
        !isWarning && !isExpired && 'border-[var(--color-border)]',
        isExpired && 'border-[var(--color-incorrect)]',
        className
      )}
    >
      {content}
      {!isExpired && (
        <div className="text-xs text-text-muted mt-1 font-mono uppercase tracking-[0.16em]">
          {label}
        </div>
      )}
    </div>
  )
}
