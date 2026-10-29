# Preview runtime

تعرض المعاينة الحالية نسخة Next.js محسنة للإنتاج، محليًا داخل Sandbox على المنفذ 3000، وليست نشرًا عامًا. اختيار ذلك سببه أن قناة WebSocket الخاصة بـ Next dev لم تُتم bootstrap في بيئة المهمة، رغم نجاح تنزيل الأصول؛ المشكلة أعيدت مع Turbopack وwebpack. نسخة الإنتاج أكملت hydration والتفاعل بلا أخطاء JavaScript في Chromium.

```bash
NEXT_BUILD_DIR=.next-production pnpm build
NEXT_BUILD_DIR=.next-production pnpm start
```

تجنب بناء `.next` أثناء تشغيل `next dev` عليها. نسخة الإنتاج المعزولة مستثناة من Git وESLint. بعد أي تعديل على المصدر، أعد بناء production وأعد تشغيل خدمة المعاينة لعرض آخر نسخة. تطوير الموقع المعتاد خارج هذه البيئة يبقى `pnpm dev`؛ لم نغيّر framework أو نُعطّل فحوصات lint أو نخفي أخطاء كود التطبيق.

تم استثناء كل `/_next/` من proxy المصادقة، بما في ذلك مسارات HMR، كتصحيح مستقل للنمط السابق. هذا لا يُعرض كإثبات أن مشكلة HMR المحلية حُلّت؛ نجاح التفاعل المثبت يخص نسخة production.

## معاينة تسجيل الدخول الجديدة

تستخدم المعاينة الحالية المخرجات المعزولة `.next-login` بعد إعادة تصميم `/login` فقط. تشغيلها:

```bash
NEXT_BUILD_DIR=.next-login pnpm build
NEXT_BUILD_DIR=.next-login pnpm start
```

المنفذ الرئيسي ما زال 3000. `.next-login` مستثنى من Git وESLint مثل بقية المخرجات المولّدة. لم تتغير طريقة المصادقة أو مزوّدها.

## توحيد الصفحتين

بعد توحيد `/login` و`/register` في `AccountFrame` واحد، عادت المعاينة الحالية إلى المخرجات `.next-production`:

```bash
NEXT_BUILD_DIR=.next-production pnpm build
NEXT_BUILD_DIR=.next-production pnpm start
```

المنفذ 3000 والمصادقة نفسها دون تغيير.

## نسخة النبرة المصرية

تستخدم نسخة الكلام المصري الجديدة المخرجات المعزولة `.next-login` أثناء تجهيزها، مع بقاء المنفذ 3000:

```bash
NEXT_BUILD_DIR=.next-login pnpm build
NEXT_BUILD_DIR=.next-login pnpm start
```

كل من `.next-login` و`.next-production` مخرجات build مستثناة من Git. إعدادات Supabase ومسار الدخول لم تتغير.

آخر نسخة بعد تصحيحات مراجعة النبرة بتشتغل حاليًا بأمر `NEXT_BUILD_DIR=.next-production pnpm start` على 3000. `.next-login` كان مخرج build معزول للنسخة الأولى، ومش هو المخرج الحالي.
