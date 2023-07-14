import { ApolloProvider } from '@apollo/client'
import { Global } from '@emotion/react'
import { Provider as JotaiProvider } from 'jotai'
import { appWithTranslation } from 'next-i18next'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { globalStyles, theme } from 'ui'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { BankIdDialog } from '@/components/BankIdDialog'
import { DebugDialog } from '@/components/DebugDialog/DebugDialog'
import { GlobalBanner } from '@/components/GlobalBanner/GlobalBanner'
import { GlobalLinkStyles } from '@/components/RichText/RichText.styles'
import { useApollo } from '@/services/apollo/client'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { CustomerFirstScript } from '@/services/CustomerFirst'
import { GTMAppScript } from '@/services/gtm'
import { initDatadog } from '@/services/logger/client'
import { PageTransitionProgressBar } from '@/services/nprogress/pageTransition'
import { OneTrustStyles } from '@/services/OneTrust'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'
import {
  handleNewSiteExperimentQueryParam,
  trackNewSiteExperimentImpression,
  useRemoveExperimentQueryParam,
} from '@/services/Tracking/newSiteExperimentTracking'
import { trackExperimentImpression } from '@/services/Tracking/trackExperimentImpression'
import { Tracking } from '@/services/Tracking/Tracking'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { trackPageViews } from '@/services/Tracking/trackPageViews'
import { contentFontClassName } from '@/utils/fonts'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { useDebugTranslationKeys } from '@/utils/l10n/useDebugTranslationKeys'
import { useForceHtmlLangAttribute } from '@/utils/l10n/useForceHtmlLangAttribute'
import { useAllowActiveStylesInSafari } from '@/utils/useAllowActiveStylesInSafari'
import { useReloadOnCountryChange } from '@/utils/useReloadOnCountryChange'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

const tracking = new Tracking()
initStoryblok()

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    console.log(
      `%cHey there fellow developer! Curious how we built this? Find us at https://github.com/HedvigInsurance !\nLike it, and want to change the insurance industry? Of course we're hiring: https://www.hedvig.com/se-en/jobs`,
      `font-size: 2rem; font-family: sans-serif; color: ${theme.colors.textSecondary}; padding: 2rem; display: block;`,
    )
  }

  initDatadog()

  Router.ready(() => {
    const { routingLocale } = getLocaleOrFallback(Router.locale)
    const { countryCode } = getCountryByLocale(routingLocale)
    tracking.reportAppInit({ countryCode })

    handleNewSiteExperimentQueryParam()
    trackNewSiteExperimentImpression(tracking)
    trackExperimentImpression(tracking)
    trackPageViews(tracking)
  })
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  useRemoveExperimentQueryParam()
  useDebugTranslationKeys()
  useReloadOnCountryChange()
  useAllowActiveStylesInSafari()
  // Override to correct html lang set by i18next
  useForceHtmlLangAttribute()

  const apolloClient = useApollo(pageProps)
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <GTMAppScript />

      <ApolloProvider client={apolloClient}>
        <Global styles={globalStyles} />
        <GlobalLinkStyles />
        <OneTrustStyles />
        <PageTransitionProgressBar />
        <JotaiProvider>
          <ShopSessionProvider shopSessionId={pageProps[SHOP_SESSION_PROP_NAME]}>
            <TrackingProvider value={tracking}>
              <BankIdContextProvider>
                <BalancerProvider>
                  <AppErrorProvider>
                    <AppErrorDialog />
                    <DebugDialog />
                    <GlobalBanner />
                    {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
                  </AppErrorProvider>
                </BalancerProvider>
                <BankIdDialog />
              </BankIdContextProvider>
            </TrackingProvider>
          </ShopSessionProvider>
          <CustomerFirstScript />
        </JotaiProvider>
      </ApolloProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
