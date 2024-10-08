import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS } from './bundleDiscount.constants'

export const hasBundleDiscount = (shopSession: ShopSession) => {
  return !!(shopSession.cart.redeemedCampaign && shopSession.experiments?.bundleDiscount)
}

export const hasCartItemsEligibleForBundleDiscount = (shopSession: ShopSession) => {
  return (
    shopSession.experiments?.bundleDiscount &&
    // Another special case to ignore - only accident in cart
    shopSession.cart.entries.some((item) =>
      BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS.has(item.product.id),
    )
  )
}
