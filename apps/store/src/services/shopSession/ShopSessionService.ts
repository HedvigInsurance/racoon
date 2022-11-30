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
import { IsoLocale } from '@/utils/l10n/types'
import type { ShopSession } from './ShopSession.types'

export class ShopSessionService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  public shopSessionId() {
    return this.persister.fetch()
  }

  public save(shopSession: ShopSession) {
    this.persister.save(shopSession.id)
  }

  public reset() {
    this.persister.reset()
  }

  public async getOrCreate(params: ShopSessionCreateMutationVariables) {
    const existingShopSession = await this.fetch(params.locale as IsoLocale)

    if (existingShopSession?.countryCode === params.countryCode) {
      return existingShopSession
    }

    return await this.create(params)
  }

  public async fetch(locale: IsoLocale) {
    const shopSessionId = this.persister.fetch()
    if (!shopSessionId) return null
    try {
      return await this.fetchById(shopSessionId, locale)
    } catch (error) {
      console.info(`ShopSession not found: ${shopSessionId}`)
      return null
    }
  }

  public async fetchById(shopSessionId: string, locale: IsoLocale) {
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

    this.save(shopSession)

    return shopSession
  }
}
