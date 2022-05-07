import { fonts } from '@hedviginsurance/brand'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { GTM_ID } from '@/services/analytics/gtm'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
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
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
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
