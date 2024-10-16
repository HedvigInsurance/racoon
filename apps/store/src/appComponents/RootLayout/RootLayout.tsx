import clsx from 'clsx'
import { Suspense, type PropsWithChildren } from 'react'
import globalCss from 'ui/src/global.css'
import { mainTheme } from 'ui'
import { NavigationProgressIndicator } from '@/appComponents/RootLayout/NavigationProgressIndicator'
import { OrgStructuredData } from '@/appComponents/RootLayout/OrgStructuredData'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { ApolloProvider } from '../providers/ApolloProvider'
import { InternalReporterProvider } from '../providers/InternalReporterProvider'
import { DebugError } from './DebugError'

// Trick compiler into thinking we need global.css import for anything other than side effects
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

export function RootLayout({
  locale = 'se',
  children,
}: PropsWithChildren<{ locale?: RoutingLocale }>) {
  return (
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      {/* False alert, next/head does now work with app router */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <OrgStructuredData />
      </head>
      <body className={clsx(contentFontClassName, mainTheme)}>
        <Suspense>
          <DebugError />
        </Suspense>
        <NavigationProgressIndicator />

        <ApolloProvider locale={locale}>
          <InternalReporterProvider>{children}</InternalReporterProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
