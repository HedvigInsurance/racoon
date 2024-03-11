import { initTranslationsServerSide } from 'app/i18n'
import { TranslationsProvider } from 'app/providers/TranslationsProvider'
import { PropsWithChildren, Suspense } from 'react'
import globalCss from 'ui/src/global.css'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
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
      <body className={contentFontClassName}>
        <Suspense>
          <DebugError />
        </Suspense>

        <TranslationsProvider locale={locale} resources={resources}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  )
}
