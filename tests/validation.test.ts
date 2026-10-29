import { describe, expect, it } from 'vitest'

import {
  createClassSchema,
  phoneSchema,
  signInSchema,
  signUpSchema,
} from '@/lib/validation/classroom'

describe('classroom validation', () => {
  it('normalizes common phone formatting into E.164-compatible input', () => {
    expect(phoneSchema.parse('+20 (100) 123-4567')).toBe('+201001234567')
  })

  it('rejects ambiguous local phone numbers', () => {
    expect(phoneSchema.safeParse('01001234567').success).toBe(false)
  })

  it('requires a strong enough password for signup', () => {
    expect(
      signUpSchema.safeParse({ fullName: 'طالب تجريبي', phone: '+201001234567', password: 'short' })
        .success,
    ).toBe(false)
  })

  it('accepts valid sign-in and class inputs', () => {
    expect(
      signInSchema.safeParse({ phone: '+201001234567', password: 'a-secure-password' }).success,
    ).toBe(true)
    expect(createClassSchema.safeParse({ name: 'الصف الثاني', capacity: '30' }).success).toBe(true)
  })
})
