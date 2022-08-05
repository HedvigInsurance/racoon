import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getCDNFonts } from 'ui'
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
          {getCDNFonts().map((font) => (
            <link
              key={font.src}
              rel="preload"
              href={font.src}
              as="font"
              type={`font/${font.format}`}
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
