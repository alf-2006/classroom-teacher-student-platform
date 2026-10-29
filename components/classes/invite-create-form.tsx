'use client'

import { Link2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export function InviteCreateForm({ classId }: { classId: string }) {
  const [pending, setPending] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  async function createInvite() {
    if (pending) return
    setPending(true)
    setMessage(null)
    setCopied(false)
    try {
      const { data, error } = await createBrowserSupabaseClient().rpc('create_class_invite', {
        target_class_id: classId,
      })
      if (error || !data?.[0]?.token) {
        setMessage('تعذر إصدار الدعوة. تأكد أن حسابك يملك هذا الفصل.')
        return
      }
      setInviteUrl(`${window.location.origin}/invite/${data[0].token}`)
    } catch {
      setMessage('تعذر الاتصال. تحقق من الإنترنت ثم حاول مجددًا.')
    } finally {
      setPending(false)
    }
  }
  async function copyInvite() {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setMessage(null)
    } catch {
      setMessage('المتصفح لم يسمح بالنسخ. حدد الرابط وانسخه يدويًا.')
    }
  }
  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
          <Link2 aria-hidden="true" size={20} />
        </span>
        <div>
          <h2 className="text-lg font-semibold">دعوة طالب</h2>
          <p className="mt-1 text-sm leading-7 text-muted">
            كل دعوة تحمل رمزًا عشوائيًا، ويُفحص الفصل والسعة لحظة الانضمام.
          </p>
        </div>
      </div>
      <Button className="mt-5" loading={pending} onClick={createInvite} type="button">
        إصدار رابط دعوة
      </Button>
      {message ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-warning-50 px-3 py-3 text-sm leading-7 text-[var(--warning-600)]"
        >
          {message}
        </p>
      ) : null}
      {inviteUrl ? (
        <div className="mt-5 rounded-xl border border-[#abddc9] bg-success-50 p-4">
          <p className="text-sm font-semibold text-[var(--success-600)]" role="status">
            {copied ? 'تم نسخ الرابط' : 'الرابط جاهز للمشاركة'}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              aria-label="رابط دعوة الطالب — يمكنك تحديده ونسخه"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-3 text-left text-xs"
              dir="ltr"
              readOnly
              value={inviteUrl}
            />
            <Button onClick={copyInvite} type="button" variant="secondary">
              {copied ? (
                <Check aria-hidden="true" size={16} />
              ) : (
                <Copy aria-hidden="true" size={16} />
              )}
              {copied ? 'تم النسخ' : 'نسخ الرابط'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
