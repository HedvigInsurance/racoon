import type { ApolloClient } from '@apollo/client'
import {
  AdyenSubmitRedirectionDocument,
  type AdyenSubmitRedirectionMutation,
  type AdyenSubmitRedirectionMutationVariables,
} from '@/services/graphql/generated'

export const submitAdyenRedirection = async (
  apolloClient: ApolloClient<unknown>,
  variables: AdyenSubmitRedirectionMutationVariables,
) => {
  const result = await apolloClient.mutate<
    AdyenSubmitRedirectionMutation,
    AdyenSubmitRedirectionMutationVariables
  >({
    mutation: AdyenSubmitRedirectionDocument,
    variables,
  })

  const resultCode = result.data?.submitAdyenRedirection2.resultCode
  if (!(resultCode && ['Authorised', 'Pending'].includes(resultCode))) {
    throw new Error('Adyen Redirection failed')
  }

  return resultCode
}
