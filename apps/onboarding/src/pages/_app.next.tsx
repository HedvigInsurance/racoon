import '@/styles/global.css'

import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@emotion/react'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { theme } from 'ui'
import { MetaFavicons } from '@/components/meta-favicons'
import { useCurrentLocale } from '@/lib/l10n/use-current-locale'
import { GTM_ID, pageview, useGTMUserProperties } from '@/services/analytics/gtm'
import { useApollo } from '@/services/apollo'
import * as Datadog from '@/services/datadog'
import NextI18nextConfig from '../../next-i18next.config'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

Datadog.initRum()

function MyApp({ Component, pageProps, router }: AppProps) {
  const { adtractionScriptSrc } = useCurrentLocale()
  const apolloClient = useApollo(pageProps)

  useGTMUserProperties()
  useEffect(() => {
    router.events.on('routeChangeComplete', pageview)
    return () => router.events.off('routeChangeComplete', pageview)
  }, [router.events])

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
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>

      {adtractionScriptSrc && <Script strategy="afterInteractive" src={adtractionScriptSrc} />}

      {/* Google Tag Manager - Global base code */}
      {GTM_ID && (
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
          }}
        />
      )}
    </>
  )
}

export default appWithTranslation(MyApp, NextI18nextConfig)
