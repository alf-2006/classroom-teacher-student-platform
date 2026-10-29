import { describe, expect, it } from 'vitest'
import { safeReturnPath } from '../lib/auth/safe-return-path'
import { checkedQuery } from '../lib/supabase/checked-query'

describe('safe invitation return path', () => {
  it('preserves an internal invitation', () => {
    expect(safeReturnPath('/invite/demo-review-token')).toBe('/invite/demo-review-token')
  })
  it.each([
    'https://evil.example',
    '//evil.example',
    '/invite/%2f%2fevil',
    '/invite/demo-review-token?next=evil',
    '/dashboard',
    '/invite/a',
    '/invite/demo-review-token\n',
  ])('rejects unapproved destination %s', (path) => {
    expect(safeReturnPath(path)).toBe('/')
  })
})
describe('query errors must not look like empty state', () => {
  it('preserves valid empty data', async () => {
    expect(await checkedQuery(Promise.resolve({ data: [], error: null }))).toEqual({
      data: [],
      error: null,
    })
  })
  it('raises failure for an error result', async () => {
    await expect(
      checkedQuery(Promise.resolve({ data: null, error: { code: '42501' } })),
    ).rejects.toThrow('مش قادرين نحمّل البيانات')
  })
  it('preserves thrown network failures', async () => {
    await expect(checkedQuery(Promise.reject(new Error('network failure')))).rejects.toThrow(
      'network failure',
    )
  })
})
