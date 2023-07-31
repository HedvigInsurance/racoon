import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { getCartEntry } from '@/components/CartInventory/CartInventory.helpers'
import { CartItem } from '@/components/CartItem/CartItem'
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
    <CartItem {...cartEntry}>
      <ProductPageLink href={props.product.pageLink}>
        {t('CRM_RETARGETING_CHOOSE_TIER')}
      </ProductPageLink>
    </CartItem>
  )
}
