import { useTranslation } from 'next-i18next'
import type { CampaignDiscount } from '@/services/graphql/generated'
import { CampaignDiscountType } from '@/services/graphql/generated'
import { useFormatter } from './useFormatter'

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

      // Not a case we care about, this discount type is evil and should no longer be used
      // For now it's used with some partner integrations
      case CampaignDiscountType.VisibleNoDiscount:
        return ''
    }
  }
}
