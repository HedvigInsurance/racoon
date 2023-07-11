import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Button, theme, Text, Space, mq } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/PurchaseForm/useHandleSubmitAddToCart'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  OfferRecommendationFragment,
  ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useFormatter } from '@/utils/useFormatter'

type CartOfferItemProps = {
  shopSessionId: string
  product: ProductRecommendationFragment
  offer: OfferRecommendationFragment
}

export const CartEntryOfferItem = ({ shopSessionId, product, offer }: CartOfferItemProps) => {
  const [show, setShow] = useShowCartEntryOffer()
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const [getHandleSubmitAddToCart, loading] = useHandleSubmitAddToCart({
    shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Added quick offer to cart', {
        priceIntentId: offer.id,
        product: product.id,
      })
    },
  })

  const tracking = useTracking()
  const handleSubmitAddToCart = getHandleSubmitAddToCart(offer.id)
  const handleSubmitQuickAdd: typeof handleSubmitAddToCart = (event) => {
    datadogRum.addAction('Quick add to cart', { priceIntentId: offer.id, product: product.id })
    tracking.reportAddToCart(offer, 'recommendations')
    return handleSubmitAddToCart(event)
  }

  const handleClickHide = () => {
    datadogRum.addAction('Hide offer', { priceIntentId: offer.id, product: product.id })
    setShow(false)
  }

  if (!show) return null

  const hasDiscountApplied = offer.cost.discount.amount > 0

  return (
    <Layout.Main>
      <Layout.Pillow>
        <Pillow size="small" {...product.pillowImage} />
      </Layout.Pillow>

      <Layout.Title>
        <Text>{product.displayNameFull}</Text>
        {/* TODO: move this logic outside the frontend */}
        <Text color="textSecondary">
          {t('QUICK_ADD_HOUSEHOLD_SIZE', {
            count: (parseInt(offer.priceIntentData['numberCoInsured']) || 0) + 1,
          })}
        </Text>
      </Layout.Title>

      <Layout.Separator />

      <Layout.Content>
        <Text color="textSecondary">
          {/* TODO: move this text to the api so it can be used with other offer types */}
          {t('ACCIDENT_OFFER_DESCRIPTION')}
        </Text>
      </Layout.Content>

      <Layout.Actions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <form onSubmit={handleSubmitQuickAdd}>
              <Button loading={loading} size="medium" type="submit">
                {t('QUICK_ADD_BUTTON')}
              </Button>
            </form>

            <GhostButton size="medium" variant="ghost" onClick={handleClickHide}>
              {t('QUICK_ADD_DISMISS')}
            </GhostButton>
          </SpaceFlex>
        </Space>
      </Layout.Actions>

      <Layout.Price>
        {hasDiscountApplied && (
          <Text color="textSecondary" strikethrough={true}>
            {formatter.monthlyPrice(offer.cost.gross)}
          </Text>
        )}
        {formatter.monthlyPrice(offer.cost.net)}
      </Layout.Price>
    </Layout.Main>
  )
}

const GRID_AREAS = {
  Pillow: 'pillow',
  Title: 'title',
  Separator: 'separator',
  Price: 'price',
  Content: 'content',
  Actions: 'actions',
} as const

const Main = styled.li({
  backgroundColor: theme.colors.blueFill1,
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.blue200}`,

  [mq.lg]: {
    padding: theme.space.lg,
  },

  display: 'grid',
  gap: theme.space.md,
  gridTemplateAreas: `
    "${GRID_AREAS.Pillow} ${GRID_AREAS.Title} ${GRID_AREAS.Title}"
    "${GRID_AREAS.Separator} ${GRID_AREAS.Separator} ${GRID_AREAS.Separator}"
    "${GRID_AREAS.Content} ${GRID_AREAS.Content} ${GRID_AREAS.Content}"
    "${GRID_AREAS.Actions} ${GRID_AREAS.Actions} ${GRID_AREAS.Price}"
  `,
  gridTemplateColumns: 'auto minmax(0, 1fr)',
})

const Layout = {
  Main,
  Pillow: styled.div({ gridArea: GRID_AREAS.Pillow }),
  Title: styled.div({ gridArea: GRID_AREAS.Title }),
  Separator: styled.div({
    gridArea: GRID_AREAS.Separator,
    borderBottom: `1px solid ${theme.colors.blue200}`,
  }),
  Price: styled(Text)({
    gridArea: GRID_AREAS.Price,
    display: 'flex',
    alignItems: 'center',
    gap: theme.space.xs,
  }),
  Content: styled.div({ gridArea: GRID_AREAS.Content }),
  Actions: styled.div({ gridArea: GRID_AREAS.Actions }),
} as const

const GhostButton = styled(Button)({
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.blue50,
    },
  },
})

const SHOW_CART_OFFER_ATOM = atom(true)

const useShowCartEntryOffer = () => {
  return useAtom(SHOW_CART_OFFER_ATOM)
}
