import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, theme } from 'ui'
import { CartItem } from '@/components/CartItem/CartItem'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/PurchaseForm/useHandleSubmitAddToCart'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { ProductPageLink } from './ProductPageLink'

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
    <CartItem
      pillow={props.product.pillowImage}
      displayName={props.product.displayNameFull}
      cost={props.offer.cost}
      documents={props.offer.variant.documents}
      productName={props.product.name}
      data={props.offer.priceIntentData}
      startDate={props.offer.startDate ? new Date(props.offer.startDate) : undefined}
    >
      <ButtonGroup>
        <ProductPageLink href={props.product.pageLink}>
          {t('CART_ENTRY_EDIT_BUTTON')}
        </ProductPageLink>
        <Form onSubmit={getHandleSubmit(props.offer.id)}>
          <Button type="submit" size="medium" variant="secondary-alt" loading={loading}>
            {t('ADD_TO_CART_BUTTON_LABEL')}
          </Button>
        </Form>
      </ButtonGroup>
    </CartItem>
  )
}

const ButtonGroup = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  columnGap: theme.space.xs,
})

const Form = styled.form({
  display: 'grid',
  justifyContent: 'stretch',
})
