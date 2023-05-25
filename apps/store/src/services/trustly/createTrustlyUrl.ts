import { type ApolloClient } from '@apollo/client'
import {
  TrustlyInitDocument,
  TrustlyInitMutation,
  TrustlyInitMutationVariables,
} from '@/services/apollo/generated'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

type Params = {
  apolloClient: ApolloClient<unknown>
  locale: RoutingLocale
}

export const createTrustlyUrl = async ({ apolloClient, locale }: Params): Promise<string> => {
  const response = await apolloClient.mutate<TrustlyInitMutation, TrustlyInitMutationVariables>({
    mutation: TrustlyInitDocument,
    variables: {
      successUrl: PageLink.paymentSuccess({ locale }),
      failureUrl: PageLink.paymentFailure({ locale }),
    },
  })

  if (!response.data) {
    throw new Error('No response from Trustly')
  }

  return response.data.registerDirectDebit2.url
}
