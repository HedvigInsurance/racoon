import { ApolloProvider } from '@apollo/client'
import { Provider as JotaiProvider } from 'jotai'
import type { AppPropsWithLayout } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import globalCss from 'ui/src/global.css'
import { theme } from 'ui'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { BankIdDialog } from '@/components/BankIdDialog'
import { BankIdV6Dialog } from '@/components/BankIdV6Dialog/BankIdV6Dialog'
import { ContactUs } from '@/components/ContactUs/ContactUs'
import { CookieConsentLoader } from '@/components/CookieConsentLoader'
import { GlobalLinkStyles } from '@/components/RichText/RichText.styles'
import { usePublishWidgetInitEvent } from '@/features/widget/usePublishWidgetInitEvent'
import { useApollo } from '@/services/apollo/client'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { CustomerFirstScript, hasHiddenChat } from '@/services/CustomerFirst'
import { initDatadog } from '@/services/logger/client'
import { PageTransitionProgressBar } from '@/services/nprogress/pageTransition'
import { OneTrustStyles } from '@/services/OneTrust'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider, useShopSession } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'
import { trackExperimentImpression } from '@/services/Tracking/trackExperimentImpression'
import { Tracking } from '@/services/Tracking/Tracking'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { trackPageViews } from '@/services/Tracking/trackPageViews'
import { Features } from '@/utils/Features'
import { contentFontClassName } from '@/utils/fonts'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { UiLocale } from '@/utils/l10n/types'
import { useDebugTranslationKeys } from '@/utils/l10n/useDebugTranslationKeys'
import { useForceHtmlLangAttribute } from '@/utils/l10n/useForceHtmlLangAttribute'
import { useAllowActiveStylesInSafari } from '@/utils/useAllowActiveStylesInSafari'
import { useReloadOnCountryChange } from '@/utils/useReloadOnCountryChange'

// GOTCHA: Here we need to trick compiler into thinking we need global.css import
// for anything other than side effects
// Would've been easier if we just imported module without using it, but this leads to
// styles never appearing in resulting HTML. I guess tree shaking or similar optimization
// is the reason
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

const DynamicGlobalBanner = dynamic(() => import('@/components/GlobalBanner/GlobalBanner'), {
  ssr: false,
})

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
    const { routingLocale } = getLocaleOrFallback(Router.query.locale as UiLocale)
    const { countryCode } = getCountryByLocale(routingLocale)
    tracking.reportAppInit(countryCode)

    trackExperimentImpression(tracking)
    trackPageViews(tracking)
  })
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  useDebugTranslationKeys()
  useReloadOnCountryChange()
  useAllowActiveStylesInSafari()
  // Override to correct html lang set by i18next
  useForceHtmlLangAttribute()
  usePublishWidgetInitEvent()

  const apolloClient = useApollo(pageProps)
  const getLayout = Component.getLayout ?? ((page) => page)

  let Chat: ReactNode = null
  if (!hasHiddenChat(pageProps)) {
    Chat = Features.enabled('CUSTOM_CHAT') ? <ContactUs /> : <CustomerFirstScript />
  }

  return (
    <>
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CookieConsentLoader />
      <GlobalLinkStyles />
      <OneTrustStyles />
      <PageTransitionProgressBar />
      <ApolloProvider client={apolloClient}>
        <JotaiProvider>
          <ShopSessionProvider shopSessionId={pageProps[SHOP_SESSION_PROP_NAME]}>
            <ShopSessionTrackingProvider>
              <BankIdContextProvider>
                <BalancerProvider>
                  <AppErrorProvider>
                    <AppErrorDialog />
                    <DynamicGlobalBanner />
                    {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
                  </AppErrorProvider>
                </BalancerProvider>
                {Features.enabled('BANKID_V6') ? <BankIdV6Dialog /> : <BankIdDialog />}
              </BankIdContextProvider>
            </ShopSessionTrackingProvider>
          </ShopSessionProvider>
          {Chat}
        </JotaiProvider>
      </ApolloProvider>
    </>
  )
}

const ShopSessionTrackingProvider = (props: { children: ReactNode }) => {
  const { shopSession } = useShopSession()
  return <TrackingProvider shopSession={shopSession}>{props.children}</TrackingProvider>
}

export default appWithTranslation(MyApp)
