'use client'

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react'
import { ArrowLeft, Check, FileText, Link2, ShieldCheck, UsersRound } from 'lucide-react'
import { clamp01, useElementMetrics, useLandingMotion, useScrollFrame } from './landing-motion'

const steps = [
  { title: 'دعوة تلمّ الفصل', text: 'لينك واحد خاص. والطلبة في المكان الصح.', icon: Link2 },
  {
    title: 'تسليم ما يضيعش',
    text: 'ملف واضح، نسخة محفوظة، والخطوة الجاية معروفة.',
    icon: FileText,
  },
  { title: 'القرار في إيدك', text: 'المراجعة قدامك. والنتيجة تنزل لما تقرر.', icon: ShieldCheck },
]

const PIN_QUERY = '(min-width: 1024px) and (min-height: 620px)'

/** False in SSR markup and during hydration, true once the client is interactive. */
const noopSubscribe = () => () => {}
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

function usePinnable(enabled: boolean) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    if (!enabled) return
    const media = window.matchMedia(PIN_QUERY)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [enabled])
  return enabled && matches
}

function StagePanel({ index }: { index: number }) {
  if (index === 0)
    return (
      <>
        <span className="workflow-symbol">
          <Link2 size={28} aria-hidden="true" />
        </span>
        <span className="demo-tag">مثال للتوضيح</span>
        <h3>الصف التاني · رياضيات</h3>
        <p>دعوة خاصة توصّل طلبتك لمساحة الفصل.</p>
        <div className="demo-link" dir="ltr">
          <span className="number-font">classroom / invite / ••••••</span>
          <Check size={17} aria-hidden="true" />
        </div>
        <div className="student-stack">
          <div aria-hidden="true">
            <span>أ</span>
            <span>م</span>
            <span>س</span>
            <span>ن</span>
          </div>
          <p>
            <strong>الطلبة كلهم في مكان واحد</strong>
            <small>مفيش لينكات تايهة، والواتساب ياخد أجازة.</small>
          </p>
        </div>
      </>
    )
  if (index === 1)
    return (
      <>
        <span className="workflow-symbol mint">
          <FileText size={28} aria-hidden="true" />
        </span>
        <span className="demo-tag">مثال للتسليم · لسه بيتجهّز</span>
        <h3>كده هنرتّب التسليمات</h3>
        <p>ده تصوّر للمتابعة اللي لسه بنجهّزها: نسخة واضحة، وخطوة جاية معروفة.</p>
        <div className="demo-file">
          <FileText size={24} aria-hidden="true" />
          <div>
            <strong>حلّ الوحدة التالتة.pdf</strong>
            <small>ملف مثال · مش تسليم حقيقي</small>
          </div>
          <Check size={19} aria-hidden="true" />
        </div>
        <div className="workflow-progress">
          <span>ملف واضح. ومراجعة أسرع.</span>
          <div>
            <i />
          </div>
        </div>
      </>
    )
  return (
    <>
      <span className="workflow-symbol coral">
        <ShieldCheck size={28} aria-hidden="true" />
      </span>
      <span className="demo-tag">نشوف المراجعة ماشية إزاي</span>
      <h3>القرار عند المدرس</h3>
      <p>اقتراحات تساعدك، بس القرار والنشر في إيدك.</p>
      <div className="grade-review">
        <span className="number-font">
          18 <small>/ 20</small>
        </span>
        <div>
          <strong>درجة لسه بتتراجع</strong>
          <small>مش بتتنشر قبل قرار المدرس</small>
        </div>
      </div>
      <div className="review-note">
        <Check size={17} aria-hidden="true" />
        المدرس يراجع، والصورة كاملة.
      </div>
    </>
  )
}

export function WorkflowDemo() {
  const [stage, setStage] = useState(0)
  const { enabled } = useLandingMotion()
  const pinned = usePinnable(enabled)
  const section = useRef<HTMLElement>(null)
  const meter = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const stageRef = useRef(0)
  const metrics = useElementMetrics(section, pinned)
  // Without JS every panel stays readable; inactive panels are hidden only once tabs work.
  const hydrated = useHydrated()

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    const bar = meter.current
    return () => {
      if (bar) bar.style.transform = ''
    }
  }, [pinned])

  useScrollFrame((y, viewport) => {
    const { top, height } = metrics.current
    const travel = height - viewport
    if (travel <= 0) return
    const progress = clamp01((y - top) / travel)
    if (meter.current) meter.current.style.transform = `scaleX(${progress})`
    const next = Math.min(steps.length - 1, Math.floor(progress * steps.length))
    if (next !== stageRef.current) {
      stageRef.current = next
      // Only at stage boundaries (twice per pass), and never urgent for the frame.
      startTransition(() => setStage(next))
    }
  }, pinned)

  /** In the pinned story the scroll position is the source of truth. */
  function goTo(index: number, instant: boolean) {
    setStage(index)
    stageRef.current = index
    if (!pinned) return
    const { top, height } = metrics.current
    const travel = height - window.innerHeight
    window.scrollTo({
      top: top + ((index + 0.5) / steps.length) * travel,
      behavior: instant ? 'auto' : 'smooth',
    })
  }

  function changeByKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === 'ArrowLeft'
        ? (index + 1) % 3
        : event.key === 'ArrowRight'
          ? (index + 2) % 3
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? 2
              : null
    if (next === null) return
    event.preventDefault()
    goTo(next, true)
    tabs.current[next]?.focus({ preventScroll: true })
  }

  return (
    <section className={`workflow-section ${pinned ? 'is-pinned' : ''}`} id="story" ref={section}>
      <div className="workflow-sticky">
        <div className="landing-container workflow-layout">
          <div className="workflow-copy">
            <p className="eyebrow" data-reveal>
              <span className="mono" lang="en" dir="ltr">
                03
              </span>
              <i aria-hidden="true" />
              بتشتغل إزاي
            </p>
            <h2 className="section-title" data-reveal data-delay="1">
              مش أدوات وخلاص.
              <br />
              <span>كل خطوة ماشية مع اللي بعدها.</span>
            </h2>
            <p className="section-copy" data-reveal data-delay="2">
              من الدعوة للقرار، شوف كل خطوة وهي بتاخد مكانها.{' '}
              {pinned ? 'انزل بالسكرول أو اختار مرحلة.' : 'جرّب المراحل التلاتة.'}
            </p>
            <div
              role="tablist"
              aria-label="مراحل شغل Classroom"
              className="workflow-tabs"
              data-reveal
              data-delay="3"
            >
              {steps.map(({ title, text, icon: Icon }, index) => (
                <button
                  role="tab"
                  type="button"
                  aria-selected={stage === index}
                  aria-controls={`workflow-panel-${index}`}
                  id={`workflow-tab-${index}`}
                  key={title}
                  ref={(element) => {
                    tabs.current[index] = element
                  }}
                  tabIndex={stage === index ? 0 : -1}
                  className={`workflow-tab ${stage === index ? 'is-active' : ''}`}
                  onKeyDown={(event) => changeByKeyboard(event, index)}
                  onClick={(event) => goTo(index, event.detail === 0)}
                >
                  <span className="step-index number-font">0{index + 1}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                  <Icon aria-hidden="true" size={19} />
                </button>
              ))}
            </div>
          </div>
          <div className="workflow-visual" data-reveal data-delay="2">
            <div className="workflow-card">
              <div className="workflow-toolbar">
                <span>
                  <i />
                  حكاية فصل واحد
                </span>
                <span className="number-font" aria-live="polite">
                  0{stage + 1} / 03
                </span>
              </div>
              <div className="workflow-meter" aria-hidden="true">
                <i
                  ref={meter}
                  style={pinned ? undefined : { transform: `scaleX(${(stage + 1) / 3})` }}
                />
              </div>
              <div className="workflow-stack">
                {steps.map(({ title }, index) => {
                  const active = index === stage
                  return (
                    <div
                      key={title}
                      id={`workflow-panel-${index}`}
                      role="tabpanel"
                      aria-labelledby={`workflow-tab-${index}`}
                      aria-hidden={hydrated && !active ? 'true' : undefined}
                      inert={hydrated && !active}
                      tabIndex={active ? 0 : -1}
                      className="workflow-panel"
                      data-offset={String(index - stage)}
                    >
                      <StagePanel index={index} />
                    </div>
                  )
                })}
              </div>
              <div className="workflow-bottom">
                <UsersRound size={16} aria-hidden="true" />
                <span>كل فصل، وكل طالب، وكل خطوة في مكانها.</span>
                <ArrowLeft size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
