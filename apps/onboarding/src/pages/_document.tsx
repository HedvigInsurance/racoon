import Document, { Head, Html, Main, NextScript } from 'next/document'
import { contentFontClassName } from '@/lib/fonts'
import { locales, LocaleLabel } from '@/lib/l10n/locales'
import { gtmDevScript, gtmProdScript } from '@/services/analytics/gtm'

export default class MyDocument extends Document {
  lang(): string {
    const { locale } = this.props

    if (locale && Object.keys(locales).includes(locale)) {
      return locales[locale as LocaleLabel].htmlLang
    }

    return 'en'
  }

  render() {
    return (
      <Html lang={this.lang()}>
        <Head />
        {/* Fallback for pages that don't pass className down to DOM */}
        <body className={contentFontClassName}>
          <noscript>
            <iframe
              src={
                process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? gtmProdScript.body : gtmDevScript.body
              }
              title="gtm"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
