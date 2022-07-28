import { GetServerSidePropsContext } from 'next'
import { ShopSessionFindOrCreateQueryVariables } from '@/services/graphql/generated'
import { graphqlSdk } from '@/services/graphql/sdk'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { SimplePersister } from '@/services/persister/Persister.types'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { COOKIE_KEY_SHOP_SESSION } from './ShopSession.constants'

export class ShopSessionService {
  constructor(private readonly persister: SimplePersister) {}

  public get shopSessionId() {
    return this.persister.fetch()
  }

  public async fetch(createParams: FetchParams) {
    const shopSessionId = this.persister.fetch()
    const { shopSessionFindOrCreate: shopSession } = await graphqlSdk.ShopSessionFindOrCreate({
      shopSessionId,
      ...createParams,
    })
    this.persister.save(shopSession.id)
    return shopSession
  }
}

type FetchParams = Omit<ShopSessionFindOrCreateQueryVariables, 'shopSessionId'>

export const shopSessionServiceInitServerSide = ({ request, response }: Params) => {
  return new ShopSessionService(
    new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, request, response),
  )
}

export const shopSessionServiceInitClientSide = () => {
  return new ShopSessionService(new CookiePersister(COOKIE_KEY_SHOP_SESSION))
}

type Params = {
  request: GetServerSidePropsContext['req']
  response: GetServerSidePropsContext['res']
}
