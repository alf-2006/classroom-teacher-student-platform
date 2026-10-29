'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, Check, FileText, Link2, ShieldCheck, UsersRound } from 'lucide-react'
import { useLandingMotion } from './landing-motion'

const steps = [
  { title: 'دعوة تلمّ الفصل', text: 'لينك واحد خاص. والطلبة في المكان الصح.', icon: Link2 },
  {
    title: 'تسليم ما يضيعش',
    text: 'ملف واضح، نسخة محفوظة، والخطوة الجاية معروفة.',
    icon: FileText,
  },
  { title: 'القرار في إيدك', text: 'المراجعة قدامك. والنتيجة تنزل لما تقرر.', icon: ShieldCheck },
]

export function WorkflowDemo() {
  const [stage, setStage] = useState(0)
  const { enabled } = useLandingMotion()
  const panel = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const keyboard = useRef(false)

  useEffect(() => {
    if (!enabled || keyboard.current || !panel.current) return
    const animation = panel.current.animate(
      [
        { opacity: 0.15, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 450, easing: 'cubic-bezier(.23,1,.32,1)' },
    )
    return () => animation.cancel()
  }, [stage, enabled])

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
    keyboard.current = true
    setStage(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="workflow-section" id="story">
      <div className="landing-container workflow-layout">
        <div data-reveal>
          <p className="section-kicker">من أولها لآخرها</p>
          <h2 className="section-title">
            مش أدوات وخلاص.
            <br />
            <span>كل خطوة ماشية مع اللي بعدها.</span>
          </h2>
          <p className="section-copy">
            من الدعوة للقرار، شوف كل خطوة وهي بتاخد مكانها. جرّب المراحل التلاتة.
          </p>
          <div role="tablist" aria-label="مراحل شغل Classroom" className="workflow-tabs">
            {steps.map(({ title, text, icon: Icon }, index) => (
              <button
                role="tab"
                type="button"
                aria-selected={stage === index}
                aria-controls="workflow-panel"
                id={`workflow-tab-${index}`}
                key={title}
                ref={(element) => {
                  tabs.current[index] = element
                }}
                tabIndex={stage === index ? 0 : -1}
                className={`workflow-tab ${stage === index ? 'is-active' : ''}`}
                onKeyDown={(event) => changeByKeyboard(event, index)}
                onClick={(event) => {
                  keyboard.current = event.detail === 0
                  setStage(index)
                }}
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
        <div className="workflow-visual" data-reveal data-delay="100">
          <div className="workflow-card">
            <div className="workflow-toolbar">
              <span>
                <i />
                حكاية فصل واحد
              </span>
              <span className="number-font">0{stage + 1} / 03</span>
            </div>
            <div
              id="workflow-panel"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`workflow-tab-${stage}`}
              ref={panel}
              className="workflow-panel"
            >
              {stage === 0 ? (
                <>
                  <span className="workflow-symbol">
                    <Link2 size={30} aria-hidden="true" />
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
              ) : stage === 1 ? (
                <>
                  <span className="workflow-symbol mint">
                    <FileText size={30} aria-hidden="true" />
                  </span>
                  <span className="demo-tag">مثال للتسليم · لسه بيتجهّز</span>
                  <h3>كده هنرتّب التسليمات</h3>
                  <p>ده تصوّر للمتابعة اللي لسه بنجهّزها: نسخة واضحة، وخطوة جاية معروفة.</p>
                  <div className="demo-file">
                    <FileText size={26} aria-hidden="true" />
                    <div>
                      <strong>حلّ الوحدة التالتة.pdf</strong>
                      <small>ملف مثال · مش تسليم حقيقي</small>
                    </div>
                    <Check size={19} aria-hidden="true" />
                  </div>
                  <div className="workflow-progress">
                    <span>ملف واضح. ومراجعة أسرع.</span>
                    <div>
                      <i className="mint" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="workflow-symbol coral">
                    <ShieldCheck size={30} aria-hidden="true" />
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
              )}
            </div>
            <div className="workflow-bottom">
              <UsersRound size={16} aria-hidden="true" />
              <span>كل فصل، وكل طالب، وكل خطوة في مكانها.</span>
              <ArrowLeft size={16} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
