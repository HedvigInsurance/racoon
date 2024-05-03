import { useMemo } from 'react'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { getOffersByPrice } from '@/utils/getOffersByPrice'

type Params = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
}

export function useTiersAndDeductibles({ offers, selectedOffer }: Params) {
  return useMemo(() => {
    const sortedOffers = getOffersByPrice(offers)
    const tiers: Array<ProductOfferFragment> = []
    const usedTiers = new Set<string>()
    for (const offer of sortedOffers) {
      const typeOfContract = offer.variant.typeOfContract
      if (usedTiers.has(typeOfContract)) continue

      usedTiers.add(typeOfContract)
      tiers.push(typeOfContract === selectedOffer.variant.typeOfContract ? selectedOffer : offer)
    }

    const deductibles = sortedOffers.filter(
      (item) => item.variant.typeOfContract === selectedOffer.variant.typeOfContract,
    )

    return { tiers, deductibles }
  }, [offers, selectedOffer])
}
