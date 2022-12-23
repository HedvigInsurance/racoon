import { ApolloClient } from '@apollo/client'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { PriceIntentService } from './PriceIntentService'

type Params = {
  apolloClient: ApolloClient<unknown>
  shopSession: ShopSession
}

export const priceIntentServiceInitClientSide = ({ apolloClient, shopSession }: Params) => {
  return new PriceIntentService(
    new CookiePersister('UNUSED_DEFAULT_KEY'),
    apolloClient,
    shopSession,
  )
}
