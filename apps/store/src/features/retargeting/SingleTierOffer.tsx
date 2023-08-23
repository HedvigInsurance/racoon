import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ActionButton } from '@/components/ProductItem/ProductItem'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/PurchaseForm/useHandleSubmitAddToCart'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { ProductLinkActionButton } from './ProductPageLink'

type Props = {
  shopSessionId: string
  offer: ProductOfferFragment
  product: ProductOfferFragment['variant']['product']
}

export const SingleTierOffer = (props: Props) => {
  const { t } = useTranslation('cart')
  const [getHandleSubmit, loading] = useHandleSubmitAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess: () => {
      datadogLogs.logger.info('CRM Retarget | Add to cart success')
    },
  })

  return (
    <ProductItemContainer offer={props.offer}>
      <ProductLinkActionButton href={props.product.pageLink}>
        {t('CART_ENTRY_EDIT_BUTTON')}
      </ProductLinkActionButton>
      <Form onSubmit={getHandleSubmit(props.offer.id)}>
        <ActionButton type="submit" loading={loading}>
          {t('ADD_TO_CART_BUTTON_LABEL')}
        </ActionButton>
      </Form>
    </ProductItemContainer>
  )
}

const Form = styled.form({
  display: 'grid',
  justifyContent: 'stretch',
})
