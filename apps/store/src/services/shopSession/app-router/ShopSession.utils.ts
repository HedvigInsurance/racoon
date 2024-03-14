import { ApolloClient } from '@apollo/client'
import { cookies } from 'next/headers'
import { AppRouterCookiePersister } from '@/services/persister/app-router/AppRouterCookiePersister'
import { COOKIE_KEY_SHOP_SESSION } from '../ShopSession.constants'
import { ShopSessionService } from '../ShopSessionService'

export const setupShopSession = (apolloClient: ApolloClient<unknown>) => {
  return new ShopSessionService(new AppRouterCookiePersister(COOKIE_KEY_SHOP_SESSION), apolloClient)
}

export const getShopSessionId = () => {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_KEY_SHOP_SESSION)?.value
}
