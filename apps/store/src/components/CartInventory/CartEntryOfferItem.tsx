import styled from '@emotion/styled'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Balancer from 'react-wrap-balancer'
import { Button, theme, Text, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  OfferRecommendationFragment,
  ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { useHandleSubmitAddToCart } from '../ProductPage/PurchaseForm/useHandleSubmitAddToCart'

type CartOfferItemProps = {
  cartId: string
  product: ProductRecommendationFragment
  offer: OfferRecommendationFragment
}
export const CartEntryOfferItem = ({ cartId, product, offer }: CartOfferItemProps) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()
  const [handleSubmitAddToCart] = useHandleSubmitAddToCart({
    cartId: cartId,
    priceIntentId: offer.id,
    onSuccess() {},
  })

  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    handleSubmitAddToCart(event)
  }

  return (
    <Layout.Main key={offer.id}>
      <Layout.Pillow>
        <Pillow size="small" {...product.pillowImage} />
      </Layout.Pillow>

      <Layout.Title>
        <Text>{product.displayNameFull}</Text>
        <Text color="textSecondary">
          {t('CART_ENTRY_DATE_LABEL', {
            date: formatter.fromNow(new Date(offer.startDate)),
          })}
        </Text>
      </Layout.Title>

      <Layout.Content>
        <Text color="textSecondary">
          {/* TODO: move this text to the api so it can be used with other offer types */}
          <Balancer>{t('ACCIDENT_OFFER_CONTENT')}</Balancer>
        </Text>
      </Layout.Content>

      <Layout.Actions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <form onSubmit={handleFormSubmit}>
              <Button loading={loading} size="medium" type="submit">
                {t('ADD_TO_CART_BUTTON_LABEL')}
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

const GRID_AREAS = {
  Pillow: 'pillow',
  Title: 'title',
  Price: 'price',
  Content: 'content',
  Actions: 'actions',
} as const

const Main = styled.li({
  backgroundColor: theme.colors.blue100,
  padding: theme.space.md,
  borderRadius: theme.radius.md,

  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "${GRID_AREAS.Pillow} ${GRID_AREAS.Title} ${GRID_AREAS.Title}"
    "${GRID_AREAS.Content} ${GRID_AREAS.Content} ${GRID_AREAS.Content}"
    "${GRID_AREAS.Actions} ${GRID_AREAS.Actions} ${GRID_AREAS.Price}"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',
})

const Layout = {
  Main,
  Pillow: styled.div({ gridArea: GRID_AREAS.Pillow }),
  Title: styled.div({ gridArea: GRID_AREAS.Title }),
  Price: styled.div({ gridArea: GRID_AREAS.Price }),
  Content: styled.div({ gridArea: GRID_AREAS.Content }),
  Actions: styled.div({ gridArea: GRID_AREAS.Actions }),
} as const

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
  paddingRight: theme.space.xs,
})
