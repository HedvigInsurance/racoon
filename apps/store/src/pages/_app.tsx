import { ApolloProvider } from '@apollo/client'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import { GlobalStyles } from '@/lib/GlobalStyles'
import { useApollo } from '@/services/apollo/client'
import * as Datadog from '@/services/datadog'
import { CartContext, useCartContextStore } from '@/services/mockCartService'
import { initStoryblok } from '@/services/storyblok/storyblok'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

Datadog.initRum()

initStoryblok()

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
        <ThemeProvider>
          <GlobalStyles />
          <CartContext.Provider value={cartStore}>
            {getLayout(<Component {...pageProps} />)}
          </CartContext.Provider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
