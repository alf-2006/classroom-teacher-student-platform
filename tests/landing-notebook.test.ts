import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MOTION_BOOT_SCRIPT } from '../components/landing/motion-boot'

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../app/landing.css', import.meta.url), 'utf8')

type BootInput = { stored: string | null; reduced: boolean; seen?: boolean; hash?: string }
function bootAll({ stored, reduced, seen = false, hash = '' }: BootInput) {
  const dataset: Record<string, string> = {}
  const session = new Map<string, string>(seen ? [['classroom-intro', '1']] : [])
  const scope = {
    document: { documentElement: { dataset } },
    localStorage: { getItem: () => stored },
    sessionStorage: {
      getItem: (key: string) => session.get(key) ?? null,
      setItem: (key: string, value: string) => void session.set(key, value),
    },
    window: { matchMedia: () => ({ matches: reduced }), location: { hash } },
  }
  new Function('document', 'localStorage', 'sessionStorage', 'window', MOTION_BOOT_SCRIPT)(
    scope.document,
    scope.localStorage,
    scope.sessionStorage,
    scope.window,
  )
  return { motion: dataset.motion, intro: dataset.intro, session }
}
const boot = (input: BootInput) => bootAll(input).motion
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
describe('site intro decision', () => {
  it('plays once per session when motion is on', () => {
    const first = bootAll({ stored: null, reduced: false })
    expect(first.intro).toBe('play')
    expect(first.session.get('classroom-intro')).toBe('1')
    expect(bootAll({ stored: null, reduced: false, seen: true }).intro).toBeUndefined()
  })
  it('never plays with reduced motion, a pause, or a deep link', () => {
    expect(bootAll({ stored: null, reduced: true }).intro).toBeUndefined()
    expect(bootAll({ stored: 'off', reduced: false }).intro).toBeUndefined()
    expect(bootAll({ stored: null, reduced: false, hash: '#story' }).intro).toBeUndefined()
  })
  it('is driven and ended by CSS alone, so a failed hydration cannot cover the page', () => {
    expect(css).toContain("html[data-motion='on'][data-intro='play'] .site-intro:not([data-done])")
    // the hero hand-off delay must not be tied to the overlay's own end state
    expect(css).not.toMatch(/data-intro='done'/)
    expect(css).toMatch(/animation: intro-gone 1ms linear \d+ms forwards/)
    expect(page).toContain('<SiteIntro />')
    expect(
      readFileSync(new URL('../components/landing/site-intro.tsx', import.meta.url), 'utf8'),
    ).toContain('className="intro-ribbon"')
  })
})

describe('ribbon entrance', () => {
  const ink = readFileSync(new URL('../components/landing/ink-mark.tsx', import.meta.url), 'utf8')
  it('keeps an accessible label, a no-JS image and the static full ribbon by default', () => {
    expect(ink).toContain('role="img"')
    expect(ink).toContain('<noscript>')
    expect(css).toMatch(/\.ink-stroke \{[^}]*stroke-dashoffset: 0;/)
  })
  it('hides the drawing only behind the motion and ready flags', () => {
    expect(css).toContain(
      "html[data-motion='on'] .landing[data-ready] .ink-section:not([data-play]) .ink-stroke",
    )
    expect(ink).not.toContain('ارسمها تاني')
    expect(css).not.toContain('.ink-replay')
    expect(page).not.toContain('<MotionControl />')
  })
})
