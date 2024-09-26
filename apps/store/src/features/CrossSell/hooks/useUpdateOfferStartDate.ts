import {
  type OfferRecommendationFragment,
  useStartDateUpdateMutation,
} from '@/services/graphql/generated'
import { formatAPIDate } from '@/utils/date'

export function useUpdateOfferStartDate() {
  const [updateStartDate] = useStartDateUpdateMutation()

  const updateOfferStartDate = async (
    offerId: string,
    startDate: Date,
  ): Promise<OfferRecommendationFragment> => {
    const { data } = await updateStartDate({
      variables: {
        productOfferIds: [offerId],
        startDate: formatAPIDate(startDate),
      },
    })

    const updatedOffer = data?.productOffersStartDateUpdate.productOffers[0]

    if (!updatedOffer) {
      throw new Error(`Cross sell | failed to update offer (${offerId}) startDate (${startDate})`)
    }

    return updatedOffer
  }

  return updateOfferStartDate
}
