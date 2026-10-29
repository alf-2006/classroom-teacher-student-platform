import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'
import { getCurrentContext } from '@/lib/auth/current-user'

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const { user, profile } = await getCurrentContext()
  if (!user || !profile || profile.status !== 'active') redirect('/login')
  if (profile.role !== 'teacher') redirect('/student/dashboard')
  return (
    <AppShell profile={profile} role="teacher">
      {children}
    </AppShell>
  )
}
