import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const login = readFileSync(new URL('../app/(auth)/login/page.tsx', import.meta.url), 'utf8')
const register = readFileSync(new URL('../app/(auth)/register/page.tsx', import.meta.url), 'utf8')
const form = readFileSync(new URL('../components/auth/auth-form.tsx', import.meta.url), 'utf8')

describe('shared authentication visual contract', () => {
  it('uses the same account frame for both routes', () => {
    expect(login).toContain('<AccountFrame mode="login">')
    expect(register).toContain('<AccountFrame mode="register">')
    expect(register).not.toContain('AuthFrame')
  })
  it('uses one form appearance and retains all registration fields', () => {
    expect(form).toContain('className="account-form"')
    for (const field of ['fullName', 'phone', 'password', 'confirmPassword']) {
      expect(form).toContain(`name="${field}"`)
    }
    expect(form).toContain("'new-password' : 'current-password'")
    expect(form).toContain("reportErrors({ confirmPassword: 'كلمتا المرور غير متطابقتين.' })")
  })
})
