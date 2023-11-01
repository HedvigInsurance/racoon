import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import {
  CampaignDiscount,
  CampaignDiscountType,
  CartCost,
  Money,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  cart: ShopSession['cart']
}

export const TotalAmountContainer = (props: Props) => {
  const { getDiscountDurationExplanation, getReducedAmmount } = useDiscount()

  const apiDiscount = props.cart.redeemedCampaign?.discount
  const totalCost = props.cart.cost.gross

  const discount = apiDiscount
    ? {
        reducedAmount: getReducedAmmount(apiDiscount.type, props.cart.cost),
        explanation: getDiscountDurationExplanation(apiDiscount, totalCost),
      }
    : undefined

  return (
    <TotalAmount
      currencyCode={totalCost.currencyCode}
      amount={totalCost.amount}
      discount={discount}
    />
  )
}

const useDiscount = () => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const getDiscountDurationExplanation = useCallback(
    (discount: CampaignDiscount, total: Money) => {
      switch (discount.type) {
        case CampaignDiscountType.FreeMonths:
        case CampaignDiscountType.MonthlyPercentage:
          return t('DISCOUNT_DURATION_EXPLANATION', {
            count: discount.months,
            monthlyPrice: formatter.monthlyPrice(total),
            // Avoid double escaping / in price.  Safe since we're not using dangerouslySetInnerHtml
            interpolation: { escapeValue: false },
          })
        case CampaignDiscountType.MonthlyCost:
        case CampaignDiscountType.IndefinitePercentage:
        default:
          return ''
      }
    },
    [t, formatter],
  )

  const getReducedAmmount = useCallback(
    (campaignType: CampaignDiscountType, cartCost: CartCost) => {
      switch (campaignType) {
        case CampaignDiscountType.FreeMonths:
          return cartCost.discount.amount
        case CampaignDiscountType.MonthlyPercentage:
        case CampaignDiscountType.MonthlyCost:
        case CampaignDiscountType.IndefinitePercentage:
        default:
          return cartCost.net.amount
      }
    },
    [],
  )

  return { getDiscountDurationExplanation, getReducedAmmount }
}
