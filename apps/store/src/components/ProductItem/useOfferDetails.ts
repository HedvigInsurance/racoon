import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import type { ProductOfferFragment } from '@/services/graphql/generated'

type Offer = Pick<ProductOfferFragment, 'displayItems' | 'deductible' | 'variant' | 'product'>

export const useOfferDetails = (offer: Offer): Array<{ title: string; value: string }> => {
  const { t } = useTranslation('cart')
  return useMemo(() => {
    const items = offer.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    }))
    const tierLevelDisplayName = getTierLevelDisplayName(offer)
    if (tierLevelDisplayName) {
      items.push({ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName })
    }
    const deductibleDisplayName = offer.deductible?.displayName
    if (deductibleDisplayName) {
      items.push({ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: deductibleDisplayName })
    }
    return items
  }, [offer, t])
}

const getTierLevelDisplayName = (item: Pick<ProductOfferFragment, 'variant' | 'product'>) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
