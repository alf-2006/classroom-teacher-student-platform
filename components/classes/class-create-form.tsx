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
      setMessage(parsed.error.issues[0]?.message ?? 'بصّ على البيانات وجرّب تاني.')
      return
    }
    setPending(true)
    setMessage(null)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        setMessage('جلسة دخولك خلصت. ادخل حسابك تاني.')
        return
      }
      const { error } = await supabase
        .from('classes')
        .insert({ owner_teacher_id: auth.user.id, ...parsed.data })
      if (error) {
        setMessage('مش قادرين نعمل الفصل. اتأكد إن حسابك ليه الصلاحية وجرّب تاني.')
        return
      }
      element.reset()
      setOpen(false)
      router.refresh()
    } catch {
      setMessage('الاتصال فصل. اطّمن على النت وجرّب تاني.')
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
        <h2 className="text-lg font-semibold">نعمل فصل جديد؟</h2>
        <p className="mt-1 text-sm text-muted">
          سمّي الفصل وحدّد عدد الطلبة، وبعدها ابعت لينك الدعوة.
        </p>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">اسم الفصل</span>
        <input
          autoFocus
          className="min-h-12 w-full rounded-xl border border-border px-3 py-3 text-sm"
          name="name"
          placeholder="زي: تانية إعدادي — علوم"
          required
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">الفصل يشيل كام طالب؟</span>
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
          كلمتين عن الفصل <span className="font-normal text-muted">براحتك</span>
        </span>
        <textarea
          className="min-h-24 w-full rounded-xl border border-border px-3 py-3 text-sm"
          name="description"
          maxLength={2000}
          placeholder="هنذاكر إيه في الفصل ده؟"
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
          مش دلوقتي
        </Button>
        <Button loading={pending} type="submit">
          اعمل الفصل
        </Button>
      </div>
    </form>
  )
}
