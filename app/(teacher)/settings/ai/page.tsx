import { Bot, KeyRound, ShieldCheck } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/page-elements'
import { Card } from '@/components/ui/states'

export default function AiSettingsPage() {
  return (
    <>
      <PageHeader
        description="إعدادات الذكاء الاصطناعي لا تُفعّل إلا بعد إدخال مفتاح مزود عبر متغيرات خادمية محمية."
        title="إعدادات AI"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-50 text-primary-700">
              <Bot aria-hidden="true" size={22} />
            </span>
            <div>
              <h2 className="text-lg font-black">تصحيح المقالات بمراجعة المدرس</h2>
              <p className="text-sm text-muted">
                عند تفعيل المزود، ينتج النظام اقتراحًا فقط ولا ينشر درجة تلقائيًا.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-surface-subtle p-4 text-sm leading-7 text-muted">
            لا يوجد مزود AI مفعّل في هذه البيئة حتى الآن. تتطلب خطوة التفعيل مفتاحًا خادميًا ومفتاح
            تشفير للمفاتيح المخزنة، ثم اختبار اتصال ومراجعة النموذج المختار.
          </div>
        </Card>
        <Card>
          <KeyRound aria-hidden="true" className="text-primary-700" size={22} />
          <h2 className="mt-4 font-black">المفاتيح لا تذهب للمتصفح</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            يُحفظ المفتاح في طبقة خادمية فقط ولا يظهر مجددًا في الواجهة أو السجل.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[var(--success-600)]">
            <ShieldCheck aria-hidden="true" size={16} />
            مطلوب قبل التفعيل
          </div>
        </Card>
      </div>
    </>
  )
}
