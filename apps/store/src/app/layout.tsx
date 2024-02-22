import { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import { theme } from 'ui'
import { ORIGIN_URL } from '@/utils/PageLink'

// Everything interesting is in [locale]/layout, but we must provide root layout anyway
const RootLayout = ({ children }: PropsWithChildren) => children
export default RootLayout

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
