import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'

import { useMemo } from 'react'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  })
}

export const initializeApollo = (initialState: any = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    const existingCache = _apolloClient.extract()

    const data = {
      ...existingCache,
      ...initialState,
    }

    _apolloClient.cache.restore(data)
  }

  // always create new Apollo Client for SSG/SSR
  if (typeof window === 'undefined') {
    return _apolloClient
  }

  // reuse client on the client-side
  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
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

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
