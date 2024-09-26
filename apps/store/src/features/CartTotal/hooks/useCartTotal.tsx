import { useTranslation } from 'next-i18next'
import {
  type CampaignDiscount,
  CampaignDiscountType,
  type CartCost,
} from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'

type UseCartTotalParams = {
  discount?: CampaignDiscount
  cost: CartCost
}

export const useCartTotal = ({ discount, cost }: UseCartTotalParams) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const getDiscountDurationExplanation = () => {
    if (!discount) {
      return
    }

    switch (discount.type) {
      case CampaignDiscountType.FreeMonths:
      case CampaignDiscountType.MonthlyPercentage:
        return t('DISCOUNT_DURATION_EXPLANATION', {
          count: discount.months,
          monthlyPrice: formatter.monthlyPrice(cost.gross),
          // Avoid double escaping / in price.  Safe since we're not using dangerouslySetInnerHtml
          interpolation: { escapeValue: false },
        })
      case CampaignDiscountType.MonthlyCost:
      case CampaignDiscountType.IndefinitePercentage:
      default:
        return ''
    }
  }

  const getReducedAmount = () => {
    if (!discount) {
      return
    }

    if (discount.type === CampaignDiscountType.FreeMonths) {
      return cost.discount.amount
    }

    return cost.net.amount
  }

  const reducedAmount = getReducedAmount()
  const explanation = getDiscountDurationExplanation()

  return { amount: cost.gross, reducedAmount, explanation }
}
