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
      setMessage('في بيانات محتاجة مراجعة. بصّ على الخانات اللي تحت.')
      return
    }
    if (isRegister && payload.password !== String(form.get('confirmPassword'))) {
      reportErrors({ confirmPassword: 'كلمتي السر مش زي بعض. خلّيهم نفس الكلمة.' })
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
        setMessage('مش قادرين نكمّل دلوقتي. راجع بياناتك وجرّب تاني بعد شوية.')
        return
      }
      if (isRegister && !result.data.session) {
        setMessage(
          'الحساب لسه ما دخلش. محتاجين نكمّل إعداد تأكيد الموبايل في Supabase، ولسه ما انضمّتش للفصل.',
        )
        return
      }
      router.replace(destination)
      router.refresh()
    } catch {
      setMessage('الاتصال فصل. اطّمن على النت وجرّب تاني.')
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
      className="account-form"
      noValidate
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      {isRegister ? (
        <label className="block" htmlFor="fullName">
          <span className="mb-2 block text-sm font-semibold">اسمك كامل</span>
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
        <span className="mb-2 block text-sm font-semibold">رقم موبايلك</span>
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
          اكتب كود البلد الأول، زي +20، وبعده رقم موبايلك.
        </span>
        {errorFor('phone')}
      </label>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="password">
          كلمة السر
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
            aria-label={showPassword ? 'خبّي كلمة السر' : 'ورّيني كلمة السر'}
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
            10 حروف على الأقل. خلّي كلمة السر ليك لوحدك.
          </p>
        ) : null}
        {errorFor('password')}
      </div>
      {isRegister ? (
        <label className="block" htmlFor="confirmPassword">
          <span className="mb-2 block text-sm font-semibold">اكتب كلمة السر تاني</span>
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
          className="account-alert rounded-xl border border-[#f4d3ab] bg-warning-50 px-3 py-3 text-sm leading-7 text-[var(--warning-600)]"
        >
          {message}
        </p>
      ) : null}
      <div className="account-actions">
        <Link
          className="account-create"
          href={`${isRegister ? '/login' : '/register'}${authSuffix}`}
        >
          {isRegister ? 'ادخل حسابك' : 'اعمل حساب طالب'}
        </Link>
        <Button className="account-submit" loading={pending} type="submit">
          {isRegister ? 'اعمل حساب طالب' : 'ادخل حسابك'}
        </Button>
      </div>
    </form>
  )
}
