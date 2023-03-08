import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Button, mq, theme, Text, Space } from 'ui'
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
export const CartOfferItem = (props: CartOfferItemProps) => {
  const { product } = props
  const {
    product: { pillowImage },
    offer,
    cartId,
  } = props

  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId: cartId,
    priceIntentId: offer.id,
    onSuccess(productOfferId) {
      console.log('🚀 ~ file: 🍒🍒🍒🍒🍒🍒🍒🍒🍒:', productOfferId)
    },
  })

  return (
    <Layout key={offer.id}>
      <LayoutPillow>
        <Pillow size="small" {...pillowImage} />
      </LayoutPillow>

      <LayoutText>
        <Text>{product.displayNameFull}</Text>
        <Text color="textSecondary">{offer.startDate}</Text>
        {/* <Text color="textSecondary">
          {offer.startDate
            ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(offer.startDate) })
            : t('CART_ENTRY_AUTO_SWITCH')}
        </Text> */}
      </LayoutText>

      <LayoutContent>
        <Text color="textSecondary">
          Consequat nulla eu ex. Velit minim excepteur nisi laboris. Et laborum qui nulla dolor
        </Text>
      </LayoutContent>

      <LayoutActions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <form onSubmit={handleSubmitAddToCart}>
              <Button>Add to cart</Button>
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

  [mq.md]: {
    gridTemplateAreas: `
      "pillow title price"
      "empty actions actions"
    `,
    gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  },
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
