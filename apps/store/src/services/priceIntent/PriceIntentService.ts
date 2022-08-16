import { graphqlSdk } from '@/services/graphql/sdk'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import {
  PriceIntentCreateParams,
  PriceIntentDataUpdateParams,
  SimplePersister,
} from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly shopSession?: ShopSession,
  ) {}

  public async create({ productId }: PriceIntentCreateParams) {
    if (!this.shopSession) throw new Error('No shop session found')

    const response = await graphqlSdk.PriceIntentCreate({
      shopSessionId: this.shopSession.id,
      productId,
    })

    if (!response.shopSession.priceIntentCreate) throw new Error('Could not create price intent')

    this.persister.save(response.shopSession.priceIntentCreate.id)

    return response.shopSession.priceIntentCreate
  }

  private async get(priceIntentId: string) {
    if (!this.shopSession) throw new Error('No shop session found')

    const result = await graphqlSdk.PriceIntent({
      shopSessionId: this.shopSession.id,
      priceIntentId,
    })

    return result?.shopSession.priceIntent ?? null
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
    if (!this.shopSession) throw new Error('No shop session found')

    const shopSessionId = this.shopSession.id
    const response = await graphqlSdk.PriceIntentDataUpdate({ shopSessionId, priceIntentId, data })

    const priceIntent = response?.shopSession.priceIntent.dataUpdate.priceIntent
    if (!priceIntent) throw new Error('Could not update price intent')
    return priceIntent
  }

  public async confirm(priceIntentId: string) {
    if (!this.shopSession) throw new Error('No shop session found')

    const shopSessionId = this.shopSession.id
    const response = await graphqlSdk.PriceIntentConfirm({ shopSessionId, priceIntentId })

    const priceIntent = response?.shopSession.priceIntent.confirm.priceIntent
    if (!priceIntent) throw new Error('Could not confirm price intent')
    return priceIntent
  }

  public reset() {
    this.persister.reset()
  }
}
