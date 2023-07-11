import { useTranslation } from 'next-i18next'
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

  return (
    <CartItem
      pillow={props.product.pillowImage}
      displayName={props.product.displayNameFull}
      cost={props.defaultOffer.cost}
      documents={props.defaultOffer.variant.documents}
      productName={props.product.name}
      data={props.defaultOffer.priceIntentData}
      startDate={props.defaultOffer.startDate ? new Date(props.defaultOffer.startDate) : undefined}
    >
      <ProductPageLink href={props.product.pageLink}>
        {t('CRM_RETARGETING_CHOOSE_TIER')}
      </ProductPageLink>
    </CartItem>
  )
}
