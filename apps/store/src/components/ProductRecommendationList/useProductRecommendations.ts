import { useProductRecommendationsQuery } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useProductRecommendations = () => {
  const { shopSession } = useShopSession()

  const shopSessionId = typeof shopSession?.id === 'string' ? shopSession.id : undefined
  const result = useProductRecommendationsQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
  })

  return result.data?.shopSession.recommendations.map((item) => ({
    product: item.product,
    offer: item.offer,
  }))
}
