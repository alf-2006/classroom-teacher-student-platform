'use client'

import { useRef } from 'react'
import { clamp01, useElementMetrics, useLandingMotion, useScrollFrame } from './landing-motion'

type Props = { text: string; keywords?: string[] }

/**
 * Lights a sentence word by word as it travels up the viewport.
 * Splits on spaces only — Arabic letters stay joined inside each word.
 * Only words whose state changes are touched on each frame.
 */
export function Manifesto({ text, keywords = [] }: Props) {
  const { enabled } = useLandingMotion()
  const block = useRef<HTMLParagraphElement>(null)
  const lit = useRef(-1)
  const metrics = useElementMetrics(block, enabled)
  const words = text.split(' ')

  useScrollFrame((y, viewport) => {
    const element = block.current
    if (!element) return
    const { top, height } = metrics.current
    const start = top - viewport * 0.82
    const distance = height + viewport * 0.3
    const count = Math.round(clamp01((y - start) / distance) * words.length)
    if (count === lit.current) return
    const spans = element.children
    const from = Math.max(0, Math.min(count, lit.current))
    const to = Math.max(count, lit.current)
    for (let index = from; index < to && index < spans.length; index += 1)
      spans[index].classList.toggle('is-lit', index < count)
    lit.current = count
  }, enabled)

  return (
    <div className="manifesto">
      <p className="sr-only">{text}</p>
      <p className="manifesto-text" ref={block} aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="manifesto-word"
            data-key={keywords.some((key) => word.includes(key)) ? 'true' : undefined}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}
