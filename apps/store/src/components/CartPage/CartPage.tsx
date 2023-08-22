import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { CampaignSection } from '@/components/CartInventory/CampaignSection'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CartEntryOfferItem } from '@/components/CartInventory/CartEntryOfferItem'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { ReadOnlyCampaignSection } from '@/components/CartInventory/ReadOnlyCampaignSection'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Skeleton } from '@/components/ProductItem/ProductItem'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CartPageProps } from './CartPageProps.types'
import { DiscountFieldContainer } from './DiscountFieldContainer'
import { PageDebugDialog } from './PageDebugDialog'
import { TotalAmountContainer } from './TotalAmountContainer'

export const CartPage = (props: CartPageProps) => {
  const { shopSessionId, entries, campaign, campaignsEnabled, cost } = props
  const { t } = useTranslation('cart')
  const { shopSession } = useShopSession()
  const { productRecommendations, productRecommendationOffers } = useProductRecommendations()
  const tracking = useTracking()

  useTrackViewCartEffect()

  if (!shopSession || entries === undefined) return <LoadingState />

  const productRecommendationList = productRecommendations && (
    <ProductRecommendationList recommendations={productRecommendations} />
  )

  if (entries.length === 0) {
    return <EmptyState shopSession={shopSession}>{productRecommendationList}</EmptyState>
  }

  const showProductRecommendations =
    shopSessionId && productRecommendationOffers && productRecommendationOffers.length > 0

  return (
    <PageWrapper>
      <Space y={{ base: 3.5, lg: 5 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={3.5}>
              <Heading as="h2" align="center" variant="standard.24">
                {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
              </Heading>

              <CartEntryList>
                {shopSessionId &&
                  entries.map((item) => (
                    <CartEntryItem key={item.offerId} shopSessionId={shopSessionId} {...item} />
                  ))}
              </CartEntryList>

              {campaignsEnabled
                ? shopSessionId && (
                    <Space y={{ base: 1, sm: 1.5 }}>
                      <CampaignSection shopSessionId={shopSessionId} campaign={campaign} />
                      <HorizontalLine />
                    </Space>
                  )
                : !!campaign && (
                    <Space y={{ base: 1, sm: 1.5 }}>
                      <ReadOnlyCampaignSection campaign={campaign} />
                      <HorizontalLine />
                    </Space>
                  )}

              {cost && <CostSummary {...cost} campaign={campaign} />}

              {showProductRecommendations && (
                <CartEntryList>
                  {productRecommendationOffers.map(({ offer, product }) => {
                    // TODO: improve typing to get rid of this check
                    if (!offer) return null
                    return (
                      <CartEntryOfferItem
                        key={offer.id}
                        shopSessionId={shopSession.id}
                        product={product}
                        offer={offer}
                      />
                    )
                  })}
                </CartEntryList>
              )}

              <ButtonNextLink
                href={PageLink.checkout({ expandCart: true })}
                onClick={() => {
                  tracking.reportBeginCheckout(shopSession.cart)
                }}
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

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
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
              <Skeleton />
              <Skeleton />
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
