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
import { useLandingMotion } from './landing-motion'

export function ProductScene() {
  const { enabled } = useLandingMotion()
  const scene = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)

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
    <div className="product-stage" ref={scene} data-reveal data-delay="180">
      <div className="orbital-ring orbital-ring-one" aria-hidden="true" />
      <div className="orbital-ring orbital-ring-two" aria-hidden="true" />
      <div className="product-depth" ref={surface}>
        <div className="product-window">
          <div className="product-toolbar">
            <div className="product-identity">
              <BookOpenCheck size={19} aria-hidden="true" />
              <span className="number-font" lang="en" dir="ltr">
                Classroom
              </span>
            </div>
            <span className="demo-tag">معاينة توضيحية</span>
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
                  مساحة المدرس<small>كل شيء في مكانه</small>
                </div>
              </div>
              {[
                [LayoutDashboard, 'نظرة عامة'],
                [UsersRound, 'الفصول'],
                [FileText, 'الواجبات'],
                [GraduationCap, 'الطلاب'],
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
                وقت أكثر.
                <br />
                وضوح أكبر.
              </div>
            </aside>
            <div className="demo-content">
              <div className="demo-heading">
                <div>
                  <span>جاهز ليوم أوضح؟</span>
                  <h2>صباح الخير، أستاذ أحمد</h2>
                </div>
                <span className="demo-avatar">أ</span>
              </div>
              <div className="demo-metrics">
                <div className="metric-ink">
                  <span className="number-font">04</span>
                  <small>فصول نشطة</small>
                </div>
                <div className="metric-violet">
                  <span className="number-font">28</span>
                  <small>طالبًا</small>
                </div>
                <div className="metric-mint">
                  <span className="number-font">12</span>
                  <small>تسليمًا جديدًا</small>
                </div>
              </div>
              <div className="demo-chart">
                <div>
                  <h3>إيقاع التعلّم</h3>
                  <span>هذا الأسبوع</span>
                </div>
                <svg
                  viewBox="0 0 340 104"
                  role="img"
                  aria-label="رسم توضيحي لتقدم التعلّم خلال الأسبوع"
                >
                  <defs>
                    <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6557f5" stopOpacity=".22" />
                      <stop offset="100%" stopColor="#6557f5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 26H340M0 58H340M0 90H340" stroke="#ebeaf3" fill="none" />
                  <path
                    d="M2 82C30 84 24 55 58 62S97 90 119 58S143 17 172 40S207 70 232 28S271 52 290 23S313 8 338 12V104H2Z"
                    fill="url(#chart-fill)"
                  />
                  <path
                    className="chart-trace"
                    d="M2 82C30 84 24 55 58 62S97 90 119 58S143 17 172 40S207 70 232 28S271 52 290 23S313 8 338 12"
                    stroke="#6557f5"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    pathLength="1"
                  />
                  <circle cx="338" cy="12" r="4" fill="#6557f5" />
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
                  <h3>اختبار الوحدة الثالثة</h3>
                  <p>الصف الثاني · ٣ تسليمات للمراجعة</p>
                </div>
                <span className="task-state">للمراجعة</span>
              </div>
            </div>
          </div>
          <div className="product-footer">
            <span>
              <i />
              عرض تصميمي، وليس بيانات حسابك
            </span>
            <span className="number-font">WORKSPACE / 01</span>
          </div>
        </div>
        <div className="float-card float-card-top">
          <span className="float-icon">
            <UsersRound size={18} aria-hidden="true" />
          </span>
          <div>
            كل فصل له مساحته<small>دعوة خاصة. بداية واضحة.</small>
          </div>
          <ArrowUpLeft size={16} aria-hidden="true" />
        </div>
        <div className="float-card float-card-bottom">
          <span className="float-icon mint">
            <Check size={19} aria-hidden="true" />
          </span>
          <div>
            كل خطوة محفوظة<small>مسار واضح من أول دعوة</small>
          </div>
        </div>
      </div>
    </div>
  )
}
