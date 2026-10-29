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
    default: 'Classroom | فصلك مترتّب ودماغك أروق',
    template: '%s | Classroom',
  },
  description: 'فصول وواجبات وكويزات في مكان واحد. كلام مصري خفيف، وشغل متظبّط للمدرس والطالب.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar-EG" dir="rtl" suppressHydrationWarning>
      <body className={`${arabic.variable} ${latin.variable}`}>
        <a className="skip-link" href="#main-content">
          روح لمحتوى الصفحة
        </a>
        {children}
      </body>
    </html>
  )
}
