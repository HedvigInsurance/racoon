import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import {
  CampaignDiscount,
  CampaignDiscountType,
  ExternalInsuranceCancellationOption,
  RedeemedCampaign,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { convertToDate } from '@/utils/date'
import { Money } from '@/utils/formatter'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { useFormatter } from '@/utils/useFormatter'
import { CartCampaign, CartEntry } from './CartInventory.types'

export const getTotal = (shopSession: ShopSession) => {
  if (!shopSession.cart.redeemedCampaign) return shopSession.cart.cost.net
  switch (shopSession.cart.redeemedCampaign.discount.type) {
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
  const isInvalidOption = [
    ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate,
    ExternalInsuranceCancellationOption.None,
  ].includes(item.cancellation.option)
  const hasCancellation = !isInvalidOption && item.cancellation.requested

  return {
    offerId: item.id,
    title: item.variant.product.displayNameFull,
    cost: item.cost,
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

type GetCartCampaignFunction = (total: Money, campaign: RedeemedCampaign) => CartCampaign

export const useGetCartCampaign = (): GetCartCampaignFunction => {
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  return useCallback(
    (total, campaign) => {
      return {
        id: campaign.id,
        code: campaign.code,
        discountExplanation: getDiscountExplanation(campaign.discount),
        discountDurationExplanation: getDiscountDurationExplanation(campaign.discount, total),
      }
    },
    [getDiscountExplanation, getDiscountDurationExplanation],
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
