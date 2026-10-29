import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-600/55',
  secondary:
    'border border-border bg-white text-foreground hover:bg-surface-subtle disabled:bg-surface-subtle',
  ghost: 'text-muted hover:bg-surface-subtle hover:text-foreground disabled:text-muted/60',
  danger:
    'bg-[var(--danger-600)] text-white hover:bg-[#b42318] disabled:bg-[color-mix(in_srgb,var(--danger-600)_55%,white)]',
}

export function Button({
  className,
  variant = 'primary',
  loading,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'app-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold leading-relaxed shadow-sm disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
      {loading ? (
        <span role="status" className="text-xs">
          جارٍ التنفيذ…
        </span>
      ) : null}
    </button>
  )
}
