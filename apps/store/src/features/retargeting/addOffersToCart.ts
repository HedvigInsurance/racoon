import { ApolloClient } from '@apollo/client'
import {
  CartEntriesAddDocument,
  CartEntriesAddMutation,
  CartEntriesAddMutationVariables,
} from '@/services/apollo/generated'

export const addOffersToCart = async (
  apolloClient: ApolloClient<unknown>,
  shopSessionId: string,
  offers: Array<string>,
) => {
  try {
    const { data } = await apolloClient.mutate<
      CartEntriesAddMutation,
      CartEntriesAddMutationVariables
    >({
      mutation: CartEntriesAddDocument,
      variables: {
        shopSessionId,
        offerIds: offers,
      },
    })

    if (!data?.shopSessionCartEntriesAdd.shopSession) {
      throw new Error(
        data?.shopSessionCartEntriesAdd.userError?.message ??
          'Failed to load shop session response',
      )
    }
  } catch (error) {
    console.warn(`Retargeting: Failed to add offers ${JSON.stringify(offers)}`, error)
  }
}
