import { ApolloProvider } from '@apollo/client'
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
import { contentFontClassName } from '@/utils/fonts'

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
