'use client'

import { useEffect, useRef } from 'react'
import {
  BookOpenCheck,
  Check,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  UsersRound,
  ArrowUpLeft,
} from 'lucide-react'
import { clamp01, useLandingMotion, useScrollFrame } from './landing-motion'

export function ProductScene() {
  const { enabled } = useLandingMotion()
  const scene = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const topCard = useRef<HTMLDivElement>(null)
  const bottomCard = useRef<HTMLDivElement>(null)

  /* Layers drift apart as the hero scrolls away, like a gentle teardown. */
  useScrollFrame((y, viewport) => {
    const progress = clamp01(y / (viewport * 0.9))
    if (topCard.current)
      topCard.current.style.translate = `${(progress * -42).toFixed(1)}px ${(progress * -64).toFixed(1)}px`
    if (bottomCard.current)
      bottomCard.current.style.translate = `${(progress * 38).toFixed(1)}px ${(progress * 56).toFixed(1)}px`
    if (scene.current) scene.current.style.translate = `0 ${(progress * 36).toFixed(1)}px`
  }, enabled)

  useEffect(() => {
    if (enabled) return
    ;[topCard.current, bottomCard.current, scene.current].forEach((element) => {
      if (element) element.style.translate = ''
    })
  }, [enabled])

  /* Idle loops (floating cards, scroll cue) pause while the hero is off screen. */
  useEffect(() => {
    const hero = scene.current?.closest<HTMLElement>('.landing-hero')
    if (!hero || !enabled) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete hero.dataset.offscreen
      else hero.dataset.offscreen = 'true'
    })
    observer.observe(hero)
    return () => {
      observer.disconnect()
      delete hero.dataset.offscreen
    }
  }, [enabled])

  useEffect(() => {
    const element = scene.current
    const card = surface.current
    if (!element || !card || !enabled || !matchMedia('(hover: hover) and (pointer: fine)').matches)
      return
    let frame = 0
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0
    const tick = () => {
      x += (targetX - x) * 0.1
      y += (targetY - y) * 0.1
      card.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.02) frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8
      targetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 6
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const reset = () => {
      targetX = 0
      targetY = 0
      if (!frame) frame = requestAnimationFrame(tick)
    }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(frame)
      card.style.transform = ''
    }
  }, [enabled])

  return (
    <div className="product-stage intro intro-4" ref={scene}>
      <div className="stage-grid" aria-hidden="true" />
      <span className="stage-label mono" lang="en" dir="ltr" aria-hidden="true">
        FIG. 00 — LIVE PREVIEW
      </span>
      <div className="product-depth" ref={surface}>
        <div className="product-window">
          <div className="product-toolbar">
            <div className="product-identity">
              <BookOpenCheck size={19} aria-hidden="true" />
              <span className="number-font" lang="en" dir="ltr">
                Classroom
              </span>
            </div>
            <span className="demo-tag">معاينة للتوضيح</span>
            <div className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="product-layout">
            <aside className="demo-sidebar" aria-hidden="true">
              <div className="demo-person">
                <span>أ</span>
                <div>
                  مساحة المدرس<small>كل حاجة في مكانها</small>
                </div>
              </div>
              {[
                [LayoutDashboard, 'نظرة سريعة'],
                [UsersRound, 'الفصول'],
                [FileText, 'الواجبات'],
                [GraduationCap, 'الطلبة'],
              ].map(([Icon, label], index) => {
                const Symbol = Icon as typeof LayoutDashboard
                return (
                  <div className={`demo-nav ${index === 0 ? 'selected' : ''}`} key={String(label)}>
                    <Symbol size={16} />
                    {String(label)}
                  </div>
                )
              })}
              <div className="sidebar-note">
                <Sparkles size={18} />
                وقت أكتر.
                <br />
                ووجع دماغ أقل.
              </div>
            </aside>
            <div className="demo-content">
              <div className="demo-heading">
                <div>
                  <span>جاهز ليوم أهدى؟</span>
                  <h2>صباح الخير يا أستاذ أحمد</h2>
                </div>
                <span className="demo-avatar">أ</span>
              </div>
              <div className="demo-metrics">
                <div className="metric-ink">
                  <span className="number-font">04</span>
                  <small>فصول شغّالة</small>
                </div>
                <div className="metric-violet">
                  <span className="number-font">28</span>
                  <small>طلبة</small>
                </div>
                <div className="metric-mint">
                  <span className="number-font">12</span>
                  <small>تسليمات جديدة</small>
                </div>
              </div>
              <div className="demo-chart">
                <div>
                  <h3>الدنيا ماشية إزاي</h3>
                  <span>الأسبوع ده</span>
                </div>
                <svg viewBox="0 0 340 104" role="img" aria-label="رسم يوضّح التقدّم خلال الأسبوع">
                  <defs>
                    <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2443e8" stopOpacity=".2" />
                      <stop offset="100%" stopColor="#2443e8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 26H340M0 58H340M0 90H340" stroke="#e6e5dc" fill="none" />
                  <path
                    d="M2 82C30 84 24 55 58 62S97 90 119 58S143 17 172 40S207 70 232 28S271 52 290 23S313 8 338 12V104H2Z"
                    fill="url(#chart-fill)"
                  />
                  <path
                    className="chart-trace"
                    d="M2 82C30 84 24 55 58 62S97 90 119 58S143 17 172 40S207 70 232 28S271 52 290 23S313 8 338 12"
                    stroke="#2443e8"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    pathLength="1"
                  />
                  <circle cx="338" cy="12" r="4" fill="#2443e8" />
                </svg>
                <div className="chart-labels">
                  <span>السبت</span>
                  <span>الاثنين</span>
                  <span>الأربعاء</span>
                </div>
              </div>
              <div className="demo-task">
                <span className="task-symbol">
                  <FileText size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3>كويز الوحدة التالتة</h3>
                  <p>الصف التاني · ٣ تسليمات للمراجعة</p>
                </div>
                <span className="task-state">للمراجعة</span>
              </div>
            </div>
          </div>
          <div className="product-footer">
            <span>
              <i />
              ده عرض توضيحي، مش بيانات حسابك
            </span>
            <span className="number-font">مساحتك / 01</span>
          </div>
        </div>
        <div className="float-card float-card-top intro intro-5" ref={topCard}>
          <span className="float-icon">
            <UsersRound size={18} aria-hidden="true" />
          </span>
          <div>
            كل فصل ليه مساحته<small>دعوة خاصة. وكل حاجة تبدأ صح.</small>
          </div>
          <ArrowUpLeft size={16} aria-hidden="true" />
        </div>
        <div className="float-card float-card-bottom intro intro-6" ref={bottomCard}>
          <span className="float-icon mint">
            <Check size={19} aria-hidden="true" />
          </span>
          <div>
            كل خطوة متسجّلة<small>الطريق واضح من أول دعوة</small>
          </div>
        </div>
      </div>
    </div>
  )
}
