import { Provider as JotaiProvider } from 'jotai'
import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { theme } from 'ui'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { ORIGIN_URL } from '@/utils/PageLink'
import { ApolloProvider } from './providers/ApolloProvider'

type Props = {
  children: ReactNode
}

export default function RootAppLayout({ children }: Props) {
  return (
    <ApolloProvider>
      <ShopSessionProvider>
        <JotaiProvider>{children}</JotaiProvider>
      </ShopSessionProvider>
    </ApolloProvider>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN_URL),
  openGraph: {
    type: 'website',
  },
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
      color: theme.colors.gray1000,
    },
  ],
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: theme.colors.light,
}
