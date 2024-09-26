import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useCallback } from 'react'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'

export function useAddRecommendationOfferToCart({ shopSessionId }: { shopSessionId: string }) {
  const tracking = useTracking()

  const [addToCart, loading] = useAddToCart({
    shopSessionId,
    onSuccess(offerId, cart) {
      const addedOffer = cart.entries.find((entry) => entry.id === offerId)!
      const productName = addedOffer.product.name

      datadogLogs.logger.info('Quick Add | Added offer to cart', {
        productOfferId: addedOffer.id,
        product: productName,
      })
      window.scrollTo({ top: 0 })
    },
  })

  const addOfferToCart = useCallback(
    async (offer: OfferRecommendationFragment) => {
      const productName = offer.product.name

      datadogRum.addAction('Quick Add To Cart', {
        type: 'complete',
        productOfferId: offer.id,
        product: productName,
      })
      tracking.reportAddToCart(offer, 'recommendations')
      await addToCart(offer.id)
    },
    [addToCart, tracking],
  )

  return [addOfferToCart, loading] as const
}
