import type { ApolloClient } from '@apollo/client'
import { cookies } from 'next/headers'
import { AppRouterCookiePersister } from '@/services/persister/app-router/AppRouterCookiePersister'
import { SHOP_SESSION_COOKIE_NAME } from '../ShopSession.constants'
import { ShopSessionService } from '../ShopSessionService'

export const setupShopSession = (apolloClient: ApolloClient<unknown>) => {
  return new ShopSessionService(
    new AppRouterCookiePersister(SHOP_SESSION_COOKIE_NAME),
    apolloClient,
  )
}

export const getShopSessionId = () => {
  const cookieStore = cookies()
  return cookieStore.get(SHOP_SESSION_COOKIE_NAME)?.value
}
