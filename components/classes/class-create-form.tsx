'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { createClassSchema } from '@/lib/validation/classroom'

export function ClassCreateForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  async function createClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const element = event.currentTarget
    const form = new FormData(element)
    const parsed = createClassSchema.safeParse({
      name: form.get('name'),
      description: form.get('description') || undefined,
      capacity: form.get('capacity'),
    })
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? 'راجع البيانات.')
      return
    }
    setPending(true)
    setMessage(null)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        setMessage('انتهت الجلسة. سجّل الدخول مجددًا.')
        return
      }
      const { error } = await supabase
        .from('classes')
        .insert({ owner_teacher_id: auth.user.id, ...parsed.data })
      if (error) {
        setMessage('تعذر إنشاء الفصل. تأكد من صلاحيات الحساب ثم حاول مرة أخرى.')
        return
      }
      element.reset()
      setOpen(false)
      router.refresh()
    } catch {
      setMessage('تعذر الاتصال. تحقق من الإنترنت وأعد المحاولة.')
    } finally {
      setPending(false)
    }
  }
  if (!open)
    return (
      <Button onClick={() => setOpen(true)} type="button">
        <Plus aria-hidden="true" size={18} />
        فصل جديد
      </Button>
    )
  return (
    <form
      className="surface-card mb-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
      onSubmit={createClass}
      aria-busy={pending}
    >
      <div className="sm:col-span-2">
        <h2 className="text-lg font-semibold">إنشاء فصل جديد</h2>
        <p className="mt-1 text-sm text-muted">حدّد الاسم والسعة قبل إرسال رابط دعوة للطلاب.</p>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">اسم الفصل</span>
        <input
          autoFocus
          className="min-h-12 w-full rounded-xl border border-border px-3 py-3 text-sm"
          name="name"
          placeholder="مثال: الصف الثاني — علوم"
          required
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">السعة القصوى</span>
        <input
          className="min-h-12 w-full rounded-xl border border-border px-3 py-3 text-sm"
          defaultValue="30"
          min="1"
          max="10000"
          name="capacity"
          type="number"
          required
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">
          وصف مختصر <span className="font-normal text-muted">اختياري</span>
        </span>
        <textarea
          className="min-h-24 w-full rounded-xl border border-border px-3 py-3 text-sm"
          name="description"
          maxLength={2000}
          placeholder="ما الذي يتعلمه هذا الفصل؟"
        />
      </label>
      {message ? (
        <p
          role="alert"
          className="rounded-xl bg-warning-50 px-3 py-3 text-sm leading-7 text-[var(--warning-600)] sm:col-span-2"
        >
          {message}
        </p>
      ) : null}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)} type="button">
          إلغاء
        </Button>
        <Button loading={pending} type="submit">
          إنشاء الفصل
        </Button>
      </div>
    </form>
  )
}
