import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { errorLink } from '../errorLink'
import { httpLink } from '../httpLink'
import { userErrorLink } from '../userErrorLink'
import { serverStaticHeadersLink } from './serverStaticHeadersLink'

// Passing locale through module-level static var is ugly, but it works
// When `registerApolloClient` stops complaining about passed params, we should switch to it
let currentLocale = toRoutingLocale(FALLBACK_LOCALE)
export const getApolloClient = (locale: RoutingLocale): ApolloClient<any> => {
  currentLocale = locale
  return getClient()
}

// TODO: Support RSC client for dynamic pages too (auth headers, hedvig-shop-session-id header)
const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    name: 'Web:Racoon:Store',

    link: ApolloLink.from([
      // Has to be the first to process output last
      // We re-raise userError results as errors, we don't want errorLink to see those
      userErrorLink,
      errorLink,
      serverStaticHeadersLink({ locale: currentLocale }),
      requestLogger,
      httpLink,
    ]),

    cache: new InMemoryCache(),
  })
})

// Set to true to debug GQL requests in server components
const logRequests = process.env.NODE_ENV === 'development'
const requestLogger = new ApolloLink((operation, forward) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (logRequests) {
    console.log(
      `GraphQL operation ${operation.operationName}, variables=${JSON.stringify(operation.variables)}`,
    )
  }
  return forward(operation)
})
