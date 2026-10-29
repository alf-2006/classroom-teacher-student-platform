import { checkedQuery } from '@/lib/supabase/checked-query'
import { ClipboardCheck } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function QuizzesPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: quizzes } = await checkedQuery(
    supabase
      .from('quizzes')
      .select('id, title, description, status, created_at, published_at')
      .eq('owner_teacher_id', profile!.id)
      .order('created_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader
        description="كل نشر بيحفظ نسخة من الكويز. والإجابات النموذجية بتفضل خاصة، مش مكشوفة للطالب."
        title="الكويزات"
      />
      {quizzes?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((item) => (
            <article className="interactive-card surface-card p-5" key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <ClipboardCheck aria-hidden="true" size={20} />
                </span>
                <StatusPill
                  status={
                    item.status === 'published'
                      ? 'اتنشر'
                      : item.status === 'draft'
                        ? 'لسه بتتجهّز'
                        : 'في الأرشيف'
                  }
                />
              </div>
              <h2 className="mt-5 font-semibold">{item.title}</h2>
              <p className="mt-2 min-h-12 text-sm text-muted">
                {item.description || 'لسه مفيش وصف للكويز ده.'}
              </p>
              <p className="mt-5 border-t border-border pt-4 text-xs font-bold text-muted">
                {item.published_at
                  ? `اتنشر ${formatArabicDate(item.published_at)}`
                  : `لسه بتتجهّز من ${formatArabicDate(item.created_at)}`}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="رفع JSON وتجهيز الكويز لسه بيتجهّزوا. النشر هيحفظ نسخة ثابتة للمحاولات."
          title="لسه مفيش كويزات. أول واحد مستنيك"
        />
      )}
    </>
  )
}
