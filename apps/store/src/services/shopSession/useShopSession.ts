import { useApolloClient } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  ShopSessionQuery,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'

export const useShopSession = () => {
  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()

  const [createShopSession] = useShopSessionCreateMutation({
    variables: { countryCode },
    onCompleted({ shopSessionCreate }) {
      setShopSessionId(shopSessionCreate.id)
      shopSessionService.save(shopSessionCreate)
    },
  })

  const [shopSessionId, setShopSessionId] = useState(() => {
    const shopSessionId = shopSessionService.shopSessionId()
    if (!shopSessionId) createShopSession()
    return shopSessionId
  })

  const result = useShopSessionQuery({
    shopSessionId,
    onCompleted: ({ shopSession }) => {
      if (shopSession.countryCode !== countryCode) createShopSession()
    },
  })

  return useMemo(() => {
    const shopSessionCountryCode = result.data?.shopSession?.countryCode
    return {
      ...result,
      data: shopSessionCountryCode !== countryCode ? undefined : result.data?.shopSession,
    }
  }, [result, countryCode])
}

const useShopSessionQuery = ({ shopSessionId, onCompleted }: UseShopSessionParams) => {
  return useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted,
  })
}

type UseShopSessionParams = {
  onCompleted: (data: ShopSessionQuery) => void
  shopSessionId: string | null
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
