// Workaround to make app dir works with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { type PropsWithChildren } from 'react'
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir'
import { ApolloWrapper } from '@/services/apollo/app-router/ApolloWrapper'
import { contentFontClassName } from '@/utils/fonts'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      {/* head-tag needed, even if empty: https://docs.tss-react.dev/ssr/next.js */}
      <head></head>
      <body className={contentFontClassName}>
        <ApolloWrapper>
          <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
            {children}
          </NextAppDirEmotionCacheProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}

export default Layout
