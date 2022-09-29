import { ApolloClient } from '@apollo/client'
import {
  PriceIntentDocument,
  PriceIntentQuery,
  PriceIntentQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'
import { Template } from '@/services/PriceForm/PriceForm.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { createPriceIntent, updatePriceIntentData } from './PriceIntent.helpers'
import { PriceIntentCreateParams } from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
    private readonly shopSession: ShopSession,
  ) {}

  public async create({ productName, priceTemplate }: PriceIntentCreateParams) {
    const priceIntent = await createPriceIntent({
      apolloClient: this.apolloClient,
      shopSessionId: this.shopSession.id,
      productName,
    })

    this.persister.save(priceIntent.id, this.getPriceIntentKey(priceTemplate.name))

    if (priceTemplate.initialData) {
      return await updatePriceIntentData({
        apolloClient: this.apolloClient,
        priceIntentId: priceIntent.id,
        data: priceTemplate.initialData,
      })
    }

    return priceIntent
  }

  private async get(priceIntentId: string) {
    try {
      const result = await this.apolloClient.query<PriceIntentQuery, PriceIntentQueryVariables>({
        query: PriceIntentDocument,
        variables: { priceIntentId },
      })
      return result.data?.priceIntent ?? null
    } catch (error) {
      // TODO: should probably be logged by DD-logger, but we don't want to include it in
      // the client bundle. This function is only called from the server but the class is
      // included also in client code. Something to investigate. // siau 2022-09-27
      console.warn(`Unable to get price intent: ${priceIntentId}`)
      console.warn(error)
    }

    return null
  }

  public async fetch({ productName, priceTemplate }: FetchParams) {
    const priceIntentId = this.persister.fetch(this.getPriceIntentKey(priceTemplate.name))

    if (priceIntentId) {
      const priceIntent = await this.get(priceIntentId)
      // @TODO: check if price intent is linked to the product
      if (priceIntent) return priceIntent
    }

    return await this.create({ productName, priceTemplate })
  }

  private getPriceIntentKey(templateName: string) {
    return `HEDVIG_${this.shopSession.id}_${templateName}`
  }

  public clear(templateName: string) {
    this.persister.reset(this.getPriceIntentKey(templateName))
  }
}

type FetchParams = {
  productName: string
  priceTemplate: Template
}
