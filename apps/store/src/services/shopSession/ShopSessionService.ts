import { ApolloClient, ApolloQueryResult } from '@apollo/client'
import {
  ShopSessionFindOrCreateDocument,
  ShopSessionFindOrCreateQuery,
  ShopSessionFindOrCreateQueryVariables,
} from '@/services/apollo/generated'
import { SimplePersister } from '@/services/persister/Persister.types'

export class ShopSessionService {
  constructor(
    private readonly persister: SimplePersister,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  public get shopSessionId() {
    return this.persister.fetch()
  }

  public async fetch(createParams: FetchParams) {
    const shopSessionId = this.persister.fetch()

    const {
      data: { shopSessionFindOrCreate: shopSession },
    } = await this.shopSessionFindOrCreate({
      shopSessionId,
      ...createParams,
    })

    this.persister.save(shopSession.id)
    return shopSession
  }

  private async shopSessionFindOrCreate(
    variables: ShopSessionFindOrCreateQueryVariables,
  ): Promise<ApolloQueryResult<ShopSessionFindOrCreateQuery>> {
    return await this.apolloClient.query({
      query: ShopSessionFindOrCreateDocument,
      variables,
    })
  }
}

type FetchParams = Omit<ShopSessionFindOrCreateQueryVariables, 'shopSessionId'>
