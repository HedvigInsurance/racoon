import { ApolloClient } from '@apollo/client'
import {
  CartLinesAddDocument,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveDocument,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
  StartDateUpdateDocument,
  StartDateUpdateMutation,
  StartDateUpdateMutationVariables,
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
    const result = await this.apolloClient.mutate<
      CartLinesRemoveMutation,
      CartLinesRemoveMutationVariables
    >({
      mutation: CartLinesRemoveDocument,
      variables: {
        cartId: this.shopSession.cart.id,
        lineItemId,
      },
    })

    const updatedCart = result.data?.cartLinesRemove.cart
    if (!updatedCart) throw new Error(`Could not remove line item from cart: ${lineItemId}`)
    return updatedCart
  }

  public async startDateUpdate(lineItemId: string, startDate: Date | null) {
    const result = await this.apolloClient.mutate<
      StartDateUpdateMutation,
      StartDateUpdateMutationVariables
    >({
      mutation: StartDateUpdateDocument,
      variables: {
        lineItemId,
        startDate: startDate ? startDate.toISOString().substring(0, 10) : null,
      },
    })

    const updatedCart = result.data?.cartLineStartDateUpdate.cart
    if (!updatedCart) throw new Error(`Could not update start date for line item: ${lineItemId}`)
    return updatedCart
  }
}

type Params = {
  shopSession: ShopSession
  apolloClient: ApolloClient<unknown>
}

export const cartServiceInit = ({ shopSession, apolloClient }: Params) => {
  return new CartService(shopSession, apolloClient)
}
