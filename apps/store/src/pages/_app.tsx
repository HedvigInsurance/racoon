import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'ui'
import { GlobalStyles } from '@/lib/GlobalStyles'
import * as Datadog from '@/services/datadog'
import { CartContext, useCartContextStore } from '@/services/mockCartService'

Datadog.initRum()

const cache = createCache({ key: 'next' })

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

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
