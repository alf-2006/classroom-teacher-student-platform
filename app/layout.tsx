import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { IBM_Plex_Sans_Arabic, Manrope } from 'next/font/google'

import './globals.css'

const arabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const latin = Manrope({
  variable: '--font-latin',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Classroom | مساحة تدريس منظمة',
    template: '%s | Classroom',
  },
  description: 'منصة عربية منظمة لإدارة الفصول والواجبات والاختبارات.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${arabic.variable} ${latin.variable}`}>
        <a className="skip-link" href="#main-content">
          الانتقال إلى المحتوى الرئيسي
        </a>
        {children}
      </body>
    </html>
  )
}
