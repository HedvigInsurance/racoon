import '@/styles/global.css'

import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useApollo } from '@/lib/apollo-client'

// Enable API mocking
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('mocks')
}

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default appWithTranslation(MyApp)
