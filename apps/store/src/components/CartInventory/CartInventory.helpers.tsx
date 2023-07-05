import { useTranslation } from 'next-i18next'
import {
  CampaignDiscount,
  CampaignDiscountType,
  ExternalInsuranceCancellationOption,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { convertToDate } from '@/utils/date'
import { Money } from '@/utils/formatter'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'

export const useGetDiscountDurationExplanation = () => {
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

export const getTotal = (shopSession: ShopSession) => {
  const hasDiscount = shopSession.cart.redeemedCampaigns.length !== 0

  if (!hasDiscount) return shopSession.cart.cost.net
  // Only expecting one discount right now. Going forward we'd need to make this work for multi discounts.
  switch (shopSession.cart.redeemedCampaigns[0].discount.type) {
    case CampaignDiscountType.FreeMonths:
      return shopSession.cart.cost.discount
    default:
      return shopSession.cart.cost.net
  }
}

export const getCrossOut = (shopSession: ShopSession) => {
  const hasDiscount = shopSession.cart.cost.discount.amount > 0

  if (!hasDiscount) return undefined
  return shopSession.cart.cost.gross
}

export const getCartEntry = (item: ShopSession['cart']['entries'][number]): CartEntry => {
  const invalidRenewalDate =
    item.cancellation.option === ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate
  const hasCancellation = item.cancellation.requested && !invalidRenewalDate

  return {
    offerId: item.id,
    title: item.variant.product.displayNameFull,
    cost: item.price,
    startDate: hasCancellation ? undefined : convertToDate(item.startDate),
    pillow: {
      src: item.variant.product.pillowImage.src,
      alt: item.variant.product.pillowImage.alt ?? undefined,
    },
    documents: item.variant.documents,
    productName: item.variant.product.name,
    data: item.priceIntentData,
    tierLevelDisplayName: getTierLevelDisplayName(item),
    deductibleDisplayName: item.deductible?.displayName,
  }
}

const getTierLevelDisplayName = (item: ShopSession['cart']['entries'][number]) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.variant.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
