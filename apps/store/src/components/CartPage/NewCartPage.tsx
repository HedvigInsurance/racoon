import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect } from 'react'
import { Heading, Space, Text, mq, theme } from 'ui'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { ButtonNextLink } from '../ButtonNextLink'
import { CartEntryList } from '../CartInventory/CartEntryList'
import { CartEntryOfferItem } from '../CartInventory/CartEntryOfferItem'
import { GridLayout } from '../GridLayout/GridLayout'
import { Skeleton } from '../ProductItem/ProductItem'
import { Divider, ShopBreakdown } from '../ShopBreakdown/ShopBreakdown'
import { DiscountFieldContainer } from './DiscountFieldContainer'
import { PageDebugDialog } from './PageDebugDialog'
import { ProductItemContainer } from './ProductItemContainer'
import { TotalAmountContainer } from './TotalAmountContainer'

export const NewCartPage = () => {
  const { t } = useTranslation('cart')
  const { data } = useShopSession()
  const { productRecommendations, productRecommendationOffers } = useProductRecommendations()
  useTrackViewCartEffect()
  const tracking = useTracking()

  if (!data) return <LoadingState />

  const productRecommendationList = productRecommendations && (
    <ProductRecommendationList recommendations={productRecommendations} />
  )

  if (data.shopSession.cart.entries.length === 0) {
    return <EmptyState shopSession={data.shopSession}>{productRecommendationList}</EmptyState>
  }

  const handleClickCheckout = () => {
    tracking.reportBeginCheckout(data.shopSession.cart)
  }

  return (
    <PageWrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <Heading as="h2" align="center" variant="standard.24">
              {t('CART_PAGE_HEADING')} ({data.shopSession.cart.entries.length})
            </Heading>

            <ShopBreakdown>
              {data.shopSession.cart.entries.map((item) => (
                <ProductItemContainer key={item.id} shopSessionId={data.shopSession.id} {...item} />
              ))}

              {productRecommendationOffers && productRecommendationOffers.length > 0 && (
                <CartEntryList>
                  {productRecommendationOffers.map(({ offer, product }) => {
                    // TODO: improve typing to get rid of this check
                    if (!offer) return null
                    return (
                      <CartEntryOfferItem
                        key={offer.id}
                        shopSessionId={data.shopSession.id}
                        product={product}
                        offer={offer}
                      />
                    )
                  })}
                </CartEntryList>
              )}

              <DiscountFieldContainer shopSession={data.shopSession} />

              <Divider />

              <TotalAmountContainer cart={data.shopSession.cart} />
            </ShopBreakdown>

            <ButtonNextLink
              href={PageLink.checkout({ expandCart: true })}
              onClick={handleClickCheckout}
            >
              {t('CHECKOUT_BUTTON')}
            </ButtonNextLink>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>

      {productRecommendationList}
      <PageDebugDialog />
    </PageWrapper>
  )
}

const LoadingState = () => {
  const { t } = useTranslation('cart')

  return (
    <PageWrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <ShopBreakdown>
            <Heading mb="3.5rem" as="h2" align="center" variant="standard.24">
              {t('CART_PAGE_HEADING')}
            </Heading>
            <Skeleton />
            <Skeleton />
          </ShopBreakdown>
        </GridLayout.Content>
      </GridLayout.Root>
    </PageWrapper>
  )
}

const PageWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxl,

  [mq.sm]: {
    paddingTop: theme.space.xxl,
  },
})

type EmptyStateProps = { shopSession: ShopSession; children: ReactNode }

const EmptyState = (props: EmptyStateProps) => {
  const { t } = useTranslation('cart')
  const { routingLocale } = useCurrentLocale()

  return (
    <PageWrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <ShopBreakdown>
            <EmptyStateWrapper>
              <Space y={2}>
                <Space y={1}>
                  <Text align="center">¯\_(ツ)_/¯</Text>
                  <Text align="center" color="textSecondary">
                    {t('CART_EMPTY_SUMMARY')}
                  </Text>
                </Space>
                <ButtonNextLink href={PageLink.store({ locale: routingLocale })}>
                  {t('GO_TO_STORE_BUTTON')}
                </ButtonNextLink>
              </Space>
            </EmptyStateWrapper>

            <DiscountFieldContainer shopSession={props.shopSession} />
            <Divider />
            <TotalAmountContainer cart={props.shopSession.cart} />
          </ShopBreakdown>
        </GridLayout.Content>
      </GridLayout.Root>

      {props.children}
      <PageDebugDialog />
    </PageWrapper>
  )
}

const EmptyStateWrapper = styled.div({
  height: '23rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const useTrackViewCartEffect = () => {
  const { onReady } = useShopSession()

  const tracking = useTracking()
  useEffect(
    () =>
      onReady((shopSession) => {
        const { cart } = shopSession
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cart) {
          tracking.reportViewCart(cart)
        } else {
          datadogLogs.logger.error('No cart data on cartPage')
        }
      }),
    [onReady, tracking],
  )
}
