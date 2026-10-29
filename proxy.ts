import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getPublicEnv } from '@/lib/env'
import type { Database } from '@/types/database'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const env = getPublicEnv()

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  // Next's WebSocket and runtime paths must never pass through the auth proxy.
  matcher: ['/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)'],
}
