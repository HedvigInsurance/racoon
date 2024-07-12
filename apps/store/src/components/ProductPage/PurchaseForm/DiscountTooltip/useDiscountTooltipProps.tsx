import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import type { ProductOfferFragment, RedeemedCampaignFragment } from '@/services/graphql/generated'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { useFormatter } from '@/utils/useFormatter'

export const useDiscountTooltipProps = (
  selectedOffer: ProductOfferFragment,
  campaign?: RedeemedCampaignFragment,
) => {
  const { t } = useTranslation(['purchase-form', 'cart'])
  const formatter = useFormatter()
  const getDiscountExplanation = useGetDiscountExplanation()

  const tooltipProps = useMemo(() => {
    if (selectedOffer.priceMatch) {
      const company = selectedOffer.priceMatch.externalInsurer.displayName

      if (selectedOffer.priceMatch.priceReduction.amount < 1) {
        // No price reduction due to incomparable offers
        const amount = formatter.monthlyPrice(selectedOffer.priceMatch.externalPrice)
        return {
          children: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_TITLE', { amount, company }),
          subtitle: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_SUBTITLE'),
          color: 'gray',
        } as const
      }

      const priceReduction = formatter.monthlyPrice(selectedOffer.priceMatch.priceReduction)

      return {
        children: t('PRICE_MATCH_BUBBLE_SUCCESS_TITLE', { amount: priceReduction }),
        subtitle: t('PRICE_MATCH_BUBBLE_SUCCESS_SUBTITLE', { company }),
        color: 'green',
      } as const
    }

    if (campaign && selectedOffer.cost.discount.amount > 0) {
      return {
        children: getDiscountExplanation({
          ...campaign.discount,
          amount: selectedOffer.cost.discount,
        }),
        subtitle: t('DISCOUNT_PRICE_AFTER_EXPIRATION', {
          amount: formatter.monthlyPrice(selectedOffer.cost.gross),
          ns: 'cart',
        }),
        color: 'green',
      } as const
    }
  }, [t, formatter, getDiscountExplanation, selectedOffer, campaign])

  return tooltipProps
}
