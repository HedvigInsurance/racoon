import { useTranslation } from 'next-i18next'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { ProductLinkActionButton } from './ProductPageLink'

type Props = {
  product: ProductOfferFragment['variant']['product']
  defaultOffer: ProductOfferFragment
}

export const MultiTierOffer = (props: Props) => {
  const { t } = useTranslation()

  return (
    <ProductItemContainer offer={props.defaultOffer}>
      <ProductLinkActionButton href={props.product.pageLink}>
        {t('CRM_RETARGETING_CHOOSE_TIER')}
      </ProductLinkActionButton>
    </ProductItemContainer>
  )
}
