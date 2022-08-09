import { useApolloClient } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { getShopSessionClientSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export const useCart = () => {
  const { countryCode } = useCurrentLocale()
  const [shopSession, setShopSession] = useState<ShopSession>()
  const apolloClient = useApolloClient()

  useEffect(() => {
    ;(async () => {
      setShopSession(await getShopSessionClientSide({ apolloClient, countryCode }))
    })()
  }, [apolloClient, countryCode])

  return shopSession?.cart
}
