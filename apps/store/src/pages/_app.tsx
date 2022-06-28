import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import { GlobalStyles } from '@/lib/GlobalStyles'
import * as Datadog from '@/services/datadog'
import { CartContext, useCartContextStore } from '@/services/mockCartService'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

Datadog.initRum()

const cache = createCache({ key: 'next' })

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const cartStore = useCartContextStore()

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyles />
      <CacheProvider value={cache}>
        <ThemeProvider>
          <CartContext.Provider value={cartStore}>
            {getLayout(<Component {...pageProps} />)}
          </CartContext.Provider>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

export default MyApp
