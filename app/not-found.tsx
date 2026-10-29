import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main id="main-content" className="account-page">
      <section
        className="surface-card w-full max-w-lg p-8 text-center sm:p-10"
        aria-labelledby="not-found-title"
      >
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary-50 text-primary-700">
          <Search size={25} aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-primary-700">404 · الصفحة مش هنا</p>
        <h1 id="not-found-title" className="mt-3 text-3xl font-semibold leading-relaxed">
          اللينك خد لفة زيادة
        </h1>
        <p className="mt-4 text-sm leading-8 text-muted">
          الصفحة دي مش موجودة. راجع اللينك، أو نرجع للرئيسية ونبدأ من هناك.
        </p>
        <Link href="/" className="landing-button button-primary mt-7">
          <ArrowRight size={17} aria-hidden="true" />
          ارجع للرئيسية
        </Link>
      </section>
    </main>
  )
}
