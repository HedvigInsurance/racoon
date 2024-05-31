import type { ApolloClient } from '@apollo/client'
import type { CountryCode } from '@/services/graphql/generated'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import type { CookieParams } from '@/utils/types'
import { SHOP_SESSION_COOKIE_MAX_AGE, SHOP_SESSION_COOKIE_NAME } from './ShopSession.constants'
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
  return new ShopSessionService(
    new CookiePersister(SHOP_SESSION_COOKIE_NAME, SHOP_SESSION_COOKIE_MAX_AGE),
    apolloClient,
  )
}

export const setupShopSessionServiceServerSide = (params: Omit<Params, 'locale'>) => {
  const { req, res, apolloClient } = params
  return new ShopSessionService(
    new ServerCookiePersister(SHOP_SESSION_COOKIE_NAME, req, res, SHOP_SESSION_COOKIE_MAX_AGE),
    apolloClient,
  )
}

export const getShopSessionId = ({ req, res }: CookieParams = {}) => {
  if (req && res)
    return new ServerCookiePersister(
      SHOP_SESSION_COOKIE_NAME,
      req,
      res,
      SHOP_SESSION_COOKIE_MAX_AGE,
    ).fetch()
  return new CookiePersister(SHOP_SESSION_COOKIE_NAME, SHOP_SESSION_COOKIE_MAX_AGE).fetch()
}
