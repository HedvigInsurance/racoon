import {
  ShopSessionRetargetingQuery,
  RetargetingPriceIntentFragment,
  RetargetingOfferFragment,
} from '@/services/apollo/generated'
import { PageLink } from '@/utils/PageLink'
import { UserParams } from './retargeting.types'

export enum RedirectType {
  Product = 'product',
  Cart = 'cart',
  Fallback = 'fallback',
  ModifiedCart = 'modified-cart',
}

type Redirect =
  | { type: Exclude<RedirectType, RedirectType.ModifiedCart>; url: URL }
  | {
      type: RedirectType.ModifiedCart
      url: URL
      offers: Array<string>
    }

export const getUserRedirect = (
  userParams: UserParams,
  data: ShopSessionRetargetingQuery | null,
): Redirect => {
  const fallbackRedirect = {
    type: RedirectType.Fallback,
    url: PageLink.store({ locale: userParams.locale }),
  } as const

  if (!data) return fallbackRedirect

  if (hasAddedCartEntries(data)) {
    return {
      type: RedirectType.Cart,
      url: PageLink.session({
        locale: userParams.locale,
        shopSessionId: data.shopSession.id,
        next: PageLink.cart({ locale: userParams.locale }).pathname,
        code: userParams.campaignCode,
      }),
    }
  }

  const priceIntents = getPriceIntentsByExposure(data)

  if (priceIntents.length === 1) {
    return {
      type: RedirectType.Product,
      url: PageLink.session({
        locale: userParams.locale,
        shopSessionId: data.shopSession.id,
        code: userParams.campaignCode,
        priceIntentId: priceIntents[0].id,
      }),
    }
  }

  const offers = getCheapestOffersIds(priceIntents)
  if (offers.length > 0) {
    return {
      type: RedirectType.ModifiedCart,
      url: PageLink.session({
        locale: userParams.locale,
        shopSessionId: data.shopSession.id,
        next: PageLink.cart({ locale: userParams.locale }).pathname,
        code: userParams.campaignCode,
      }),
      offers,
    }
  }

  console.warn(`Retargeting: no confirmed price intents in ${userParams.shopSessionId}`)
  return fallbackRedirect
}

const hasAddedCartEntries = (data: ShopSessionRetargetingQuery): boolean => {
  return data.shopSession.cart.entries.length > 0
}

const getPriceIntentsByExposure = (
  data: ShopSessionRetargetingQuery,
): Array<RetargetingPriceIntentFragment> => {
  const exposures = new Set()
  const uniquePriceIntents = data.shopSession.priceIntents
    .filter((item) => item.offers.length > 0)
    // We care about the last confirmed price intent
    .reverse()
    .filter((item) => {
      const exposure = getProductExposure(item.product.name, item.data)
      if (exposures.has(exposure)) return false
      exposures.add(exposure)
      return true
    })

  return uniquePriceIntents
}

const CAR_EXPOSURE_FIELD = 'registrationNumber'
const PET_EXPOSURE_FIELD = 'name'
const getProductExposure = (productName: string, data: Record<string, unknown>): string => {
  switch (productName) {
    case 'SE_CAR':
      return [productName, getAsString(data[CAR_EXPOSURE_FIELD])].join('')
    case 'SE_PET_DOG':
    case 'SE_PET_CAT':
      return [productName, getAsString(data[PET_EXPOSURE_FIELD])].join('')
    default:
      // You can only add one Home / Accident
      return productName
  }
}

const getAsString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined
}

const getCheapestOffersIds = (priceIntents: Array<RetargetingPriceIntentFragment>) => {
  const cheapestOffersIds = priceIntents.reduce<Array<string>>((result, priceIntent) => {
    const cheapestOffer = getCheapestOffer(priceIntent)
    return [...result, cheapestOffer.id]
  }, [])

  return cheapestOffersIds
}

const getCheapestOffer = (
  priceIntent: RetargetingPriceIntentFragment,
): RetargetingOfferFragment => {
  const sortedOffersByPrice = [...priceIntent.offers].sort(
    (offerA, offerB) => offerA.cost.gross.amount - offerB.cost.gross.amount,
  )
  const cheapestOffer = sortedOffersByPrice[0]

  return cheapestOffer
}
