import { ApolloClient } from '@apollo/client'
import type { CountryCode } from '@/services/graphql/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { CookieParams } from '@/utils/types'
import { COOKIE_KEY_SHOP_SESSION } from './ShopSession.constants'
import { ShopSessionService } from './ShopSessionService'

type Params = CookieParams & {
  apolloClient: ApolloClient<unknown>
}

export const getCurrentShopSessionServerSide = async (params: Params) => {
  const shopSessionService = setupShopSessionServiceServerSide(params)

  const shopSessionId = shopSessionService.shopSessionId()

  if (shopSessionId === null) {
    console.warn('Current ShopSession ID not found')
    console.info('All cookies: ', params.req?.headers.cookie)
    throw new Error('Current ShopSession not found')
  }

  return shopSessionService.fetchById(shopSessionId)
}

export const getShopSessionServerSide = async (params: GetShopSessionParams) => {
  const shopSessionService = setupShopSessionServiceServerSide(params)
  const { countryCode } = params
  return await shopSessionService.getOrCreate({ countryCode })
}

type GetShopSessionParams = Params & { countryCode: CountryCode }

export const setupShopSessionServiceClientSide = (apolloClient: ApolloClient<unknown>) => {
  return new ShopSessionService(new CookiePersister(COOKIE_KEY_SHOP_SESSION), apolloClient)
}

export const setupShopSessionServiceServerSide = (params: Omit<Params, 'locale'>) => {
  const { req, res, apolloClient } = params
  return new ShopSessionService(
    new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, req, res),
    apolloClient,
  )
}

export const getShopSessionId = ({ req, res }: CookieParams = {}) => {
  if (req && res) return new ServerCookiePersister(COOKIE_KEY_SHOP_SESSION, req, res).fetch()
  return new CookiePersister(COOKIE_KEY_SHOP_SESSION).fetch()
}
