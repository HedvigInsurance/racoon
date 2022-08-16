import { ApolloProvider } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import type { AppPropsWithLayout } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'ui'
import { GlobalStyles } from '@/lib/GlobalStyles'
import { initializeApollo, useApollo } from '@/services/apollo/client'
import * as Datadog from '@/services/datadog'
import { CartContext, useCartContextStore } from '@/services/mockCartService'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { initStoryblok } from '@/services/storyblok/storyblok'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

Datadog.initRum()

initStoryblok()

const MyApp = ({
  Component,
  pageProps,
  initialShopSessionId = null,
}: AppPropsWithLayout & { initialShopSessionId: string | null }) => {
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
          <ShopSessionProvider initialShopSessionId={initialShopSessionId}>
            <CartContext.Provider value={cartStore}>
              {getLayout(<Component {...pageProps} />)}
            </CartContext.Provider>
          </ShopSessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

// FIXME: Do we need to even session on server side?
MyApp.getInitialProps = ({ ctx: { req, res } }: { ctx: GetServerSidePropsContext }) => {
  const apolloClient = initializeApollo()
  const shopSessionService = setupShopSessionServiceServerSide({ req, res, apolloClient })
  return { initialShopSessionId: shopSessionService.shopSessionId() }
}

export default MyApp
