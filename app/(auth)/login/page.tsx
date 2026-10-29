import { AuthForm } from '@/components/auth/auth-form'
import { AuthFrame } from '@/components/auth/auth-frame'
import { safeReturnPath } from '@/lib/auth/safe-return-path'

export const metadata = { title: 'تسجيل الدخول' }
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  return (
    <AuthFrame>
      <AuthForm mode="login" returnPath={safeReturnPath(params.next)} />
    </AuthFrame>
  )
}
