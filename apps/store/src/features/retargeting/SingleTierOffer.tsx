import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { ActionButton } from '@/components/ProductItem/ProductItem'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { useAddToCart } from '@/utils/useAddToCart'
import { ProductLinkActionButton } from './ProductPageLink'

type Props = {
  shopSessionId: string
  offer: ProductOfferFragment
  product: ProductOfferFragment['variant']['product']
  onSuccess: (productOfferId: string) => void
}

export const SingleTierOffer = (props: Props) => {
  const { t } = useTranslation('cart')
  const [addToCart, loading] = useAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess: (productOfferId) => {
      datadogLogs.logger.info('CRM Retarget | Add to cart success')
      props.onSuccess(productOfferId)
    },
  })

  return (
    <ProductItemContainer offer={props.offer}>
      <ProductLinkActionButton href={props.product.pageLink}>
        {t('CART_ENTRY_EDIT_BUTTON')}
      </ProductLinkActionButton>
      <ActionButton onClick={() => addToCart(props.offer.id)} loading={loading}>
        {t('ADD_TO_CART_BUTTON_LABEL')}
      </ActionButton>
    </ProductItemContainer>
  )
}
