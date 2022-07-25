import { GetServerSidePropsContext } from 'next'
import { graphqlSdk } from '@/services/graphql/sdk'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { COOKIE_KEY_PRICE_INTENT } from './priceIntent.constants'
import {
  PriceIntentCreateParams,
  PriceIntentDataUpdateParams,
  SimplePersister,
} from './priceIntent.types'

class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly shopSession: ShopSession,
  ) {}

  public async create({ productId }: PriceIntentCreateParams) {
    const response = await graphqlSdk.PriceIntentCreate({
      shopSessionId: this.shopSession.id,
      productId,
    })

    const priceIntent = response.priceIntent?.create
    if (!priceIntent) throw new Error('Could not create price intent')

    this.persister.save(priceIntent.id)

    return priceIntent
  }

  private async get(priceIntentId: string) {
    const {
      shopSession: { priceIntent },
    } = await graphqlSdk.PriceIntent({ shopSessionId: this.shopSession.id, priceIntentId })
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
    const response = await graphqlSdk.PriceIntentDataUpdate({ priceIntentId, data })
    const priceIntent = response.priceIntent?.dataUpdate.priceIntent
    if (!priceIntent) throw new Error('Could not update price intent')
    return priceIntent
  }

  public async confirm(priceIntentId: string) {
    const response = await graphqlSdk.PriceIntentConfirm({ priceIntentId })
    const priceIntent = response.priceIntent?.confirm.priceIntent
    if (!priceIntent) throw new Error('Could not confirm price intent')
    return priceIntent
  }

  public async reset() {
    this.persister.reset()
  }
}

export const priceIntentServiceInitServerSide = ({ request, response, shopSession }: Params) => {
  return new PriceIntentService(
    new ServerCookiePersister(COOKIE_KEY_PRICE_INTENT, request, response),
    shopSession,
  )
}

type Params = {
  request: GetServerSidePropsContext['req']
  response: GetServerSidePropsContext['res']
  shopSession: ShopSession
}
