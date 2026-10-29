'use client'

import { useEffect, useRef } from 'react'

const phrases = [
  'دعوة خاصة',
  'تسليم ما يضيعش',
  'القرار للمدرس',
  'عربي من أول حرف',
  'كل فصل ليه حدوده',
]

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee-track" aria-hidden={hidden ? 'true' : undefined}>
      {phrases.map((phrase) => (
        <li key={phrase}>
          {phrase}
          <i aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

/** Constant linear motion that only runs while the band is on screen. */
export function Marquee() {
  const band = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = band.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.running = entry.isIntersecting ? 'true' : 'false'
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="marquee" ref={band} role="region" aria-label="Classroom في كلمتين">
      <div className="marquee-rail">
        <Track />
        <Track hidden />
      </div>
    </div>
  )
}
