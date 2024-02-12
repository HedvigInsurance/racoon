// Workaround to make app dir work with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { type PropsWithChildren } from 'react'
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir'
import globalCss from 'ui/src/global.css'
import { ApolloWrapper } from '@/services/apollo/app-router/ApolloWrapper'
import { ORIGIN_URL } from '@/utils/PageLink'

// Trick compiler into thinking we need global.css import for anything other than side effects
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <ApolloWrapper>{children}</ApolloWrapper>
    </NextAppDirEmotionCacheProvider>
  )
}

export default Layout

export const metadata = {
  metadataBase: new URL(ORIGIN_URL),
  twitter: { site: '@hedvigapp', card: 'summary_large_image' },
  icons: [
    { rel: 'apple-touch-icon', sizes: '76x76', url: '/apple-touch-icon.png' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: 'hsl(0, 0%, 7%)', // theme.colors.gray1000
    },
  ],
  manifest: '/site.webmanifest',
}
