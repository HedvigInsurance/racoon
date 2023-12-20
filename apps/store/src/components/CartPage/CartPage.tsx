import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { EditActionButton } from '@/components/ProductItem/EditActionButton'
import { ProductItemSkeleton } from '@/components/ProductItem/ProductItem'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { RemoveActionButton } from '@/components/ProductItem/RemoveActionButton'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './CartPage.constants'
import { PageDebugDialog } from './PageDebugDialog'

export const CartPage = () => {
  const { t } = useTranslation('cart')
  const { shopSession } = useShopSession()
  const router = useRouter()
  const { productRecommendations, offerRecommendation } = useProductRecommendations()
  const tracking = useTracking()

  useTrackViewCartEffect()

  if (!shopSession || !router.isReady) return <LoadingState />

  const productRecommendationList = productRecommendations && (
    <ProductRecommendationList recommendations={productRecommendations} />
  )

  if (shopSession.cart.entries.length === 0) {
    return <EmptyState shopSession={shopSession}>{productRecommendationList}</EmptyState>
  }

  const handleClickCheckout = () => {
    tracking.reportBeginCheckout(shopSession.cart)
  }

  return (
    <PageWrapper>
      <Space y={{ base: 3.5, lg: 5 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={2}>
              <Heading as="h2" align="center" variant="standard.24">
                {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
              </Heading>
              <Space y={1}>
                <ShopBreakdown>
                  {shopSession.cart.entries.map((item) => (
                    <ProductItemContainer
                      key={item.id}
                      offer={item}
                      defaultExpanded={router.query[QueryParam.ExpandCart] === '1'}
                    >
                      <EditActionButton shopSessionId={shopSession.id} offer={item} />
                      <RemoveActionButton
                        shopSessionId={shopSession.id}
                        offer={item}
                        title={item.product.displayNameFull}
                      />
                    </ProductItemContainer>
                  ))}
                  <DiscountFieldContainer shopSession={shopSession} />
                  <Divider />
                  <TotalAmountContainer cart={shopSession.cart} />
                </ShopBreakdown>

                {offerRecommendation && (
                  <QuickAddOfferContainer
                    cart={shopSession.cart}
                    shopSessionId={shopSession.id}
                    {...offerRecommendation}
                  />
                )}
              </Space>

              <ButtonNextLink
                href={PageLink.checkout({ expandCart: true }).toRelative()}
                onClick={handleClickCheckout}
              >
                {t('CHECKOUT_BUTTON')}
              </ButtonNextLink>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        {productRecommendationList}
      </Space>

      <PageDebugDialog />
    </PageWrapper>
  )
}

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

const PageWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxl,
  minHeight: '100vh',

  [mq.sm]: {
    paddingTop: theme.space.xxl,
  },
})

const LoadingState = () => {
  const { t } = useTranslation('cart')

  return (
    <PageWrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <Heading as="h2" align="center" variant="standard.24">
              {t('CART_PAGE_HEADING')}
            </Heading>
            <ShopBreakdown>
              <ProductItemSkeleton />
              <ProductItemSkeleton />
            </ShopBreakdown>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </PageWrapper>
  )
}

type EmptyStateProps = { shopSession: ShopSession; children: ReactNode }

const EmptyState = (props: EmptyStateProps) => {
  const { t } = useTranslation('cart')
  const { routingLocale } = useCurrentLocale()

  return (
    <PageWrapper>
      <Space y={{ base: 3.5, lg: 5 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={1}>
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
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        {props.children}
      </Space>

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
