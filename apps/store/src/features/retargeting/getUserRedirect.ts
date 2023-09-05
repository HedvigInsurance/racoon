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

  const priceIntentId = getSingleProduct(data)
  if (priceIntentId) {
    return {
      type: RedirectType.Product,
      url: PageLink.session({
        locale: userParams.locale,
        shopSessionId: data.shopSession.id,
        code: userParams.campaignCode,
        priceIntentId,
      }),
    }
  }

  const offers = getCheapestOffersIds(data)
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

  console.warn(
    `Retargeting: no confirmed price intents in shop session ${userParams.shopSessionId}. Redirecting to fallback location`,
  )
  return fallbackRedirect
}

const hasAddedCartEntries = (data: ShopSessionRetargetingQuery): boolean => {
  return data.shopSession.cart.entries.length > 0
}

const getSingleProduct = (data: ShopSessionRetargetingQuery): string | null => {
  const productNames = data.shopSession.priceIntents.map((priceIntent) => priceIntent.product.name)
  const products = new Set(productNames)
  if (products.size !== 1) return null

  // Assume that the last price intent is the latest one
  const priceIntent = data.shopSession.priceIntents[data.shopSession.priceIntents.length - 1]
  return priceIntent.id
}

const getCheapestOffersIds = (data: ShopSessionRetargetingQuery) => {
  const confirmedPriceIntents = data.shopSession.priceIntents.filter(
    (priceIntent) => priceIntent.offers.length > 0,
  )
  const cheapestOffersIds = confirmedPriceIntents.reduce<Array<string>>((result, priceIntent) => {
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
