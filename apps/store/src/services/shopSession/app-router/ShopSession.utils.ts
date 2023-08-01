import { cookies } from 'next/headers'
import { COOKIE_KEY_SHOP_SESSION } from '../ShopSession.constants'

export const getShopSessionId = () => {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_KEY_SHOP_SESSION)?.value
}
