import { ApolloProvider } from '@apollo/client'
import { Provider as JotaiProvider } from 'jotai'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import globalCss from 'ui/src/global.css'
import { theme } from 'ui/src/theme/theme'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { BankIdDialogDynamic } from '@/components/BankIdDialog/BankIdDialogDynamic'
import { ContactUs } from '@/components/ContactUs/ContactUs'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent'
import { GlobalBannerDynamic } from '@/components/GlobalBanner/GlobalBannerDynamic'
import { GlobalLinkStyles } from '@/components/RichText/RichText.styles'
import { usePublishWidgetInitEvent } from '@/features/widget/usePublishWidgetInitEvent'
import { useApollo } from '@/services/apollo/client'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useInitDatadogAfterInteractive } from '@/services/logger/client'
import { PageTransitionProgressBar } from '@/services/nprogress/pageTransition'
import { OneTrustStyles } from '@/services/OneTrust'
import { hasHiddenChat } from '@/services/pageChat'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { ShopSessionProvider, useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'
import { Tracking } from '@/services/Tracking/Tracking'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { trackPageViews } from '@/services/Tracking/trackPageViews'
import { useReportDeviceInfo } from '@/services/Tracking/useReportDeviceInfo'
import { Features } from '@/utils/Features'
import { contentFontClassName } from '@/utils/fonts'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { UiLocale } from '@/utils/l10n/types'
import { useDebugTranslationKeys } from '@/utils/l10n/useDebugTranslationKeys'
import { useForceHtmlLangAttribute } from '@/utils/l10n/useForceHtmlLangAttribute'
import { useAllowActiveStylesInSafari } from '@/utils/useAllowActiveStylesInSafari'
import { useReloadOnCountryChange } from '@/utils/useReloadOnCountryChange'
import { globalStore } from '../globalStore'

// GOTCHA: Here we need to trick compiler into thinking we need global.css import
// for anything other than side effects
// Would've been easier if we just imported module without using it, but this leads to
// styles never appearing in resulting HTML. I guess tree shaking or similar optimization
// is the reason
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (val: any) => {}
noop(globalCss)

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

  Router.ready(() => {
    const { routingLocale } = getLocaleOrFallback(Router.query.locale as UiLocale)
    const { countryCode } = getCountryByLocale(routingLocale)
    tracking.reportAppInit(countryCode)

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
  useInitDatadogAfterInteractive()

  const apolloClient = useApollo(pageProps)
  const getLayout = Component.getLayout ?? ((page) => page)

  let chat: ReactNode = null
  if (!hasHiddenChat(pageProps)) {
    chat = <ContactUs />
  }

  return (
    <>
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {Features.enabled('COOKIE_BANNER') && <CookieConsent />}
      <GlobalLinkStyles />
      <OneTrustStyles />
      <PageTransitionProgressBar />
      <ApolloProvider client={apolloClient}>
        <JotaiProvider store={globalStore}>
          <ShopSessionProvider shopSessionId={pageProps[SHOP_SESSION_PROP_NAME]}>
            <ShopSessionTrackingProvider>
              <BankIdContextProvider>
                <AppErrorDialog />
                <GlobalBannerDynamic />
                {getLayout(<Component {...pageProps} className={contentFontClassName} />)}
                <BankIdDialogDynamic />
              </BankIdContextProvider>
            </ShopSessionTrackingProvider>
          </ShopSessionProvider>
          {chat}
        </JotaiProvider>
      </ApolloProvider>
    </>
  )
}

const ShopSessionTrackingProvider = (props: { children: ReactNode }) => {
  // Outermost component where we have tracking + shopSession
  useReportDeviceInfo()

  const shopSessionId = useShopSessionId()
  return <TrackingProvider shopSessionId={shopSessionId}>{props.children}</TrackingProvider>
}

export default appWithTranslation(MyApp)
