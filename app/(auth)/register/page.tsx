import { AuthForm } from '@/components/auth/auth-form'
import { AccountFrame } from '@/components/auth/account-frame'
import { safeReturnPath } from '@/lib/auth/safe-return-path'

export const metadata = { title: 'إنشاء حساب طالب' }
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  return (
    <AccountFrame mode="register">
      <AuthForm mode="register" returnPath={safeReturnPath(params.next)} />
    </AccountFrame>
  )
}
