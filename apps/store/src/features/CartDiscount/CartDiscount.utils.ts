import { type ShopSession } from '@/services/shopSession/ShopSession.types'

export const getDiscountsVisibility = (cart: ShopSession['cart']) => {
  const campaign = cart.redeemedCampaign
  const campaignCode = campaign?.code

  const IS_CAMPAIGNS_ENABLED = cart.campaignsEnabled

  const shouldShowToggle = IS_CAMPAIGNS_ENABLED
  const shouldShowDiscountForm = IS_CAMPAIGNS_ENABLED && !campaignCode
  const shouldShowDiscountSection = campaignCode || shouldShowDiscountForm

  return {
    shouldShowToggle,
    shouldShowDiscountForm,
    shouldShowDiscountSection,
  }
}
