'use client'

import { ApolloLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { createHeadersLink } from '@/services/apollo/createHeadersLink'
import { errorLink } from '@/services/apollo/errorLink'
import { httpLink } from '@/services/apollo/httpLink'
import { userErrorLink } from '@/services/apollo/userErrorLink'
import { toIsoLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

type Props = {
  locale: RoutingLocale
  children: ReactNode
}

export const ApolloProvider = ({ children, locale }: Props) => {
  const makeClient = useMakeApolloClient(locale)
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}

const useMakeApolloClient = (locale: RoutingLocale) => {
  return useCallback(
    () =>
      new ApolloClient({
        name: 'Web:Racoon:Store',
        cache: new InMemoryCache(),

        link: ApolloLink.from([
          // Has to be the first to process output last
          // We re-raise userError results as errors, we don't want errorLink to see those
          userErrorLink,
          errorLink,
          createHeadersLink({ 'Hedvig-language': toIsoLocale(locale) }),
          httpLink,
        ]),

        ssrMode: typeof window === 'undefined',
        connectToDevTools: process.env.NODE_ENV === 'development',
      }),
    [locale],
  )
}
