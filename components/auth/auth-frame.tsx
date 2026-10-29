import Link from 'next/link'
import { ArrowRight, BookOpenCheck, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

export function AuthFrame({ register, children }: { register?: boolean; children: ReactNode }) {
  return (
    <main id="main-content" className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <section
        className="relative hidden overflow-hidden bg-ink px-10 py-10 text-white lg:flex lg:flex-col"
        style={{ background: '#0b1020' }}
        aria-label="عن Classroom"
      >
        <div
          className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-[radial-gradient(circle,#6557f54d,transparent_65%)]"
          aria-hidden="true"
        />
        <Link className="number-font relative flex items-center gap-3 text-xl font-bold" href="/">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-500">
            <BookOpenCheck aria-hidden="true" size={22} />
          </span>
          Classroom.
        </Link>
        <div className="relative my-auto max-w-md py-14">
          <p className="text-sm text-primary-100">
            {register ? 'بداية واضحة للطالب' : 'ارجع لمساحتك'}
          </p>
          <h2 className="mt-5 text-[clamp(2rem,3.3vw,3.25rem)] font-semibold leading-[1.5]">
            {register ? 'فصلك في مكانه. وخطوتك القادمة أوضح.' : 'كل فصل له إيقاعه. أنت تتحكم فيه.'}
          </h2>
          <p className="mt-7 text-base leading-8 text-[#c3c5d6]">
            {register
              ? 'أنشئ حسابك، ثم استخدم دعوة المدرس للانضمام إلى مساحة فصلك.'
              : 'مساحة عربية تجمع الفصول والطلاب. قراءة مريحة، وصلاحيات تحمي كل فصل.'}
          </p>
          <div className="mt-10 h-px bg-white/15" />
          <p className="mt-5 text-sm text-[#c3c5d6]">تعليم منظّم. وتفاصيل بتفرق.</p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-[#c3c5d6]">
          <ShieldCheck aria-hidden="true" size={18} />
          جلسة محمية. بيانات الفصل لأصحابها.
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-[550px] flex-col justify-center px-5 py-10 sm:px-9">
        <Link
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-700"
          href="/"
        >
          <ArrowRight size={17} aria-hidden="true" />
          العودة للرئيسية
        </Link>
        <div className="mb-6 flex items-center gap-2 font-semibold lg:hidden">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-600 text-white">
            <BookOpenCheck aria-hidden="true" size={20} />
          </span>
          <span className="number-font" lang="en">
            Classroom.
          </span>
        </div>
        <p className="eyebrow">{register ? 'خطوة أولى، في المكان الصحيح' : 'مرحبًا بعودتك'}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-relaxed">
          {register ? 'إنشاء حساب طالب' : 'تسجيل الدخول'}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {register ? 'استخدم رقم هاتفك وكلمة مرور خاصة بك.' : 'استخدم رقم الهاتف المرتبط بحسابك.'}
        </p>
        <div className="mt-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
          {children}
        </div>
        <p className="mt-5 text-xs leading-6 text-muted">
          تسجيل الهاتف يحتاج تفعيل مزوّد SMS في المشروع. الموقع ما زال قيد التطوير.
        </p>
      </section>
    </main>
  )
}
