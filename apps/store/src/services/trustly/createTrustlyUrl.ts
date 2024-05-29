import { type ApolloClient } from '@apollo/client'
import type {
  TrustlyInitMutation,
  TrustlyInitMutationVariables,
} from '@/services/graphql/generated'
import { TrustlyInitDocument } from '@/services/graphql/generated'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

export const getTrustlyInitMutationVariables = (
  locale: RoutingLocale,
): TrustlyInitMutationVariables => {
  return {
    successUrl: PageLink.paymentSuccess({ locale }).href,
    failureUrl: PageLink.paymentFailure({ locale }).href,
  }
}

type Params = {
  apolloClient: ApolloClient<unknown>
  locale: RoutingLocale
}

export const createTrustlyUrl = async ({ apolloClient, locale }: Params): Promise<string> => {
  const response = await apolloClient.mutate<TrustlyInitMutation, TrustlyInitMutationVariables>({
    mutation: TrustlyInitDocument,
    variables: getTrustlyInitMutationVariables(locale),
  })

  if (!response.data) {
    throw new Error('No response from Trustly')
  }

  return response.data.registerDirectDebit2.url
}
