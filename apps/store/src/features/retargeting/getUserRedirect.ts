import { type ShopSessionRetargetingQuery } from '@/services/graphql/generated'
import { PageLink } from '@/utils/PageLink'
import { type UserParams } from './retargeting.types'

export enum RedirectType {
  Product = 'product',
  Cart = 'cart',
  ModifiedCart = 'modified-cart',
  Fallback = 'fallback',
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
  const fallbackRedirect: Redirect = {
    type: RedirectType.Fallback,
    url: PageLink.store({ locale: userParams.locale }),
  }

  if (!data) return fallbackRedirect

  // Ignore campaign code if it cannot be changed (partner session, active bundle discount, etc)
  if (data.shopSession.cart.campaignsEnabled === false) {
    delete userParams.campaignCode
  }

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

  const { priceIntents } = data.shopSession

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

  const offerIds = priceIntents
    .map((priceIntent) => priceIntent.defaultOffer?.id)
    .filter(Boolean) as Array<string>
  if (offerIds.length > 0) {
    return {
      type: RedirectType.ModifiedCart,
      url: PageLink.session({
        locale: userParams.locale,
        shopSessionId: data.shopSession.id,
        next: PageLink.cart({ locale: userParams.locale }).pathname,
        code: userParams.campaignCode,
      }),
      offers: offerIds,
    }
  }

  console.warn(`Retargeting | no confirmed price intents in ${userParams.shopSessionId}`)
  return fallbackRedirect
}

const hasAddedCartEntries = (data: ShopSessionRetargetingQuery): boolean => {
  return data.shopSession.cart.entries.length > 0
}
