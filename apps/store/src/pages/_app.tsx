import { ApolloProvider } from '@apollo/client'
import localFont from '@next/font/local'
import { appWithTranslation } from 'next-i18next'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import { useApollo } from '@/services/apollo/client'
import {
  GTMAppScript,
  trackExperimentImpression,
  trackPageView,
  useGTMEvents,
} from '@/services/gtm'
import * as Datadog from '@/services/logger/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'

// NOTE:
// - Font loaders have to be const expressions at top level
// - Cannot reference path from packages/ui published version, font path is always local
const smallFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Small.woff2',
  weight: '400',
  fallback: ['serif'],
  variable: '--hedvig-font-small',
})
const standardFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Standard.woff2',
  weight: '400',
  fallback: ['serif'],
  variable: '--hedvig-font-standard',
})
const bigFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Big.woff2',
  weight: '400',
  fallback: ['serif'],
  variable: '--hedvig-font-big',
})
// Apply variables for theme and standard font as default
const contentFontClassName = [
  smallFont.variable,
  standardFont.variable,
  bigFont.variable,
  standardFont.className,
].join(' ')

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

if (typeof window === 'undefined') {
  Datadog.initDatadog()
} else {
  trackPageView(window.location.pathname)
  trackExperimentImpression(window.location.pathname)
}

// @TODO - should this be initialized unless running in browser?
initStoryblok()

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const apolloClient = useApollo(pageProps)

  const getLayout = Component.getLayout || ((page) => page)
  useGTMEvents()

  return (
    <>
      <GTMAppScript />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>
          <ShopSessionProvider shopSessionId={pageProps[SHOP_SESSION_PROP_NAME]}>
            {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
          </ShopSessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
