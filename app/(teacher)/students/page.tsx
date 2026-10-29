import { checkedQuery } from '@/lib/supabase/checked-query'
import { GraduationCap } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function StudentsPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: ownedClasses } = await checkedQuery(
    supabase.from('classes').select('id, name').eq('owner_teacher_id', profile!.id),
  )
  const ids = (ownedClasses ?? []).map((item) => item.id)
  const { data: memberships } = ids.length
    ? await checkedQuery(
        supabase
          .from('class_memberships')
          .select('id, class_id, student_id, status, joined_at')
          .in('class_id', ids)
          .order('joined_at', { ascending: false }),
      )
    : { data: [] }
  const { data: profiles } = memberships?.length
    ? await checkedQuery(
        supabase
          .from('profiles')
          .select('id, display_name, phone_e164, status')
          .in(
            'id',
            memberships.map((item) => item.student_id),
          ),
      )
    : { data: [] }
  const classNames = new Map((ownedClasses ?? []).map((item) => [item.id, item.name]))
  const studentMap = new Map((profiles ?? []).map((item) => [item.id, item]))
  return (
    <>
      <PageHeader
        description="تشاهد فقط طلاب فصولك. الطالب لا يرى بيانات زملائه ضمن سياسات قاعدة البيانات."
        title="الطلاب"
      />
      {memberships?.length ? (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-surface-subtle text-xs text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">الطالب</th>
                  <th className="px-5 py-3 font-bold">الفصل</th>
                  <th className="px-5 py-3 font-bold">انضم</th>
                  <th className="px-5 py-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {memberships.map((membership) => {
                  const student = studentMap.get(membership.student_id)
                  return (
                    <tr key={membership.id}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-full bg-primary-50 text-primary-700">
                            <GraduationCap aria-hidden="true" size={17} />
                          </span>
                          <div>
                            <p className="font-semibold">{student?.display_name ?? 'طالب'}</p>
                            <p className="text-xs text-muted" dir="ltr">
                              {student?.phone_e164 ?? '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {classNames.get(membership.class_id) ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatArabicDate(membership.joined_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={membership.status === 'active' ? 'نشط' : 'موقوف'} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          description="سيظهر الطلاب هنا بعد انضمامهم عبر دعوة فصل تملكها."
          title="لا يوجد طلاب في فصولك بعد"
        />
      )}
    </>
  )
}
