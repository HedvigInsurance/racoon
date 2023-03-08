import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import Balancer from 'react-wrap-balancer'
import { Button, theme, Text, Space } from 'ui'
import {
  OfferRecommendationFragment,
  ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { Pillow } from '../Pillow/Pillow'
import { useHandleSubmitAddToCart } from '../ProductPage/PurchaseForm/useHandleSubmitAddToCart'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'

type CartOfferItemProps = {
  cartId: string
  product: ProductRecommendationFragment
  offer: OfferRecommendationFragment
}
export const CartOfferItem = ({ cartId, product, offer }: CartOfferItemProps) => {
  const { pillowImage } = product
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId: cartId,
    priceIntentId: offer.id,
    onSuccess(productOfferId) {
      const addedProductOffer = offer.id
// TODO: Fix this
      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }
    },
  })

  // TODO: Fix date types
  // For now the start date will always be the day the offer was created aka today
  const startDateFormatted = formatter.fromNow(new Date(offer.startDate) ?? new Date())

  return (
    <Layout key={offer.id}>
      <LayoutPillow>
        <Pillow size="small" {...pillowImage} />
      </LayoutPillow>

      <LayoutText>
        <Text>{product.displayNameFull}</Text>
        <Text color="textSecondary">
          {t('CART_ENTRY_DATE_LABEL', {
            date: startDateFormatted,
          })}
        </Text>
      </LayoutText>

      <LayoutContent>
        <Text color="textSecondary">
          <Balancer>
            Utöka ditt skydd med en Olycksfallsförsäkring. Täcker olyckor, tandskador, ärr och
            mycket mer. Försäkringen gäller utan självrisk.
          </Balancer>
        </Text>
      </LayoutContent>

      <LayoutActions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <form onSubmit={handleSubmitAddToCart}>
              <Button loading={loadingAddToCart} type="submit">
                Add to cart
              </Button>
              <input type="hidden" name="productOfferId" value={offer.id} />
            </form>
          </SpaceFlex>
        </Space>
      </LayoutActions>

      <LayoutPrice>
        <PriceFlex>
          <Text>{formatter.monthlyPrice(offer.price)}</Text>
        </PriceFlex>
      </LayoutPrice>
    </Layout>
  )
}

const Layout = styled.li({
  backgroundColor: theme.colors.blue100,
  padding: theme.space.md,
  borderRadius: theme.radius.md,

  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "pillow title"
    "content content"
    "actions price"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',
})

const GRID_AREAS = {
  pillow: 'pillow',
  title: 'title',
  price: 'price',
  content: 'content',
  actions: 'actions',
} as const

const LayoutPillow = styled.div({ gridArea: GRID_AREAS.pillow })
const LayoutText = styled.div({ gridArea: GRID_AREAS.title })
const LayoutPrice = styled.div({ gridArea: GRID_AREAS.price })
const LayoutContent = styled.div({ gridArea: GRID_AREAS.content })
const LayoutActions = styled.div({ gridArea: GRID_AREAS.actions })

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
})
