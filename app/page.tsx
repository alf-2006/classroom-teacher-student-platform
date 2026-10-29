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
import { LandingMotion } from '@/components/landing/landing-motion'
import { ScrollCinema } from '@/components/landing/scroll-cinema'
import { WorkflowDemo } from '@/components/landing/workflow-demo'

const outcomes = [
  {
    icon: UsersRound,
    title: 'الفصل من غير دوشة',
    text: 'دعوات خاصة، عضويات واضحة، وكل طالب باين مكانه.',
    tone: 'violet',
    number: '01',
  },
  {
    icon: FileCheck2,
    title: 'كل خطوة ليها أثر',
    text: 'متابعة تجمع النسخ والتسليمات بدل الملفات اللي بتتوه.',
    tone: 'mint',
    number: '02',
  },
  {
    icon: ShieldCheck,
    title: 'القرار في إيدك',
    text: 'مساحة مراجعة تخلي عين المدرس هي الأساس في التقييم والنشر.',
    tone: 'coral',
    number: '03',
  },
]

function Brand() {
  return (
    <Link href="/" className="landing-brand" aria-label="Classroom — الصفحة الرئيسية">
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
            <nav className="desktop-nav" aria-label="التنقل بين الصفحات">
              <a href="#outcomes">الحكاية</a>
              <a href="#story">بتشتغل إزاي</a>
              <a href="#questions">أسئلة بنسمعها كتير</a>
            </nav>
            <div className="header-actions">
              <Link href="/login" className="header-login">
                ادخل حسابك
              </Link>
              <Link href="/register" className="landing-button button-white button-compact">
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
          </header>
        </div>
        <ScrollCinema>
          <div className="hero-copy">
            <div className="hero-badge" data-reveal>
              <span />
              التعليم ليه مساحة. والمساحة ليها معنى.
            </div>
            <h1 className="hero-title" data-reveal data-delay="60">
              <span>كل فصل ليه طريقته.</span>
              <span className="title-coral">وإنت ماسك الدفّة.</span>
            </h1>
            <p className="hero-description" data-reveal data-delay="120">
              وقت أقل في لَمّ الدوشة.
              <br />
              ووقت أكتر للي يستاهل: <strong>التعليم.</strong>
            </p>
            <div className="hero-actions" data-reveal data-delay="180">
              <Link className="landing-button button-primary" href="/register">
                اعمل حساب طالب
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
              <a className="landing-button button-outline" href="#story">
                شوف مساحة الفصل
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
                صلاحيات بتحمي كل فصل
              </span>
            </div>
          </div>
        </ScrollCinema>
      </section>
      <section id="outcomes" className="outcomes-section landing-container">
        <div className="section-intro">
          <div data-reveal>
            <p className="section-kicker">أقل دوشة. قيمة أكتر.</p>
            <h2 className="section-title">
              التنظيم مش رفاهية.
              <br />
              <span>ده وقت بيرجعلك.</span>
            </h2>
          </div>
          <p className="section-copy" data-reveal data-delay="80">
            Classroom مساحة بالعربي معمولة حوالين اللحظات المهمة في الفصل: طالب ينضم، واجب يوصل،
            وقرار محتاج تركيزك.
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
              <a href="#story" className="outcome-link" aria-label={`شوف حكاية ${title}`}>
                شوف الحكاية
                <ArrowLeft size={17} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
      <WorkflowDemo />
      <section className="principles-section landing-container">
        <div className="principles-copy" data-reveal>
          <p className="section-kicker">الوضوح، مش منظر وخلاص</p>
          <h2 className="section-title">
            مساحة بسيطة.
            <br />
            <span>وكل تفصيلة في حسابها.</span>
          </h2>
          <p className="section-copy">
            تجربة بالعربي بتحترم وقتك، على الشاشة الكبيرة أو في كف إيدك.
          </p>
        </div>
        <div className="principle-list" data-reveal data-delay="80">
          <div>
            <span className="principle-mark">
              <BookOpenCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>عربي بجد، مش واجهة مترجمة</h3>
              <p>خط واضح، قراية مريحة، واتجاه يحترم لغتك.</p>
            </div>
          </div>
          <div>
            <span className="principle-mark mint">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>كل فصل ليه حدوده</h3>
              <p>صلاحيات مرتبطة بالملكية والعضوية، مش مجرد أزرار مستخبية.</p>
            </div>
          </div>
          <div>
            <span className="principle-mark coral">
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>الحركة بتشرح، مش بتشتّت</h3>
              <p>انزل بالسكرول وشوف الواجهة وهي بتفتح لطبقات، أو وقّف الحركة وقت ما تحب.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section landing-container" id="questions">
        <div data-reveal>
          <p className="section-kicker">قبل ما نبدأ</p>
          <h2 className="section-title">خلّينا نوضّحها.</h2>
        </div>
        <div className="faq-list" data-reveal data-delay="80">
          <details>
            <summary>
              الأرقام اللي في المعاينة دي تخص حساب حقيقي؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              لأ. المعاينة والحكاية التفاعلية دي أمثلة للتوضيح، مش بيانات حسابك ولا نتائج طلبة
              حقيقيين.
            </p>
          </details>
          <details>
            <summary>
              إزاي الطالب بينضم لفصل؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              بعد ما يسجّل دخوله، الطالب بيستخدم رابط الدعوة الخاص اللي المدرس بيبعته. الانضمام
              مرتبط بعضوية الفصل وسعته.
            </p>
          </details>
          <details>
            <summary>
              المنصة جاهزة نستخدمها دلوقتي؟<span aria-hidden="true">+</span>
            </summary>
            <p>
              لسه بنكمّل المنصة. قاعدة البيانات والفصول والدعوات شغّالة، إنما التسليمات والاختبارات
              والتصحيح لسه محتاجة استكمال. وتسجيل الموبايل محتاج تفعيل مزوّد SMS في Supabase.
            </p>
          </details>
        </div>
      </section>
      <section id="start" className="final-section landing-container">
        <div className="final-cta" data-reveal>
          <div className="cta-orbit" aria-hidden="true" />
          <div>
            <p>كل رحلة تعليم تستاهل بداية واضحة.</p>
            <h2>
              الفصل المرتّب بيبدأ
              <br />
              من مساحة واضحة.
            </h2>
          </div>
          <div className="final-actions">
            <Link className="landing-button button-white" href="/register">
              اعمل حساب طالب
              <ArrowLeft aria-hidden="true" size={18} />
            </Link>
            <Link className="landing-button button-outline" href="/login">
              ادخل حسابك
            </Link>
          </div>
        </div>
      </section>
      <footer className="landing-footer landing-container">
        <Brand />
        <p>تعليم مترتّب. وتفاصيل بتفرق.</p>
        <span className="number-font" lang="en" dir="ltr">
          CLASSROOM © 2026
        </span>
      </footer>
    </LandingMotion>
  )
}
