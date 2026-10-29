import { checkedQuery } from '@/lib/supabase/checked-query'
import { FileText } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function AssignmentsPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: assignments } = await checkedQuery(
    supabase
      .from('assignments')
      .select('id, title, details, status, published_at, created_at')
      .eq('owner_teacher_id', profile!.id)
      .order('created_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader
        description="الواجب بيظهر لطلبة فصوله بس. والتسليمات بتفضل خاصة بالطالب وبالمدرس."
        title="الواجبات"
      />
      {assignments?.length ? (
        <div className="space-y-3">
          {assignments.map((item) => (
            <article
              className="interactive-card surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              key={item.id}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <FileText aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {item.details || 'مفيش تعليمات زيادة.'}
                  </p>
                  <p className="mt-2 text-xs font-bold text-muted">
                    {item.published_at
                      ? `اتنشر ${formatArabicDate(item.published_at)}`
                      : `اتعمل ${formatArabicDate(item.created_at)}`}
                  </p>
                </div>
              </div>
              <StatusPill
                status={
                  item.status === 'published'
                    ? 'اتنشر'
                    : item.status === 'draft'
                      ? 'لسه بتتجهّز'
                      : 'في الأرشيف'
                }
              />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="لما تعمل واجب، هتختار فصوله. الطلبة مش هيشوفوه غير لما تنشره."
          title="لسه مفيش واجبات. الهدوء قبل المذاكرة!"
        />
      )}
    </>
  )
}
