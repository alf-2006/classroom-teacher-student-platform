import type { ReactNode } from 'react'
import Link from 'next/link'
import { BookOpenCheck } from 'lucide-react'

import { LogoutButton } from '@/components/layout/logout-button'
import { WorkspaceNavigation } from '@/components/layout/workspace-navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/auth/current-user'

export function AppShell({
  role,
  profile,
  children,
}: {
  role: 'teacher' | 'student'
  profile: Profile
  children: ReactNode
}) {
  return (
    <div className="app-shell bg-background lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden border-l border-border bg-white p-4 lg:flex lg:flex-col">
        <Brand role={role} />
        <WorkspaceNavigation role={role} />
        <ProfileBlock profile={profile} />
      </aside>
      <div className="app-main pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur sm:px-8 lg:hidden">
          <Brand role={role} compact />
          <LogoutButton compact />
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10"
        >
          {children}
        </main>
        <WorkspaceNavigation role={role} mobile />
      </div>
    </div>
  )
}
function Brand({ role, compact = false }: { role: 'teacher' | 'student'; compact?: boolean }) {
  return (
    <Link
      className={cn('flex items-center gap-3', compact && 'gap-2')}
      href={role === 'teacher' ? '/dashboard' : '/student/dashboard'}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-primary-600 text-white">
        <BookOpenCheck aria-hidden="true" size={22} />
      </span>
      <span>
        <span className="number-font block text-base font-bold" lang="en" dir="ltr">
          Classroom.
        </span>
        {!compact ? (
          <span className="block text-xs text-muted">فصلك مترتّب، ودماغك أروق.</span>
        ) : null}
      </span>
    </Link>
  )
}
function ProfileBlock({ profile }: { profile: Profile }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-3 px-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {profile.display_name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{profile.display_name}</p>
          <p className="text-xs text-muted">{profile.role === 'teacher' ? 'مدرس' : 'طالب'}</p>
        </div>
      </div>
      <LogoutButton />
    </div>
  )
}
