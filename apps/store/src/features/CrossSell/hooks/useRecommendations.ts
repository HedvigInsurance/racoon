import { datadogLogs } from '@datadog/browser-logs'
import type { ProductRecommendationFragment } from '@/services/graphql/generated'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationsQuery,
  useProductRecommendationsQuery,
} from '@/services/graphql/generated'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'

export type OfferRecommendation = {
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export const useRecommendations = (customShopSessionId?: string): OfferRecommendation | null => {
  const currentShopSessionId = useShopSessionId()
  const shopSessionId = customShopSessionId ?? currentShopSessionId

  const result = useProductRecommendationsQuery({
    fetchPolicy: 'cache-and-network',
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: shopSessionId == null,
    onCompleted(data) {
      const offerRecommendations = getOfferRecommendations(data)
      if (offerRecommendations.length > 1) {
        datadogLogs.logger.warn('More than one offer recommendation', {
          shopSessionId,
          offers: offerRecommendations.map((item) => item.offer.id),
        })
      }
    },
  })

  const offers = result.data ? getOfferRecommendations(result.data) : []

  if (!offers.length) {
    return null
  }

  const [offer] = offers

  // We only support cross-selling of Accident insurance at the moment
  if (offer.product.name !== 'SE_ACCIDENT') {
    console.log(`Cross sell | Unsupported product: ${offer.product.name}`)
    return null
  }

  return offer
}

const getOfferRecommendations = (data: ProductRecommendationsQuery): Array<OfferRecommendation> => {
  return data.shopSession.recommendations.reduce<Array<OfferRecommendation>>((acc, item) => {
    if (item.offer) {
      acc.push({ product: item.product, offer: item.offer })
    }
    return acc
  }, [])
}
