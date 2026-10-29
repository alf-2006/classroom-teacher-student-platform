import { Bot, KeyRound, ShieldCheck } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { Card } from '@/components/ui/states'

export default function AiSettingsPage() {
  return (
    <>
      <PageHeader
        description="الذكاء الاصطناعي مش هيشتغل غير لما نضيف مفتاح الخدمة على السيرفر بأمان."
        title="ظبّط الذكاء الاصطناعي"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-50 text-primary-700">
              <Bot aria-hidden="true" size={22} />
            </span>
            <div>
              <h2 className="text-lg font-black">الذكاء الاصطناعي يقترح، والمدرس يراجع</h2>
              <p className="text-sm text-muted">
                لما الخدمة تتفعّل، هتديك اقتراح بس. مفيش درجة هتنزل لوحدها.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-surface-subtle p-4 text-sm leading-7 text-muted">
            لسه مفيش خدمة ذكاء اصطناعي شغّالة هنا. محتاجين مفتاح للخدمة ومفتاح لتشفير البيانات،
            وبعدها نختبر الاتصال والموديل اللي اخترته.
          </div>
        </Card>
        <Card>
          <KeyRound aria-hidden="true" className="text-primary-700" size={22} />
          <h2 className="mt-4 font-black">مفتاح الخدمة مش بيظهر في المتصفح</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            المفتاح بيتحفظ على السيرفر بس، ومش بيظهر تاني في الواجهة أو السجل.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[var(--success-600)]">
            <ShieldCheck aria-hidden="true" size={16} />
            محتاجين ده قبل التشغيل
          </div>
        </Card>
      </div>
    </>
  )
}
