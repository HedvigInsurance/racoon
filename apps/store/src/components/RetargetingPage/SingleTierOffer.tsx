import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, theme } from 'ui'
import { CartItem } from '@/components/CartItem/CartItem'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { ProductPageLink } from './ProductPageLink'

type Props = {
  offer: ProductOfferFragment
  product: ProductOfferFragment['variant']['product']
}

export const SingleTierOffer = (props: Props) => {
  const { t } = useTranslation('cart')

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
        <Button size="medium" variant="secondary-alt">
          {t('ADD_TO_CART_BUTTON_LABEL')}
        </Button>
      </ButtonGroup>
    </CartItem>
  )
}

const ButtonGroup = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  columnGap: theme.space.xs,
})
