import { useState } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { useShopSessionFindOrCreateQuery } from '@/services/apollo/generated'
import { shopSessionServiceInitClientSide } from '@/services/shopSession/ShopSessionService'

const shopSessionService = shopSessionServiceInitClientSide()

export const useCart = () => {
  const { countryCode } = useCurrentLocale()
  const [shopSessionId, setShopSessionId] = useState(() => {
    const shopSessionId = shopSessionService.shopSessionId
    return shopSessionId
  })

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
