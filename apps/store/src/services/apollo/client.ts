import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { mergeDeep } from '@apollo/client/utilities'
import { GetServerSidePropsContext } from 'next'
import { useMemo } from 'react'
import * as Auth from '@/services/Auth/Auth'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => {
  const accessToken = Auth.getAccessToken()

  return {
    headers: {
      ...headers,
      authorization: accessToken ?? '',
    },
  }
})

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })

const createApolloClient = (accessToken?: string) => {
  return new ApolloClient({
    name: 'Web:Racoon:Store',
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    headers: { authorization: accessToken ?? '' },
  })
}

export const initializeApollo = (
  initialState: unknown = null,
  req?: GetServerSidePropsContext['req'],
  res?: GetServerSidePropsContext['res'],
) => {
  const _apolloClient = apolloClient ?? createApolloClient(Auth.getAccessToken(req, res))

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

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps?: { props: any },
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}
