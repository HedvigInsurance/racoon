import { datadogLogs } from '@datadog/browser-logs'
import type { SetStateAction } from 'jotai'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import type { ProductOfferFragment } from '@/services/graphql/generated'

const selectedOfferAtom = atom<ProductOfferFragment | null>(null)

export const useSelectedOffer = () => {
  const [selectedOffer, _setSelectedOffer] = useAtom(selectedOfferAtom)

  const setSelectedOffer = useCallback(
    (action: SetStateAction<ProductOfferFragment | null>): void => {
      let offer: ProductOfferFragment | null = null

      if (typeof action === 'function') {
        _setSelectedOffer((prev) => {
          offer = action(prev)
          return offer
        })
      } else {
        _setSelectedOffer(action)
        offer = action
      }

      if (offer?.priceMatch) {
        datadogLogs.logger.info('Selected price matched offer', {
          offerId: offer.id,
          product: offer.product.name,
          productVariant: offer.variant.displayName,
          externalInsurer: offer.priceMatch.externalInsurer.displayName,
          priceReduction: offer.priceMatch.priceReduction.amount,
        })
      }
    },
    [_setSelectedOffer],
  )

  return [selectedOffer, setSelectedOffer] as const
}
