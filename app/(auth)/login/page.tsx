import { AuthForm } from '@/components/auth/auth-form'
import { LoginFrame } from '@/components/auth/login-frame'
import { safeReturnPath } from '@/lib/auth/safe-return-path'

export const metadata = { title: 'تسجيل الدخول' }
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  return (
    <LoginFrame>
      <AuthForm mode="login" returnPath={safeReturnPath(params.next)} />
    </LoginFrame>
  )
}
