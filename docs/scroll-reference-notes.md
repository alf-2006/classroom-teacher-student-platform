# مرجع حركة السكرول

المطلوب تطبيق إلهام الفيديو على Classroom الحالي، مش إنشاء مشروع جديد أو تغيير حساباته. الفيديو الأصلي: https://www.youtube.com/watch?v=QMINxTaV9IM . التحليل البصري المباشر اكتمل وتم تطبيقه، والتفاصيل في scroll-video-analysis.md وscroll-cinema.md؛ استخلاص صفحة YouTube أعاد محتوى قصيرًا بعنوان Base44 ولم يوفّر هوية موثوقة للفيديو، فلا يُستخدم كدليل على عنوانه أو صاحبه.

مرجع تنفيذ رسمي: https://developer.chrome.com/docs/css-ui/scroll-driven-animations . يشرح ارتباط الحركة بتقدم السكرول والسماح لها بالعكس عند الرجوع، وفصل scroll progress عن view progress، والدمج مع Web Animations API. الاختيار التقني سيحافظ على scroll الطبيعي، ولن يُجبر wheel/touch على قفزات بين الأقسام. كل انتقال سيُطبّق على wrapper مستقل حتى لا يتعارض مع tilt أو reveal. تبقى العربية متصلة دون split للحروف، والتصميم والكلام المصري ونظام الدخول ثابتين.
