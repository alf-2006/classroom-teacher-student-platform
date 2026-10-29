import { describe, expect, it } from 'vitest'
import { getStatusPresentation } from '../lib/copy/status-label'
import { createClassSchema, signUpSchema } from '../lib/validation/classroom'
import { readFileSync } from 'node:fs'

describe('Egyptian Arabic copy', () => {
  it('localizes stored status codes without changing the codes', () => {
    expect(getStatusPresentation('published')).toEqual({ label: 'اتنشر', tone: 'success' })
    expect(getStatusPresentation('active')).toEqual({ label: 'شغّال', tone: 'success' })
    expect(getStatusPresentation('inactive').tone).toBe('neutral')
    expect(getStatusPresentation('draft').tone).toBe('warning')
    expect(getStatusPresentation('لسه بنراجعها').tone).toBe('warning')
  })
  it('keeps capacity bounds and gives Egyptian error messages', () => {
    for (const capacity of [0, 10001, 1.5, 'not-a-number']) {
      const result = createClassSchema.safeParse({ name: 'فصل تجريبي', capacity })
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error.issues[0].message).toMatch(/[ء-ي]/)
    }
    expect(createClassSchema.safeParse({ name: 'فصل تجريبي', capacity: 1 }).success).toBe(true)
    expect(createClassSchema.safeParse({ name: 'فصل تجريبي', capacity: 10000 }).success).toBe(true)
  })
  it('does not fall back to English when a name is too long', () => {
    const result = signUpSchema.safeParse({
      fullName: 'أ'.repeat(121),
      phone: '+201001234567',
      password: 'ExampleSafe123!',
    })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toContain('اسمك طويل زيادة')
  })
  it('matches the eye-button CSS to its accessible label and keeps the Egyptian locale', () => {
    const css = readFileSync(new URL('../app/account.css', import.meta.url), 'utf8')
    const form = readFileSync(new URL('../components/auth/auth-form.tsx', import.meta.url), 'utf8')
    const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
    expect(css).toContain("aria-label*='كلمة السر'")
    expect(form).toContain('ورّيني كلمة السر')
    expect(layout).toContain('lang="ar-EG"')
  })
})
