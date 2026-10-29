import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('surface-card p-5 sm:p-6', className)}>{children}</section>
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="surface-card flex min-h-60 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary-700">
        <Inbox aria-hidden="true" size={24} />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const tone =
    normalized.includes('published') ||
    normalized.includes('active') ||
    normalized.includes('graded') ||
    normalized.includes('منشور') ||
    normalized.includes('نشط') ||
    normalized.includes('متاح') ||
    normalized.includes('منشورة')
      ? 'bg-[var(--success-50)] text-[var(--success-600)]'
      : normalized.includes('draft') ||
          normalized.includes('review') ||
          normalized.includes('مسودة') ||
          normalized.includes('مراجعة') ||
          normalized.includes('قيد')
        ? 'bg-[var(--warning-50)] text-[var(--warning-600)]'
        : 'bg-surface-subtle text-muted'

  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-bold', tone)}>
      {status}
    </span>
  )
}
