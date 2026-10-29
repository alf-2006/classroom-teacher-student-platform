import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: { href: Route; label: string }
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">{eyebrow ?? 'مساحتك'}</p>
        <h1 className="page-title mt-1">{title}</h1>
        <p className="page-description max-w-2xl">{description}</p>
      </div>
      {action ? (
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          href={action.href}
        >
          {action.label}
          <ArrowLeft aria-hidden="true" size={17} />
        </Link>
      ) : null}
    </div>
  )
}

export function Metric({
  label,
  value,
  detail,
  tone = 'primary',
  icon,
}: {
  label: string
  value: string | number
  detail: string
  tone?: 'primary' | 'success' | 'warning'
  icon?: ReactNode
}) {
  const colors = {
    primary: 'border-primary-500 bg-primary-50 text-primary-700',
    success: 'border-[var(--success-600)] bg-[var(--success-50)] text-[var(--success-600)]',
    warning: 'border-[var(--warning-600)] bg-[var(--warning-50)] text-[var(--warning-600)]',
  }
  return (
    <article className="surface-card relative overflow-hidden p-5">
      <div className={cn('absolute inset-y-0 right-0 w-1', colors[tone].split(' ')[0])} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
          <p className="mt-2 text-xs font-semibold text-muted">{detail}</p>
        </div>
        {icon ? (
          <span
            className={cn(
              'grid size-10 place-items-center rounded-xl',
              colors[tone].replace(colors[tone].split(' ')[0], ''),
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </article>
  )
}
