import type { PropsWithChildren } from 'react'

import { ApolloLink, HttpLink, ServerError } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { setContext } from '@apollo/client/link/context'
import { getAuthCredentials } from 'auth/auth.api'
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import { persistenceMapper } from 'gql/apollo/persistence/mapper'
import { cache } from 'gql/apollo/cache'
import { createPersistLink } from 'gql/apollo/persistence/link'
import { canRenewToken } from 'gql/apollo/lock'
import { removeAccessToken } from 'auth/auth.state'

const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  const persistor = new CachePersistor({
    persistenceMapper,
    cache,
    storage: new LocalStorageWrapper(localStorage),
    trigger: 'write',
    debounce: 100,
  })

  const SCHEMA_VERSION = '4'
  const SCHEMA_VERSION_KEY = 'apollo-schema-version'

  const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY)

  if (currentVersion === SCHEMA_VERSION) {
    persistor.restore()
  } else {
    persistor.purge()
    localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
  }
}

const attachHeaders = setContext(async (_operation, previousContext) => {
  const { headers } = previousContext

  const { accessToken } = await getAuthCredentials()

  if (!accessToken) {
    if (isBrowser) {
      window.sessionStorage.setItem(
        'hvg:login-return-to',
        window.location.toString(),
      )
      window.location.href = '/login/logout'
    }

    return
  }

  return {
    ...previousContext,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
      ...(isBrowser
        ? {
            'Hope-Location': window.location.pathname,
            clientTimezoneOffset: new Date().getTimezoneOffset(),
          }
        : {}),
    },
  }
})

const makeClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),

    link: ApolloLink.from([
      onError((error) => {
        const isUnauthorizedException = error.graphQLErrors?.some(
          ({ message }) => message.toLowerCase().includes('unauthorized'),
        )
        const isInvalidTokenException = error.graphQLErrors?.some(
          ({ message }) => message.toLowerCase().includes('invalid_token'),
        )

        if (!canRenewToken()) {
          return
        }

        const isSomeKindOfAccessTokenProblem =
          isUnauthorizedException ||
          isInvalidTokenException ||
          [401, 403].includes(
            (error?.networkError as ServerError)?.response?.status,
          )

        if (isSomeKindOfAccessTokenProblem) {
          // Trigger token refreshing (hopefully)
          removeAccessToken()
        }
      }),
      attachHeaders,
      createPersistLink(),
      new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
        credentials: 'same-origin',
      }),
    ]),
    ssrMode: !isBrowser,
    connectToDevTools:
      isBrowser &&
      process.env.NODE_ENV === 'development' &&
      Boolean(localStorage.getItem('__debug:apollo')),
  })
}
export const ApolloProvider = ({ children }: PropsWithChildren) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
