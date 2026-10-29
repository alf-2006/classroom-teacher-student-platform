'use client'

import { useEffect, useRef, useState } from 'react'
import { clamp01, useElementMetrics, useLandingMotion, useScrollFrame } from './landing-motion'
import { RIBBON_SEGMENTS, RIBBON_VIEWBOX } from './ribbon-path'

const meanings = [
  { number: '01', title: 'اللفّة', text: 'دعوة خاصة بتلمّ طلبة الفصل في مكان واحد.' },
  { number: '02', title: 'الشريط', text: 'متابعة ماشية من غير ما حاجة تقع في السكة.' },
  { number: '03', title: 'علامة الصح', text: 'القرار الأخير للمدرس، وبعدها النتيجة تنزل.' },
]

const LABEL = 'شريط أزرق واحد بيبدأ بلفّة وبيخلص بعلامة صح'
const { width: W, height: H } = RIBBON_VIEWBOX

export function InkMark() {
  const { enabled } = useLandingMotion()
  const section = useRef<HTMLElement>(null)
  const figureBox = useRef<HTMLDivElement>(null)
  const figure = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const metrics = useElementMetrics(section, enabled)
  const [src, setSrc] = useState<string | null>(null)

  /* Load the transparent artwork only when the section gets close. */
  useEffect(() => {
    const box = figureBox.current
    if (!box || src) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const needed = box.clientWidth * (window.devicePixelRatio || 1)
        setSrc(`/landing/ink-ribbon-alpha-${needed > 760 ? 1200 : 720}.webp`)
        observer.disconnect()
      },
      { rootMargin: '900px 0px' },
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [src])

  /* Play the entrance once the figure is well in view; idle loops pause off screen. */
  useEffect(() => {
    const node = section.current
    const box = figureBox.current
    if (!node || !box || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            if (entry.isIntersecting) delete node.dataset.offscreen
            else node.dataset.offscreen = 'true'
          } else if (entry.intersectionRatio >= 0.35) {
            node.dataset.play = 'true'
          }
        })
      },
      { threshold: [0, 0.35] },
    )
    observer.observe(node)
    observer.observe(box)
    return () => {
      observer.disconnect()
      delete node.dataset.offscreen
    }
  }, [enabled])

  /* Gentle scroll parallax on the outer wrapper. */
  useScrollFrame((y, viewport) => {
    const element = figure.current
    if (!element) return
    const { top, height } = metrics.current
    if (y + viewport < top - 200 || y > top + height + 200) return
    const progress = clamp01((y + viewport - top) / (height + viewport))
    const shift = (0.5 - progress) * 70
    const turn = (0.5 - progress) * -7
    element.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) rotate(${turn.toFixed(2)}deg)`
  }, enabled)

  /* Pointer depth on fine pointers only, eased with one rAF loop. */
  useEffect(() => {
    const box = figureBox.current
    const card = tilt.current
    if (!box || !card || !enabled || !matchMedia('(hover: hover) and (pointer: fine)').matches)
      return
    let frame = 0
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0
    const tick = () => {
      x += (targetX - x) * 0.09
      y += (targetY - y) * 0.09
      card.style.transform = `perspective(1200px) rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.02 ? requestAnimationFrame(tick) : 0
    }
    const move = (event: PointerEvent) => {
      const bounds = box.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14
      targetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 10
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const reset = () => {
      targetX = 0
      targetY = 0
      if (!frame) frame = requestAnimationFrame(tick)
    }
    box.addEventListener('pointermove', move)
    box.addEventListener('pointerleave', reset)
    return () => {
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(frame)
      card.style.transform = ''
    }
  }, [enabled])

  return (
    <section className="ink-section" id="line" ref={section}>
      <div className="landing-container ink-layout">
        <div className="ink-copy">
          <p className="eyebrow" data-reveal>
            <span className="mono" lang="en" dir="ltr">
              02
            </span>
            <i aria-hidden="true" />
            خط واحد
          </p>
          <h2 className="section-title" data-reveal data-delay="1">
            خط واحد متصل.
            <br />
            <span>من أول دعوة لحد القرار.</span>
          </h2>
          <p className="section-copy" data-reveal data-delay="2">
            شريط واحد بيلفّ ويكمّل ويخلص بعلامة صح. ده بالظبط اللي بيحصل في الفصل لما كل خطوة تبقى
            في مكانها.
          </p>
          <ol className="meaning-list">
            {meanings.map(({ number, title, text }, index) => (
              <li key={number} data-reveal data-delay={String(index + 1)}>
                <span className="mono" lang="en" dir="ltr">
                  {number}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="ink-figure" ref={figureBox}>
          <div className="ink-figure-inner" ref={figure}>
            <div className="ink-enter">
              <div className="ink-float">
                <div className="ink-tilt" ref={tilt}>
                  <svg
                    className="ink-ribbon"
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={LABEL}
                    focusable="false"
                  >
                    <defs>
                      <mask
                        id="ink-reveal-mask"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={W}
                        height={H}
                      >
                        {RIBBON_SEGMENTS.map(({ key, d, width }) => (
                          <path
                            key={key}
                            className={`ink-stroke ink-stroke-${key}`}
                            d={d}
                            pathLength={1}
                            strokeWidth={width}
                          />
                        ))}
                      </mask>
                    </defs>
                    {src ? (
                      <image
                        href={src}
                        width={W}
                        height={H}
                        crossOrigin="anonymous"
                        mask="url(#ink-reveal-mask)"
                      />
                    ) : null}
                  </svg>
                  <span
                    className="ink-sheen"
                    aria-hidden="true"
                    style={
                      src ? { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` } : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- no-JS fallback of the same artwork */}
            <img
              className="ink-fallback"
              src="/landing/ink-ribbon-1200.webp"
              width={W}
              height={H}
              alt={LABEL}
            />
          </noscript>
          <div className="ink-meta">
            <span className="ink-caption mono" lang="en" dir="ltr" aria-hidden="true">
              FIG. 02 — ONE LINE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
