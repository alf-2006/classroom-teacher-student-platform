'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { Pause, Play, Wind } from 'lucide-react'

const MotionContext = createContext({
  enabled: false,
  paused: false,
  reduced: false,
  override: false,
  toggle: () => {},
})
const subscribe = (callback: () => void) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const getReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const useLandingMotion = () => useContext(MotionContext)

export function LandingMotion({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [optedIn, setOptedIn] = useState(false)
  const systemReduced = useSyncExternalStore(subscribe, getReduced, () => true)
  const reduced = systemReduced && !optedIn
  const enabled = !paused && !reduced
  const root = useRef<HTMLElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  function toggle() {
    if (reduced) {
      setOptedIn(true)
      setPaused(false)
    } else if (systemReduced && optedIn) {
      setOptedIn(false)
      setPaused(false)
    } else setPaused((value) => !value)
  }
  useEffect(() => {
    const container = root.current
    if (!container || !enabled) return
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement
          if (!entry.isIntersecting || element.dataset.revealed) return
          element.dataset.revealed = 'true'
          const delay = Number(element.dataset.delay ?? 0)
          const animation = element.animate(
            [
              { opacity: 0, transform: 'translate3d(0,28px,0)' },
              { opacity: 1, transform: 'translate3d(0,0,0)' },
            ],
            { duration: 800, delay, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' },
          )
          animations.add(animation)
          animation.onfinish = () => animations.delete(animation)
          observer.unobserve(element)
        })
      },
      { threshold: 0.12 },
    )
    container.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [enabled])
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const update = () => {
      frame = 0
      const available = document.documentElement.scrollHeight - window.innerHeight
      const fraction = available > 0 ? window.scrollY / available : 0
      if (progress.current) progress.current.style.transform = `scaleX(${fraction})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [enabled])
  return (
    <MotionContext.Provider
      value={{ enabled, paused, reduced, override: systemReduced && optedIn, toggle }}
    >
      <main id="main-content" ref={root} className="landing" data-motion={enabled ? 'on' : 'off'}>
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
