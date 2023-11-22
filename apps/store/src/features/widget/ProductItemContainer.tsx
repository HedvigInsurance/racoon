import { useTranslation } from 'next-i18next'
import { useMemo, type ReactNode, type ComponentProps } from 'react'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { useStartDateUpdateMutation, type ProductOfferFragment } from '@/services/apollo/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { ProductItem } from './ProductItem'

type Offer = Pick<
  ProductOfferFragment,
  | 'id'
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
  onDelete?: ComponentProps<typeof ProductItem>['onDelete']
}

export const ProductItemContainer = (props: Props) => {
  const { t } = useTranslation('cart')

  const getStartDateProps = useGetStartDateProps()
  const { tooltip } = getStartDateProps({
    data: props.offer.priceIntentData,
    startDate: props.offer.startDate,
  })

  const price = getOfferPrice(props.offer.cost)

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

  const [updateStartDate, result] = useStartDateUpdateMutation()
  const handleChangeStartDate = (startDate: string) => {
    updateStartDate({
      variables: { productOfferIds: [props.offer.id], startDate },
    })
  }

  return (
    <ProductItem
      title={props.offer.product.displayNameFull}
      pillowSrc={props.offer.product.pillowImage.src}
      price={price}
      productDetails={productDetails}
      productDocuments={productDocuments}
      defaultExpanded={props.defaultExpanded}
      variant={props.variant}
      exposure={props.offer.exposure.displayNameShort}
      tooltip={tooltip}
      startDate={props.offer.startDate}
      onChangeStartDate={handleChangeStartDate}
      loading={result.loading}
      onDelete={props.onDelete}
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
