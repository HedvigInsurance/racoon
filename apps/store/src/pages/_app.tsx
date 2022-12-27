import { ApolloProvider } from '@apollo/client'
import { Global, ThemeProvider } from '@emotion/react'
import { appWithTranslation } from 'next-i18next'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import router from 'next/router'
import { globalStyles, theme } from 'ui'
import { useApollo } from '@/services/apollo/client'
import { GTMAppScript } from '@/services/gtm'
import { initDatadog } from '@/services/logger/client'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'
import {
  handleNewSiteExperimentQueryParam,
  trackNewSiteExperimentImpression,
} from '@/services/Tracking/newSiteExperimentTracking'
import { Tracking } from '@/services/Tracking/Tracking'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { contentFontClassName } from '@/utils/fonts'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { useDebugTranslationKeys } from '@/utils/l10n/useDebugTranslationKeys'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

const tracking = new Tracking()

if (typeof window !== 'undefined') {
  initDatadog()

  tracking.reportPageView(window.location.pathname)

  handleNewSiteExperimentQueryParam()
  trackNewSiteExperimentImpression(tracking)

  router.ready(() => {
    const { routingLocale } = getLocaleOrFallback(router.locale)
    const { countryCode } = getCountryByLocale(routingLocale)
    tracking.setAppContext({ countryCode })
  })
}

// @TODO - should this be initialized unless running in browser?
initStoryblok()

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const apolloClient = useApollo(pageProps)

  const getLayout = Component.getLayout || ((page) => page)
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
            <TrackingProvider value={tracking}>
              {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
            </TrackingProvider>
          </ShopSessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
