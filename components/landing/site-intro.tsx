'use client'

import { useEffect, useRef } from 'react'
import { BookOpenCheck } from 'lucide-react'
import { RIBBON_PATH, RIBBON_VIEWBOX } from './ribbon-path'

/** Time the skip should still take, so the curtain lifts instead of vanishing. */
const SKIP_MS = 380

/**
 * Opening curtain shown once per browser session, only when motion is on
 * (decided before first paint by `motion-boot.ts`, which sets
 * `html[data-intro="play"]`). Pure CSS drives the whole sequence and also
 * ends it, so a failed hydration can never leave the page covered. JS only
 * adds the skip: any key, click, wheel or touch fast-forwards the running
 * animations and shifts the hero entrance by the same saved time.
 */
export function SiteIntro() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const overlay = root.current
    if (!overlay || html.dataset.intro !== 'play') return

    // Hide the overlay itself; `html[data-intro]` (and the hero's
    // `--intro-delay`) stays for the whole page view so running hero
    // animations never get their delay recomputed mid-flight.
    const finish = () => {
      overlay.dataset.done = 'true'
    }
    const ending = overlay
      .getAnimations?.()
      .find((animation) => (animation as CSSAnimation).animationName === 'intro-gone')

    let skipped = false
    const skip = () => {
      if (skipped || overlay.dataset.done || html.dataset.intro !== 'play') return
      skipped = true
      const timing = ending?.effect?.getComputedTiming()
      const now = Number(ending?.currentTime ?? 0)
      const remaining = Number(timing?.endTime ?? 0) - now
      if (!ending || remaining <= SKIP_MS) return
      const rate = remaining / SKIP_MS
      const saved = remaining - SKIP_MS
      const own = new Set(overlay.getAnimations({ subtree: true }))
      own.forEach((animation) => animation.updatePlaybackRate(rate))
      document.getAnimations().forEach((animation) => {
        if (own.has(animation) || animation.currentTime === null) return
        animation.currentTime = Number(animation.currentTime) + saved
      })
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.target === overlay && event.animationName === 'intro-gone') finish()
    }
    const fallback = window.setTimeout(finish, 4000)
    const passive = { passive: true } as const
    overlay.addEventListener('animationend', onEnd)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip, passive)
    window.addEventListener('wheel', skip, passive)
    window.addEventListener('touchstart', skip, passive)
    return () => {
      window.clearTimeout(fallback)
      overlay.removeEventListener('animationend', onEnd)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
    }
  }, [])

  return (
    <div className="site-intro" ref={root} aria-hidden="true">
      <div className="intro-panel intro-panel-ink" />
      <div className="intro-panel intro-panel-paper">
        <div className="intro-stage">
          <span className="intro-chapter mono" lang="en" dir="ltr">
            00 — OPENING THE CLASS
          </span>
          <svg
            className="intro-line"
            viewBox={`0 0 ${RIBBON_VIEWBOX.width} ${RIBBON_VIEWBOX.height}`}
            focusable="false"
          >
            <path d={RIBBON_PATH} pathLength={1} />
          </svg>
          <div className="intro-brand">
            <span className="intro-symbol">
              <BookOpenCheck size={30} strokeWidth={2.1} />
            </span>
            <span className="intro-word-mask">
              <span className="intro-word number-font" lang="en" dir="ltr">
                Classroom<span className="brand-period">.</span>
              </span>
            </span>
          </div>
          <p className="intro-tagline">تعليم مترتّب. وتفاصيل بتفرق.</p>
        </div>
      </div>
    </div>
  )
}
