import { ApolloClient } from '@apollo/client'
import {
  ShopSessionCustomerUpdateDocument,
  type ShopSessionCustomerUpdateMutation,
  type ShopSessionCustomerUpdateMutationVariables,
} from '@/services/apollo/generated'

type Params = {
  apolloClient: ApolloClient<any>
  variables: ShopSessionCustomerUpdateMutationVariables['input']
}

export const shopSessionCustomerUpdate = (params: Params) => {
  return params.apolloClient.mutate<
    ShopSessionCustomerUpdateMutation,
    ShopSessionCustomerUpdateMutationVariables
  >({
    mutation: ShopSessionCustomerUpdateDocument,
    variables: { input: params.variables },
  })
}
