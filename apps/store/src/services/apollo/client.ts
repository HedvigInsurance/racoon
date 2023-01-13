import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { mergeDeep } from '@apollo/client/utilities'
import { GetServerSidePropsContext } from 'next'
import { i18n } from 'next-i18next'
import { AppInitialProps } from 'next/app'
import { useMemo } from 'react'
import { getDeviceIdHeader } from '@/services/LocalContext/LocalContext.helpers'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { getAuthHeaders } from '../authApi/persist'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers = {}, context }) => {
  return {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    ...context,
  }
})

const languageLink = setContext((_, { headers = {}, ...context }) => {
  const locale = getLocaleOrFallback(i18n?.language).locale
  return {
    headers: {
      ...headers,
      'Hedvig-Language': locale,
    },
    ...context,
  }
})

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })

const createApolloClient = (headers?: Record<string, string>) => {
  return new ApolloClient({
    name: 'Web:Racoon:Store',
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, languageLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Cart: {
          fields: {
            redeemedCampaigns: {
              merge: (_, incoming) => incoming,
            },
          },
        },
      },
    }),
    headers,
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}

type InitializeApolloParams = {
  initialState?: unknown
  req?: GetServerSidePropsContext['req']
  res?: GetServerSidePropsContext['res']
}

export const initializeApollo = ({
  initialState = null,
  req,
  res,
}: InitializeApolloParams = {}) => {
  const headers = {
    ...getDeviceIdHeader({ req, res }),
    ...getAuthHeaders({ req, res }),
  }

  const _apolloClient = apolloClient ?? createApolloClient(headers)

  if (initialState) {
    const existingCache = _apolloClient.extract()
    const data = mergeDeep(existingCache, initialState)
    _apolloClient.cache.restore(data)
  }

  // always create new Apollo Client for SSG/SSR
  if (typeof window === 'undefined') return _apolloClient

  // reuse client on the client-side
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const useApollo = (pageProps: AppInitialProps['pageProps']) => {
  const initialState = pageProps[APOLLO_STATE_PROP_NAME]
  return useMemo(() => initializeApollo({ initialState }), [initialState])
}

export const addApolloState = <Props>(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: Props },
) => {
  return {
    ...pageProps,
    props: {
      ...pageProps.props,
      [APOLLO_STATE_PROP_NAME]: client.cache.extract(),
    },
  }
}
