import { GetServerSidePropsContext } from 'next'
import { graphqlSdk } from '@/services/graphql/sdk'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { ShopSessionService } from '@/services/shopSession/ShopSessionService'
import { COOKIE_KEY_SHOP_SESSION } from './../priceIntent/priceIntent.constants'

export class CartService {
  constructor(private readonly shopSessionService: ShopSessionService) {}

  public async fetch() {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const { shopSession } = await graphqlSdk.Cart({ shopSessionId })
    return shopSession.cart
  }

  public async lineAdd(lineId: string) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const { shopSession } = await graphqlSdk.CartLinesAdd({ shopSessionId, lineId })

    const cart = shopSession?.cart?.linesAdd.cart
    if (!cart) throw new Error(`Could not add line item to cart: ${lineId}`)
    return cart
  }

  public async lineRemove(lineId: string) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const { shopSession } = await graphqlSdk.CartLinesRemove({ shopSessionId, lineId })

    const cart = shopSession?.cart?.linesRemove.cart
    if (!cart) throw new Error(`Could not remove line item from cart: ${lineId}`)
    return cart
  }
}

export const cartServiceInitClientSide = () => {
  return new CartService(new ShopSessionService(new CookiePersister(COOKIE_KEY_SHOP_SESSION)))
}

export const cartServiceInitServerSide = (
  request: GetServerSidePropsContext['req'],
  response: GetServerSidePropsContext['res'],
) => {
  return new CartService(
    new ShopSessionService(new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, request, response)),
  )
}
