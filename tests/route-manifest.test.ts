import { describe, expect, it } from 'vitest'

import manifest from '@/public/manus-routes.json'

describe('route manifest', () => {
  it('contains the public, auth, role, and invitation route families', () => {
    const paths = manifest.routes.map((route) => route.path)
    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/login',
        '/register',
        '/invite/:token',
        '/dashboard',
        '/classes',
        '/classes/:id',
        '/student/dashboard',
      ]),
    )
    expect(new Set(paths).size).toBe(paths.length)
  })
  it('uses only supported path and title fields', () => {
    for (const route of manifest.routes) {
      expect(Object.keys(route).every((key) => ['path', 'title'].includes(key))).toBe(true)
    }
  })
})
