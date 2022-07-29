import { useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { useShopSessionFindOrCreateQuery } from '@/services/apollo/generated'
import { getShopSessionIdClientSide } from '@/services/shopSession/ShopSession.helpers'

export const useCart = () => {
  const { countryCode } = useCurrentLocale()

  const apolloClient = useApolloClient()
  const [shopSessionId, setShopSessionId] = useState(() => getShopSessionIdClientSide(apolloClient))

  const result = useShopSessionFindOrCreateQuery({
    variables: { shopSessionId, countryCode },
    onCompleted(data) {
      if (data.shopSessionFindOrCreate.id !== shopSessionId) {
        setShopSessionId(data.shopSessionFindOrCreate.id)
      }
    },
  })

  return { ...result, data: result.data?.shopSessionFindOrCreate.cart }
}
