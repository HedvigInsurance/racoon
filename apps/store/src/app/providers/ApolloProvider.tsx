'use client'

import { ApolloLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { type PropsWithChildren } from 'react'
import { createHeadersLink } from '@/services/apollo/createHeadersLink'
import { errorLink } from '@/services/apollo/errorLink'
import { httpLink } from '@/services/apollo/httpLink'
import { languageLink } from '@/services/apollo/languageLink'
import { userErrorLink } from '@/services/apollo/userErrorLink'

const makeClient = () => {
  const headersLink = createHeadersLink()

  return new NextSSRApolloClient({
    name: 'Web:Racoon:Store',
    cache: new NextSSRInMemoryCache(),

    link: ApolloLink.from([
      // Has to be the first to process output last
      // We re-raise userError results as errors, we don't want errorLink to see those
      userErrorLink,
      errorLink,
      headersLink,
      languageLink,
      httpLink,
    ]),

    ssrMode: typeof window === 'undefined',
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}

export const ApolloProvider = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
