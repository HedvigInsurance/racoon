import { ApolloClient } from '@apollo/client'
import {
  ShopSessionCreateDocument,
  ShopSessionCreateMutation,
  ShopSessionCreateMutationVariables,
  ShopSessionDocument,
  ShopSessionQuery,
  ShopSessionQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { IsoLocale } from '@/utils/l10n/types'

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

  public save(shopSessionId: string) {
    this.persister.save(shopSessionId)
  }

  public reset() {
    this.persister.reset()
    this.createPromise = null
    this.createParams = null
  }

  public async getOrCreate(params: ShopSessionCreateMutationVariables): Promise<ShopSession> {
    const existingShopSession = await this.fetch(params.locale as IsoLocale)

    if (existingShopSession?.countryCode === params.countryCode) {
      return existingShopSession
    }
    // Deduplicate mutation, Apollo won't do this for us
    if (JSON.stringify(this.createParams) != JSON.stringify(params)) {
      this.createParams = params
      this.createPromise = this.create(params)
    }
    return await this.createPromise!
  }

  public async fetch(locale: IsoLocale): Promise<ShopSession | null> {
    const shopSessionId = this.persister.fetch()
    if (!shopSessionId) return null
    try {
      return await this.fetchById(shopSessionId, locale)
    } catch (error) {
      console.info(`ShopSession not found: ${shopSessionId}`)
      return null
    }
  }

  public async fetchById(shopSessionId: string, locale: IsoLocale): Promise<ShopSession> {
    const { data } = await this.apolloClient.query<ShopSessionQuery, ShopSessionQueryVariables>({
      query: ShopSessionDocument,
      variables: { shopSessionId, locale },
    })
    return data.shopSession
  }

  private async create(variables: ShopSessionCreateMutationVariables) {
    const result = await this.apolloClient.mutate<
      ShopSessionCreateMutation,
      ShopSessionCreateMutationVariables
    >({
      mutation: ShopSessionCreateDocument,
      variables,
    })

    const shopSession = result.data?.shopSessionCreate

    if (!shopSession) throw new Error('Unable to create ShopSession')

    this.save(shopSession.id)

    return shopSession
  }
}
