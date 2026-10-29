import { checkedQuery } from '@/lib/supabase/checked-query'
import Link from 'next/link'
import { BookOpen, ClipboardCheck, FileText, UsersRound } from 'lucide-react'

import { Metric, PageHeader } from '@/components/dashboard/page-elements'
import { Card, EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function TeacherDashboardPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const [classes, assignments, quizzes, submissions] = await Promise.all([
    checkedQuery(
      supabase
        .from('classes')
        .select('id, name, status, created_at')
        .eq('owner_teacher_id', profile!.id)
        .order('created_at', { ascending: false }),
    ),
    checkedQuery(
      supabase
        .from('assignments')
        .select('id, title, status, created_at')
        .eq('owner_teacher_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ),
    checkedQuery(
      supabase
        .from('quizzes')
        .select('id, title, status, created_at')
        .eq('owner_teacher_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ),
    checkedQuery(supabase.from('assignment_grades').select('id', { count: 'exact', head: true })),
  ])
  const classRows = classes.data ?? []
  const assignmentRows = assignments.data ?? []
  const quizRows = quizzes.data ?? []

  return (
    <>
      <PageHeader
        eyebrow="لوحة المدرس"
        title={`مرحبًا، ${profile!.display_name}`}
        description="هذا الملخص يعرض بياناتك الحالية من المنصة، وليس أرقامًا تجريبية."
        action={{ href: '/classes', label: 'إدارة الفصول' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          detail="تملكها حاليًا"
          icon={<UsersRound aria-hidden="true" size={20} />}
          label="الفصول النشطة"
          value={classRows.filter((row) => row.status === 'active').length}
        />
        <Metric
          detail="آخر 5 واجبات"
          icon={<FileText aria-hidden="true" size={20} />}
          label="الواجبات"
          value={assignmentRows.length}
          tone="success"
        />
        <Metric
          detail="آخر 5 اختبارات"
          icon={<ClipboardCheck aria-hidden="true" size={20} />}
          label="الاختبارات"
          value={quizRows.length}
          tone="warning"
        />
        <Metric
          detail="سجلت في المنصة"
          icon={<BookOpen aria-hidden="true" size={20} />}
          label="الدرجات"
          value={submissions.count ?? 0}
        />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">أحدث الفصول</h2>
              <p className="mt-1 text-sm text-muted">افتح الفصل لإدارة الدعوات والطلاب.</p>
            </div>
            <Link
              className="text-sm font-semibold text-primary-700 underline underline-offset-4"
              href="/classes"
            >
              كل الفصول
            </Link>
          </div>
          {classRows.length ? (
            <ul className="mt-5 divide-y divide-border">
              {classRows.slice(0, 5).map((row) => (
                <li className="flex items-center justify-between gap-4 py-4" key={row.id}>
                  <div>
                    <Link
                      className="font-semibold hover:text-primary-700"
                      href={`/classes/${row.id}`}
                    >
                      {row.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      أُنشئ {formatArabicDate(row.created_at)}
                    </p>
                  </div>
                  <StatusPill status={row.status === 'active' ? 'نشط' : 'مؤرشف'} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="ابدأ بإنشاء فصل ثم أنشئ دعوة خاصة للطلاب."
                title="لا توجد فصول بعد"
                action={
                  <Link
                    className="font-semibold text-primary-700 underline underline-offset-4"
                    href="/classes"
                  >
                    إنشاء أول فصل
                  </Link>
                }
              />
            </div>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المحتوى الأخير</h2>
          <p className="mt-1 text-sm text-muted">الواجبات والاختبارات التي أنشأتها مؤخرًا.</p>
          <div className="mt-5 space-y-3">
            {[
              ...assignmentRows.map((item) => ({ ...item, kind: 'واجب' })),
              ...quizRows.map((item) => ({ ...item, kind: 'اختبار' })),
            ]
              .slice(0, 5)
              .map((item) => (
                <div
                  className="rounded-xl border border-border p-3.5"
                  key={`${item.kind}-${item.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.title}</p>
                    <StatusPill
                      status={
                        item.status === 'published'
                          ? 'منشور'
                          : item.status === 'draft'
                            ? 'مسودة'
                            : 'مؤرشف'
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {item.kind} · {formatArabicDate(item.created_at)}
                  </p>
                </div>
              ))}
            {!assignmentRows.length && !quizRows.length ? (
              <p className="rounded-xl bg-surface-subtle p-4 text-sm text-muted">
                لا يوجد محتوى بعد. ستظهر هنا أحدث الواجبات والاختبارات الحقيقية.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </>
  )
}
