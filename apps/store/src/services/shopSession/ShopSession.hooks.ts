import Cookies from 'js-cookie'
import { useCallback } from 'react'
import { useShopSessionLazyQuery } from '@/services/apollo/generated'
import { COOKIE_KEY_SHOP_SESSION } from './ShopSession.constants'

export const useGetCurrentShopSession = () => {
  const [getShopSession] = useShopSessionLazyQuery()

  return useCallback(async () => {
    const shopSessionId = Cookies.get(COOKIE_KEY_SHOP_SESSION)
    if (!shopSessionId) throw new Error('Did not find a ShopSession ID in cookies')
    const { data } = await getShopSession({ variables: { shopSessionId } })
    if (!data) throw new Error(`Did not find a ShopSession with ID: ${shopSessionId}`)
    return data.shopSession
  }, [getShopSession])
}
