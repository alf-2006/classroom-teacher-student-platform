'use client'

import Link from 'next/link'
import { CheckCircle2, LogIn, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export function InviteJoinCard({ token }: { token: string }) {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [joined, setJoined] = useState(false)
  const next = encodeURIComponent(`/invite/${token}`)
  useEffect(() => {
    let active = true
    createBrowserSupabaseClient()
      .auth.getUser()
      .then(({ data }) => {
        if (active) setSignedIn(Boolean(data.user))
      })
      .catch(() => {
        if (active) setMessage('مش قادرين نتأكد إنك داخل حسابك. ادخل تاني وجرب.')
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])
  async function join() {
    if (pending) return
    setPending(true)
    setMessage(null)
    try {
      const { error } = await createBrowserSupabaseClient().rpc('join_class_from_invite', {
        raw_token: token,
      })
      if (error) {
        setMessage(
          'الدعوة دي مش شغّالة دلوقتي. ممكن تكون انتهت أو الفصل اتملّى. اطلب لينك جديد من المدرس.',
        )
        return
      }
      setJoined(true)
      setMessage('تمام! بقيت معانا في الفصل. نورت مكانك.')
    } catch {
      setMessage('الاتصال فصل. اطّمن على النت وجرّب تاني.')
    } finally {
      setPending(false)
    }
  }
  if (!ready)
    return (
      <div className="surface-card p-8 text-center text-muted" role="status">
        بنتأكد إنك داخل حسابك…
      </div>
    )
  if (!signedIn)
    return (
      <div className="surface-card p-7 text-center">
        <h2 className="text-xl font-semibold leading-relaxed">اعمل حساب أو ادخل حسابك الأول</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          بنربط الدعوة بحسابك عشان بيانات الفصل تفضل خاصة.
        </p>
        {message ? (
          <p role="alert" className="mt-4 text-sm text-[var(--warning-600)]">
            {message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white"
            href={`/register?next=${next}`}
          >
            <UserPlus aria-hidden="true" size={18} />
            اعمل حساب
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground"
            href={`/login?next=${next}`}
          >
            <LogIn aria-hidden="true" size={18} />
            ادخل حسابك
          </Link>
        </div>
      </div>
    )
  return (
    <div className="surface-card p-7">
      <h2 className="text-xl font-semibold leading-relaxed">
        {joined ? 'الفصل بقى عندك' : 'جاهز تدخل الفصل؟'}
      </h2>
      <p className="mt-2 text-sm leading-7 text-muted">
        قبل ما تدخل، بنتأكد إن الدعوة شغّالة وفي مكان فاضي في الفصل.
      </p>
      {message ? (
        <p
          role={joined ? 'status' : 'alert'}
          className="mt-5 rounded-xl bg-primary-50 p-3 text-sm leading-7 text-primary-700"
        >
          {message}
        </p>
      ) : null}
      {joined ? (
        <Link
          className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white"
          href="/student/dashboard"
        >
          شوف مساحتك
        </Link>
      ) : (
        <Button className="mt-6 w-full" loading={pending} onClick={join} type="button">
          <CheckCircle2 aria-hidden="true" size={18} />
          دخل يوم للفصل
        </Button>
      )}
    </div>
  )
}
