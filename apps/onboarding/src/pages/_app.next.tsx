import type { AppProps } from 'next/app'

import { appWithTranslation } from 'next-i18next'

import '@/styles/global.css'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('mocks')
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
