import { ApolloProvider } from '@apollo/client'
import { Global } from '@emotion/react'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider, globalFontStyles } from 'ui'
import { MetaFavicons } from '@/components/meta-favicons'
import { useApollo } from '@/hooks/useApollo'
import { useDebugTranslationKeys } from '@/hooks/useDebugTranslationsKeys'
import { useSetupQuoteCartEffect } from '@/hooks/useSetupQuoteCartEffect'
import { useTrackPageViews } from '@/hooks/useTrackPageViews'
import { useCurrentLocale } from '@/lib/l10n/use-current-locale'
import { gtmDevScript, gtmProdScript, useGTMUserProperties } from '@/services/analytics/gtm'
import * as Datadog from '@/services/datadog'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

Datadog.initRum()

function MyApp({ Component, pageProps }: AppProps) {
  const { adtractionScriptSrc } = useCurrentLocale()
  const apolloClient = useApollo(pageProps)

  useGTMUserProperties()
  useTrackPageViews()
  useDebugTranslationKeys()
  useSetupQuoteCartEffect()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <MetaFavicons />

        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      </Head>

      <ApolloProvider client={apolloClient}>
        <Global styles={globalFontStyles} />
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>

      {adtractionScriptSrc && <Script strategy="afterInteractive" src={adtractionScriptSrc} />}

      {/* Google Tag Manager - Global base code */}
      <Script
        id="gtm-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? gtmProdScript.head : gtmDevScript.head,
        }}
      />
    </>
  )
}

export default appWithTranslation(MyApp)
