# خطة تنفيذ منصة Classroom

## القرار التقني

المنتج يبدأ كتطبيق ويب عربي RTL ومتجاوب باستخدام Next.js App Router وTypeScript وTailwind CSS، مع Supabase Auth وPostgres وStorage. تُفصل النماذج، validation، permissions، والخدمات عن واجهات React بحيث يمكن إعادة استخدام منطق المجال لاحقًا مع Expo لتطبيق iOS وAndroid. الإصدار الأول كامل وظيفيًا، لكن التنفيذ سيكون على شرائح رأسية قابلة للتشغيل بدل بناء صفحات شكلية دفعة واحدة.

## التصميم

### بدائل الأسلوب

- **Quiet Academic SaaS — احتمال 0.07:** واجهة هادئة وعملية تعتمد على off-white، أزرق موثوق، بطاقات واضحة، وجداول كثيفة للمدرس.
- **Warm Editorial Classroom — احتمال 0.04:** مساحات دافئة وعناوين أكثر تحريرية مع بطاقات تعليمية بارزة.
- **Utility Command Center — احتمال 0.08:** كثافة بيانات أعلى، حدود أقوى، وألوان حالة واضحة للمراجعة السريعة.

### الأسلوب المختار: Quiet Academic SaaS

- **الحركة التصميمية:** SaaS تعليمي هادئ يوازن بين وضوح لوحة الإدارة وإحساس منصة التعلم.
- **المبادئ:** وضوح قبل الزخرفة، أفعال أساسية بارزة، كثافة قابلة للتحكم، وحالات فشل قابلة للفهم.
- **فلسفة اللون:** الأزرق يدل على الثقة والتقدم، teal للنجاح، amber للحاجة إلى مراجعة، والأحمر للمخاطر. الخلفية الباردة تقلل إجهاد القراءة.
- **نمط التخطيط:** asymmetric workspace؛ تنقل ثابت للمدرس، مساحة عمل رئيسية، وعمود سياق عند مراجعة تسليم أو تحرير كويز، بدل شبكة بطاقات متماثلة في كل مكان.
- **العناصر المميزة:** شريط حالة رأسي للتسليم/النشر، بطاقات إحصاء بخط جانبي ملون، وواجهة مراجعة split-view للملف والدرجة.
- **فلسفة التفاعل:** كل عملية مؤثرة تعرض أثرها قبل التأكيد، وكل نجاح يأتي بعد نتيجة الخادم. الحفظ التدريجي واضح وغير مزعج.
- **التحريك:** 150–200ms للحالات، skeleton أثناء التحميل، لا حركة مطلوبة لفهم البيانات، ودعم prefers-reduced-motion.
- **النظام الطباعي:** IBM Plex Sans Arabic أو Noto Sans Arabic، وزن 600 للعناوين، 500 للعناوين الثانوية، 400 للنص، وأرقام tabular عند الدرجات والإحصائيات.
- **جوهر العلامة:** مساحة تشغيل عربية تجعل المدرس يرى ما يحتاجه الآن والطالب يعرف خطوته التالية. الشخصية: موثوقة، هادئة، عملية.
- **الصوت:** مباشر ومشجع دون مبالغة. أمثلة: «راجع التسليمات التي تحتاج قرارًا» و«تم حفظ إجابتك على الخادم».
- **الفكرة البصرية للشعار:** علامة كتاب مفتوح يتكوّن من مسارين متوازيين، أحدهما للمدرس والآخر للطالب، مع نقطة صغيرة تمثل التقدم.
- **اللون المميز:** `#155EEF` كبذرة، مع primary-600 تشغيليًا للأفعال ذات التباين الآمن.

## البنية الرئيسية

```text
app/
  (public)/page.tsx
  (auth)/login/page.tsx
  (auth)/register/page.tsx
  (auth)/reset-password/page.tsx
  (public)/invite/[token]/page.tsx
  (teacher)/dashboard/page.tsx
  (teacher)/classes/...
  (student)/student/dashboard/page.tsx
  (student)/student/classes/...
  api/...
components/
  ui/ layout/ forms/ data-table/ assignments/ submissions/
  quizzes/ quiz-editor/ quiz-player/ grading/ ai-settings/
lib/
  supabase/ auth/ permissions/ validation/ storage/
  assignments/ submissions/ quizzes/ grading/ ai/ audit/
types/
supabase/migrations/
tests/
docs/
public/manus-routes.json
```

Route Groups لا تظهر في URL؛ لذلك مسارات الطالب تحت `(student)/student/...` حتى لا تتعارض مع `/dashboard` و`/classes` الخاصة بالمدرس.

## تسلسل التنفيذ

1. إعداد Next.js وTailwind وdiagnostics وroute manifest.
2. إضافة Supabase clients، env validation، migrations، RLS، seed وStorage policies.
3. تنفيذ auth بالهاتف وكلمة المرور، profiles، roles، وإدارة الجلسة.
4. تنفيذ الدعوات والفصول والعضويات والسعة والتزامن.
5. تنفيذ الواجبات والرفع الخاص والنسخ والتقييم اليدوي.
6. تنفيذ JSON import، quiz editor، immutable versions، attempts والتصحيح الموضوعي.
7. تنفيذ adapters لمزودي AI وإعدادات المفاتيح وjobs وتصحيح المقال بمراجعة المدرس.
8. تنفيذ التقارير والإشعارات وسجل النشاط.
9. تنفيذ responsive RTL وaccessibility وempty/loading/error/partial failure states.
10. تشغيل lint وtypecheck وbuild وE2E وsecurity matrix، ثم مراجعة UI/performance قبل checkpoint.

## حدود الأمان

- role والملكية والعضوية تتحقق على الخادم وRLS.
- لا تُرسل answer keys للطالب.
- Storage bucket خاص وsigned URLs قصيرة الصلاحية بعد authorization.
- مفاتيح AI server-only ومشفرة/محمية، ولا تُسجل.
- endpoint المخصص لمزود AI مغلق افتراضيًا أو allowlisted مع SSRF controls.
- idempotency للتسجيل بالـ invite والرفع ومحاولات الكويز وAI jobs.
- لا تُعلن أي نتيجة نجاح قبل نتيجة الخادم.

## استراتيجية قاعدة البيانات

المشروع الجديد هو Supabase Postgres. كل migration additive وقابلة للمراجعة. يبدأ التصميم بـ profiles، classes، class_memberships، class_invites، assignments، assignment_classes، submissions، submission_versions، submission_files، assignment_grades، quizzes، quiz_versions، quiz_classes، quiz_questions، quiz_question_options، quiz_attempts، quiz_answers، ai_provider_configs، ai_grading_jobs، student_notes، audit_logs، notifications، مع enums وindexes وRLS tests.

## استراتيجية المصادقة

يستخدم Supabase phone/password المدعوم رسميًا. لا ندّعي إثبات ملكية الهاتف في الإصدار الأول لأن OTP غير مطلوب. نطبق normalized E.164، رسائل خطأ غير كاشفة، rate limiting، password reset policy موثقة، وMFA كتحسين لاحق عند الحاجة.

## استراتيجية AI

الطلب ينشئ job pending مع idempotency key. worker server-only يلتقط job بlease، يعيد المحاولة بحدود، يتحقق من JSON والدرجة، ويحوّل المخرجات غير الصالحة إلى review_required. لا تُنشر الدرجة المقترحة تلقائيًا.

## معايير الجاهزية

لا يعد أي مسار مكتملًا إلا إذا كان موصولًا ببيانات حقيقية، لديه loading/empty/error/permission states، ويجتاز typecheck وlint والاختبارات المناسبة. لا يتم نشر المشروع قبل نجاح build وتوثيق ما لم يُختبر.

## مراجعة التصميم والحركة — 29 أكتوبر 2026

الاتجاه المعتمد حبر كحلي وIndigo مع Coral وMint وخطي IBM Plex Sans Arabic وManrope. تبقى المصادقة والروابط والخدمات كما هي. أصلح ترتيب CSS عبر وضع resets في `@layer base`؛ النص العربي يستخدم letter spacing طبيعيًا، وأوزان الخط المثبتة 400–700 فقط، مع line-height لا يقل عن 1.3 للعناوين العربية.

الحركة تشرح المنتج بدل زخرفته: دخول متدرّج للعناوين والـ product preview، عمق 3D يستجيب للمؤشر على أجهزة pointer fine فقط، قصة تفاعلية من دعوة إلى تسليم إلى مراجعة، وإشارات progress تتحرك بـ transform. Reveal عبر IntersectionObserver + Web Animations API، دون مكتبة أنيميشن أو scroll hijack أو split للحروف العربية. كل الحركات مستثناة من keyboard actions، وقابلة للإيقاف من زر ظاهر، ومحترمة reduced-motion. تبقى جميع النصوص ظاهرة عند غياب JavaScript.

`components/landing/` تملك المحتوى التسويقي ومعاينة بيانات موسومة توضيحية لا حقيقية. `landing-motion.tsx` تملك دورة حياة الأنيميشن، `product-scene.tsx` تملك tilt وcount-up، و`workflow-demo.tsx` تملك المراحل الثلاث والتبديل الحقيقي. المكونات المشتركة والتنقل تتم مراجعتها على مستوى المصدر، والصفحات العامة يتم قياسها في Chromium بمقاسات 375/768/1280/1920 دون كتابة أي بيانات فعلية في Supabase.

## تسجيل الدخول — Google-inspired Material calm

طلب المستخدم صفحة دخول شبيهة بـ Google وفخمة. هذا Redesign · Overhaul لواجهة `/login` فقط، لا نقل للعلامة ولا إضافة Google OAuth. الهوية Classroom وخط IBM Plex Sans Arabic ولون Indigo تبقى. المشهد هادئ: خلفية `#f0f4f9`، بطاقة بيضاء بعرض أقصى 1040px وزاوية 28px بلا shadow ثقيل، عنوان 40px بوزن 400–500، مسافات 8/16/24/40px، وحقول outline بارتفاع 60px وزوايا 5px. عنوان العلامة يمين البطاقة والنموذج يسارها؛ على الموبايل ترتيب عمودي وبطاقة ممتدة بلا هامش يضغط الحقول. أزرار pill وتركيز واضح، وحركة دخول واحدة 240ms محترمة reduced-motion. Visual variance 3/10، motion 2/10، density 3/10، asset dependence 2/10، fidelity 8/10. لا gradients ولا رسوم تعليمية ولا روابط استعادة كلمة مرور غير منفذة. form field names/order وSupabase validation وsafeReturnPath وerror announcements/autofill لا تتغير. `AuthFrame` ومسار التسجيل يبقيان كما هما؛ غلاف `LoginFrame` وCSS scoped يملكان التغيير البصري، مع ترتيب action row منفصل في حالة login فقط.

## توحيد إنشاء الحساب مع تسجيل الدخول

طلب المستخدم تطبيق التصميم نفسه على `/register`، وليس الاحتفاظ بالشكل السابق. يستخدم المساران `AccountFrame` واحدًا و`account-form` وaction row واحدين؛ الاختلاف في العنوان والنص والحقول المطلوبة فقط. نفس الخلفية والبطاقة والخط والـ outline والـ pill وحالات التركيز. البطاقة تنمو طبيعيًا لحقول التسجيل الأربعة دون ارتفاع ثابت أو إخفاء المحتوى على الموبايل. تبقى schemas وpassword confirmation وautofill ومسار الدعوة دون تغيير.

## نبرة مصرية موحدة للموقع كله

طلب المستخدم عامية مصرية قوية وودودة ومضحكة من غير شتايم. تُراجع كل نصوص الواجهات الثابتة، بما فيها المساحات المحمية، رسائل validation وحالات الفشل والتحميل والـ aria وmetadata، وكذلك صفحة 404 الخاصة بدل fallback الإنجليزي. المصطلحات التقنية وأسماء العلامات وبيانات المستخدم المخزنة والـ routes والـ enums وRLS لا تتغير. تعاد كتابة النصوص عبر قاموس تحويل محلي محدد، مع وحدة تسويقية مترابطة للصفحة الرئيسية وقصة المنتج. المصدر المرجعي للنبرة `docs/voice-guide.md`؛ الأفعال ثابتة مثل «ادخل حسابك» و«اعمل حساب طالب» و«جرّب تاني». الهزار في مواضع الترحيب والـ empty states فقط، وليس في الدرجات أو كلمات المرور أو الفشل. يحفظ التصميم الموحد وحالاته، وتُراجع الأسماء المرتبطة بـ CSS/test selectors عند تغيير الكلام.
