import Link from 'next/link'
import { BookOpenCheck, LockKeyhole } from 'lucide-react'

import { InviteJoinCard } from '@/components/auth/invite-join-card'

export const metadata = { title: 'دعوة إلى فصل' }

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center bg-background px-5 py-12"
    >
      <div className="w-full max-w-xl">
        <Link
          className="mb-10 flex items-center justify-center gap-3 text-xl font-semibold"
          href="/"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-primary-600 text-white">
            <BookOpenCheck aria-hidden="true" size={21} />
          </span>{' '}
          Classroom
        </Link>
        <div className="mb-5 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary-700">
            <LockKeyhole aria-hidden="true" size={23} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal">دعوة خاصة إلى فصل</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            لن نعرض اسم الفصل أو قائمة الطلاب قبل التحقق من حسابك وصلاحية الدعوة.
          </p>
        </div>
        <InviteJoinCard token={token} />
      </div>
    </main>
  )
}
