import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { errorLink } from '../errorLink'
import { httpLink } from '../httpLink'
import { userErrorLink } from '../userErrorLink'
import { serverStaticHeadersLink } from './serverStaticHeadersLink'

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

type RscClientParams =
  | {
      locale: RoutingLocale
    }
  | undefined

type GetClient = (params: RscClientParams) => ApolloClient<any>

// TODO: Support RSC client for dynamic pages too (auth headers, hedvig-shop-session-id header)
export const { getClient }: { getClient: GetClient } = registerApolloClient(
  // @ts-expect-error apollo did not declare parametrised version, but it works
  (params: RscClientParams) => {
    const locale = getLocaleOrFallback(params?.locale).routingLocale
    return new ApolloClient({
      name: 'Web:Racoon:Store',

      link: ApolloLink.from([
        // Has to be the first to process output last
        // We re-raise userError results as errors, we don't want errorLink to see those
        userErrorLink,
        errorLink,
        serverStaticHeadersLink({ locale }),
        requestLogger,
        httpLink,
      ]),

      cache: new InMemoryCache(),
    })
  },
)
