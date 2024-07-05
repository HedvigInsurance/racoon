import type { ApolloClient } from '@apollo/client'
import { AppRouterCookiePersister } from '@/services/persister/app-router/AppRouterCookiePersister'
import type { NextCookiesStore } from '@/utils/types'
import { SHOP_SESSION_COOKIE_NAME } from '../ShopSession.constants'
import { ShopSessionService } from '../ShopSessionService'

export const setupShopSession = (apolloClient: ApolloClient<unknown>) => {
  return new ShopSessionService(
    new AppRouterCookiePersister(SHOP_SESSION_COOKIE_NAME),
    apolloClient,
  )
}

export const getShopSessionId = (cookies: NextCookiesStore) => {
  return cookies.get(SHOP_SESSION_COOKIE_NAME)?.value
}
