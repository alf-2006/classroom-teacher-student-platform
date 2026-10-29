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
        eyebrow="مساحة المدرس"
        title={`نورت، ${profile!.display_name}`}
        description="دي أرقام شغلك الفعلية هنا، مش أرقام للتجربة. نلمّ الدنيا بسرعة؟"
        action={{ href: '/classes', label: 'ظبّط فصولك' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          detail="فصولك الشغّالة"
          icon={<UsersRound aria-hidden="true" size={20} />}
          label="الفصول الشغّالة"
          value={classRows.filter((row) => row.status === 'active').length}
        />
        <Metric
          detail="آخر 5 واجبات عندك"
          icon={<FileText aria-hidden="true" size={20} />}
          label="الواجبات"
          value={assignmentRows.length}
          tone="success"
        />
        <Metric
          detail="آخر 5 كويزات عندك"
          icon={<ClipboardCheck aria-hidden="true" size={20} />}
          label="الكويزات"
          value={quizRows.length}
          tone="warning"
        />
        <Metric
          detail="متسجّلة هنا"
          icon={<BookOpen aria-hidden="true" size={20} />}
          label="الدرجات"
          value={submissions.count ?? 0}
        />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">آخر الفصول</h2>
              <p className="mt-1 text-sm text-muted">افتح الفصل، وظبّط الدعوات والطلبة.</p>
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
                      اتعمل {formatArabicDate(row.created_at)}
                    </p>
                  </div>
                  <StatusPill status={row.status === 'active' ? 'شغّال' : 'في الأرشيف'} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="اعمل فصل وبعدين لينك دعوة خاص. كده اللمة تبقى على أصولها."
                title="لسه مفيش فصول. نعمل أول واحد؟"
                action={
                  <Link
                    className="font-semibold text-primary-700 underline underline-offset-4"
                    href="/classes"
                  >
                    اعمل أول فصل
                  </Link>
                }
              />
            </div>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">آخر شغل عندك</h2>
          <p className="mt-1 text-sm text-muted">آخر واجبات وكويزات عملتها. كله قدامك.</p>
          <div className="mt-5 space-y-3">
            {[
              ...assignmentRows.map((item) => ({ ...item, kind: 'واجب' })),
              ...quizRows.map((item) => ({ ...item, kind: 'كويز' })),
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
                          ? 'اتنشر'
                          : item.status === 'draft'
                            ? 'لسه بتتجهّز'
                            : 'في الأرشيف'
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
                لسه مفيش محتوى. أول واجب أو كويز تعمله هيظهر هنا.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </>
  )
}
