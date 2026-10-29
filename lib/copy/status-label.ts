type Tone = 'success' | 'warning' | 'neutral'
type StatusPresentation = { label: string; tone: Tone }

const published: StatusPresentation = { label: 'اتنشر', tone: 'success' }
const active: StatusPresentation = { label: 'شغّال', tone: 'success' }
const draft: StatusPresentation = { label: 'لسه بتتجهّز', tone: 'warning' }
const review: StatusPresentation = { label: 'لسه بنراجعها', tone: 'warning' }
const archived: StatusPresentation = { label: 'في الأرشيف', tone: 'neutral' }
const paused: StatusPresentation = { label: 'متوقّف', tone: 'neutral' }
const statusLabels: Record<string, StatusPresentation> = {
  published,
  منشور: published,
  منشورة: published,
  اتنشر: published,
  اتنشرت: { label: 'اتنشرت', tone: 'success' },
  active,
  نشط: active,
  شغّال: active,
  available: { label: 'متاح', tone: 'success' },
  متاح: { label: 'متاح', tone: 'success' },
  graded: { label: 'اتصحّح', tone: 'success' },
  draft,
  مسودة: draft,
  'لسه بتتجهّز': draft,
  review,
  pending_review: review,
  'قيد المراجعة': review,
  'لسه بنراجعها': review,
  pending: { label: 'لسه مستني', tone: 'warning' },
  queued: { label: 'مستني دوره', tone: 'warning' },
  running: { label: 'بيشتغل دلوقتي', tone: 'warning' },
  submitted: { label: 'اتسلّم', tone: 'success' },
  completed: { label: 'خلص', tone: 'success' },
  archived,
  مؤرشف: archived,
  'في الأرشيف': archived,
  suspended: paused,
  inactive: paused,
  موقوف: paused,
  متوقّف: paused,
  removed: { label: 'اتشال', tone: 'neutral' },
  failed: { label: 'ما كملش', tone: 'neutral' },
}

export function getStatusPresentation(status: string): StatusPresentation {
  return statusLabels[status.trim().toLowerCase()] ?? { label: 'الحالة مش معروفة', tone: 'neutral' }
}
