import { AuthForm } from '@/components/auth/auth-form'
import { AccountFrame } from '@/components/auth/account-frame'
import { safeReturnPath } from '@/lib/auth/safe-return-path'

export const metadata = { title: 'تسجيل الدخول' }
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  return (
    <AccountFrame mode="login">
      <AuthForm mode="login" returnPath={safeReturnPath(params.next)} />
    </AccountFrame>
  )
}
