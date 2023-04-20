import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ErrorResponse, onError } from '@apollo/client/link/error'
import { mergeDeep } from '@apollo/client/utilities'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { GetServerSidePropsContext } from 'next'
import { i18n } from 'next-i18next'
import { AppInitialProps } from 'next/app'
import { useMemo } from 'react'
import { getAuthHeaders } from '@/services/authApi/persist'
import { isBrowser } from '@/utils/env'
import { getLocaleOrFallback, toIsoLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { getShopSessionHeader, performTokenRefreshIfNeeded } from './apollo.helpers'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const errorLink = onError((error: ErrorResponse) => {
  if (error.graphQLErrors)
    error.graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (error.networkError) console.log(`[Network error]: ${error.networkError}`)
})

const userErrorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((fetchResult) => {
    for (const result of Object.values(fetchResult.data ?? {})) {
      const { userError } = result ?? {}
      if (userError) {
        throw new ApolloError({
          errorMessage: userError.message,
          extraInfo: { userError },
        })
      }
    }
    return fetchResult
  })
})

const languageLink = setContext((_, { headers = {}, ...context }) => {
  if (!isBrowser()) return context

  const locale = getLocaleOrFallback(i18n?.language).routingLocale
  return {
    headers: {
      ...headers,
      ...getHedvigLanguageHeader(locale),
    },
    ...context,
  }
})

const TIMEOUT_50_SECONDS = 50 * 1000
const timeoutLink = new ApolloLinkTimeout(TIMEOUT_50_SECONDS)
const httpLink = createHttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })
const timeoutHttpLink = timeoutLink.concat(httpLink)

const createApolloClient = (defaultHeaders?: Record<string, string>) => {
  const headersLink = setContext(async (_, prevContext) => {
    const headers = { ...defaultHeaders }
    if (isBrowser()) {
      Object.assign(headers, {
        ...(await performTokenRefreshIfNeeded()),
        ...getShopSessionHeader(),
      })
    }
    return { headers, ...prevContext }
  })

  return new ApolloClient({
    name: 'Web:Racoon:Store',
    ssrMode: typeof window === 'undefined',
    link: from([
      // Has to be the first to process output last
      // We re-raise userError results as errors, we don't want errorLink to see those
      userErrorLink,
      errorLink,
      headersLink,
      languageLink,
      timeoutHttpLink,
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Cart: {
          fields: {
            redeemedCampaigns: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              merge: (_, incoming) => incoming,
            },
          },
        },
      },
    }),
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}

type InitializeApolloParams = {
  initialState?: unknown
  req?: GetServerSidePropsContext['req']
  res?: GetServerSidePropsContext['res']
  locale?: RoutingLocale
  authHeaders?: Record<string, string>
}

export const initializeApollo = (params: InitializeApolloParams = {}) => {
  const { initialState = null, req, res, locale, authHeaders } = params

  const _apolloClient =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    apolloClient ??
    createApolloClient({
      ...(authHeaders ?? getAuthHeaders({ req, res })),
      ...(locale && getHedvigLanguageHeader(locale)),
      ...getShopSessionHeader({ req, res }),
    })

  if (initialState) {
    const existingCache = _apolloClient.extract()
    const data = mergeDeep(existingCache, initialState)
    _apolloClient.cache.restore(data)
  }

  // always create new Apollo Client for SSG/SSR
  if (!isBrowser()) return _apolloClient

  // reuse client on the client-side
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

type InitializeApolloServerSideParams = InitializeApolloParams & {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}

export const initializeApolloServerSide = async (params: InitializeApolloServerSideParams) => {
  const { req, res } = params
  return initializeApollo({
    ...params,
    authHeaders: await performTokenRefreshIfNeeded({ req, res }),
  })
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

const getHedvigLanguageHeader = (locale: RoutingLocale) => ({
  'hedvig-language': toIsoLocale(locale),
})
