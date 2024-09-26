import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { theme } from 'ui'
import { ORIGIN_URL } from 'utils/url'
import { AppInitTriggers } from './AppInitTriggers'
import { LayoutJotaiProvider } from './LayoutJotaiProvider'

type Props = {
  children: ReactNode
}

export default function RootAppLayout({ children }: Props) {
  return (
    <>
      <LayoutJotaiProvider>{children}</LayoutJotaiProvider>
      <AppInitTriggers />
    </>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN_URL),
  openGraph: {
    type: 'website',
  },
  twitter: { site: '@hedvigapp', card: 'summary_large_image' },
  // Favicon setup taken from https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      sizes: 'any',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: '#121212',
    },
  ],
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: theme.colors.light,
}
