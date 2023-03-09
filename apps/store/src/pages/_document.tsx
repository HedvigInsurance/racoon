import Document, { Head, Html, Main, NextScript } from 'next/document'
import { theme } from 'ui'
import { GTMBodyScript } from '@/services/gtm'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'

export default class MyDocument extends Document {
  lang() {
    return getLocaleOrFallback(this.props.locale).language
  }

  render() {
    return (
      <Html lang={this.lang()} dir="ltr">
        <Head>
          <meta name="twitter:site" content="@hedvigapp" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="theme-color" content={theme.colors.light} />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color={theme.colors.gray1000} />
          <meta name="msapplication-TileColor" content={theme.colors.gray1000} />
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
