import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MOTION_BOOT_SCRIPT } from '../components/landing/motion-boot'

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../app/landing.css', import.meta.url), 'utf8')

function boot({ stored, reduced }: { stored: string | null; reduced: boolean }) {
  const dataset: Record<string, string> = {}
  const scope = {
    document: { documentElement: { dataset } },
    localStorage: { getItem: () => stored },
    window: { matchMedia: () => ({ matches: reduced }) },
  }
  new Function('document', 'localStorage', 'window', MOTION_BOOT_SCRIPT)(
    scope.document,
    scope.localStorage,
    scope.window,
  )
  return dataset.motion
}

describe('landing notebook redesign contracts', () => {
  it('keeps every in-page destination and the real auth routes', () => {
    for (const id of ['home', 'outcomes', 'story', 'questions', 'start'])
      expect(
        page +
          readFileSync(new URL('../components/landing/workflow-demo.tsx', import.meta.url), 'utf8'),
      ).toContain(`id="${id}"`)
    expect(page).toContain('href="/register"')
    expect(page).toContain('href="/login"')
  })

  it('keeps the illustrative-data and unfinished-feature disclosures', () => {
    expect(page).toContain('أمثلة للتوضيح')
    expect(page).toContain('لسه بنكمّل المنصة')
  })

  it('animates only behind the motion flag and gates hover', () => {
    expect(css).not.toMatch(/transition:\s*all/)
    expect(css).not.toMatch(/ease-in[;\s,)]/)
    expect(css).toContain('@media (hover: hover) and (pointer: fine)')
    expect(css).toContain(
      "html[data-motion='on'] .landing[data-ready] [data-reveal]:not([data-in])",
    )
  })
})

describe('motion boot script', () => {
  it('turns motion on by default', () => {
    expect(boot({ stored: null, reduced: false })).toBe('on')
  })
  it('respects the system reduced-motion preference', () => {
    expect(boot({ stored: null, reduced: true })).toBe('off')
  })
  it('respects an explicit pause and an explicit opt-in', () => {
    expect(boot({ stored: 'off', reduced: false })).toBe('off')
    expect(boot({ stored: 'on', reduced: true })).toBe('on')
  })
})
