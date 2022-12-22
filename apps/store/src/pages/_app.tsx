import { ApolloProvider } from '@apollo/client'
import { Global, ThemeProvider } from '@emotion/react'
import { appWithTranslation } from 'next-i18next'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { globalStyles, theme } from 'ui'
import { useApollo } from '@/services/apollo/client'
import {
  GTMAppScript,
  trackNewSiteExperimentImpression,
  trackPageView,
  useGTMEvents,
  useHandleExperimentQueryParam,
} from '@/services/gtm'
import * as Datadog from '@/services/logger/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'
import { contentFontClassName } from '@/utils/fonts'
import { useDebugTranslationKeys } from '@/utils/l10n/useDebugTranslationKeys'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

if (typeof window === 'undefined') {
  Datadog.initDatadog()
} else {
  trackPageView(window.location.pathname)
  trackNewSiteExperimentImpression()
}

// @TODO - should this be initialized unless running in browser?
initStoryblok()

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const apolloClient = useApollo(pageProps)

  const getLayout = Component.getLayout || ((page) => page)
  useGTMEvents()
  useHandleExperimentQueryParam()
  useDebugTranslationKeys()

  return (
    <>
      <GTMAppScript />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <Global styles={globalStyles} />
        <ThemeProvider theme={theme}>
          <ShopSessionProvider shopSessionId={pageProps[SHOP_SESSION_PROP_NAME]}>
            {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
          </ShopSessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
