'use client'

import { useEffect, useRef, useState } from 'react'
import { clamp01, useLandingMotion, useScrollFrame } from './landing-motion'

export type Chapter = { id: string; number: string; label: string }

export function SectionRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? '')
  const { enabled } = useLandingMotion()
  const fill = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[visible.length - 1].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [chapters])

  useScrollFrame((y, viewport, height) => {
    const available = height - viewport
    if (fill.current)
      fill.current.style.transform = `scaleY(${available > 0 ? clamp01(y / available) : 0})`
  }, enabled)

  return (
    <nav className="section-rail" aria-label="فصول الصفحة">
      <span className="rail-track" aria-hidden="true">
        <span ref={fill} />
      </span>
      <ol>
        {chapters.map(({ id, number, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={active === id ? 'is-active' : undefined}
            >
              <span className="rail-label">
                <span className="mono" lang="en" dir="ltr">
                  {number}
                </span>
                {label}
              </span>
              <i aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
