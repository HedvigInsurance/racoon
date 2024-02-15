import { ReactNode } from 'react'
import { theme } from 'ui'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { contentFontClassName } from '@/utils/fonts'
import { locales } from '@/utils/l10n/locales'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from './i18n'
import { ProductMetadataProvider } from './ProductMetadataProvider'
import { TranslationsProvider } from './TranslationsProvider'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
  const { resources } = await initTranslationsServerSide(locale)
  // This is how you get GraphQL data in server components. Caching/deduplication is automatic
  const apolloClient = getApolloClient({ locale })
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })

  return (
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      <head>
        <meta name="theme-color" content={theme.colors.light} />
      </head>
      <body className={contentFontClassName}>
        <TranslationsProvider locale={locale} resources={resources}>
          <ProductMetadataProvider productMetadata={productMetadata}>
            {children}
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
