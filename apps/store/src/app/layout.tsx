'use client'

import { ThemeProvider } from 'ui'
import { contentFontClassName } from '@/utils/fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={contentFontClassName}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
