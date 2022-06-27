import { fonts } from '@hedviginsurance/brand'
import Document, { Head, Html, Main, NextScript } from 'next/document'
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
        <Head>
          {Object.values(fonts).map((fontName) => (
            <link
              key={fontName}
              rel="preload"
              href={`https://cdn.hedvig.com/identity/fonts/${fontName}.woff2`}
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          ))}
        </Head>
        <body>
          <noscript>
            <iframe
              src={
                process.env.NEXT_PUBLIC_APP_ENV === 'prod' ? gtmProdScript.body : gtmDevScript.body
              }
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
