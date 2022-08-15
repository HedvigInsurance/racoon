import { useContext } from 'react'
import { ShopSessionContext } from './ShopSession.context'

export const useShopSession = () => {
  const contextValue = useContext(ShopSessionContext)
  if (!contextValue) {
    throw new Error('useShopSession must be used inside ShopSessionContextProvider')
  }
  return contextValue.querySession()
}
