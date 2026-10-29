import { AuthForm } from '@/components/auth/auth-form'
import { AuthFrame } from '@/components/auth/auth-frame'
import { safeReturnPath } from '@/lib/auth/safe-return-path'

export const metadata = { title: 'إنشاء حساب طالب' }
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  return (
    <AuthFrame register>
      <AuthForm mode="register" returnPath={safeReturnPath(params.next)} />
    </AuthFrame>
  )
}
