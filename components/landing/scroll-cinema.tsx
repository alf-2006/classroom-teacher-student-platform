'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import { ArrowDown, Layers3 } from 'lucide-react'
import { MotionControl, useLandingMotion } from './landing-motion'
import {
  chapterAt,
  frameAt,
  sectionProgress,
  SEQUENCE,
  SequenceLoader,
} from '@/lib/motion/scroll-sequence'

const query = '(min-width: 1000px) and (min-height: 520px)'
const subscribeWide = (callback: () => void) => {
  const media = matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const getWide = () => matchMedia(query).matches
type DataConnection = EventTarget & { saveData?: boolean }
const getConnection = () => (navigator as Navigator & { connection?: DataConnection }).connection
const subscribeData = (callback: () => void) => {
  const connection = getConnection()
  connection?.addEventListener('change', callback)
  return () => connection?.removeEventListener('change', callback)
}
const getSaveData = () => Boolean(getConnection()?.saveData)
const chapters = [
  {
    label: 'الصورة كاملة',
    title: 'واجهة واحدة. والدوشة برّه.',
    text: 'انزل بالسكرول وشوف الواجهة وهي بتفتح لطبقات. اطلع تاني، والحركة ترجع معاك.',
  },
  {
    label: 'الفصول',
    title: 'كل فصل ليه مكانه.',
    text: 'فصولك وطلبتك قدامك. والدعوة الخاصة تلمّهم في المكان الصح.',
  },
  {
    label: 'التسليم',
    title: 'من غير «الواجب اتبعت فين؟».',
    text: 'ده تصوّر لتتبّع التسليم اللي لسه بنجهّزه. نسخة واضحة، وخطوة جاية معروفة.',
  },
  {
    label: 'المراجعة',
    title: 'الصورة توضح. والقرار ليك.',
    text: 'المراجعة قبل النشر. المشهد مثال للتوضيح، مش درجات أو بيانات حساب حقيقي.',
  },
]

export function ScrollCinema({ children }: { children: ReactNode }) {
  const { enabled, paused, reduced } = useLandingMotion()
  const wide = useSyncExternalStore(subscribeWide, getWide, () => false)
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const meter = useRef<HTMLDivElement>(null)
  const current = useRef(0)
  const lastChapter = useRef(0)
  const [chapter, setChapter] = useState(0)
  const saveData = useSyncExternalStore(subscribeData, getSaveData, () => false)
  const canAnimate = !reduced && !saveData
  const pinned = wide && canAnimate

  useEffect(() => {
    const section = root.current
    const display = canvas.current
    const picture = media.current
    if (!section || !display || !picture || !enabled || !canAnimate) return
    const context = display.getContext('2d', { alpha: false })
    if (!context) return
    let alive = true
    let visible = false
    let frame = 0
    let wanted = 0
    let painted = -1
    const count = wide ? SEQUENCE.frames : SEQUENCE.mobileFrames
    const nextWidth = wide ? SEQUENCE.width : 640
    const nextHeight = wide ? SEQUENCE.height : 480
    if (display.width !== nextWidth || display.height !== nextHeight) {
      display.width = nextWidth
      display.height = nextHeight
      display.dataset.ready = 'false'
    }

    const paint = () => {
      if (!alive || !visible) return
      const result = loader.closest(wanted)
      if (!result || result.index === painted) return
      context.drawImage(result.image, 0, 0, display.width, display.height)
      painted = result.index
      display.dataset.ready = 'true'
      display.dataset.frame = String(result.index)
    }
    const loader = new SequenceLoader(!wide, paint)
    const update = () => {
      frame = 0
      if (!alive || !visible || document.hidden) return
      const rect = (wide ? section : picture).getBoundingClientRect()
      const progress = sectionProgress(rect.top, rect.height, window.innerHeight, wide)
      current.current = progress
      wanted = frameAt(progress, count)
      const nextChapter = chapterAt(progress)
      if (nextChapter !== lastChapter.current) {
        lastChapter.current = nextChapter
        setChapter(nextChapter)
      }
      if (meter.current) meter.current.style.transform = `scaleX(${progress})`
      loader.request(wanted)
      paint()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false
        if (visible) schedule()
      },
      { rootMargin: '160px 0px' },
    )
    observer.observe(section)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    document.addEventListener('visibilitychange', schedule)
    window.addEventListener('online', schedule)
    return () => {
      alive = false
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
      window.removeEventListener('online', schedule)
      cancelAnimationFrame(frame)
      loader.destroy()
      // Pause keeps the last painted frame and layout. Reduced-motion hides the canvas via CSS.
    }
  }, [enabled, canAnimate, wide])

  function goToChapter(index: number) {
    const section = root.current
    const picture = media.current
    if (!section) return
    if (!pinned || !enabled) return
    setChapter(index)
    lastChapter.current = index
    const rect = section.getBoundingClientRect()
    const top =
      window.scrollY + rect.top + (index / 3) * Math.max(0, rect.height - window.innerHeight)
    window.scrollTo({ top, behavior: 'auto' })
    picture?.setAttribute('data-selected-chapter', String(index))
  }

  return (
    <div
      ref={root}
      className="scroll-cinema"
      data-pinned={pinned ? 'true' : 'false'}
      data-running={enabled && canAnimate ? 'on' : 'off'}
      data-reduced={reduced || saveData ? 'true' : 'false'}
    >
      <div className="cinema-screen">
        <div className="cinema-copy landing-container">{children}</div>
        <div ref={media} className="cinema-media">
          <Image
            src={`${SEQUENCE.path}/poster.webp`}
            alt="معاينة توضيحية لواجهة Classroom وطبقات الفصول والمتابعة، مش بيانات حساب حقيقي"
            fill
            priority
            unoptimized
            sizes="(min-width: 1000px) 72vw, 100vw"
            className="cinema-poster"
          />
          <canvas ref={canvas} className="cinema-canvas" aria-hidden="true" />
        </div>
        <div className="cinema-foot landing-container">
          <div className="cinema-story">
            <p className="cinema-eyebrow">
              <Layers3 size={15} aria-hidden="true" />
              الواجهة من جوّه · مثال للتوضيح
            </p>
            <ol className="cinema-captions">
              {chapters.map((item, index) => (
                <li
                  key={item.label}
                  data-selected={chapter === index ? 'true' : 'false'}
                  aria-hidden={
                    (pinned || (enabled && canAnimate)) && chapter !== index ? true : undefined
                  }
                >
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="cinema-controls">
            <div className="cinema-chapters" aria-label="نقط حكاية الواجهة">
              {chapters.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goToChapter(index)}
                  disabled={!enabled || !pinned}
                  aria-pressed={chapter === index}
                  aria-label={`شوف ${item.label}`}
                >
                  <span className="number-font">0{index + 1}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="cinema-meter" aria-hidden="true">
              <div ref={meter} />
            </div>
            <div className="cinema-control-row">
              <MotionControl />
              <span>
                {paused ? (
                  'الحركة واقفة. خُد راحتك.'
                ) : saveData ? (
                  'موفّر البيانات شغّال. المعاينة ثابتة.'
                ) : reduced ? (
                  'معاينة ثابتة على مزاج جهازك.'
                ) : (
                  <>
                    <ArrowDown size={14} aria-hidden="true" />
                    {wide ? 'انزل براحتك. الحكاية هتمشي معاك.' : 'انزل وشوف الطبقات وهي بتتحرّك.'}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
