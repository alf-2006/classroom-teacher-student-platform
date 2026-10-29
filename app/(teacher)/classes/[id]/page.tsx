import { checkedQuery } from '@/lib/supabase/checked-query'
import Link from 'next/link'
import { ArrowRight, GraduationCap, UsersRound } from 'lucide-react'
import { notFound } from 'next/navigation'

import { InviteCreateForm } from '@/components/classes/invite-create-form'
import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: classRow } = await checkedQuery(
    supabase
      .from('classes')
      .select('id, name, description, capacity, status, created_at')
      .eq('id', id)
      .eq('owner_teacher_id', profile!.id)
      .maybeSingle(),
  )
  if (!classRow) notFound()
  const { data: memberships } = await checkedQuery(
    supabase
      .from('class_memberships')
      .select('id, student_id, status, joined_at')
      .eq('class_id', id)
      .order('joined_at', { ascending: false }),
  )
  const studentIds = (memberships ?? []).map((item) => item.student_id)
  const { data: students } = studentIds.length
    ? await checkedQuery(
        supabase
          .from('profiles')
          .select('id, display_name, phone_e164, status')
          .in('id', studentIds),
      )
    : { data: [] }
  const studentMap = new Map((students ?? []).map((item) => [item.id, item]))
  return (
    <>
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary-700"
        href="/classes"
      >
        <ArrowRight aria-hidden="true" size={17} />
        العودة إلى الفصول
      </Link>
      <PageHeader
        eyebrow="تفاصيل الفصل"
        title={classRow.name}
        description={classRow.description || 'أدر الدعوات والعضويات من هذه المساحة.'}
      />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <InviteCreateForm classId={classRow.id} />
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">الطلاب</h2>
              <p className="mt-1 text-sm text-muted">
                {memberships?.filter((item) => item.status === 'active').length ?? 0} من{' '}
                {classRow.capacity} مقعدًا مستخدمًا
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
              <UsersRound aria-hidden="true" size={20} />
            </span>
          </div>
          {memberships?.length ? (
            <ul className="mt-5 divide-y divide-border">
              {memberships.map((membership) => {
                const student = studentMap.get(membership.student_id)
                return (
                  <li className="flex items-center justify-between gap-3 py-3" key={membership.id}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-subtle text-muted">
                        <GraduationCap aria-hidden="true" size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{student?.display_name || 'طالب'}</p>
                        <p className="text-xs text-muted">
                          انضم {formatArabicDate(membership.joined_at)}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={membership.status === 'active' ? 'نشط' : 'موقوف'} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="mt-5">
              <EmptyState
                description="أصدر رابط الدعوة وأرسله للطلاب للبدء."
                title="لا يوجد طلاب بعد"
              />
            </div>
          )}
        </section>
      </div>
    </>
  )
}
