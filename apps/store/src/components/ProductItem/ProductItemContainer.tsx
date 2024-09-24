import { type ComponentProps, type ReactNode } from 'react'
import { useOfferDetails } from '@/app/[locale]/checkout/components/CartItem/hooks/useOfferDetails'
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
  const getStartDateProps = useGetStartDateProps()

  const price = getOfferPrice(props.offer.cost)

  const startDateProps = getStartDateProps({
    data: props.offer.priceIntentData,
    startDate: props.offer.startDate,
  })

  const productDetails = useOfferDetails(props.offer)

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
