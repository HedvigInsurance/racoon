import { ApolloClient, ApolloLink, InMemoryCache, type NormalizedCacheObject } from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { mergeDeep } from '@apollo/client/utilities'
import { type GetServerSidePropsContext } from 'next'
import { type AppInitialProps } from 'next/app'
import { useMemo } from 'react'
import { getAuthHeaders } from '@/services/authApi/persist'
import { isBrowser } from '@/utils/env'
import { toIsoLocale } from '@/utils/l10n/localeUtils'
import { type RoutingLocale } from '@/utils/l10n/types'
import { getShopSessionHeader, performTokenRefreshIfNeeded } from './apollo.helpers'
import { createHeadersLink } from './createHeadersLink'
import { errorLink } from './errorLink'
import { httpLink } from './httpLink'
import { languageLink } from './languageLink'
import { userErrorLink } from './userErrorLink'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

const createApolloClient = (defaultHeaders?: Record<string, string>) => {
  const headersLink = createHeadersLink(defaultHeaders)

  const gitCommitRef = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
  const gitCommitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  const version = gitCommitSha ? `${gitCommitRef}_${gitCommitSha}` : undefined

  return new ApolloClient({
    name: 'Web:Racoon:Store',
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      // Has to be the first to process output last
      // We re-raise userError results as errors, we don't want errorLink to see those
      userErrorLink,
      errorLink,
      headersLink,
      languageLink,
      httpLink,
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development',
    version,
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
