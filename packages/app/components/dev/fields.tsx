'use client'

/**
 * Field primitives for the authoring tool. Dev-only UI — deliberately plain,
 * because this is a workbench, not a product surface.
 */

import { INK } from '@/lib/ui/theme'

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: `1px solid ${INK.border}`,
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: INK.text,
  background: INK.surface,
  lineHeight: 1.45,
}

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '0 0 4px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: INK.textFaint,
        }}
      >
        {children}
      </span>
      {hint && <span style={{ fontSize: '11px', color: INK.textFaint }}>{hint}</span>}
    </div>
  )
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  multiline,
  placeholder,
  shared,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
  /** Marks a field rendered in two panels — `ask` and `answer`. See SharedNote. */
  shared?: boolean
}) {
  const style: React.CSSProperties = {
    ...inputStyle,
    ...(shared ? { borderColor: '#c4b5fd', background: '#faf8ff' } : {}),
    ...(multiline ? { minHeight: '64px', resize: 'vertical' as const } : {}),
  }
  return (
    <div style={{ marginBottom: '12px' }}>
      <Label hint={hint}>{label}</Label>
      {multiline ? (
        <textarea value={value} placeholder={placeholder} style={style} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} placeholder={placeholder} style={style} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

/** An editable list of strings: distractors, acceptableAnswers. */
export function StringListField({
  label,
  hint,
  values,
  onChange,
  placeholder,
  addLabel,
  markFirstCorrect,
}: {
  label: string
  hint?: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  addLabel: string
  markFirstCorrect?: boolean
}) {
  const set = (i: number, v: string) => onChange(values.map((old, j) => (i === j ? v : old)))
  const remove = (i: number) => onChange(values.filter((_, j) => j !== i))
  return (
    <div style={{ marginBottom: '12px' }}>
      <Label hint={hint}>{label}</Label>
      {values.map((v, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          {markFirstCorrect && (
            <span style={{ fontSize: '11px', color: INK.textFaint, width: '14px' }}>{i + 1}</span>
          )}
          <input value={v} placeholder={placeholder} style={inputStyle} onChange={(e) => set(i, e.target.value)} />
          <button
            type="button"
            onClick={() => remove(i)}
            style={{
              border: `1px solid ${INK.border}`,
              background: INK.surface,
              borderRadius: '6px',
              padding: '6px 9px',
              cursor: 'pointer',
              color: INK.textDim,
              fontSize: '13px',
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        style={{
          border: `1px dashed ${INK.borderStrong}`,
          background: 'transparent',
          borderRadius: '6px',
          padding: '6px 10px',
          cursor: 'pointer',
          color: INK.textDim,
          fontSize: '13px',
        }}
      >
        {addLabel}
      </button>
    </div>
  )
}

export function Panel({
  title,
  subtitle,
  accent,
  disabled,
  children,
}: {
  title: string
  subtitle?: string
  accent: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        flex: 1,
        minWidth: 0,
        border: `1px solid ${INK.border}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: '8px',
        padding: '14px',
        background: INK.surface,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <h4 style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 800, color: INK.text }}>{title}</h4>
      {subtitle && (
        <p style={{ margin: '0 0 12px', fontSize: '11px', color: INK.textFaint, lineHeight: 1.4 }}>{subtitle}</p>
      )}
      {children}
    </section>
  )
}
