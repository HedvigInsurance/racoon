import { Provider as JotaiProvider } from 'jotai'
import { PropsWithChildren, Suspense } from 'react'
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir'
import globalCss from 'ui/src/global.css'
import { ApolloWrapper } from '@/services/apollo/app-router/ApolloWrapper'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { DebugError } from './DebugError'
import StoryblokProvider from './StoryblokProvider'

// Trick compiler into thinking we need global.css import for anything other than side effects
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

export const RootLayout = ({ locale, children }: PropsWithChildren<{ locale: RoutingLocale }>) => {
  return (
    <html lang={getLocaleOrFallback(locale).htmlLang}>
      <body className={contentFontClassName}>
        <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
          <Suspense>
            <DebugError />
          </Suspense>
          <ApolloWrapper>
            <StoryblokProvider>
              <JotaiProvider>{children}</JotaiProvider>
            </StoryblokProvider>
          </ApolloWrapper>
        </NextAppDirEmotionCacheProvider>
      </body>
    </html>
  )
}
