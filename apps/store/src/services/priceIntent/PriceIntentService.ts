import { ApolloClient } from '@apollo/client'
import {
  PriceIntentDocument,
  PriceIntentQuery,
  PriceIntentQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'
import { JSONData } from '@/services/PriceForm/PriceForm.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { createPriceIntent, updatePriceIntentData } from './PriceIntent.helpers'
import { PriceIntentCreateParams } from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
    private readonly shopSession: ShopSession,
  ) {}

  public async create({ productName, initialData }: PriceIntentCreateParams) {
    const priceIntent = await createPriceIntent({
      apolloClient: this.apolloClient,
      shopSessionId: this.shopSession.id,
      productName,
    })

    this.persister.save(priceIntent.id, this.getPriceIntentKey(productName))

    if (initialData) {
      return await updatePriceIntentData({
        apolloClient: this.apolloClient,
        priceIntentId: priceIntent.id,
        data: initialData,
      })
    }

    return priceIntent
  }

  private async get(priceIntentId: string) {
    try {
      const result = await this.apolloClient.query<PriceIntentQuery, PriceIntentQueryVariables>({
        query: PriceIntentDocument,
        variables: { shopSessionId: this.shopSession.id, priceIntentId },
      })
      return result.data?.shopSession.priceIntent ?? null
    } catch (error) {
      // TODO: should probably be logged by DD-logger, but we don't want to include it in
      // the client bundle. This function is only called from the server but the class is
      // included also in client code. Something to investigate. // siau 2022-09-27
      console.warn(`Unable to get price intent: ${priceIntentId}`)
      console.warn(error)
    }

    return null
  }

  public async fetch(productName: string, initialData?: JSONData) {
    const priceIntentId = this.persister.fetch(this.getPriceIntentKey(productName))

    if (priceIntentId) {
      const priceIntent = await this.get(priceIntentId)
      // @TODO: check if price intent is linked to the product
      if (priceIntent) return priceIntent
    }

    return await this.create({ productName, initialData })
  }

  private getPriceIntentKey(productName: string) {
    return `HEDVIG_${this.shopSession.id}_${productName}`
  }

  public clear(productName: string) {
    this.persister.reset(this.getPriceIntentKey(productName))
  }
}
