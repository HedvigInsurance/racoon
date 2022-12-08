import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { mergeDeep } from '@apollo/client/utilities'
import { GetServerSidePropsContext } from 'next'
import { i18n } from 'next-i18next'
import { AppProps } from 'next/app'
import { useRef } from 'react'
import * as Auth from '@/services/Auth/Auth'
import { getDeviceIdHeader } from '@/services/LocalContext/LocalContext.helpers'
import { isBrowser } from '@/utils/isBrowser'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

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
      ...Auth.getAuthHeader(),
    },
    ...context,
  }
})

const languageLink = setContext((operation, { headers = {}, ...context }) => {
  const locale = operation.variables?.locale ?? getLocaleOrFallback(i18n?.language).locale
  return {
    headers: {
      ...headers,
      'Hedvig-Language': locale,
    },
    ...context,
  }
})

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })

type InitializeApolloParams = {
  initialState?: unknown
  req?: GetServerSidePropsContext['req']
  res?: GetServerSidePropsContext['res']
}

export const createApolloClient = ({ req, res }: InitializeApolloParams = {}) => {
  const headers = {
    ...getDeviceIdHeader({ req, res }),
    ...Auth.getAuthHeader({ req, res }),
  }
  return new ApolloClient({
    name: 'Web:Racoon:Store',
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, languageLink, httpLink]),
    cache: new InMemoryCache(),
    headers,
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps'],
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
  return pageProps
}

export const useFillApolloCacheFromServer = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps'],
) => {
  const firstRenderRef = useRef(false)
  if (isBrowser() && !firstRenderRef.current) {
    firstRenderRef.current = true
    const initialState = pageProps[APOLLO_STATE_PROP_NAME]
    if (initialState) {
      const existingCache = apolloClient.extract()
      const data = mergeDeep(existingCache, initialState)
      apolloClient.cache.restore(data)
    }
  }
}
