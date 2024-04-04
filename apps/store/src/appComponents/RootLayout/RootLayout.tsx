import { Provider as JotaiProvider } from 'jotai'
import { PropsWithChildren, Suspense } from 'react'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import globalCss from 'ui/src/global.css'
import { TranslationsProvider } from '@/appComponents/providers/TranslationsProvider'
import { OrgStructuredData } from '@/appComponents/RootLayout/OrgStructuredData'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from 'app/i18n'
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

        <TranslationsProvider locale={locale} resources={resources}>
          <JotaiProvider>
            <BalancerProvider>{children}</BalancerProvider>
          </JotaiProvider>
        </TranslationsProvider>
      </body>
    </html>
  )
}
