import { GetServerSidePropsContext } from 'next'
import { graphqlSdk } from '@/services/graphql/sdk'
import { CookiePersister } from './CookiePersister'
import { COOKIE_KEY_PRICE_INTENT, COOKIE_KEY_SHOP_SESSION } from './priceIntent.constants'
import {
  PriceIntentCreateParams,
  PriceIntentDataUpdateParams,
  SimplePersister,
} from './priceIntent.types'
import { ServerCookiePersister } from './ServerCookiePersister'
import { ShopSessionService } from './ShopSessionService'

class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly shopSessionService: ShopSessionService,
  ) {}

  public async create({ productId }: PriceIntentCreateParams) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()

    const response = await graphqlSdk.PriceIntentCreate({
      shopSessionId,
      productId,
    })

    const priceIntent = response.shopSession?.priceIntent?.create.priceIntent
    if (!priceIntent) throw new Error('Could not create price intent')

    this.persister.save(priceIntent.id)

    return priceIntent
  }

  private async get(priceIntentId: string) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const {
      shopSession: { priceIntent },
    } = await graphqlSdk.PriceIntent({ shopSessionId, priceIntentId })
    return priceIntent ?? null
  }

  public async fetch(productId: string) {
    const priceIntentId = this.persister.fetch()

    if (priceIntentId) {
      const priceIntent = await this.get(priceIntentId)
      // @TODO: check if price intent is linked to the product
      if (priceIntent) return priceIntent
    }

    return await this.create({ productId })
  }

  public async update({ priceIntentId, data }: PriceIntentDataUpdateParams) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const response = await graphqlSdk.PriceIntentDataUpdate({ shopSessionId, priceIntentId, data })
    const priceIntent = response.shopSession?.priceIntent?.dataUpdate.priceIntent
    if (!priceIntent) throw new Error('Could not update price intent')
    return priceIntent
  }

  public async confirm(priceIntentId: string) {
    const { id: shopSessionId } = await this.shopSessionService.fetch()
    const response = await graphqlSdk.PriceIntentConfirm({ shopSessionId, priceIntentId })
    const priceIntent = response.shopSession?.priceIntent?.confirm.priceIntent
    if (!priceIntent) throw new Error('Could not confirm price intent')
    return priceIntent
  }

  public async reset() {
    this.persister.reset()
  }
}

export const priceIntentServiceInitClientSide = () => {
  return new PriceIntentService(
    new CookiePersister(COOKIE_KEY_PRICE_INTENT),
    new ShopSessionService(new CookiePersister(COOKIE_KEY_SHOP_SESSION)),
  )
}

export const priceIntentServiceInitServerSide = (
  request: GetServerSidePropsContext['req'],
  response: GetServerSidePropsContext['res'],
) => {
  return new PriceIntentService(
    new ServerCookiePersister(COOKIE_KEY_PRICE_INTENT, request, response),
    new ShopSessionService(new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, request, response)),
  )
}
