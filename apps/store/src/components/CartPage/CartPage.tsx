import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { CampaignsSection } from '@/components/CartInventory/CampaignsSection'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { PageLink } from '@/utils/PageLink'
import { ButtonNextLink } from '../ButtonNextLink'
import { CartPageProps } from './CartPageProps.types'

export const CartPage = (props: CartPageProps) => {
  const { cartId, entries, campaigns, campaignsEnabled, cost, recommendations } = props
  const { t } = useTranslation('cart')
  const { onReady, shopSession } = useShopSession()

  const tracking = useTracking()
  useEffect(
    () =>
      onReady((shopSession) => {
        const { cart } = shopSession
        if (cart) {
          tracking.reportViewCart(cart)
        } else {
          datadogLogs.logger.error('No cart data on cartPage')
        }
      }),
    [onReady, tracking],
  )

  let body = (
    <EmptyState>
      <Space y={1.5}>
        <HorizontalLine />
        {campaignsEnabled && (
          <>
            <CampaignsSection cartId={cartId} campaigns={campaigns} />
            <HorizontalLine />
          </>
        )}
        <CostSummary {...cost} campaigns={campaigns} />
      </Space>
    </EmptyState>
  )

  if (entries.length > 0) {
    body = (
      <Space y={1.5}>
        <Heading mb='2.5rem' as={'h2'} align="center">
          {t('CART_TITLE')}
        </Heading>
        <CartEntryList>
          {entries.map((item) => (
            <CartEntryItem key={item.offerId} cartId={cartId} {...item} />
          ))}
        </CartEntryList>
        {campaignsEnabled && (
          <Space y={{ base: 1, sm: 1.5 }}>
            <HorizontalLine />
            <CampaignsSection cartId={cartId} campaigns={campaigns} />
            <HorizontalLine />
          </Space>
        )}
        <CostSummary {...cost} campaigns={campaigns} />
        {shopSession && (
          <ButtonNextLink
            href={PageLink.checkout()}
            onClick={() => {
              tracking.reportBeginCheckout(shopSession.cart)
            }}
          >
            {t('CHECKOUT_BUTTON')}
          </ButtonNextLink>
        )}
      </Space>
    )
  }

  return (
    <PageWrapper>
      <Space y={{ base: 3, sm: 6 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            {body}
          </GridLayout.Content>
        </GridLayout.Root>
        {recommendations.length > 0 && (
          <ProductRecommendationList recommendations={recommendations} />
        )}
      </Space>
    </PageWrapper>
  )
}

type EmptyStateProps = { children: ReactNode }

const EmptyState = ({ children }: EmptyStateProps) => {
  const { t } = useTranslation('cart')

  return (
    <>
      <Heading as={'h2'} align="center">
        {t('CART_TITLE_EMPTY')}
      </Heading>
      <EmptyStateWrapper>
        <Space y={2}>
          <Space y={1}>
            <Text align="center">¯\_(ツ)_/¯</Text>
            <Text align="center" color="textSecondary">
              {t('CART_EMPTY_SUMMARY')}
            </Text>
          </Space>
          <ButtonNextLink href={PageLink.store()}>{t('GO_TO_STORE_BUTTON')}</ButtonNextLink>
        </Space>
      </EmptyStateWrapper>
      {children}
    </>
  )
}

const PageWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxl,

  [mq.sm]: {
    paddingTop: theme.space.xxl,
  },
})

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})

const EmptyStateWrapper = styled.div({
  height: '23rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const TitleWrapper = styled(Space)({
  paddingBottom: theme.space.md,
})
