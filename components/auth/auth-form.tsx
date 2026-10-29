'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { safeReturnPath } from '@/lib/auth/safe-return-path'
import { signInSchema, signUpSchema } from '@/lib/validation/classroom'

type Field = 'fullName' | 'phone' | 'password' | 'confirmPassword'
export function AuthForm({
  mode,
  returnPath = '/',
}: {
  mode: 'login' | 'register'
  returnPath?: string
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'
  const destination = safeReturnPath(returnPath)
  const authSuffix = destination === '/' ? '' : `?next=${encodeURIComponent(destination)}`

  function reportErrors(fieldErrors: Partial<Record<Field, string>>) {
    setErrors(fieldErrors)
    const first = Object.keys(fieldErrors)[0]
    const input = formRef.current?.elements.namedItem(first) as HTMLInputElement | null
    input?.focus()
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setMessage(null)
    setErrors({})
    const form = new FormData(event.currentTarget)
    const payload = {
      fullName: String(form.get('fullName') ?? ''),
      phone: String(form.get('phone') ?? ''),
      password: String(form.get('password') ?? ''),
    }
    const parsed = isRegister ? signUpSchema.safeParse(payload) : signInSchema.safeParse(payload)
    if (!parsed.success) {
      const nextErrors: Partial<Record<Field, string>> = {}
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]) as Field
        if (!nextErrors[key]) nextErrors[key] = issue.message
      })
      reportErrors(nextErrors)
      setMessage('راجع الحقول الموضحة قبل المتابعة.')
      return
    }
    if (isRegister && payload.password !== String(form.get('confirmPassword'))) {
      reportErrors({ confirmPassword: 'كلمتا المرور غير متطابقتين.' })
      return
    }
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const result = isRegister
        ? await supabase.auth.signUp({
            phone: parsed.data.phone,
            password: parsed.data.password,
            options: { data: { full_name: payload.fullName.trim() } },
          })
        : await supabase.auth.signInWithPassword({
            phone: parsed.data.phone,
            password: parsed.data.password,
          })
      if (result.error) {
        setMessage('تعذر إتمام العملية. تحقق من البيانات أو حاول لاحقًا.')
        return
      }
      if (isRegister && !result.data.session) {
        setMessage(
          'الحساب لم يحصل على جلسة دخول. إعداد تأكيد الهاتف يحتاج استكمالًا في Supabase. لم يتم الانضمام إلى الفصل.',
        )
        return
      }
      router.replace(destination)
      router.refresh()
    } catch {
      setMessage('تعذر الاتصال. تحقق من الإنترنت ثم حاول مرة أخرى.')
    } finally {
      setPending(false)
    }
  }
  const errorFor = (field: Field) =>
    errors[field] ? (
      <span id={`${field}-error`} className="mt-2 block text-xs leading-6 text-[var(--danger-600)]">
        {errors[field]}
      </span>
    ) : null
  const inputClass =
    'min-h-12 w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm leading-relaxed placeholder:text-muted focus:border-primary-500 aria-invalid:border-[var(--danger-600)]'

  return (
    <form
      ref={formRef}
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      {isRegister ? (
        <label className="block" htmlFor="fullName">
          <span className="mb-2 block text-sm font-semibold">الاسم الكامل</span>
          <input
            id="fullName"
            autoComplete="name"
            className={inputClass}
            name="fullName"
            placeholder="مثال: أحمد محمد"
            required
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errorFor('fullName')}
        </label>
      ) : null}
      <label className="block" htmlFor="phone">
        <span className="mb-2 block text-sm font-semibold">رقم الهاتف</span>
        <input
          id="phone"
          autoComplete="tel"
          type="tel"
          className={`${inputClass} text-left`}
          dir="ltr"
          inputMode="tel"
          name="phone"
          placeholder="+201001234567"
          required
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={`phone-hint${errors.phone ? ' phone-error' : ''}`}
        />
        <span id="phone-hint" className="mt-2 block text-xs leading-6 text-muted">
          استخدم الصيغة الدولية، مثل +20 ثم رقم الهاتف.
        </span>
        {errorFor('phone')}
      </label>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="password">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className={`${inputClass} pe-14`}
            dir="ltr"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'password-error' : isRegister ? 'password-hint' : undefined
            }
          />
          <button
            className="absolute inset-y-0 end-1 my-auto grid size-11 place-items-center rounded-lg text-muted hover:bg-surface-subtle"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        {isRegister ? (
          <p id="password-hint" className="mt-2 text-xs leading-6 text-muted">
            10 أحرف على الأقل. لا تستخدم كلمة مرور مشتركة.
          </p>
        ) : null}
        {errorFor('password')}
      </div>
      {isRegister ? (
        <label className="block" htmlFor="confirmPassword">
          <span className="mb-2 block text-sm font-semibold">تأكيد كلمة المرور</span>
          <input
            id="confirmPassword"
            className={inputClass}
            dir="ltr"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
          {errorFor('confirmPassword')}
        </label>
      ) : null}
      {message ? (
        <p
          role="alert"
          className="rounded-xl border border-[#f4d3ab] bg-warning-50 px-3 py-3 text-sm leading-7 text-[var(--warning-600)]"
        >
          {message}
        </p>
      ) : null}
      <Button className="w-full" loading={pending} type="submit">
        {isRegister ? 'إنشاء حساب طالب' : 'تسجيل الدخول'}
      </Button>
      <p className="text-center text-sm leading-7 text-muted">
        {isRegister ? 'لديك حساب بالفعل؟' : 'لا تملك حسابًا؟'}{' '}
        <Link
          className="font-semibold text-primary-700 underline underline-offset-4"
          href={`${isRegister ? '/login' : '/register'}${authSuffix}`}
        >
          {isRegister ? 'تسجيل الدخول' : 'إنشاء حساب طالب'}
        </Link>
      </p>
    </form>
  )
}
