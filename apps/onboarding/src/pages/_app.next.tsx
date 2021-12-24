import type { AppProps } from 'next/app'

import { appWithTranslation } from 'next-i18next'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '@/lib/apollo-client'

import '@/styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default appWithTranslation(MyApp)
