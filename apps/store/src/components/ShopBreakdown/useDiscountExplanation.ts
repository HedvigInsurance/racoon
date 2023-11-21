import { type ComponentProps } from 'react'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { Discount } from './Discount'

type RedeemedCampaign = ShopSession['cart']['redeemedCampaign']

export const useDiscountProps = (
  campaign: RedeemedCampaign,
): ComponentProps<typeof Discount> | undefined => {
  const getDiscountExplanation = useGetDiscountExplanation()

  if (!campaign) return

  return {
    code: campaign.code,
    explanation: getDiscountExplanation(campaign.discount),
  }
}
