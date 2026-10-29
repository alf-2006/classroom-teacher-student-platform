import Link from 'next/link'
import { ArrowDown, ArrowLeft, BookOpenCheck, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentContext } from '@/lib/auth/current-user'
import { InkMark } from '@/components/landing/ink-mark'
import { LandingMotion, MotionControl } from '@/components/landing/landing-motion'
import { Manifesto } from '@/components/landing/manifesto'
import { Marquee } from '@/components/landing/marquee'
import { MOTION_BOOT_SCRIPT } from '@/components/landing/motion-boot'
import { ProductScene } from '@/components/landing/product-scene'
import { SectionRail, type Chapter } from '@/components/landing/section-rail'
import { SiteIntro } from '@/components/landing/site-intro'
import { WorkflowDemo } from '@/components/landing/workflow-demo'

const chapters: Chapter[] = [
  { id: 'home', number: '00', label: 'البداية' },
  { id: 'outcomes', number: '01', label: 'الحكاية' },
  { id: 'line', number: '02', label: 'خط واحد' },
  { id: 'story', number: '03', label: 'بتشتغل إزاي' },
  { id: 'details', number: '04', label: 'التفاصيل' },
  { id: 'questions', number: '05', label: 'أسئلة' },
  { id: 'start', number: '06', label: 'يلا' },
]

const outcomes = [
  {
    number: '01',
    title: 'الفصل من غير دوشة',
    text: 'دعوات خاصة، عضويات واضحة، وكل طالب باين مكانه.',
  },
  {
    number: '02',
    title: 'كل خطوة ليها أثر',
    text: 'متابعة تجمع النسخ والتسليمات بدل الملفات اللي بتتوه.',
  },
  {
    number: '03',
    title: 'القرار في إيدك',
    text: 'مساحة مراجعة تخلي عين المدرس هي الأساس في التقييم والنشر.',
  },
]

const principles = [
  {
    icon: BookOpenCheck,
    title: 'عربي بجد، مش واجهة مترجمة',
    text: 'خط واضح، قراية مريحة، واتجاه يحترم لغتك.',
  },
  {
    icon: ShieldCheck,
    title: 'كل فصل ليه حدوده',
    text: 'صلاحيات مرتبطة بالملكية والعضوية، مش مجرد أزرار مستخبية.',
  },
  {
    icon: Sparkles,
    title: 'الحركة بتشرح، مش بتشتّت',
    text: 'انزل بالراحة وشوف الحكاية، أو وقّف الحركة وقت ما تحب.',
  },
]

function Brand() {
  return (
    <Link href="/" className="landing-brand" aria-label="Classroom — الصفحة الرئيسية">
      <span className="brand-symbol">
        <BookOpenCheck aria-hidden="true" size={21} strokeWidth={2.1} />
      </span>
      <span className="number-font" lang="en" dir="ltr">
        Classroom<span className="brand-period">.</span>
      </span>
    </Link>
  )
}

function Eyebrow({ number, children }: { number: string; children: string }) {
  return (
    <p className="eyebrow" data-reveal>
      <span className="mono" lang="en" dir="ltr">
        {number}
      </span>
      <i aria-hidden="true" />
      {children}
    </p>
  )
}

export default async function HomePage() {
  const { user, profile } = await getCurrentContext()
  if (user && profile?.status === 'active')
    redirect(profile.role === 'teacher' ? '/dashboard' : '/student/dashboard')

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      <LandingMotion>
        <SiteIntro />
        <header className="landing-header">
          <div className="landing-container header-inner">
            <Brand />
            <nav className="desktop-nav" aria-label="التنقل بين الصفحات">
              <a href="#outcomes">الحكاية</a>
              <a href="#story">بتشتغل إزاي</a>
              <a href="#questions">أسئلة بنسمعها كتير</a>
            </nav>
            <div className="header-actions">
              <Link href="/login" className="header-login">
                ادخل حسابك
              </Link>
              <Link href="/register" className="landing-button button-primary button-compact">
                اعمل حساب طالب
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <details className="mobile-menu">
                <summary aria-label="افتح القائمة">
                  <span />
                  <span />
                </summary>
                <nav aria-label="قائمة الموبايل">
                  <a href="#outcomes">الحكاية</a>
                  <a href="#story">بتشتغل إزاي</a>
                  <a href="#questions">أسئلة بنسمعها كتير</a>
                  <Link href="/login">ادخل حسابك</Link>
                </nav>
              </details>
            </div>
          </div>
        </header>

        <SectionRail chapters={chapters} />

        <section className="landing-hero" id="home">
          <div className="paper-rules" aria-hidden="true" />
          <div className="landing-container hero-frame">
            <span className="frame-corner corner-a" aria-hidden="true" />
            <span className="frame-corner corner-b" aria-hidden="true" />
            <div className="hero-layout">
              <div className="hero-copy">
                <p className="eyebrow intro intro-1">
                  <span className="mono" lang="en" dir="ltr">
                    00
                  </span>
                  <i aria-hidden="true" />
                  التعليم ليه مساحة. والمساحة ليها معنى.
                </p>
                <h1 className="hero-title">
                  <span className="hero-line">
                    <span>كل فصل ليه طريقته.</span>
                  </span>
                  <span className="hero-line">
                    <span>
                      وإنت <span className="hl">ماسك الدفّة.</span>
                    </span>
                  </span>
                </h1>
                <p className="hero-description intro intro-3">
                  وقت أقل في لَمّ الدوشة، ووقت أكتر للي يستاهل: <strong>التعليم.</strong>
                </p>
                <div className="hero-actions intro intro-4">
                  <Link className="landing-button button-primary" href="/register">
                    اعمل حساب طالب
                    <ArrowLeft size={18} aria-hidden="true" />
                  </Link>
                  <a className="landing-button button-outline" href="#story">
                    شوف مساحة الفصل
                    <ArrowDown size={17} aria-hidden="true" />
                  </a>
                </div>
                <div className="hero-meta intro intro-5">
                  <span>
                    <Check size={15} aria-hidden="true" />
                    عربي من أول حرف
                  </span>
                  <span>
                    <Check size={15} aria-hidden="true" />
                    صلاحيات بتحمي كل فصل
                  </span>
                  <MotionControl />
                </div>
              </div>
              <ProductScene />
            </div>
            <div className="hero-baseline intro intro-6">
              <span>وضوح للمدرس. وخطوة سهلة للطالب.</span>
              <a href="#outcomes" className="scroll-cue" aria-label="شوف فكرة Classroom">
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <span className="mono" lang="en" dir="ltr" aria-hidden="true">
                SCROLL — 00 / 06
              </span>
            </div>
          </div>
        </section>

        <section id="outcomes" className="manifesto-section">
          <div className="landing-container">
            <Eyebrow number="01">الحكاية</Eyebrow>
            <Manifesto
              text="الفصل مش جروب واتساب، ولا كومة ملفات على الديسك. الفصل مساحة: طالب بينضم، وواجب بيوصل، وقرار محتاج عينك. وإحنا بنلمّ ده كله في مكان واحد واضح."
              keywords={['مساحة', 'عينك', 'واضح']}
            />
            <ol className="outcome-rows">
              {outcomes.map(({ number, title, text }, index) => (
                <li key={number} data-reveal data-delay={String(index + 1)}>
                  <span className="mono" lang="en" dir="ltr">
                    /{number}
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="#story" aria-label={`شوف حكاية ${title}`}>
                    شوف الحكاية
                    <ArrowLeft size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <InkMark />

        <WorkflowDemo />

        <Marquee />

        <section id="details" className="principles-section">
          <div className="landing-container principles-layout">
            <div className="principles-copy">
              <Eyebrow number="04">التفاصيل</Eyebrow>
              <h2 className="section-title" data-reveal data-delay="1">
                مساحة بسيطة.
                <br />
                <span>وكل تفصيلة في حسابها.</span>
              </h2>
              <p className="section-copy" data-reveal data-delay="2">
                تجربة بالعربي بتحترم وقتك، على الشاشة الكبيرة أو في كف إيدك.
              </p>
            </div>
            <ul className="principle-list">
              {principles.map(({ icon: Icon, title, text }, index) => (
                <li key={title} data-reveal data-delay={String(index + 1)}>
                  <span className="principle-mark">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="faq-section" id="questions">
          <div className="landing-container faq-layout">
            <div>
              <Eyebrow number="05">قبل ما نبدأ</Eyebrow>
              <h2 className="section-title" data-reveal data-delay="1">
                خلّينا نوضّحها.
              </h2>
            </div>
            <div className="faq-list" data-reveal data-delay="2">
              <details>
                <summary>
                  الأرقام اللي في المعاينة دي تخص حساب حقيقي؟
                  <span aria-hidden="true" />
                </summary>
                <p>
                  لأ. المعاينة والحكاية التفاعلية دي أمثلة للتوضيح، مش بيانات حسابك ولا نتائج طلبة
                  حقيقيين.
                </p>
              </details>
              <details>
                <summary>
                  إزاي الطالب بينضم لفصل؟
                  <span aria-hidden="true" />
                </summary>
                <p>
                  بعد ما يسجّل دخوله، الطالب بيستخدم رابط الدعوة الخاص اللي المدرس بيبعته. الانضمام
                  مرتبط بعضوية الفصل وسعته.
                </p>
              </details>
              <details>
                <summary>
                  المنصة جاهزة نستخدمها دلوقتي؟
                  <span aria-hidden="true" />
                </summary>
                <p>
                  لسه بنكمّل المنصة. قاعدة البيانات والفصول والدعوات شغّالة، إنما التسليمات
                  والاختبارات والتصحيح لسه محتاجة استكمال. وتسجيل الموبايل محتاج تفعيل مزوّد SMS في
                  Supabase.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section id="start" className="final-section">
          <div className="landing-container">
            <div className="final-cta" data-reveal>
              <svg className="cta-mark" viewBox="0 0 320 150" aria-hidden="true">
                <path
                  d="M300 70c0-30-22-52-50-52s-48 24-44 52c4 30 34 44 60 30M206 74C176 52 150 120 118 118S70 60 40 76l-26 14M40 76l26 40 54-90"
                  pathLength="1"
                />
              </svg>
              <div className="final-copy">
                <p className="mono">
                  <span lang="en" dir="ltr">
                    06 — START
                  </span>
                </p>
                <h2>
                  الفصل المرتّب بيبدأ
                  <br />
                  من مساحة واضحة.
                </h2>
                <p>كل رحلة تعليم تستاهل بداية واضحة.</p>
              </div>
              <div className="final-actions">
                <Link className="landing-button button-white" href="/register">
                  اعمل حساب طالب
                  <ArrowLeft aria-hidden="true" size={18} />
                </Link>
                <Link className="landing-button button-ghost" href="/login">
                  ادخل حسابك
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="landing-container footer-inner">
            <Brand />
            <p>تعليم مترتّب. وتفاصيل بتفرق.</p>
            <span className="mono" lang="en" dir="ltr">
              CLASSROOM © 2026
            </span>
          </div>
        </footer>
      </LandingMotion>
    </>
  )
}
