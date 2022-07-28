import { GetServerSidePropsContext } from 'next'
import { CountryCode } from '@/services/graphql/generated'
import { graphqlSdk } from '@/services/graphql/sdk'
import { SimplePersister } from '@/services/persister/Persister.types'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { COOKIE_KEY_SHOP_SESSION } from './ShopSession.constants'

export class ShopSessionService {
  constructor(private readonly persister: SimplePersister) {}

  public async fetch(createParams: CreateParams) {
    const shopSessionId = this.persister.fetch()

    if (shopSessionId) {
      const response = await graphqlSdk.ShopSession({ shopSessionId })
      if (response.shopSession) return response.shopSession
    }

    return await this.create(createParams)
  }

  private async create({ countryCode }: CreateParams) {
    const response = await graphqlSdk.ShopSessionCreate({ countryCode })
    const newSession = response.shopSession?.create

    if (!newSession) throw new Error('Could not create session')

    this.persister.save(newSession.id)

    return newSession
  }
}

type CreateParams = {
  countryCode: CountryCode
}

export const shopSessionServiceInitServerSide = ({ request, response }: Params) => {
  return new ShopSessionService(
    new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, request, response),
  )
}

type Params = {
  request: GetServerSidePropsContext['req']
  response: GetServerSidePropsContext['res']
}
