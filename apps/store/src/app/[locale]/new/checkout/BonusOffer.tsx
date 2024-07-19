'use client'

import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { useBonusOffer } from '@/components/QuickAdd/useBonusOffer'
import { useShopSessionSuspense } from '@/services/shopSession/app-router/useShopSessionSuspense'

export function BonusOffer({ shopSessionId }: { shopSessionId: string }) {
  const shopSession = useShopSessionSuspense({ shopSessionId })
  const offerRecommendation = useBonusOffer()

  if (!offerRecommendation) {
    return null
  }

  return (
    <QuickAddOfferContainer
      shopSessionId={shopSessionId}
      cart={shopSession.cart}
      {...offerRecommendation}
    />
  )
}
