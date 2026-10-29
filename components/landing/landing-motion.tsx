'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react'
import { Pause, Play, Wind } from 'lucide-react'

/** Storage key shared with the inline boot script in `motion-boot.ts`. */
const STORAGE_KEY = 'classroom-motion'
const CHANGE_EVENT = 'classroom-motion-change'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

type MotionState = {
  enabled: boolean
  paused: boolean
  reduced: boolean
  override: boolean
  toggle: () => void
}

const MotionContext = createContext<MotionState>({
  enabled: false,
  paused: false,
  reduced: false,
  override: false,
  toggle: () => {},
})

export const useLandingMotion = () => useContext(MotionContext)

function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(value: 'on' | 'off' | null) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode: the choice simply lasts for this page view */
  }
}

function applyMode(mode: 'on' | 'off') {
  document.documentElement.dataset.motion = mode
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function deriveMode(): 'on' | 'off' {
  const stored = readStored()
  const reduced = window.matchMedia(REDUCED_QUERY).matches
  return stored === 'off' || (reduced && stored !== 'on') ? 'off' : 'on'
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(REDUCED_QUERY)
  const onSystemChange = () => applyMode(deriveMode())
  media.addEventListener('change', onSystemChange)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    media.removeEventListener('change', onSystemChange)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

const getMode = () => document.documentElement.dataset.motion ?? 'off'
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches
const subscribeReduced = (callback: () => void) => {
  const media = window.matchMedia(REDUCED_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

/* ------------------------------------------------------------------ */
/* One shared scroll loop: a single passive listener and at most one  */
/* requestAnimationFrame per frame for every scroll-linked component.  */
/* Callbacks receive scrollY, viewport and a cached document height   */
/* (refreshed by ResizeObserver), so frames never read layout.        */
/* ------------------------------------------------------------------ */

type FrameCallback = (scrollY: number, viewport: number, documentHeight: number) => void
const frameCallbacks = new Set<FrameCallback>()
let frameId = 0
let documentHeight = 0
let sizeObserver: ResizeObserver | null = null

function runFrame() {
  frameId = 0
  const y = window.scrollY
  const viewport = window.innerHeight
  frameCallbacks.forEach((callback) => callback(y, viewport, documentHeight))
}

function scheduleFrame() {
  if (!frameId) frameId = requestAnimationFrame(runFrame)
}

function measureDocument() {
  documentHeight = document.documentElement.scrollHeight
  scheduleFrame()
}

export function useScrollFrame(callback: FrameCallback, active: boolean) {
  const latest = useRef(callback)
  useEffect(() => {
    latest.current = callback
  })
  useEffect(() => {
    if (!active) return
    const handler: FrameCallback = (y, viewport, height) => latest.current(y, viewport, height)
    frameCallbacks.add(handler)
    if (frameCallbacks.size === 1) {
      window.addEventListener('scroll', scheduleFrame, { passive: true })
      window.addEventListener('resize', measureDocument)
      sizeObserver = new ResizeObserver(measureDocument)
      sizeObserver.observe(document.body)
    }
    measureDocument()
    return () => {
      frameCallbacks.delete(handler)
      if (frameCallbacks.size === 0) {
        window.removeEventListener('scroll', scheduleFrame)
        window.removeEventListener('resize', measureDocument)
        sizeObserver?.disconnect()
        sizeObserver = null
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    }
  }, [active])
}

export type Metrics = { top: number; height: number }

/**
 * Measures an element's document offset only when layout can change
 * (element or page resize), so scroll frames never force layout.
 */
export function useElementMetrics(target: RefObject<HTMLElement | null>, active: boolean) {
  const metrics = useRef<Metrics>({ top: 0, height: 0 })
  useEffect(() => {
    const element = target.current
    if (!element || !active) return
    const measure = () => {
      const bounds = element.getBoundingClientRect()
      metrics.current = { top: bounds.top + window.scrollY, height: bounds.height }
      scheduleFrame()
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [target, active])
  return metrics
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function LandingMotion({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getMode, () => 'off')
  const systemReduced = useSyncExternalStore(subscribeReduced, getReduced, () => false)
  const enabled = mode === 'on'
  const reduced = systemReduced && !enabled
  const root = useRef<HTMLElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  function toggle() {
    if (enabled) {
      writeStored(systemReduced ? null : 'off')
      applyMode('off')
    } else {
      writeStored(systemReduced ? 'on' : null)
      applyMode('on')
    }
  }

  useEffect(() => {
    const html = document.documentElement
    if (!html.dataset.motion) applyMode(deriveMode())
    return () => {
      delete html.dataset.motion
    }
  }, [])

  useEffect(() => {
    const container = root.current
    if (!container || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const element = entry.target as HTMLElement
          element.dataset.in = 'true'
          observer.unobserve(element)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    container
      .querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])')
      .forEach((element) => observer.observe(element))
    container.dataset.ready = 'true'
    return () => {
      observer.disconnect()
      delete container.dataset.ready
    }
  }, [enabled])

  useScrollFrame((y, viewport, height) => {
    const available = height - viewport
    const fraction = available > 0 ? clamp01(y / available) : 0
    if (progress.current) progress.current.style.transform = `scaleX(${fraction})`
  }, enabled)

  return (
    <MotionContext.Provider
      value={{
        enabled,
        paused: !enabled && !systemReduced,
        reduced,
        override: systemReduced && enabled,
        toggle,
      }}
    >
      <main id="main-content" ref={root} className="landing">
        <div className="reading-progress" aria-hidden="true">
          <div ref={progress} />
        </div>
        {children}
      </main>
    </MotionContext.Provider>
  )
}

export function MotionControl() {
  const { paused, reduced, override, toggle } = useLandingMotion()
  const Icon = reduced ? Wind : paused ? Play : Pause
  const label = reduced
    ? 'جرّب مؤثرات السكرول رغم إعداد تقليل الحركة'
    : override
      ? 'ارجع للمعاينة الثابتة'
      : paused
        ? 'شغّل حركة الصفحة'
        : 'وقّف حركة الصفحة'
  return (
    <button
      className="motion-control"
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" size={15} />
      <span>
        {reduced
          ? 'جرّب المؤثرات'
          : override
            ? 'رجّع المعاينة الثابتة'
            : paused
              ? 'شغّل الحركة'
              : 'وقّف الحركة'}
      </span>
    </button>
  )
}
