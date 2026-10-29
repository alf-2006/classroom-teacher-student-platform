# Classroom Platform

منصة تعليم عربية RTL مبنية بـ Next.js 16 وTypeScript وTailwind CSS 4، متصلة بمشروع Supabase حقيقي.

## التشغيل المحلي

```bash
pnpm install
pnpm dev
```

ثم افتح `http://localhost:3000`.

الفحوصات المتاحة:

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Supabase

المشروع: `classroom`، المعرّف: `cvqjgrmeztpaswnoygzx`، المنطقة: `eu-central-1`.

تم تطبيق migration أساسية للجداول والفهارس والدوال وRLS وStorage الخاص. لا توجد بيانات تجريبية داخل قاعدة الإنتاج.

الكود يدعم `phone + password` عبر Supabase Auth. في لوحة Supabase، مزود Phone يحتاج بيانات مزود SMS مثل Twilio قبل حفظه وتفعيل التسجيل الفعلي؛ لم تُضاف بيانات وهمية. بعد إدخال بيانات مزود SMS من لوحة Supabase، ستعمل صفحات `/login` و`/register` باستخدام Auth الحقيقي.

## المسارات الأساسية

- `/` — الصفحة العامة.
- `/login` و`/register` — الهاتف وكلمة المرور.
- `/invite/:token` — الانضمام إلى فصل بعد تسجيل الدخول.
- `/dashboard` و`/classes` و`/classes/:id` — مساحة المدرس، إنشاء فصل وإصدار دعوة.
- `/student/dashboard` و`/student/classes` و`/student/assignments` و`/student/quizzes` و`/student/grades` — مساحة الطالب المقيدة بالعضوية والنشر.

## الأمان

التحقق من الدور والملكية والعضوية في RLS ودوال خادمية. رموز الدعوات تحفظ كـ SHA-256، والانضمام يفحص السعة داخل transaction-like locked RPC. مفاتيح إجابة الاختبارات لا تُعرض في مسارات الطالب، وملفات التسليم في buckets خاصة.

## الخطوة التالية

الشريحة التالية هي رفع ملفات التسليم بإصداراتها، ثم محرر JSON للاختبارات والنسخ غير القابلة للتغيير والتصحيح الموضوعي. بعدها تُضاف jobs تصحيح المقالات مع مزود AI server-only ومراجعة المدرس.
