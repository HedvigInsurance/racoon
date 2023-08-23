import { useTranslation } from 'next-i18next'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { CampaignDiscount, CampaignDiscountType, Money } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  cart: ShopSession['cart']
}

export const TotalAmountContainer = (props: Props) => {
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  const apiDiscount = props.cart.redeemedCampaign?.discount
  const total = props.cart.cost.net
  const discount = apiDiscount
    ? {
        reducedAmount: total.amount,
        explanation: getDiscountDurationExplanation(apiDiscount, total),
      }
    : undefined

  return (
    <TotalAmount
      currencyCode={props.cart.cost.gross.currencyCode}
      amount={props.cart.cost.gross.amount}
      discount={discount}
    />
  )
}

const useGetDiscountDurationExplanation = () => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (discount: CampaignDiscount, total: Money) => {
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
  }
}
