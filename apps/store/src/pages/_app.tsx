import { ApolloProvider } from '@apollo/client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import { GlobalStyles } from '@/lib/GlobalStyles'
import { useApollo } from '@/services/apollo/client'
import * as Datadog from '@/services/datadog'
import { CartContext, useCartContextStore } from '@/services/mockCartService'

Datadog.initRum()

const cache = createCache({ key: 'next' })

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const apolloClient = useApollo(pageProps)

  const cartStore = useCartContextStore()

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <CacheProvider value={cache}>
          <ThemeProvider>
            <GlobalStyles />
            <CartContext.Provider value={cartStore}>
              {getLayout(<Component {...pageProps} />)}
            </CartContext.Provider>
          </ThemeProvider>
        </CacheProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
