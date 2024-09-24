'use client'

import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { useBonusOffer } from '@/components/QuickAdd/useBonusOffer'
import { type ShopSessionFragment } from '@/services/graphql/generated'

export function CrossSell({ shopSession }: { shopSession: ShopSessionFragment }) {
  const offerRecommendation = useBonusOffer()

  if (!offerRecommendation) {
    return null
  }

  return (
    <QuickAddOfferContainer
      shopSessionId={shopSession.id}
      cart={shopSession.cart}
      {...offerRecommendation}
    />
  )
}
