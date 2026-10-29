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
        title={`نورت، ${profile!.display_name}`}
        description="دي مساحتك: فصولك والحاجات اللي المدرسين نزّلوها ليك. من غير لف كتير."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          detail="إنت موجود فيها"
          icon={<BookOpen aria-hidden="true" size={20} />}
          label="فصولي"
          value={classCount}
        />
        <Metric
          detail="آخر 5 نازلين ليك"
          icon={<FileText aria-hidden="true" size={20} />}
          label="الواجبات"
          value={assignments.data?.length ?? 0}
          tone="success"
        />
        <Metric
          detail="آخر 5 نازلين؛ حل الكويز لسه بيتجهّز"
          icon={<ClipboardCheck aria-hidden="true" size={20} />}
          label="الكويزات"
          value={quizzes.data?.length ?? 0}
          tone="warning"
        />
        <Metric
          detail="آخر 10 درجات المدرس نزّلها ليك"
          icon={<Trophy aria-hidden="true" size={20} />}
          label="درجات نازلة ليك"
          value={grades.data?.length ?? 0}
        />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">الواجبات اللي نزلت</h2>
              <p className="mt-1 text-sm text-muted">
                بصّ على الواجبات اللي نزلت. التسليم لسه بيتجهّز.
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
                    <StatusPill status="اتنشر" />
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.details || 'مفيش تعليمات زيادة.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="لما المدرس ينزّل واجب، هتلاقيه هنا. من غير «هو اتبعت فين؟»."
                title="لسه مفيش واجبات نازلة"
              />
            </div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">كويزات نازلة ليك</h2>
              <p className="mt-1 text-sm text-muted">الإجابات النموذجية مش بتظهر وإنت بتحل.</p>
            </div>
            <Link
              className="text-sm font-semibold text-primary-700 underline underline-offset-4"
              href="/student/quizzes"
            >
              كل الكويزات
            </Link>
          </div>
          {quizzes.data?.length ? (
            <div className="mt-5 space-y-3">
              {quizzes.data.map((item) => (
                <div className="rounded-xl border border-border p-4" key={item.id}>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.description || 'كويز نازل لواحد من فصولك.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="أي كويز المدرس ينزّله لفصلك هتلاقيه هنا."
                title="لسه مفيش كويزات هنا"
              />
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
