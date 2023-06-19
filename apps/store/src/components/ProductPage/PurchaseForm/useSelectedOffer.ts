import { datadogLogs } from '@datadog/browser-logs'
import { SetStateAction, atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import { ProductOfferFragment } from '@/services/apollo/generated'

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

      if (offer && offer.priceMatch) {
        datadogLogs.logger.info('Selected price matched offer', {
          offerId: offer.id,
          product: offer.variant.product.name,
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
