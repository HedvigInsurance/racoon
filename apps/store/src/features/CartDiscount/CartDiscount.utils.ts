import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { hasBundleDiscount } from '../bundleDiscount/bundleDiscount.utils'

export const getDiscountsVisibility = (shopSession: ShopSession) => {
  const hasBundleDiscountInCart = hasBundleDiscount(shopSession)

  const IS_CAMPAIGNS_ENABLED = shopSession.cart.campaignsEnabled

  const campaign = shopSession.cart.redeemedCampaign
  const campaignCode = campaign?.code

  const shouldShowToggle = IS_CAMPAIGNS_ENABLED
  const shouldShowDiscountForm = IS_CAMPAIGNS_ENABLED && !campaignCode
  const shouldShowDiscountSection =
    !hasBundleDiscountInCart && (campaignCode || shouldShowDiscountForm)

  return {
    shouldShowToggle,
    shouldShowDiscountForm,
    shouldShowDiscountSection,
  }
}
