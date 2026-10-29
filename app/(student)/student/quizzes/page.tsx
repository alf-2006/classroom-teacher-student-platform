import { checkedQuery } from '@/lib/supabase/checked-query'
import { ClipboardCheck, LockKeyhole } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function StudentQuizzesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: quizzes } = await checkedQuery(
    supabase
      .from('quizzes')
      .select('id, title, description, published_at, status')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader
        description="عند بدء الاختبار، تأتي الأسئلة من RPC آمن لا يعيد مفاتيح الإجابة أو المعايير الداخلية."
        title="الاختبارات"
      />
      {quizzes?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((item) => (
            <article className="surface-card p-5" key={item.id}>
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <ClipboardCheck aria-hidden="true" size={20} />
                </span>
                <StatusPill status="منشور" />
              </div>
              <h2 className="mt-5 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.description || 'اختبار منشور لفصلك.'}</p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs font-bold text-muted">
                <LockKeyhole aria-hidden="true" size={15} />
                بدء المحاولة قيد التطوير · نُشر{' '}
                {item.published_at ? formatArabicDate(item.published_at) : 'حديثًا'}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="ستظهر الاختبارات هنا عند نشرها لفصولك."
          title="لا توجد اختبارات متاحة"
        />
      )}
    </>
  )
}
