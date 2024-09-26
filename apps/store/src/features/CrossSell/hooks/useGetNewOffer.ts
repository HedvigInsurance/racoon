import { useApolloClient } from '@apollo/client'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'

type UseGetNewOfferParams = {
  shopSessionId: string
  productName: string
}

export function useGetNewOffer({ shopSessionId, productName }: UseGetNewOfferParams) {
  const apolloClient = useApolloClient()

  const getNewOffer = async (
    data: Record<string, unknown>,
  ): Promise<OfferRecommendationFragment> => {
    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

    const priceTemplate = getPriceTemplate(productName)
    if (!priceTemplate) {
      throw new Error(`Cross sell | Price template not found for product ${productName}`)
    }

    const priceIntent = await priceIntentService.getOrCreate({
      shopSessionId,
      priceTemplate,
      productName,
    })

    const { offers } = await priceIntentService.upddateAndConfirm({
      priceIntentId: priceIntent.id,
      data: { ...priceIntent.suggestedData, ...data },
    })

    return offers[0] as OfferRecommendationFragment
  }

  return getNewOffer
}
