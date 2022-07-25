import { graphqlSdk } from '@/services/graphql/sdk'
import { SimplePersister } from '@/services/persister/Persister.types'

export class ShopSessionService {
  constructor(private readonly persister: SimplePersister) {}

  public async fetch() {
    const shopSessionId = this.persister.fetch()

    if (shopSessionId) {
      const response = await graphqlSdk.ShopSession({ shopSessionId })
      if (response.shopSession) return response.shopSession
    }

    return await this.create()
  }

  private async create() {
    const response = await graphqlSdk.ShopSessionCreate()
    const newSession = response.shopSession?.create.shopSession

    if (!newSession) throw new Error('Could not create session')

    this.persister.save(newSession.id)

    return newSession
  }
}
