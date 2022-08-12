import { useContext } from 'react'
import { ShopSessionContext } from '@/components/LayoutWithMenu/LayoutWithMenu'

export const useShopSession = () => {
  const { querySession } = useContext(ShopSessionContext)
  return querySession()
}
