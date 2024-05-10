import type { PropsWithChildren } from 'react'
import { Suspense } from 'react'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import globalCss from 'ui/src/global.css'
import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { NavigationProgressIndicator } from '@/appComponents/RootLayout/NavigationProgressIndicator'
import { OrgStructuredData } from '@/appComponents/RootLayout/OrgStructuredData'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from '../../app/i18n'
import { ApolloProvider } from '../providers/ApolloProvider'
import { DebugError } from './DebugError'

// Trick compiler into thinking we need global.css import for anything other than side effects
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

export async function RootLayout({
  locale = 'se',
  children,
}: PropsWithChildren<{ locale?: RoutingLocale }>) {
  const { resources } = await initTranslationsServerSide(locale)

  return (
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      {/* False alert, next/head does now work with app router */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <OrgStructuredData />
      </head>
      <body className={contentFontClassName}>
        <Suspense>
          <DebugError />
        </Suspense>
        <NavigationProgressIndicator />

        <ApolloProvider locale={locale}>
          <ShopSessionProvider>
            <TranslationsProvider locale={locale} resources={resources}>
              <BalancerProvider>{children}</BalancerProvider>
            </TranslationsProvider>
          </ShopSessionProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
