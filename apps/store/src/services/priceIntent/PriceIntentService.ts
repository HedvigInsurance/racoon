import type { ApolloClient } from '@apollo/client'
import type {
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateMutation,
  PriceIntentDataUpdateMutationVariables,
  PriceIntentQuery,
  PriceIntentQueryVariables,
  PriceIntentConfirmMutation,
  PriceIntentConfirmMutationVariables,
  PriceIntentUpdateAndConfirmMutation,
  PriceIntentUpdateAndConfirmMutationVariables,
} from '@/services/graphql/generated'
import {
  PriceIntentCreateDocument,
  PriceIntentDataUpdateDocument,
  PriceIntentDocument,
  PriceIntentConfirmDocument,
  PriceIntentUpdateAndConfirmDocument,
} from '@/services/graphql/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import type { SimplePersister } from '@/services/persister/Persister.types'
import type { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { SHOP_SESSION_COOKIE_MAX_AGE } from '@/services/shopSession/ShopSession.constants'
import { type CookieParams } from '@/utils/types'
import { ServerCookiePersister } from '../persister/ServerCookiePersister'
import type { PriceIntent, PriceIntentCreateParams } from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}
  private createPromise: Promise<PriceIntent> | null = null

  public async create(params: PriceIntentCreateParams) {
    if (this.createPromise) return await this.createPromise

    // Deduplicate calls to create price intent
    this.createPromise = new Promise((resolve) => {
      this.createPriceIntent(params)
        .then((result) => resolve(result))
        .finally(() => (this.createPromise = null))
    })

    return await this.createPromise
  }

  public async get(priceIntentId: string) {
    try {
      const result = await this.apolloClient.query<PriceIntentQuery, PriceIntentQueryVariables>({
        query: PriceIntentDocument,
        variables: { priceIntentId },
      })
      return result.data.priceIntent
    } catch (error) {
      // TODO: should probably be logged by DD-logger, but we don't want to include it in
      // the client bundle. This function is only called from the server but the class is
      // included also in client code. Something to investigate. // siau 2022-09-27
      console.warn(`Unable to get price intent: ${priceIntentId}`)
      console.warn(error)
    }

    return null
  }

  public async getOrCreate(params: FetchParams) {
    const priceIntentId = this.getStoredId(params.priceTemplate.name, params.shopSessionId)

    if (priceIntentId) {
      const priceIntent = await this.get(priceIntentId)
      if (priceIntent != null && priceIntent.product.name === params.productName) {
        return priceIntent
      }
    }

    return await this.create({
      shopSessionId: params.shopSessionId,
      productName: params.productName,
      priceTemplate: params.priceTemplate,
    })
  }

  public async update(variables: PriceIntentDataUpdateMutationVariables) {
    const updatedResult = await this.apolloClient.mutate<
      PriceIntentDataUpdateMutation,
      PriceIntentDataUpdateMutationVariables
    >({
      mutation: PriceIntentDataUpdateDocument,
      variables,
    })
    const { priceIntent } = updatedResult.data?.priceIntentDataUpdate ?? {}
    if (!priceIntent) {
      throw new Error('Could not update price intent with initial data')
    }
    return priceIntent
  }

  public async confirm(priceIntentId: string) {
    const updatedResult = await this.apolloClient.mutate<
      PriceIntentConfirmMutation,
      PriceIntentConfirmMutationVariables
    >({
      mutation: PriceIntentConfirmDocument,
      variables: { priceIntentId },
    })
    const { priceIntent } = updatedResult.data?.priceIntentConfirm ?? {}
    if (!priceIntent) throw new Error('Could not confirm price intent')
    return priceIntent
  }

  public async upddateAndConfirm(variables: PriceIntentUpdateAndConfirmMutationVariables) {
    const updatedResult = await this.apolloClient.mutate<
      PriceIntentUpdateAndConfirmMutation,
      PriceIntentUpdateAndConfirmMutationVariables
    >({
      mutation: PriceIntentUpdateAndConfirmDocument,
      variables,
    })

    const { priceIntent } = updatedResult.data?.priceIntentConfirm ?? {}
    if (!priceIntent) throw new Error('Could not update and confirm price intent')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return priceIntent
  }

  public getStoredId(templateName: string, shopSessionId: string) {
    return this.persister.fetch(this.getPriceIntentKey(templateName, shopSessionId))
  }

  public save(params: { templateName: string; priceIntentId: string; shopSessionId: string }) {
    this.persister.save(
      params.priceIntentId,
      this.getPriceIntentKey(params.templateName, params.shopSessionId),
    )
  }

  public clear(templateName: string, shopSessionId: string) {
    this.persister.reset(this.getPriceIntentKey(templateName, shopSessionId))
  }

  public clearAll(shopSessionId: string) {
    for (const key of Object.keys(this.persister.getAll())) {
      if (key.startsWith(`HEDVIG_${shopSessionId}_`)) {
        this.persister.reset(key)
      }
    }
  }

  private getPriceIntentKey(templateName: string, shopSessionId: string) {
    return `HEDVIG_${shopSessionId}_${templateName}`
  }

  private async createPriceIntent({
    productName,
    priceTemplate,
    shopSessionId,
  }: PriceIntentCreateParams) {
    const result = await this.apolloClient.mutate<
      PriceIntentCreateMutation,
      PriceIntentCreateMutationVariables
    >({
      mutation: PriceIntentCreateDocument,
      variables: { productName, shopSessionId },
      update: (cache, result) => {
        const priceIntent = result.data?.priceIntentCreate
        if (priceIntent) {
          cache.writeQuery({
            query: PriceIntentDocument,
            variables: { priceIntentId: priceIntent.id },
            data: { priceIntent },
          })
        }
      },
    })

    const priceIntent = result.data?.priceIntentCreate
    if (!priceIntent) throw new Error('Could not create price intent')

    this.save({ priceIntentId: priceIntent.id, templateName: priceTemplate.name, shopSessionId })

    return priceIntent
  }
}

type FetchParams = {
  productName: string
  priceTemplate: Template
  shopSessionId: string
}

let PRICE_INTENT_SERVICE: PriceIntentService | null = null

export const priceIntentServiceInitClientSide = (apolloClient: ApolloClient<unknown>) => {
  if (!PRICE_INTENT_SERVICE) {
    PRICE_INTENT_SERVICE = new PriceIntentService(
      new CookiePersister('UNUSED_DEFAULT_KEY', SHOP_SESSION_COOKIE_MAX_AGE),
      apolloClient,
    )
  }

  return PRICE_INTENT_SERVICE
}

type ServerSideParams = CookieParams & {
  apolloClient: ApolloClient<unknown>
}

export const priceIntentServiceInitServerSide = ({ req, res, apolloClient }: ServerSideParams) => {
  return new PriceIntentService(
    new ServerCookiePersister('UNUSED_DEFAULT_KEY', req, res, SHOP_SESSION_COOKIE_MAX_AGE),
    apolloClient,
  )
}
