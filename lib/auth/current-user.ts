import { cache } from 'react'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']

export const getCurrentContext = cache(async () => {
  const supabase = await createServerSupabaseClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    return { user: null, profile: null as Profile | null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle()

  return { user: authData.user, profile }
})
