import { checkedQuery } from '@/lib/supabase/checked-query'
import Link from 'next/link'
import { ArrowLeft, UsersRound } from 'lucide-react'

import { ClassCreateForm } from '@/components/classes/class-create-form'
import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ClassesPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: classes } = await checkedQuery(
    supabase
      .from('classes')
      .select('id, name, description, capacity, status, created_at')
      .eq('owner_teacher_id', profile!.id)
      .order('created_at', { ascending: false }),
  )
  return (
    <>
      <PageHeader
        action={{ href: '#new-class', label: 'فصل جديد' }}
        description="أنشئ الفصول ثم أرسل الدعوات الخاصة للطلاب. السعة تُفحص لحظة الانضمام."
        title="الفصول"
      />
      <div id="new-class">
        <ClassCreateForm />
      </div>
      {classes?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => (
            <article className="interactive-card surface-card p-5" key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                  <UsersRound aria-hidden="true" size={20} />
                </span>
                <StatusPill status={item.status === 'active' ? 'نشط' : 'مؤرشف'} />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{item.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted">
                {item.description || 'لا يوجد وصف لهذا الفصل.'}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-bold text-muted">
                <span>سعة {item.capacity} طالب</span>
                <Link
                  className="inline-flex items-center gap-1 text-primary-700"
                  href={`/classes/${item.id}`}
                >
                  إدارة الفصل <ArrowLeft aria-hidden="true" size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="أنشئ فصلًا لتتمكن من إدارة الطلاب وإرسال دعوات الانضمام."
          title="لم تنشئ فصولًا بعد"
        />
      )}
    </>
  )
}
