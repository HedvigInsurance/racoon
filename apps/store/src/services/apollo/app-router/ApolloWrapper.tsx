'use client'

import { ApolloLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { type PropsWithChildren } from 'react'
import { createHeadersLink } from '../createHeadersLink'
import { errorLink } from '../errorLink'
import { httpLink } from '../httpLink'
import { languageLink } from '../languageLink'
import { userErrorLink } from '../userErrorLink'

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

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
