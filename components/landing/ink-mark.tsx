'use client'

import { useRef } from 'react'
import { clamp01, useElementMetrics, useLandingMotion, useScrollFrame } from './landing-motion'

const meanings = [
  { number: '01', title: 'اللفّة', text: 'دعوة خاصة بتلمّ طلبة الفصل في مكان واحد.' },
  { number: '02', title: 'الشريط', text: 'متابعة ماشية من غير ما حاجة تقع في السكة.' },
  { number: '03', title: 'علامة الصح', text: 'القرار الأخير للمدرس، وبعدها النتيجة تنزل.' },
]

export function InkMark() {
  const { enabled } = useLandingMotion()
  const section = useRef<HTMLElement>(null)
  const figure = useRef<HTMLDivElement>(null)
  const metrics = useElementMetrics(section, enabled)

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
        <div className="ink-figure" data-reveal data-delay="1">
          <div className="ink-figure-inner" ref={figure}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP pair, no optimizer needed */}
            <img
              src="/landing/ink-ribbon-1200.webp"
              srcSet="/landing/ink-ribbon-720.webp 720w, /landing/ink-ribbon-1200.webp 1200w"
              sizes="(min-width: 1024px) 48vw, 92vw"
              width={1200}
              height={552}
              loading="lazy"
              decoding="async"
              alt="شريط أزرق واحد بيبدأ بلفّة وبيخلص بعلامة صح"
            />
          </div>
          <span className="ink-caption mono" lang="en" dir="ltr" aria-hidden="true">
            FIG. 02 — ONE LINE
          </span>
        </div>
      </div>
    </section>
  )
}
