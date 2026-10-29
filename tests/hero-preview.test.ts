import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
describe('original hero preview', () => {
  it('uses the live original preview rather than the rasterized scroll cinema', () => {
    expect(page).toContain('<ProductScene />')
    expect(page).toContain('className="hero-layout"')
    expect(page).not.toContain('<ScrollCinema>')
    expect(page).not.toContain('/scroll-sequence/')
  })
  it('keeps the workflow and destinations without exposing motion controls', () => {
    expect(page).toContain('<WorkflowDemo />')
    expect(page).not.toContain('<MotionControl />')
    expect(page).toContain('href="/register"')
    expect(page).toContain('href="/login"')
    expect(page).toContain('id="outcomes"')
  })
})
