import Document, { Head, Html, Main, NextScript } from 'next/document'
import { GTMBodyScript } from '@/services/gtm'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { UiLocale } from '@/utils/l10n/types'

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
        <body className={contentFontClassName}>
          <GTMBodyScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
