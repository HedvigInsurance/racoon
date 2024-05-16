import type { ShopSession } from '@/services/shopSession/ShopSession.types'

export const hasBundleDiscount = (shopSession: ShopSession) => {
  return !!(shopSession.cart.redeemedCampaign && shopSession.experiments?.bundleDiscount)
}
