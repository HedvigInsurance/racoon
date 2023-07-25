// Workaround to make app dir works with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir'
import { contentFontClassName } from '@/utils/fonts'

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      {/* head-tag needed, even if empty: https://docs.tss-react.dev/ssr/next.js */}
      <head></head>
      <body className={contentFontClassName}>
        <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
          {children}
        </NextAppDirEmotionCacheProvider>
      </body>
    </html>
  )
}

export default Layout
