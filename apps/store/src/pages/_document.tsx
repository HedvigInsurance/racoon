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
