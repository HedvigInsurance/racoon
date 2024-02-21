// Workaround to make app dir work with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { ReactNode } from 'react'
import { theme } from 'ui'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { GlobalStory } from '@/services/storyblok/storyblok'
import {
  fetchStoryblokCacheVersion,
  getStoryBySlug,
} from '@/services/storyblok/storyblok.serverOnly'
import { locales } from '@/utils/l10n/locales'
import { RoutingLocale } from '@/utils/l10n/types'
import { ORIGIN_URL } from '@/utils/PageLink'
import { initTranslationsServerSide } from './i18n'
import { ProductMetadataProvider } from './ProductMetadataProvider'
import { RootLayout } from './RootLayout'
import { StoryblokLayout } from './StoryblokLayout'
import { TranslationsProvider } from './TranslationsProvider'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
  const apolloClient = getApolloClient({ locale })
  const [{ resources }, productMetadata, globalStory] = await Promise.all([
    initTranslationsServerSide(locale),
    fetchGlobalProductMetadata({ apolloClient }),
    initCacheVersionAndFetchGlobalStory(locale),
  ])

  return (
    <RootLayout locale={locale}>
      <TranslationsProvider locale={locale} resources={resources}>
        <ProductMetadataProvider productMetadata={productMetadata}>
          <ShopSessionProvider>
            <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
          </ShopSessionProvider>
        </ProductMetadataProvider>
      </TranslationsProvider>
    </RootLayout>
  )
}

export const generateStaticParams = () => {
  return Object.values(locales).map(({ routingLocale }) => ({ locale: routingLocale }))
}

export const dynamicParams = false

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
      color: theme.colors.gray1000,
    },
  ],
  manifest: '/site.webmanifest',
}

const initCacheVersionAndFetchGlobalStory = async (locale: RoutingLocale) => {
  // Not using the result, all we need is to put storyblok cache version into NextJs cache
  fetchStoryblokCacheVersion({ cache: 'force-cache' })
  return getStoryBySlug<GlobalStory>('global', { version: 'published', locale })
}
