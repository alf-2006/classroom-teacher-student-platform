# Preview runtime

تعرض المعاينة الحالية نسخة Next.js محسنة للإنتاج، محليًا داخل Sandbox على المنفذ 3000، وليست نشرًا عامًا. اختيار ذلك سببه أن قناة WebSocket الخاصة بـ Next dev لم تُتم bootstrap في بيئة المهمة، رغم نجاح تنزيل الأصول؛ المشكلة أعيدت مع Turbopack وwebpack. نسخة الإنتاج أكملت hydration والتفاعل بلا أخطاء JavaScript في Chromium.

```bash
NEXT_BUILD_DIR=.next-production pnpm build
NEXT_BUILD_DIR=.next-production pnpm start
```

تجنب بناء `.next` أثناء تشغيل `next dev` عليها. نسخة الإنتاج المعزولة مستثناة من Git وESLint. بعد أي تعديل على المصدر، أعد بناء production وأعد تشغيل خدمة المعاينة لعرض آخر نسخة. تطوير الموقع المعتاد خارج هذه البيئة يبقى `pnpm dev`؛ لم نغيّر framework أو نُعطّل فحوصات lint أو نخفي أخطاء كود التطبيق.

تم استثناء كل `/_next/` من proxy المصادقة، بما في ذلك مسارات HMR، كتصحيح مستقل للنمط السابق. هذا لا يُعرض كإثبات أن مشكلة HMR المحلية حُلّت؛ نجاح التفاعل المثبت يخص نسخة production.
