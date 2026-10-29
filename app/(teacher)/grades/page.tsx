import { checkedQuery } from '@/lib/supabase/checked-query'
import { BarChart3 } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function GradesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: grades } = await checkedQuery(
    supabase
      .from('assignment_grades')
      .select('id, score, max_score, feedback, published_at, reviewed_at')
      .order('reviewed_at', { ascending: false })
      .limit(100),
  )
  return (
    <>
      <PageHeader
        description="الدرجة مش بتظهر للطالب غير لما تنشرها. راجع النتيجة والملاحظات الأول."
        title="الدرجات"
      />
      {grades?.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {grades.map((grade) => (
            <article className="surface-card p-5" key={grade.id}>
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <BarChart3 aria-hidden="true" size={20} />
                </span>
                <StatusPill status={grade.published_at ? 'اتنشرت' : 'لسه بنراجعها'} />
              </div>
              <p className="mt-5 text-3xl font-semibold tabular-nums">
                {grade.score}
                <span className="text-base text-muted"> / {grade.max_score}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{grade.feedback || 'مفيش ملاحظة زيادة.'}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="الدرجات هتظهر هنا بعد ما تراجع التسليمات أو تخلص تصحيح الكويزات."
          title="لسه مفيش درجات متسجّلة"
        />
      )}
    </>
  )
}
