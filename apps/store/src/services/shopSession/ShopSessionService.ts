import { ApolloClient } from '@apollo/client'
import {
  ShopSessionCreateMutationVariables,
  ShopSessionCreateDocument,
  ShopSessionDocument,
  ShopSession,
  ShopSessionCreateMutation,
  ShopSessionQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'

export class ShopSessionService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  public async getOrCreate(params: ShopSessionCreateMutationVariables) {
    const existingShopSession = await this.get()

    if (existingShopSession) return existingShopSession

    return await this.create(params)
  }

  public async get() {
    const shopSessionId = this.persister.fetch()
    if (!shopSessionId) return null

    const { data: shopSession } = await this.apolloClient.query<
      ShopSession,
      ShopSessionQueryVariables
    >({
      query: ShopSessionDocument,
      variables: { shopSessionId },
    })

    return shopSession
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

    if (!shopSession) throw new Error('Shop session not found')

    this.persister.save(shopSession.id)

    return shopSession
  }
}
