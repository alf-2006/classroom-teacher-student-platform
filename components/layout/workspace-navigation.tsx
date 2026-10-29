'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings2,
  UsersRound,
} from 'lucide-react'

const teacherItems = [
  { href: '/dashboard', label: 'نظرة سريعة', icon: LayoutDashboard },
  { href: '/classes', label: 'الفصول', icon: UsersRound },
  { href: '/assignments', label: 'الواجبات', icon: FileText },
  { href: '/quizzes', label: 'الكويزات', icon: ClipboardCheck },
  { href: '/grades', label: 'الدرجات', icon: BarChart3 },
  { href: '/students', label: 'الطلبة', icon: GraduationCap },
  { href: '/settings/ai', label: 'ظبّط الذكاء الاصطناعي', icon: Settings2 },
] as const
const studentItems = [
  { href: '/student/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/student/classes', label: 'فصولي', icon: UsersRound },
  { href: '/student/assignments', label: 'الواجبات', icon: FileText },
  { href: '/student/quizzes', label: 'الكويزات', icon: ClipboardCheck },
  { href: '/student/grades', label: 'درجاتي', icon: BarChart3 },
] as const

export function WorkspaceNavigation({
  role,
  mobile = false,
}: {
  role: 'teacher' | 'student'
  mobile?: boolean
}) {
  const pathname = usePathname()
  const items = role === 'teacher' ? teacherItems : studentItems
  return (
    <nav
      className={
        mobile
          ? 'fixed inset-x-0 bottom-0 z-30 overflow-x-auto border-t border-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(11_16_32_/_0.05)] lg:hidden'
          : 'mt-8 flex flex-1 flex-col gap-1'
      }
      aria-label={mobile ? 'التنقل السريع — اسحب عشان تشوف كل الصفحات' : 'التنقل بين الصفحات'}
    >
      <div className={mobile ? 'flex min-w-max gap-1 px-2 py-2' : 'flex flex-col gap-1'}>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              href={href}
              key={href}
              aria-current={active ? 'page' : undefined}
              className={`${mobile ? 'flex min-h-12 min-w-[70px] flex-1 flex-col items-center justify-center gap-1 px-2 py-1 text-[11px]' : 'flex min-h-12 items-center gap-3 px-3 py-2.5 text-sm'} rounded-xl font-semibold ${active ? 'bg-primary-50 text-primary-700' : 'text-muted hover:bg-surface-subtle hover:text-foreground'}`}
            >
              <Icon aria-hidden="true" size={mobile ? 19 : 20} strokeWidth={active ? 2.3 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
