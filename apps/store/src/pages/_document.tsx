import Document, { Head, Html, Main, NextScript } from 'next/document'
import { GTMBodyScript } from '@/services/gtm'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'

export default class MyDocument extends Document {
  lang(): string {
    return getLocaleOrFallback(this.props.locale).language
  }

  render() {
    return (
      <Html lang={this.lang()}>
        <Head />
        <body>
          <GTMBodyScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
