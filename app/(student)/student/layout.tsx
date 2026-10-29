import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'
import { getCurrentContext } from '@/lib/auth/current-user'

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const { user, profile } = await getCurrentContext()
  if (!user || !profile || profile.status !== 'active') redirect('/login')
  if (profile.role !== 'student') redirect('/dashboard')
  return (
    <AppShell profile={profile} role="student">
      {children}
    </AppShell>
  )
}
