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
import { contentFontClassName } from '@/utils/fonts'
import { locales } from '@/utils/l10n/locales'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from './i18n'
import { ProductMetadataProvider } from './ProductMetadataProvider'
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
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      <head>
        <meta name="theme-color" content={theme.colors.light} />
      </head>
      <body className={contentFontClassName}>
        <TranslationsProvider locale={locale} resources={resources}>
          <ProductMetadataProvider productMetadata={productMetadata}>
            <ShopSessionProvider>
              <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
            </ShopSessionProvider>
          </ProductMetadataProvider>
        </TranslationsProvider>
      </body>
    </html>
  )
}

export const generateStaticParams = () => {
  return Object.values(locales).map(({ routingLocale }) => ({ locale: routingLocale }))
}

export default Layout

const initCacheVersionAndFetchGlobalStory = async (locale: RoutingLocale) => {
  // Not using the result, all we need is to put storyblok cache version into NextJs cache
  fetchStoryblokCacheVersion({ cache: 'force-cache' })
  return getStoryBySlug<GlobalStory>('global', { version: 'published', locale })
}
