import { useTranslation } from 'next-i18next'
import { CampaignDiscount, CampaignDiscountType } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Money } from '@/utils/formatter'
import { useFormatter } from '@/utils/useFormatter'

export const useGetDiscountExplanation = () => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (discount: CampaignDiscount) => {
    switch (discount.type) {
      case CampaignDiscountType.MonthlyCost:
        return `-${formatter.monthlyPrice(discount.amount)}`

      case CampaignDiscountType.FreeMonths:
        return t('DISCOUNT_STATE_FREE_MONTHS', { count: discount.months })

      case CampaignDiscountType.MonthlyPercentage:
        return t('DISCOUNT_STATE_MONTHLY_PERCENTAGE', {
          percentage: discount.percentage,
          count: discount.months,
        })

      case CampaignDiscountType.IndefinitePercentage:
        return t('DISCOUNT_STATE_INDEFINITE_PERCENTAGE', {
          percentage: discount.percentage,
        })
    }
  }
}

export const useGetDiscountDurationExplanation = () => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (discount: CampaignDiscount, total: Money) => {
    switch (discount.type) {
      case CampaignDiscountType.FreeMonths:
      case CampaignDiscountType.MonthlyPercentage:
        // A workaround to escape the '/' in the monthly price.
        return `${t('DISCOUNT_DURATION_EXPLANATION', {
          count: discount.months,
        })} ${formatter.monthlyPrice(total)}`

      case CampaignDiscountType.MonthlyCost:
      case CampaignDiscountType.IndefinitePercentage:
      default:
        return ''
    }
  }
}

export const useGetTotal = () => {
  const { shopSession } = useShopSession()
  const hasDiscount = shopSession?.cart.redeemedCampaigns.length !== 0

  if (!hasDiscount) return shopSession.cart.cost.net
  // Only expecting one discount right now. Going forward we'd need to make this work for multi discounts.
  switch (shopSession?.cart.redeemedCampaigns[0].discount.type) {
    case CampaignDiscountType.FreeMonths:
      return shopSession?.cart.cost.discount
    default:
      return shopSession?.cart.cost.net
  }
}

export const useGetCrossOut = () => {
  const { shopSession } = useShopSession()
  const hasDiscount = shopSession?.cart.redeemedCampaigns.length !== 0

  if (!hasDiscount) return undefined
  switch (shopSession?.cart.redeemedCampaigns[0].discount.type) {
    case CampaignDiscountType.FreeMonths:
    case CampaignDiscountType.MonthlyPercentage:
      return shopSession.cart.cost.gross
    case CampaignDiscountType.IndefinitePercentage:
    case CampaignDiscountType.MonthlyCost:
      return shopSession.cart.cost.discount
  }
}
