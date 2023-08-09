import { useTranslation } from 'next-i18next'
import { type ComponentProps, useMemo } from 'react'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { type CartEntry } from '../CartInventory.types'
import { useStartDateProps } from './useStartDateProps'

export const useProductItemProps = (cartEntry: CartEntry): ComponentProps<typeof ProductItem> => {
  const { t } = useTranslation('cart')

  const startDate = useStartDateProps({
    productName: cartEntry.productName,
    data: cartEntry.data,
    startDate: cartEntry.startDate ?? undefined,
  })

  const productDetails = useMemo(() => {
    return [
      ...cartEntry.displayItems,
      ...(cartEntry.tierLevelDisplayName
        ? [{ title: t('DATA_TABLE_TIER_LABEL'), value: cartEntry.tierLevelDisplayName }]
        : []),
      ...(cartEntry.deductibleDisplayName
        ? [{ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: cartEntry.deductibleDisplayName }]
        : []),
    ]
  }, [t, cartEntry.displayItems, cartEntry.tierLevelDisplayName, cartEntry.deductibleDisplayName])

  const productDocuments = useMemo(() => {
    return cartEntry.documents.map((item) => ({
      title: item.displayName,
      url: item.url,
    }))
  }, [cartEntry.documents])

  return useMemo(() => {
    return {
      title: cartEntry.title,
      pillowSrc: cartEntry.pillow.src,
      productDetails,
      productDocuments,
      startDate,
      price: getPriceProps(cartEntry.cost),
    }
  }, [
    cartEntry.title,
    cartEntry.pillow.src,
    startDate,
    cartEntry.cost,
    productDetails,
    productDocuments,
  ])
}

type PriceProps = ComponentProps<typeof ProductItem>['price']

const getPriceProps = (cost: CartEntry['cost']): PriceProps => {
  const priceProps: PriceProps = {
    currencyCode: cost.net.currencyCode,
    amount: cost.net.amount,
  }
  if (cost.discount.amount > 0) {
    priceProps.reducedAmount = cost.net.amount
    priceProps.amount = cost.gross.amount
  }
  return priceProps
}
