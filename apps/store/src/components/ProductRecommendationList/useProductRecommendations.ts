import { useProductRecommendationsQuery } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useProductRecommendations = () => {
  const { shopSession } = useShopSession()

  const shopSessionId = shopSession?.id
  const result = useProductRecommendationsQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  })

  const productRecommendations = result.data?.shopSession.recommendations.map(
    (item) => item.product,
  )
  const productRecommendationOffers = result.data?.shopSession.recommendations
    .filter((item) => item.offer)
    .map((item) => ({
      offer: item.offer,
      product: item.product,
    }))

  return { productRecommendations, productRecommendationOffers } as const
}
