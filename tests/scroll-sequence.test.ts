import { describe, it, expect } from 'vitest'
import {
  clampProgress,
  frameAt,
  frameUrl,
  chapterAt,
  sectionProgress,
  SEQUENCE,
} from '../lib/motion/scroll-sequence'

describe('scroll sequence math', () => {
  it('clamps progress and invalid inputs', () => {
    expect(clampProgress(-5)).toBe(0)
    expect(clampProgress(2)).toBe(1)
    expect(clampProgress(NaN)).toBe(0)
  })
  it('maps progress to bounded reversible frames', () => {
    expect(frameAt(0, 96)).toBe(0)
    expect(frameAt(1, 96)).toBe(95)
    expect(frameAt(0.8, 96)).toBeGreaterThan(frameAt(0.2, 96))
    expect(frameAt(-1, 96)).toBe(0)
    expect(frameAt(5, 96)).toBe(95)
  })
  it('uses section travel rather than whole document scroll for pinning', () => {
    expect(sectionProgress(0, 2400, 800, true)).toBe(0)
    expect(sectionProgress(-800, 2400, 800, true)).toBe(0.5)
    expect(sectionProgress(-1600, 2400, 800, true)).toBe(1)
    expect(sectionProgress(800, 600, 800, false)).toBe(0)
  })
  it('keeps chapter selection and URLs in range', () => {
    expect(chapterAt(1)).toBe(3)
    expect(chapterAt(0)).toBe(0)
    expect(frameUrl(5)).toBe('/scroll-sequence/v1/frame-005.webp')
    expect(frameUrl(5, true)).toBe('/scroll-sequence/v1/mobile/frame-005.webp')
    expect(SEQUENCE.mobileFrames).toBeLessThan(SEQUENCE.frames)
  })
})
