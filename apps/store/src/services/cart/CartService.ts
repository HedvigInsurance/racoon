import { ApolloClient } from '@apollo/client'
import {
  CartLinesAddDocument,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveDocument,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export class CartService {
  constructor(
    private readonly shopSession: ShopSession,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  public async lineAdd(lineItemId: string) {
    const result = await this.apolloClient.mutate<
      CartLinesAddMutation,
      CartLinesAddMutationVariables
    >({
      mutation: CartLinesAddDocument,
      variables: {
        cartId: this.shopSession.cart.id,
        lineItemId,
      },
    })

    const updatedCart = result.data?.cartLinesAdd.cart
    if (!updatedCart) throw new Error(`Could not add line item to cart: ${lineItemId}`)
    return updatedCart
  }

  public async lineRemove(lineItemId: string) {
    const variables = { cartId: this.shopSession.cart.id, lineItemId }
    try {
      const result = await this.apolloClient.mutate<
        CartLinesRemoveMutation,
        CartLinesRemoveMutationVariables
      >({
        mutation: CartLinesRemoveDocument,
        variables,
      })

      const updatedCart = result.data?.cartLinesRemove.cart
      if (!updatedCart) throw new Error(`Could not remove line item from cart: ${lineItemId}`)
      return updatedCart
    } catch (error) {
      console.error('Unable to remove line item from cart')
      console.error(CartLinesRemoveDocument.loc?.source.body)
      console.error(JSON.stringify(variables))
      throw error
    }
  }
}

type Params = {
  shopSession: ShopSession
  apolloClient: ApolloClient<unknown>
}

export const cartServiceInit = ({ shopSession, apolloClient }: Params) => {
  return new CartService(shopSession, apolloClient)
}
