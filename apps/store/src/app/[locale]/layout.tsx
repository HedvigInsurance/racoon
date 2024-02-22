// Workaround to make app dir work with emotion compiler enabled
// next.config.js - { compiler: { emotion: true } }
/** @jsxImportSource react */

import { ReactNode } from 'react'
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

const initCacheVersionAndFetchGlobalStory = async (locale: RoutingLocale) => {
  // Not using the result, all we need is to put storyblok cache version into NextJs cache
  fetchStoryblokCacheVersion({ cache: 'force-cache' })
  return getStoryBySlug<GlobalStory>('global', { version: 'published', locale })
}
