import { useTranslation } from 'next-i18next'
import { ComponentProps, useCallback } from 'react'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductItem } from './ProductItem'
import { useGetStartDateProps } from './useGetStartDateProps'

type ProductItemProps = Omit<ComponentProps<typeof ProductItem>, 'children' | 'defaultExpanded'>

type GetProductItemProps = (entry: ShopSession['cart']['entries'][number]) => ProductItemProps

export const useGetProductItemProps = (): GetProductItemProps => {
  const { t } = useTranslation('cart')
  const getStartDateProps = useGetStartDateProps()

  return useCallback(
    (entry) => {
      const tierLevelDisplayName = getTierLevelDisplayName(entry)
      const productDetails = [
        ...entry.displayItems.map((item) => ({
          title: item.displayTitle,
          value: item.displayValue,
        })),
        ...(tierLevelDisplayName
          ? [{ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName }]
          : []),
        ...(entry.deductible?.displayName
          ? [{ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: entry.deductible.displayName }]
          : []),
      ]

      const hasDiscount = entry.cost.discount.amount > 0

      return {
        id: entry.id,
        title: entry.variant.product.displayNameFull,
        pillowSrc: entry.variant.product.pillowImage.src,

        price: {
          currencyCode: entry.cost.net.currencyCode,
          amount: entry.cost.gross.amount,
          reducedAmount: hasDiscount ? entry.cost.net.amount : undefined,
        },

        startDate: getStartDateProps({
          productName: entry.variant.product.name,
          data: entry.priceIntentData,
          startDate: (entry.startDate as unknown as string | undefined) ?? undefined,
        }),

        productDetails,
        productDocuments: entry.variant.documents.map((doc) => ({
          title: doc.displayName,
          url: doc.url,
        })),
      }
    },
    [getStartDateProps, t],
  )
}

const getTierLevelDisplayName = (item: ShopSession['cart']['entries'][number]) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.variant.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
