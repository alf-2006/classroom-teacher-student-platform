import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import type { ReactNode } from 'react'

export function LoginFrame({ children }: { children: ReactNode }) {
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
            <h1 id="account-title">تسجيل الدخول</h1>
            <p className="account-subtitle">
              إلى حسابك في{' '}
              <bdi className="number-font" lang="en">
                Classroom
              </bdi>
            </p>
            <p className="account-intro-note">
              فصلك، وطلابك، وخطوتك التالية.
              <br />
              كل شيء في مكانه.
            </p>
          </header>
          <div className="account-form-column">{children}</div>
        </section>
        <footer className="account-footer">
          <span lang="ar">العربية</span>
          <Link href="/" className="account-home">
            <ArrowRight size={15} aria-hidden="true" />
            العودة للرئيسية
          </Link>
        </footer>
        <p className="account-service-note">
          <Info size={14} aria-hidden="true" />
          <span>المعاينة قيد التطوير. الدخول بالهاتف يحتاج استكمال إعداد مزوّد SMS.</span>
        </p>
      </div>
    </main>
  )
}
