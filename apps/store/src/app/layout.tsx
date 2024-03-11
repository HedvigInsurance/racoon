import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { theme } from 'ui'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { RoutingLocale } from '@/utils/l10n/types'
import { ORIGIN_URL } from '@/utils/PageLink'
import { initTranslationsServerSide } from './i18n'
import { ProductMetadataProvider } from './providers/ProductMetadataProvider'
import { TranslationsProvider } from './providers/TranslationsProvider'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

export default async function RootAppLayout({
  children,
  params: { locale },
}: LocalizedLayoutProps) {
  const apolloClient = getApolloClient({ locale })
  const [{ resources }, productMetadata] = await Promise.all([
    initTranslationsServerSide(locale),
    fetchGlobalProductMetadata({ apolloClient }),
  ])

  return (
    <RootLayout locale={locale}>
      <TranslationsProvider locale={locale} resources={resources}>
        <ProductMetadataProvider productMetadata={productMetadata}>
          <ShopSessionProvider>{children}</ShopSessionProvider>
        </ProductMetadataProvider>
      </TranslationsProvider>
    </RootLayout>
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
