import { datadogLogs } from '@datadog/browser-logs'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
  type ProductRecommendationsQuery,
  useProductRecommendationsQuery,
} from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type OfferRecommendation = {
  product: ProductRecommendationFragment
  offer: OfferRecommendationFragment
}

type ReturnType = {
  productRecommendations: Array<ProductRecommendationFragment> | null
  offerRecommendation: OfferRecommendation | null
}

export const useProductRecommendations = (customShopSessionId?: string): ReturnType => {
  const { shopSession } = useShopSession()
  const shopSessionId = customShopSessionId ?? shopSession?.id

  const result = useProductRecommendationsQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
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

  const productRecommendations = result.data ? getProductRecommendations(result.data) : null
  const offerRecommendations = result.data ? getOfferRecommendations(result.data) : []
  const offerRecommendation = offerRecommendations[0] ?? null

  return { productRecommendations, offerRecommendation } as const
}

const getProductRecommendations = (
  data: ProductRecommendationsQuery,
): Array<ProductRecommendationFragment> => {
  return data.shopSession.recommendations.map((item) => item.product)
}

const getOfferRecommendations = (data: ProductRecommendationsQuery): Array<OfferRecommendation> => {
  return data.shopSession.recommendations.reduce<Array<OfferRecommendation>>((acc, item) => {
    if (item.offer) {
      acc.push({ product: item.product, offer: item.offer })
    }
    return acc
  }, [])
}
