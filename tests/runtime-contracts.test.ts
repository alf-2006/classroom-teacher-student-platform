import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8')
describe('framework routes are excluded from authentication refresh', () => {
  it('excludes all Next internals including HMR, not static files only', () => {
    expect(source).toContain('(?!_next/')
    expect(source).not.toContain('_next/static|_next/image')
  })
})
