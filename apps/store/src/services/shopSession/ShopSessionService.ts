import type { ApolloClient } from '@apollo/client'
import type {
  ShopSessionCreateMutation,
  ShopSessionCreateMutationVariables,
  ShopSessionOutcomeFragment,
  ShopSessionOutcomeQuery,
  ShopSessionOutcomeQueryVariables,
  ShopSessionOutcomeIdQuery,
  ShopSessionOutcomeIdQueryVariables,
  ShopSessionQuery,
  ShopSessionQueryVariables,
} from '@/services/graphql/generated'
import {
  ShopSessionCreateDocument,
  ShopSessionDocument,
  ShopSessionOutcomeDocument,
  ShopSessionOutcomeIdDocument,
} from '@/services/graphql/generated'
import type { SimplePersister } from '@/services/persister/Persister.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'

export class ShopSessionService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  private createParams: ShopSessionCreateMutationVariables | null = null
  private createPromise: Promise<ShopSession> | null = null

  public shopSessionId() {
    return this.persister.fetch()
  }

  public saveId(shopSessionId: string) {
    this.persister.save(shopSessionId)
  }

  public reset() {
    this.persister.reset()
    this.createPromise = null
    this.createParams = null
  }

  public async getOrCreate(params: ShopSessionCreateMutationVariables): Promise<ShopSession> {
    const existingShopSession = await this.fetch()

    if (existingShopSession?.countryCode === params.countryCode) {
      return existingShopSession
    }

    // Deduplicate mutation, Apollo won't do this for us
    const paramsEquals = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
    if (!this.createPromise || !paramsEquals(this.createParams, params)) {
      this.createParams = params
      this.createPromise = this.create(params)
    }
    return await this.createPromise
  }

  public async fetch(): Promise<ShopSession | null> {
    const shopSessionId = this.persister.fetch()
    if (!shopSessionId) return null
    try {
      return await this.fetchById(shopSessionId)
    } catch {
      console.info(`ShopSession not found: ${shopSessionId}`)
      return null
    }
  }

  public async fetchById(shopSessionId: string): Promise<ShopSession> {
    const { data } = await this.apolloClient.query<ShopSessionQuery, ShopSessionQueryVariables>({
      query: ShopSessionDocument,
      variables: { shopSessionId },
    })
    return data.shopSession
  }

  public async create(variables: ShopSessionCreateMutationVariables): Promise<ShopSession> {
    const result = await this.apolloClient.mutate<
      ShopSessionCreateMutation,
      ShopSessionCreateMutationVariables
    >({
      mutation: ShopSessionCreateDocument,
      variables,
      // TODO: Investigate if we can do it by returning shopSession record on top instead of shopSessionCreate
      update: (cache, result) => {
        const shopSession = result.data?.shopSessionCreate
        if (shopSession) {
          cache.writeQuery({
            query: ShopSessionDocument,
            data: { shopSession },
            variables: { shopSessionId: shopSession.id },
          })
        }
      },
    })

    const shopSession = result.data?.shopSessionCreate
    if (!shopSession) throw new Error('Unable to create ShopSession')

    this.saveId(shopSession.id)

    return shopSession
  }

  public async fetchOutcomeId(shopSessionId: string) {
    const { data } = await this.apolloClient.query<
      ShopSessionOutcomeIdQuery,
      ShopSessionOutcomeIdQueryVariables
    >({
      query: ShopSessionOutcomeIdDocument,
      variables: { shopSessionId },
    })

    return data.shopSession.outcome?.id ?? null
  }

  public async fetchOutcome(
    shopSessionOutcomeId: string,
  ): Promise<ShopSessionOutcomeFragment | null> {
    const { data } = await this.apolloClient.query<
      ShopSessionOutcomeQuery,
      ShopSessionOutcomeQueryVariables
    >({
      query: ShopSessionOutcomeDocument,
      variables: { shopSessionOutcomeId },
    })
    return data.shopSessionOutcome ?? null
  }
}
