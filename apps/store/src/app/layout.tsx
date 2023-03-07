'use client'

import { contentFontClassName } from '@/utils/fonts'
import RootStyleRegistry from './emotion'

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      <body className={contentFontClassName}>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}

export default Layout
