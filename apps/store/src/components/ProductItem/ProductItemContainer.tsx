import { useTranslation } from 'next-i18next'
import type { ComponentProps } from 'react'
import { useMemo, type ReactNode } from 'react'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { ProductItem } from './ProductItem'
import { useGetStartDateProps } from './useGetStartDateProps'

type Offer = Pick<
  ProductOfferFragment,
  | 'cost'
  | 'priceIntentData'
  | 'startDate'
  | 'displayItems'
  | 'deductible'
  | 'variant'
  | 'product'
  | 'exposure'
>

type Props = {
  offer: Offer
  children?: ReactNode
  defaultExpanded?: boolean
  variant?: ComponentProps<typeof ProductItem>['variant']
}

export const ProductItemContainer = (props: Props) => {
  const { t } = useTranslation('cart')
  const getStartDateProps = useGetStartDateProps()

  const price = getOfferPrice(props.offer.cost)

  const startDateProps = getStartDateProps({
    data: props.offer.priceIntentData,
    startDate: props.offer.startDate,
  })

  const productDetails = useMemo(() => {
    const items = props.offer.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    }))
    const tierLevelDisplayName = getTierLevelDisplayName(props.offer)
    if (tierLevelDisplayName) {
      items.push({ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName })
    }
    const deductibleDisplayName = props.offer.deductible?.displayName
    if (deductibleDisplayName) {
      items.push({ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: deductibleDisplayName })
    }
    return items
  }, [props.offer, t])

  const productDocuments = props.offer.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  return (
    <ProductItem
      title={props.offer.product.displayNameFull}
      pillowSrc={props.offer.product.pillowImage.src}
      price={price}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      defaultExpanded={props.defaultExpanded}
      variant={props.variant}
      exposure={props.offer.exposure.displayNameShort}
    >
      {props.children}
    </ProductItem>
  )
}

const getTierLevelDisplayName = (item: Pick<ProductOfferFragment, 'variant' | 'product'>) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.product.displayNameFull
    ? item.variant.displayName
    : undefined
}
