import type { ApolloClient } from '@apollo/client'
import { AppRouterCookiePersister } from '@/services/persister/app-router/AppRouterCookiePersister'
import { PriceIntentService } from '../PriceIntentService'

export const setupPriceIntentService = (apolloClient: ApolloClient<unknown>) => {
  return new PriceIntentService(new AppRouterCookiePersister('UNUSED_DEFAULT_KEY'), apolloClient)
}
