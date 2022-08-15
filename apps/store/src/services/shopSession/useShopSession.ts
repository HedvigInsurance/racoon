import { useContext } from 'react'
import { ShopSessionContext } from './ShopSession.context'

export const useShopSession = () => {
  const { querySession } = useContext(ShopSessionContext)
  return querySession()
}
