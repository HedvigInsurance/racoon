import Document, { Head, Html, Main, NextScript } from 'next/document'
import { GTMBodyScript } from '@/services/gtm'
import { contentFontClassName } from '@/utils/fonts'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'

export default class MyDocument extends Document {
  lang(): string {
    return getLocaleOrFallback(this.props.locale).language
  }

  render() {
    return (
      <Html lang={this.lang()}>
        <Head />
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
