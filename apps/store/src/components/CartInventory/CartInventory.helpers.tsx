import { useTranslation } from 'next-i18next'
import { CampaignDiscount, CampaignDiscountType } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

export const useGetDiscountExplaination = () => {
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
