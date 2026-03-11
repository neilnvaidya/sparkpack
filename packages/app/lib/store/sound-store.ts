import { create } from 'zustand'

export type SoundId =
  | 'cell_select'
  | 'timer_start'
  | 'timer_warning'
  | 'correct'
  | 'incorrect'
  | 'steal_correct'
  | 'game_end'

interface SoundStore {
  muted: boolean
  toggleMuted: () => void
  play: (id: SoundId) => void
}

// Single shared AudioContext for all sounds
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (audioCtx) return audioCtx
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    audioCtx = new AC()
    return audioCtx
  } catch {
    return null
  }
}

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.4,
  type: OscillatorType = 'triangle'
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)

  // Envelope: quick attack, decay, then release
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}

export const useSoundStore = create<SoundStore>((set, get) => {
  const initialMuted =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('sparkpack_muted') === '1'
      : false

  return {
    muted: initialMuted,
    toggleMuted: () =>
      set((state) => {
        const next = !state.muted
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('sparkpack_muted', next ? '1' : '0')
        }
        return { muted: next }
      }),
    play: (id: SoundId) => {
      if (typeof window === 'undefined') return
      if (get().muted) return

      const ctx = getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime

      try {
        switch (id) {
          case 'cell_select': {
            // E5, short marimba-like tap
            playNote(ctx, 659.25, now, 0.22, 0.3, 'triangle')
            break
          }
          case 'timer_start': {
            // C5 → G5 ascending
            playNote(ctx, 523.25, now, 0.18, 0.25, 'triangle')
            playNote(ctx, 783.99, now + 0.15, 0.18, 0.25, 'triangle')
            break
          }
          case 'timer_warning': {
            // Soft ticking A4
            playNote(ctx, 440, now, 0.12, 0.2, 'sine')
            break
          }
          case 'correct': {
            // C5 → E5 → G5 arpeggio, then brief chord
            const base = now
            playNote(ctx, 523.25, base, 0.2, 0.3, 'triangle')
            playNote(ctx, 659.25, base + 0.05, 0.2, 0.3, 'triangle')
            playNote(ctx, 783.99, base + 0.1, 0.2, 0.3, 'triangle')
            playNote(ctx, 523.25, base + 0.2, 0.3, 0.25, 'triangle')
            playNote(ctx, 659.25, base + 0.2, 0.3, 0.25, 'triangle')
            playNote(ctx, 783.99, base + 0.2, 0.3, 0.2, 'sawtooth')
            break
          }
          case 'steal_correct': {
            // Same pattern as correct, one octave higher
            const base = now
            playNote(ctx, 1046.5, base, 0.2, 0.3, 'triangle')
            playNote(ctx, 1318.5, base + 0.05, 0.2, 0.3, 'triangle')
            playNote(ctx, 1567.98, base + 0.1, 0.2, 0.3, 'triangle')
            playNote(ctx, 1046.5, base + 0.2, 0.3, 0.25, 'triangle')
            playNote(ctx, 1318.5, base + 0.2, 0.3, 0.25, 'triangle')
            playNote(ctx, 1567.98, base + 0.2, 0.3, 0.2, 'sawtooth')
            break
          }
          case 'incorrect': {
            // G4 → D4 descending
            playNote(ctx, 392, now, 0.18, 0.25, 'triangle')
            playNote(ctx, 294, now + 0.1, 0.18, 0.25, 'triangle')
            break
          }
          case 'game_end': {
            // C5 → E5 → G5 → C6 fanfare with slight overlap
            const base = now
            playNote(ctx, 523.25, base, 0.4, 0.4, 'triangle')
            playNote(ctx, 659.25, base + 0.25, 0.4, 0.4, 'triangle')
            playNote(ctx, 783.99, base + 0.5, 0.4, 0.4, 'triangle')
            playNote(ctx, 1046.5, base + 0.75, 0.6, 0.4, 'sine')
            break
          }
        }
      } catch {
        // Swallow audio errors – sounds are non-critical
      }
    },
  }
})

