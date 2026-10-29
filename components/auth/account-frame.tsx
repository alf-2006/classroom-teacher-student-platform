import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import type { ReactNode } from 'react'

export function AccountFrame({
  mode,
  children,
}: {
  mode: 'login' | 'register'
  children: ReactNode
}) {
  const register = mode === 'register'
  return (
    <main id="main-content" className="account-page">
      <div className="account-container">
        <section className="account-card" aria-labelledby="account-title">
          <header className="account-intro">
            <Link href="/" className="account-brand" aria-label="Classroom — الرئيسية">
              <Image src="/icon.svg" width={36} height={36} alt="" />
              <span className="number-font" lang="en" dir="ltr">
                Classroom
              </span>
            </Link>
            <h1 id="account-title">{register ? 'اعمل حساب طالب' : 'ادخل حسابك'}</h1>
            <p className="account-subtitle">
              {register ? 'ابدأ حكايتك مع ' : 'نورت حسابك في '}
              <bdi className="number-font" lang="en">
                Classroom
              </bdi>
            </p>
            <p className="account-intro-note">
              {register ? 'اعمل حسابك، ولينك المدرس يوصّلك لفصلك.' : 'فصلك وواجباتك. كله في مكانه.'}
              <br />
              {register ? 'أول خطوة بسيطة. والباقي واحدة واحدة.' : 'من غير دوشة «الواجب فين؟».'}
            </p>
          </header>
          <div className="account-form-column">{children}</div>
        </section>
        <footer className="account-footer">
          <span lang="ar-EG">مصري على طبيعته</span>
          <Link href="/" className="account-home">
            <ArrowRight size={15} aria-hidden="true" />
            ارجع للرئيسية
          </Link>
        </footer>
        <p className="account-service-note">
          <Info size={14} aria-hidden="true" />
          <span>الموقع لسه بيتجهّز. الدخول بالموبايل محتاج نكمّل إعداد خدمة الرسائل SMS.</span>
        </p>
      </div>
    </main>
  )
}
