import { ReactNode } from 'react'
import { theme } from 'ui'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslationsServerSide } from './i18n'
import { TranslationsProvider } from './TranslationsProvider'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
  const { resources } = await initTranslationsServerSide(locale)

  return (
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      <head>
        <meta name="theme-color" content={theme.colors.light} />
      </head>
      <body className={contentFontClassName}>
        <TranslationsProvider locale={locale} resources={resources}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  )
}

export default Layout
