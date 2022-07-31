import { GetServerSidePropsContext } from 'next'
import { CookiePersister } from '@/services/persister/CookiePersister'
import { ServerCookiePersister } from '@/services/persister/ServerCookiePersister'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { COOKIE_KEY_PRICE_INTENT } from './priceIntent.constants'
import { PriceIntentService } from './PriceIntentService'

export const priceIntentServiceInitServerSide = ({ req, res, shopSession }: Params) => {
  return new PriceIntentService(
    new ServerCookiePersister(COOKIE_KEY_PRICE_INTENT, req, res),
    shopSession,
  )
}

export const priceIntentServiceInitClientSide = (shopSession?: Params['shopSession']) => {
  return new PriceIntentService(new CookiePersister(COOKIE_KEY_PRICE_INTENT), shopSession)
}

type Params = {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
  shopSession: ShopSession
}
