import styled from '@emotion/styled'
import { useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation('cart')
  const formatter = useFormatter()
  const [handleSubmitAddToCart] = useHandleSubmitAddToCart({
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

  return (
    <Layout.Main key={offer.id}>
      <Layout.Pillow>
        <Pillow size="small" {...product.pillowImage} />
      </Layout.Pillow>

      <Layout.Title>
        <Text>{product.displayNameFull}</Text>
        <Text color="textSecondary">
          {t('CART_ENTRY_DATE_LABEL', {
            date: offer.startDate,
          })}
        </Text>
      </Layout.Title>

      <Layout.Content>
        <Text color="textSecondary">
          <Balancer>
            Utöka ditt skydd med en Olycksfallsförsäkring. Täcker olyckor, tandskador, ärr och
            mycket mer. Försäkringen gäller utan självrisk.
          </Balancer>
        </Text>
      </Layout.Content>

      <Layout.Actions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <form
              onSubmit={(event) => {
                setLoading(true)
                handleSubmitAddToCart(event)
              }}
            >
              <Button loading={loading} type="submit">
                Add to cart
              </Button>
              <input type="hidden" name="productOfferId" value={offer.id} />
            </form>
          </SpaceFlex>
        </Space>
      </Layout.Actions>

      <Layout.Price>
        <PriceFlex>
          <Text>{formatter.monthlyPrice(offer.price)}</Text>
        </PriceFlex>
      </Layout.Price>
    </Layout.Main>
  )
}

const Main = styled.li({
  backgroundColor: theme.colors.blue100,
  padding: theme.space.md,
  borderRadius: theme.radius.md,

  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "pillow title title"
    "content content content"
    "actions actions price"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',
})

const GRID_AREAS = {
  Pillow: 'pillow',
  Title: 'title',
  Price: 'price',
  Content: 'content',
  Actions: 'actions',
} as const

const Layout = {
  Main,
  Pillow: styled.div({ gridArea: GRID_AREAS.Pillow }),
  Title: styled.div({ gridArea: GRID_AREAS.Title }),
  Price: styled.div({ gridArea: GRID_AREAS.Price }),
  Content: styled.div({ gridArea: GRID_AREAS.Content }),
  Actions: styled.div({ gridArea: GRID_AREAS.Actions }),
}

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
})
