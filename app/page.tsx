import Link from 'next/link'
import {
  ArrowDown,
  ArrowLeft,
  BookOpenCheck,
  Check,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentContext } from '@/lib/auth/current-user'
import { LandingMotion, MotionControl } from '@/components/landing/landing-motion'
import { ProductScene } from '@/components/landing/product-scene'
import { WorkflowDemo } from '@/components/landing/workflow-demo'

const outcomes = [
  {
    icon: UsersRound,
    title: 'الفصل، من غير فوضى',
    text: 'دعوات خاصة، عضويات واضحة، ومساحة تعرف فيها كل طالب.',
    tone: 'violet',
    number: '01',
  },
  {
    icon: FileCheck2,
    title: 'كل خطوة لها أثر',
    text: 'تصوّر للمتابعة يجمع النسخ والتسليمات بدل الملفات المتناثرة.',
    tone: 'mint',
    number: '02',
  },
  {
    icon: ShieldCheck,
    title: 'القرار يفضل لك',
    text: 'مساحة مراجعة تضع عين المدرس في قلب التقييم والنشر.',
    tone: 'coral',
    number: '03',
  },
]

function Brand() {
  return (
    <Link href="/" className="landing-brand" aria-label="Classroom — الرئيسية">
      <span className="brand-symbol">
        <BookOpenCheck aria-hidden="true" size={23} strokeWidth={2} />
      </span>
      <span className="number-font" lang="en" dir="ltr">
        Classroom<span className="brand-period">.</span>
      </span>
    </Link>
  )
}

export default async function HomePage() {
  const { user, profile } = await getCurrentContext()
  if (user && profile?.status === 'active')
    redirect(profile.role === 'teacher' ? '/dashboard' : '/student/dashboard')

  return (
    <LandingMotion>
      <section className="landing-hero" id="home">
        <div className="hero-mesh" aria-hidden="true" />
        <div className="hero-aurora aurora-violet" aria-hidden="true" />
        <div className="hero-aurora aurora-cyan" aria-hidden="true" />
        <div className="landing-container">
          <header className="landing-header">
            <Brand />
            <nav className="desktop-nav" aria-label="التنقل الرئيسي">
              <a href="#outcomes">الفكرة</a>
              <a href="#story">كيف تعمل</a>
              <a href="#questions">أسئلة شائعة</a>
            </nav>
            <div className="header-actions">
              <Link href="/login" className="header-login">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="landing-button button-white button-compact">
                ابدأ كطالب
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <details className="mobile-menu">
                <summary aria-label="فتح القائمة">
                  <span />
                  <span />
                </summary>
                <nav aria-label="قائمة الموبايل">
                  <a href="#outcomes">الفكرة</a>
                  <a href="#story">كيف تعمل</a>
                  <a href="#questions">أسئلة شائعة</a>
                  <Link href="/login">تسجيل الدخول</Link>
                </nav>
              </details>
            </div>
          </header>
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="hero-badge" data-reveal>
                <span />
                تعليم له مساحة. ومساحة لها معنى.
              </div>
              <h1 className="hero-title" data-reveal data-delay="60">
                <span>كل فصل له إيقاعه.</span>
                <span className="title-coral">أنت تتحكم فيه.</span>
              </h1>
              <p className="hero-description" data-reveal data-delay="120">
                وقت أقل في ترتيب الفوضى.
                <br />
                ووقت أكثر في اللي يستحق: <strong>التعليم.</strong>
              </p>
              <div className="hero-actions" data-reveal data-delay="180">
                <Link className="landing-button button-primary" href="/register">
                  إنشاء حساب طالب
                  <ArrowLeft size={18} aria-hidden="true" />
                </Link>
                <a className="landing-button button-outline" href="#story">
                  اكتشف مساحة الفصل
                  <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
              <div className="hero-assurances" data-reveal data-delay="220">
                <span>
                  <Check size={15} aria-hidden="true" />
                  عربي من أول حرف
                </span>
                <span>
                  <Check size={15} aria-hidden="true" />
                  صلاحيات تحمي كل فصل
                </span>
              </div>
              <div className="hero-motion-row">
                <MotionControl />
                <span className="hero-index number-font" aria-hidden="true">
                  SCROLL TO EXPLORE — 01
                </span>
              </div>
            </div>
            <ProductScene />
          </div>
          <div className="hero-baseline">
            <span>وضوح للمدرس. خطوة مفهومة للطالب.</span>
            <a href="#outcomes" aria-label="اكتشف فكرة Classroom">
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <span className="number-font" aria-hidden="true">
              BUILT FOR THE WAY YOU TEACH
            </span>
          </div>
        </div>
      </section>
      <section id="outcomes" className="outcomes-section landing-container">
        <div className="section-intro">
          <div data-reveal>
            <p className="section-kicker">أقل ضوضاء. قيمة أكبر.</p>
            <h2 className="section-title">
              التنظيم مش تفصيلة.
              <br />
              <span>هو وقت بيرجع لك.</span>
            </h2>
          </div>
          <p className="section-copy" data-reveal data-delay="80">
            Classroom مساحة عربية تُبنى حول اللحظات المهمة في الفصل: طالب ينضم، واجب يصل، وقرار
            يحتاج انتباهك.
          </p>
        </div>
        <div className="outcome-cards">
          {outcomes.map(({ icon: Icon, title, text, tone, number }, index) => (
            <article
              className={`outcome-card tone-${tone}`}
              key={title}
              data-reveal
              data-delay={String(index * 70)}
            >
              <div className="outcome-top">
                <span className="number-font">/{number}</span>
                <span className="outcome-icon">
                  <Icon size={25} aria-hidden="true" />
                </span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#story" className="outcome-link" aria-label={`استكشف ${title}`}>
                شوف الرحلة
                <ArrowLeft size={17} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
      <WorkflowDemo />
      <section className="principles-section landing-container">
        <div className="principles-copy" data-reveal>
          <p className="section-kicker">وضوح، مش مجرد شكل</p>
          <h2 className="section-title">
            مساحة بسيطة.
            <br />
            <span>تفاصيل محسوبة.</span>
          </h2>
          <p className="section-copy">تجربة عربية تحترم وقتك، على شاشة كبيرة أو في كفّ إيدك.</p>
        </div>
        <div className="principle-list" data-reveal data-delay="80">
          <div>
            <span className="principle-mark">
              <BookOpenCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>عربي، مش واجهة مترجمة</h3>
              <p>خط واضح، قراءة مريحة، واتجاه يحترم لغتك.</p>
            </div>
          </div>
          <div>
            <span className="principle-mark mint">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>كل فصل له حدوده</h3>
              <p>صلاحيات مرتبطة بالملكية والعضوية، لا بمجرد إخفاء أزرار.</p>
            </div>
          </div>
          <div>
            <span className="principle-mark coral">
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>الحركة تشرح، مش تشتّت</h3>
              <p>جرّب القصة، حرّك الماوس فوق المعاينة، أو أوقف الحركة وقت ما تحب.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section landing-container" id="questions">
        <div data-reveal>
          <p className="section-kicker">قبل ما تبدأ</p>
          <h2 className="section-title">خلّينا نوضّح.</h2>
        </div>
        <div className="faq-list" data-reveal data-delay="80">
          <details>
            <summary>
              هل الأرقام في المعاينة تخص حسابًا حقيقيًا؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              لا. المعاينة والقصة التفاعلية تعرضان أمثلة توضيحية للتصميم، وليستا بيانات حسابك أو
              نتائج طلاب حقيقيين.
            </p>
          </details>
          <details>
            <summary>
              إزاي الطالب بينضم إلى فصل؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              بعد تسجيل الدخول، يستخدم الطالب رابط الدعوة الخاص الذي يرسله المدرس. الانضمام مرتبط
              بالعضوية وسعة الفصل.
            </p>
          </details>
          <details>
            <summary>
              هل المنصة مكتملة وجاهزة للاستخدام النهائي؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              المنصة ما زالت قيد التطوير. قاعدة البيانات والفصول والدعوات موجودة، بينما التسليمات
              والاختبارات والتصحيح تحتاج استكمالًا. تسجيل الهاتف يحتاج تفعيل مزود SMS في Supabase.
            </p>
          </details>
        </div>
      </section>
      <section id="start" className="final-section landing-container">
        <div className="final-cta" data-reveal>
          <div className="cta-orbit" aria-hidden="true" />
          <div>
            <p>كل رحلة تعليم تستحق بداية واضحة.</p>
            <h2>
              الفصل الواضح يبدأ
              <br />
              بمساحة واضحة.
            </h2>
          </div>
          <div className="final-actions">
            <Link className="landing-button button-white" href="/register">
              إنشاء حساب طالب
              <ArrowLeft aria-hidden="true" size={18} />
            </Link>
            <Link className="landing-button button-outline" href="/login">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>
      <footer className="landing-footer landing-container">
        <Brand />
        <p>تعليم منظّم. وتفاصيل بتفرق.</p>
        <span className="number-font" lang="en" dir="ltr">
          CLASSROOM © 2026
        </span>
      </footer>
    </LandingMotion>
  )
}
