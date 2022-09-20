import { ApolloClient } from '@apollo/client'
import {
  PriceIntentCreateDocument,
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables,
  PriceIntentDocument,
  PriceIntentQuery,
  PriceIntentQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { PriceIntentCreateParams } from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
    private readonly shopSession: ShopSession,
  ) {}

  public async create({ productName }: PriceIntentCreateParams) {
    const result = await this.apolloClient.mutate<
      PriceIntentCreateMutation,
      PriceIntentCreateMutationVariables
    >({
      mutation: PriceIntentCreateDocument,
      variables: {
        shopSessionId: this.shopSession.id,
        productName,
      },
    })

    const priceIntent = result.data?.priceIntentCreate
    if (!priceIntent) throw new Error('Could not create price intent')

    this.persister.save(priceIntent.id, this.getPriceIntentKey(productName))

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
      console.warn(`Unable to get price intent: ${priceIntentId}`)
      console.warn(error)
    }

    return null
  }

  public async fetch(productName: string) {
    const priceIntentId = this.persister.fetch(this.getPriceIntentKey(productName))

    if (priceIntentId) {
      const priceIntent = await this.get(priceIntentId)
      // @TODO: check if price intent is linked to the product
      if (priceIntent) return priceIntent
    }

    return await this.create({ productName })
  }

  private getPriceIntentKey(productName: string) {
    return `HEDVIG_${this.shopSession.id}_${productName}`
  }

  public clear(productName: string) {
    this.persister.reset(this.getPriceIntentKey(productName))
  }
}
