import clsx from 'clsx'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { mainTheme } from 'ui'
import { GTMBodyScript } from '@/services/gtm'
import { Features } from '@/utils/Features'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { UiLocale } from '@/utils/l10n/types'

const COOKIE_CONSENT_SCRIPT_ID = {
  // Could be useful for testing changes on OneTrust side
  TEST: '628f5fee-1891-418c-9ed2-f893b8a3998a-test',
  PRODUCTION: '628f5fee-1891-418c-9ed2-f893b8a3998a',
}

const scriptId =
  process.env.VERCEL_ENV === 'production'
    ? COOKIE_CONSENT_SCRIPT_ID.PRODUCTION
    : COOKIE_CONSENT_SCRIPT_ID.TEST

export default class MyDocument extends Document {
  lang() {
    const { locale } = this.props.__NEXT_DATA__.query
    return getLocaleOrFallback(locale as UiLocale).htmlLang
  }

  render() {
    return (
      <Html lang={this.lang()} dir="ltr">
        <Head>
          <meta name="twitter:site" content="@hedvigapp" />
          <meta name="twitter:card" content="summary_large_image" />
          {/* Favicon setup taken from https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7 */}
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#fafafa" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#121212" />
          <meta name="msapplication-TileColor" content="#fafafa" />
        </Head>
        {/* Fallback for pages that don't pass className down to DOM */}
        <body className={clsx(contentFontClassName, mainTheme)}>
          <Main />
          <NextScript />
          <GTMBodyScript />
          {/* Cookie consent script */}
          {Features.enabled('COOKIE_BANNER') && (
            <Script
              id="onetrust-loader"
              src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
              data-document-language="true"
              type="text/javascript"
              data-domain-script={scriptId}
              // Load before any other script as recommended by Next (https://shorturl.at/hvO14)
              strategy="beforeInteractive"
            />
          )}
        </body>
      </Html>
    )
  }
}
