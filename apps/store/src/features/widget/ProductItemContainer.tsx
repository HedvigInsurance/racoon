import { type ComponentProps } from 'react'
import { useTiersAndDeductibles } from '@/components/ProductPage/PurchaseForm/useTiersAndDeductibles'
import { ProductItem } from './ProductItem'
import type { Offer } from './widget.types'

type Props = {
  offers: Array<Offer>
  selectedOffer: Offer
} & Pick<
  ComponentProps<typeof ProductItem>,
  'shopSessionId' | 'greenVariant' | 'onDelete' | 'onEdit' | 'defaultExpanded' | 'mode'
>

export const ProductItemContainer = ({ offers, selectedOffer, ...delegated }: Props) => {
  const { tiers, deductibles } = useTiersAndDeductibles({
    offers,
    selectedOffer,
  })

  return (
    <ProductItem
      selectedOffer={selectedOffer}
      tiers={tiers}
      deductibles={deductibles}
      {...delegated}
    />
  )
}
