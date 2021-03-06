import { graphqlSdk } from '@/services/graphql/sdk'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export class CartService {
  constructor(private readonly shopSession: ShopSession) {}

  public async lineAdd(lineId: string) {
    const { shopSession } = await graphqlSdk.CartLinesAdd({
      shopSessionId: this.shopSession.id,
      lineId,
    })

    const updatedCart = shopSession.cart.linesAdd.cart
    if (!updatedCart) throw new Error(`Could not add line item to cart: ${lineId}`)
    return updatedCart
  }

  public async lineRemove(lineId: string) {
    const { shopSession } = await graphqlSdk.CartLinesRemove({
      shopSessionId: this.shopSession.id,
      lineId,
    })

    const updatedCart = shopSession.cart.linesRemove.cart
    if (!updatedCart) throw new Error(`Could not remove line item from cart: ${lineId}`)
    return updatedCart
  }
}

export const cartServiceInit = ({ shopSession }: Params) => {
  return new CartService(shopSession)
}

type Params = {
  shopSession: ShopSession
}
