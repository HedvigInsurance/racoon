import { useMemo, type ComponentProps } from 'react'
import { usePriceIntentsQuery } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { MultiTierOffer } from './MultiTierOffer'
import { SingleTierOffer } from './SingleTierOffer'

type OfferSingle = ComponentProps<typeof SingleTierOffer> & { type: 'single' }
type OfferMultiple = ComponentProps<typeof MultiTierOffer> & { type: 'multiple' }
type Offer = (OfferSingle | OfferMultiple) & { key: string }

export const useRetargetingOffers = (): Array<Offer> | null => {
  const { shopSession } = useShopSession()

  const result = usePriceIntentsQuery({
    skip: !shopSession,
    variables: shopSession ? { shopSessionId: shopSession.id } : undefined,
  })

  const offers = useMemo(() => {
    if (!shopSession || !result.data) return null

    const cartOfferIds = new Set(result.data.shopSession.cart.entries.map((item) => item.id))

    return result.data.shopSession.priceIntents.reduce<Array<Offer>>((total, item) => {
      if (item.offers.some((offer) => cartOfferIds.has(offer.id))) {
        return total
      }

      if (item.offers.length === 1) {
        total.push({
          key: item.id,
          type: 'single',
          product: item.offers[0].variant.product,
          offer: item.offers[0],
          shopSessionId: shopSession.id,
        })
      } else if (item.offers.length > 1) {
        total.push({
          key: item.id,
          type: 'multiple',
          product: item.offers[0].variant.product,
          defaultOffer: item.offers[0],
          offers: item.offers,
        })
      }

      return total
    }, [])
  }, [result.data, shopSession])

  return offers
}
