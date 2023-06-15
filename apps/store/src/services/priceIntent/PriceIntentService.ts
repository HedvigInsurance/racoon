import { ApolloClient } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import {
  PriceIntentCreateDocument,
  PriceIntentCreateMutation,
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateDocument,
  PriceIntentDataUpdateMutation,
  PriceIntentDataUpdateMutationVariables,
  PriceIntentDocument,
  PriceIntentQuery,
  PriceIntentQueryVariables,
  PriceIntentConfirmDocument,
  PriceIntentConfirmMutation,
  PriceIntentConfirmMutationVariables,
} from '@/services/apollo/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { SimplePersister } from '@/services/persister/Persister.types'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { ServerCookiePersister } from '../persister/ServerCookiePersister'
import { PriceIntent, PriceIntentCreateParams } from './priceIntent.types'

export class PriceIntentService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}
  private createParams: PriceIntentCreateParams | null = null
  private createPromise: Promise<PriceIntent> | null = null

  public async create({ productName, priceTemplate, shopSessionId }: PriceIntentCreateParams) {
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
      if (priceIntent) return priceIntent
    }

    // Deduplicate mutation, Apollo won't do this for us
    const paramsEquals = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
    if (!this.createPromise || !paramsEquals(this.createParams, params)) {
      this.createParams = params
      this.createPromise = this.create(params)
    }
    return await this.createPromise
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

  private getPriceIntentKey(templateName: string, shopSessionId: string) {
    return `HEDVIG_${shopSessionId}_${templateName}`
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
}

type FetchParams = {
  productName: string
  priceTemplate: Template
  shopSessionId: string
}

export const priceIntentServiceInitClientSide = (apolloClient: ApolloClient<unknown>) => {
  return new PriceIntentService(new CookiePersister('UNUSED_DEFAULT_KEY'), apolloClient)
}

type ServerSideParams = {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
  apolloClient: ApolloClient<unknown>
}

export const priceIntentServiceInitServerSide = ({ req, res, apolloClient }: ServerSideParams) => {
  return new PriceIntentService(
    new ServerCookiePersister('UNUSED_DEFAULT_KEY', req, res),
    apolloClient,
  )
}
