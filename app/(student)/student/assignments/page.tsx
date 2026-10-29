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
        description="هنا واجبات فصولك اللي المدرس نشرها. رفع الملفات لسه بيتجهّز، وهيكون خاص بيك وبالمدرس."
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
                  <p className="mt-1 text-sm text-muted">{item.details || 'مفيش تعليمات زيادة.'}</p>
                  <p className="mt-2 text-xs font-bold text-muted">
                    اتنشر {item.published_at ? formatArabicDate(item.published_at) : 'من قريب'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status="اتنشر" />
                <p className="max-w-56 rounded-xl bg-surface-subtle px-3 py-2 text-xs leading-6 text-muted">
                  التسليم لسه مش متاح. بنجهّز رفع الملفات.
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="لسه مفيش واجبات نازلة لفصولك. هتلاقيها هنا لما المدرس ينشرها."
          title="لسه مفيش واجبات هنا"
        />
      )}
    </>
  )
}
