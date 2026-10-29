import { checkedQuery } from '@/lib/supabase/checked-query'
import { UsersRound } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { EmptyState, StatusPill } from '@/components/ui/states'
import { getCurrentContext } from '@/lib/auth/current-user'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatArabicDate } from '@/lib/utils'

export default async function StudentClassesPage() {
  const { profile } = await getCurrentContext()
  const supabase = await createServerSupabaseClient()
  const { data: memberships } = await checkedQuery(
    supabase
      .from('class_memberships')
      .select('id, class_id, joined_at, status')
      .eq('student_id', profile!.id)
      .eq('status', 'active'),
  )
  const ids = (memberships ?? []).map((item) => item.class_id)
  const { data: classes } = ids.length
    ? await checkedQuery(
        supabase.from('classes').select('id, name, description, capacity, status').in('id', ids),
      )
    : { data: [] }
  const membershipMap = new Map((memberships ?? []).map((item) => [item.class_id, item]))
  return (
    <>
      <PageHeader
        description="دي الفصول اللي دخلتها بدعوة، ولسه عضويتك فيها شغّالة."
        title="فصولي"
      />
      {classes?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => (
            <article className="surface-card p-5" key={item.id}>
              <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-700">
                <UsersRound aria-hidden="true" size={20} />
              </span>
              <div className="mt-5 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <StatusPill status="شغّال" />
              </div>
              <p className="mt-2 min-h-12 text-sm text-muted">
                {item.description || 'مفيش كلمتين زيادة عن الفصل ده.'}
              </p>
              <p className="mt-5 border-t border-border pt-4 text-xs font-bold text-muted">
                دخلت الفصل يوم {formatArabicDate(membershipMap.get(item.id)!.joined_at)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="لينك المدرس هو تذكرتك لأول فصل. افتحه وانضم."
          title="لسه مفيش فصول عندك"
        />
      )}
    </>
  )
}
