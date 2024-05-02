import { type ComponentProps } from 'react'
import { useTiersAndDeductibles } from '@/components/ProductPage/PurchaseForm/useTiersAndDeductibles'
import { ProductItem } from './ProductItem'
import type { Offer } from './widget.types'

type Props = {
  offers: Array<Offer>
  selectedOffer: Offer
} & Pick<
  ComponentProps<typeof ProductItem>,
  'shopSessionId' | 'variant' | 'onDelete' | 'defaultExpanded' | 'disableStartDate' | 'children'
>

export const ProductItemContainer = (props: Props) => {
  const { tiers, deductibles } = useTiersAndDeductibles({
    offers: props.offers,
    selectedOffer: props.selectedOffer,
  })

  return (
    <ProductItem
      shopSessionId={props.shopSessionId}
      selectedOffer={props.selectedOffer}
      tiers={tiers}
      deductibles={deductibles}
      defaultExpanded={props.defaultExpanded}
      variant={props.variant}
      disableStartDate={props.disableStartDate ?? false}
      onDelete={props.onDelete}
    >
      {props.children}
    </ProductItem>
  )
}
