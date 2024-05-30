import type { ApolloClient } from '@apollo/client'
import type {
  CartEntriesAddMutation,
  CartEntriesAddMutationVariables,
} from '@/services/graphql/generated'
import { CartEntriesAddDocument } from '@/services/graphql/generated'

export const addOffersToCart = async (
  apolloClient: ApolloClient<unknown>,
  shopSessionId: string,
  offerIds: Array<string>,
) => {
  try {
    const { data } = await apolloClient.mutate<
      CartEntriesAddMutation,
      CartEntriesAddMutationVariables
    >({
      mutation: CartEntriesAddDocument,
      variables: { shopSessionId, offerIds },
    })

    if (!data?.shopSessionCartEntriesAdd.shopSession) {
      throw new Error(
        data?.shopSessionCartEntriesAdd.userError?.message ??
          'Failed to load shop session response',
      )
    }
  } catch (error) {
    console.warn(`Retargeting | Failed to add offers ${JSON.stringify(offerIds)}`, error)
  }
}
