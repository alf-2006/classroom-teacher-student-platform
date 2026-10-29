'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    await createBrowserSupabaseClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <button
      className={
        compact
          ? 'grid size-10 place-items-center rounded-xl text-muted hover:bg-surface-subtle hover:text-foreground'
          : 'mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-muted hover:bg-surface-subtle hover:text-foreground'
      }
      disabled={pending}
      onClick={signOut}
      type="button"
      aria-label="تسجيل الخروج"
    >
      <LogOut aria-hidden="true" size={18} />
      {!compact ? (pending ? 'جارٍ الخروج…' : 'تسجيل الخروج') : null}
    </button>
  )
}
