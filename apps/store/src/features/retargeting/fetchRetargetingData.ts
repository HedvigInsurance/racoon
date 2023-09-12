import { type ApolloClient } from '@apollo/client'
import {
  ShopSessionRetargetingDocument,
  type ShopSessionRetargetingQuery,
  type ShopSessionRetargetingQueryVariables,
} from '@/services/apollo/generated'

export const fetchRetargetingData = async (
  apolloClient: ApolloClient<unknown>,
  shopSessionId: string,
): Promise<ShopSessionRetargetingQuery | null> => {
  try {
    const { data } = await apolloClient.query<
      ShopSessionRetargetingQuery,
      ShopSessionRetargetingQueryVariables
    >({
      query: ShopSessionRetargetingDocument,
      variables: { shopSessionId },
    })
    return data
  } catch (error) {
    console.warn(`Retargeting | Failed to fetch shop session (${shopSessionId})`)
    console.warn(error)
    return null
  }
}
