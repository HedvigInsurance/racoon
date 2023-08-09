import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { useProductItemProps } from '@/components/CartInventory/CartEntryItem/useProductItemProps'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { ProductPageLink } from './ProductPageLink'

type Props = {
  product: ProductOfferFragment['variant']['product']
  offers: Array<ProductOfferFragment>
  defaultOffer: ProductOfferFragment
}

export const MultiTierOffer = (props: Props) => {
  const { t } = useTranslation()
  const cartEntry = useMemo(() => getCartEntry(props.defaultOffer), [props.defaultOffer])

  return (
    <ProductItem {...useProductItemProps(cartEntry)}>
      <ProductPageLink href={props.product.pageLink}>
        {t('CRM_RETARGETING_CHOOSE_TIER')}
      </ProductPageLink>
    </ProductItem>
  )
}
