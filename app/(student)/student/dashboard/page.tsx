import { checkedQuery } from '@/lib/supabase/checked-query'
import Link from 'next/link'
import { BookOpen, ClipboardCheck, FileText, Trophy } from 'lucide-react'

import { Metric, PageHeader } from '@/components/dashboard/page-elements'
import { Card, EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function StudentDashboardPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const [memberships, assignments, quizzes, grades] = await Promise.all([
    checkedQuery(
      supabase
        .from('class_memberships')
        .select('id, class_id, status')
        .eq('student_id', profile!.id)
        .eq('status', 'active'),
    ),
    checkedQuery(
      supabase
        .from('assignments')
        .select('id, title, details, status, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5),
    ),
    checkedQuery(
      supabase
        .from('quizzes')
        .select('id, title, description, status, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5),
    ),
    checkedQuery(
      supabase
        .from('assignment_grades')
        .select('id, score, max_score, published_at')
        .not('published_at', 'is', null)
        .limit(10),
    ),
  ])
  const classCount = memberships.data?.length ?? 0
  return (
    <>
      <PageHeader
        eyebrow="مساحة الطالب"
        title={`أهلًا، ${profile!.display_name}`}
        description="هذه اللوحة تعرض فقط ما يرتبط بعضويتك الحالية وما نشره المدرسون لك."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          detail="عضويات نشطة"
          icon={<BookOpen aria-hidden="true" size={20} />}
          label="فصولي"
          value={classCount}
        />
        <Metric
          detail="آخر 5 منشورة لك"
          icon={<FileText aria-hidden="true" size={20} />}
          label="الواجبات"
          value={assignments.data?.length ?? 0}
          tone="success"
        />
        <Metric
          detail="آخر 5 منشورة؛ المحاولة قيد التطوير"
          icon={<ClipboardCheck aria-hidden="true" size={20} />}
          label="الاختبارات"
          value={quizzes.data?.length ?? 0}
          tone="warning"
        />
        <Metric
          detail="آخر 10 نتائج أتاحها المدرس"
          icon={<Trophy aria-hidden="true" size={20} />}
          label="درجات منشورة"
          value={grades.data?.length ?? 0}
        />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">واجبات منشورة</h2>
              <p className="mt-1 text-sm text-muted">
                تصفح المحتوى المنشور. مسار التسليم قيد التطوير.
              </p>
            </div>
            <Link
              className="text-sm font-semibold text-primary-700 underline underline-offset-4"
              href="/student/assignments"
            >
              كل الواجبات
            </Link>
          </div>
          {assignments.data?.length ? (
            <div className="mt-5 space-y-3">
              {assignments.data.map((item) => (
                <div className="rounded-xl border border-border p-4" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.title}</p>
                    <StatusPill status="منشور" />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {item.details || 'لا توجد تعليمات إضافية.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="ستظهر هنا الواجبات التي ينشرها مدرسو فصولك."
                title="لا توجد واجبات منشورة"
              />
            </div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">اختبارات متاحة</h2>
              <p className="mt-1 text-sm text-muted">لا يظهر لك مفتاح الإجابة أثناء المحاولة.</p>
            </div>
            <Link
              className="text-sm font-semibold text-primary-700 underline underline-offset-4"
              href="/student/quizzes"
            >
              كل الاختبارات
            </Link>
          </div>
          {quizzes.data?.length ? (
            <div className="mt-5 space-y-3">
              {quizzes.data.map((item) => (
                <div className="rounded-xl border border-border p-4" key={item.id}>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.description || 'اختبار منشور من أحد فصولك.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="ستظهر هنا الاختبارات المنشورة لفصولك."
                title="لا توجد اختبارات متاحة"
              />
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
