import { checkedQuery } from '@/lib/supabase/checked-query'
import { Trophy } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState } from '@/components/ui/states'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function StudentGradesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: grades } = await checkedQuery(
    supabase
      .from('assignment_grades')
      .select('id, score, max_score, feedback, published_at, reviewed_at')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader description="هنا درجاتك اللي المدرس قرر ينزّلها ليك." title="درجاتي" />
      {grades?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {grades.map((grade) => (
            <article className="surface-card p-5" key={grade.id}>
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--success-50)] text-[var(--success-600)]">
                <Trophy aria-hidden="true" size={20} />
              </span>
              <p className="mt-5 text-3xl font-semibold tabular-nums">
                {grade.score}
                <span className="text-base text-muted"> / {grade.max_score}</span>
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {grade.feedback || 'مفيش ملاحظات زيادة.'}
              </p>
              <p className="mt-5 border-t border-border pt-4 text-xs font-bold text-muted">
                اتنشرت {formatArabicDate(grade.published_at!)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="لسه مفيش درجات نازلة ليك. هتشوفها لما المدرس ينشرها."
          title="لسه مفيش درجات نازلة"
        />
      )}
    </>
  )
}
