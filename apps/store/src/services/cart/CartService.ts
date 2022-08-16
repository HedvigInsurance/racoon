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

  public async lineAdd(lineId: string) {
    const result = await this.apolloClient.mutate<
      CartLinesAddMutation,
      CartLinesAddMutationVariables
    >({
      mutation: CartLinesAddDocument,
      variables: {
        shopSessionId: this.shopSession.id,
        lineId,
      },
    })

    const updatedCart = result.data?.shopSession.cart.linesAdd.cart
    if (!updatedCart) throw new Error(`Could not add line item to cart: ${lineId}`)
    return updatedCart
  }

  public async lineRemove(lineId: string) {
    const result = await this.apolloClient.mutate<
      CartLinesRemoveMutation,
      CartLinesRemoveMutationVariables
    >({
      mutation: CartLinesRemoveDocument,
      variables: {
        shopSessionId: this.shopSession.id,
        lineId,
      },
    })

    const updatedCart = result.data?.shopSession.cart.linesRemove.cart
    if (!updatedCart) throw new Error(`Could not remove line item from cart: ${lineId}`)
    return updatedCart
  }

  public async startDateUpdate(lineId: string, startDate: Date | null) {
    const result = await this.apolloClient.mutate<
      StartDateUpdateMutation,
      StartDateUpdateMutationVariables
    >({
      mutation: StartDateUpdateDocument,
      variables: {
        shopSessionId: this.shopSession.id,
        lineId,
        startDate: startDate ? startDate.toISOString().substring(0, 10) : null,
      },
    })

    const updatedCart = result.data?.shopSession.cart
    if (!updatedCart) throw new Error(`Could not update start date for line item: ${lineId}`)
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
