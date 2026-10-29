import { checkedQuery } from '@/lib/supabase/checked-query'
import { FileText } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function StudentAssignmentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: assignments } = await checkedQuery(
    supabase
      .from('assignments')
      .select('id, title, details, published_at, status')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader
        description="تظهر الواجبات التي نُشرت لفصولك فقط. سيرفع الملف لاحقًا إلى مساحة خاصة لا يراها سوى صاحب التسليم والمدرس."
        title="الواجبات"
      />
      {assignments?.length ? (
        <div className="space-y-3">
          {assignments.map((item) => (
            <article
              className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              key={item.id}
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <FileText aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {item.details || 'لا توجد تعليمات إضافية.'}
                  </p>
                  <p className="mt-2 text-xs font-bold text-muted">
                    نُشر {item.published_at ? formatArabicDate(item.published_at) : 'حديثًا'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status="منشور" />
                <p className="max-w-56 rounded-xl bg-surface-subtle px-3 py-2 text-xs leading-6 text-muted">
                  التسليم غير متاح بعد؛ مسار رفع الملفات قيد التطوير.
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState description="لا توجد واجبات منشورة في فصولك الآن." title="كل شيء مرتب" />
      )}
    </>
  )
}
